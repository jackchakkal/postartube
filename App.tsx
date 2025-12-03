import React, { useState, useEffect } from 'react';
import { ChannelConfig, VideoSlot, VideoStatus, Language, ChannelProfile, DbProfile, DbSlot, Platform, PLATFORM_CONFIG } from './types';
import { ConfigPanel } from './components/ConfigPanel';
import { VideoCard } from './components/VideoCard';
import { StatsWidget } from './components/StatsWidget';
import { ChannelManager } from './components/ChannelManager';
import { generateVideoDetails, analyzeSchedule } from './services/geminiService';
import { translations } from './translations';
import { Auth } from './components/Auth';
import { CalendarSelector } from './components/CalendarSelector';
import { supabase, isSupabaseConfigured } from './services/supabase';
import { format } from 'date-fns';
import { Zap, Download, RotateCcw, Smartphone, Moon, Sun, FileText, FileSpreadsheet, Users, ChevronDown, CheckCircle2 } from 'lucide-react';

// --- HELPERS ---
const timeToMins = (time: string) => {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
};

const minsToTime = (mins: number) => {
  const h = Math.floor(mins / 60);
  const m = Math.floor(mins % 60);
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
};

// --- APP ---

const App: React.FC = () => {
  // --- SESSION STATE ---
  const [session, setSession] = useState<any>(null);
  const [sessionLoading, setSessionLoading] = useState(true);

  // --- UI STATE ---
  const [lang, setLang] = useState<Language>(() => (localStorage.getItem('postartube_lang') as Language) || 'pt');
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('postartube_theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [exportMenuOpen, setExportMenuOpen] = useState(false);
  const [channelManagerOpen, setChannelManagerOpen] = useState(false);
  const [aiTip, setAiTip] = useState<string>("");

  // --- DATA STATE ---
  const [profiles, setProfiles] = useState<ChannelProfile[]>([]);
  const [activeProfileId, setActiveProfileId] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [slots, setSlots] = useState<VideoSlot[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  // 1. Auth Init
  useEffect(() => {
    if (!isSupabaseConfigured()) {
        setSessionLoading(false);
        return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setSessionLoading(false);
    }).catch(() => {
      setSessionLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // 2. Load Profiles
  useEffect(() => {
    if (session) {
       loadProfiles();
    }
  }, [session]);

  const loadProfiles = async () => {
      const { data, error } = await supabase.from('p12_profiles').select('*');
      if (error) console.error(error);
      if (data) {
          const mapped: ChannelProfile[] = data.map((p: DbProfile) => ({
              id: p.id,
              name: p.name,
              platform: p.platform,
              config: {
                  videosPerDay: p.default_videos_per_day,
                  startTime: p.default_start_time,
                  endTime: p.default_end_time,
                  videoType: 'LONG' // Default for UI, DB doesn't store this preference per se yet
              }
          }));
          setProfiles(mapped);
          if (mapped.length > 0 && !activeProfileId) {
              setActiveProfileId(mapped[0].id);
          }
      }
  };

  // 3. Load Slots (When Profile or Date Changes)
  useEffect(() => {
     if (activeProfileId && selectedDate) {
         loadSlots();
     }
  }, [activeProfileId, selectedDate]);

  const loadSlots = async () => {
      setLoadingData(true);
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      
      const { data, error } = await supabase
          .from('p12_slots')
          .select('*')
          .eq('profile_id', activeProfileId)
          .eq('date', dateStr)
          .order('time', { ascending: true });

      if (error) console.error(error);
      
      if (data) {
          const mapped: VideoSlot[] = data.map((s: DbSlot) => ({
              id: s.id,
              time: s.time,
              type: s.type as any,
              topic: s.topic || '',
              title: s.title || '',
              description: s.description || '',
              status: s.status as VideoStatus,
              aiLoading: false,
              date: s.date
          }));
          setSlots(mapped);
      }
      setLoadingData(false);
  };

  // --- THEME & LANG ---
  useEffect(() => {
    localStorage.setItem('postartube_lang', lang);
  }, [lang]);

  useEffect(() => {
    localStorage.setItem('postartube_theme', darkMode ? 'dark' : 'light');
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [darkMode]);

  // Derived State
  const t = translations[lang];
  const activeProfile = profiles.find(p => p.id === activeProfileId);
  // We use a local config state to drive the inputs, syncing with DB on save
  const config = activeProfile?.config || { videosPerDay: 3, startTime: '09:00', endTime: '18:00', videoType: 'LONG' };

  // --- ACTIONS ---

  const handleConfigChange = async (newConfig: ChannelConfig) => {
      // Optimistic Update
      setProfiles(prev => prev.map(p => 
          p.id === activeProfileId ? { ...p, config: newConfig } : p
      ));

      // Save to DB (Debounce ideal, but simple save for now)
      await supabase.from('p12_profiles').update({
          default_videos_per_day: newConfig.videosPerDay,
          default_start_time: newConfig.startTime,
          default_end_time: newConfig.endTime
      }).eq('id', activeProfileId);
  };

  const handleCreateProfile = async (name: string, platform: Platform) => {
      const { data, error } = await supabase.from('p12_profiles').insert({
          user_id: session.user.id,
          name: name,
          platform: platform,
          default_videos_per_day: 3,
          default_start_time: '09:00',
          default_end_time: '18:00'
      }).select().single();

      if (data) {
          await loadProfiles();
          setActiveProfileId(data.id);
          setChannelManagerOpen(false);
      }
  };

  const handleDeleteProfile = async (id: string) => {
      await supabase.from('p12_profiles').delete().eq('id', id);
      const remaining = profiles.filter(p => p.id !== id);
      setProfiles(remaining);
      if (remaining.length > 0) setActiveProfileId(remaining[0].id);
      else setActiveProfileId('');
  };

  // --- SCHEDULE GENERATOR (RANDOMIZED) ---

  const generateSchedule = async () => {
    const startMins = timeToMins(config.startTime);
    const endMins = timeToMins(config.endTime);
    const count = config.videosPerDay;

    if (endMins <= startMins) {
      alert(t.endTimeError);
      return;
    }

    if (count > 200 && !window.confirm(t.confirmHighVolume)) return;

    // RANDOM ALGORITHM
    const randomTimes: number[] = [];
    for (let i = 0; i < count; i++) {
        // Generate random minute between start and end
        const rand = Math.floor(Math.random() * (endMins - startMins + 1)) + startMins;
        randomTimes.push(rand);
    }
    // Sort chronologically
    randomTimes.sort((a, b) => a - b);

    // Create DbSlots
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    const newDbSlots = randomTimes.map(timeMins => ({
        profile_id: activeProfileId,
        date: dateStr,
        time: minsToTime(timeMins),
        type: config.videoType,
        status: VideoStatus.PLANNING,
        topic: '',
        title: '',
        description: ''
    }));

    // Batch Insert
    const { error } = await supabase.from('p12_slots').insert(newDbSlots);
    if (error) {
        console.error(error);
        alert('Error saving schedule');
    } else {
        loadSlots();
    }
  };

  const updateSlot = async (id: string, updates: Partial<VideoSlot>) => {
    // Optimistic UI
    setSlots(slots.map(s => s.id === id ? { ...s, ...updates } : s));

    // DB Update
    // Map UI keys to DB keys if necessary (here mostly same, except camelCase vs snake)
    const dbUpdates: any = {};
    if (updates.status) dbUpdates.status = updates.status;
    if (updates.topic !== undefined) dbUpdates.topic = updates.topic;
    if (updates.title !== undefined) dbUpdates.title = updates.title;
    if (updates.description !== undefined) dbUpdates.description = updates.description;

    await supabase.from('p12_slots').update(dbUpdates).eq('id', id);
  };

  const deleteSlot = async (id: string) => {
      setSlots(slots.filter(s => s.id !== id));
      await supabase.from('p12_slots').delete().eq('id', id);
  };

  const clearSchedule = async () => {
      if(window.confirm(t.confirmClear)) {
          const dateStr = format(selectedDate, 'yyyy-MM-dd');
          await supabase.from('p12_slots').delete().eq('profile_id', activeProfileId).eq('date', dateStr);
          setSlots([]);
      }
  };

  // --- AI ---
  const handleAiGeneration = async (id: string, topic: string) => {
    if (!topic) return;
    updateSlot(id, { aiLoading: true });
    try {
      const data = await generateVideoDetails(topic, activeProfile?.name || '');
      updateSlot(id, {
        title: data.title,
        description: data.description,
        aiLoading: false
      });
    } catch (error) {
      alert("AI Error");
      updateSlot(id, { aiLoading: false });
    }
  };

  const handleGlobalAnalysis = async () => {
      const tip = await analyzeSchedule(slots);
      setAiTip(tip);
  };

  // --- EXPORTS ---
  const exportCSV = () => {
    // ... same as before but using slot state ...
    const BOM = "\uFEFF"; 
    const headers = ['Date', 'Time', 'Type', 'Topic', 'Status', 'Title', 'Description'];
    const csvContent = "data:text/csv;charset=utf-8," + BOM
      + [headers.join(','), ...slots.map(s => {
          const statusTranslated = t.status[s.status];
          return [
            s.date,
            s.time,
            s.type,
            `"${s.topic.replace(/"/g, '""')}"`, 
            `"${statusTranslated}"`, 
            `"${s.title.replace(/"/g, '""')}"`,
            `"${s.description.replace(/"/g, '""')}"`
          ].join(',');
      })].join('\n');
      
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      link.setAttribute("download", `PostarTube_${activeProfile?.name}_${dateStr}.csv`);
      document.body.appendChild(link);
      link.click();
      setExportMenuOpen(false);
  };

  const exportTXT = () => {
     // ... simple text export ...
     let content = `PostarTube - ${activeProfile?.name}\n`;
     content += `Date: ${format(selectedDate, 'yyyy-MM-dd')}\n`;
     slots.forEach(s => {
         content += `[${s.time}] ${s.topic || 'Untitled'} (${s.status})\n`;
     });
     const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
     const link = document.createElement("a");
     link.href = URL.createObjectURL(blob);
     link.download = `PostarTube.txt`;
     document.body.appendChild(link);
     link.click();
     setExportMenuOpen(false);
  };


  // --- RENDER ---

  if (sessionLoading) return <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-500">Loading...</div>;
  if (!session) return <Auth t={t} />;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20 transition-colors duration-200">
      
      {channelManagerOpen && (
        <ChannelManager 
          profiles={profiles}
          activeProfileId={activeProfileId}
          onSwitch={(id) => { setActiveProfileId(id); setChannelManagerOpen(false); }}
          onCreate={handleCreateProfile}
          onDelete={handleDeleteProfile}
          onClose={() => setChannelManagerOpen(false)}
          t={t}
        />
      )}

      {/* Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-indigo-200 dark:shadow-none shadow-md">
              <Zap className="text-white" size={20} fill="currentColor" />
            </div>
            <h1 className="text-xl font-bold text-slate-800 dark:text-white tracking-tight">{t.appTitle}</h1>
            
            {/* Profile Pill */}
            {activeProfile && (
                <div className="ml-4 flex items-center gap-2">
                <button 
                    onClick={() => setChannelManagerOpen(true)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-full text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors border border-slate-200 dark:border-slate-700"
                >
                    <Users size={14} className="text-indigo-500" />
                    <span className="max-w-[100px] md:max-w-[150px] truncate">{activeProfile.name}</span>
                    <ChevronDown size={12} />
                </button>
                </div>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
               {(['pt', 'es', 'en'] as Language[]).map(l => (
                   <button key={l} onClick={() => setLang(l)} className={`px-2 py-1 text-xs font-bold rounded uppercase ${lang === l ? 'bg-white dark:bg-slate-600 shadow-sm text-indigo-600 dark:text-indigo-300' : 'text-slate-500 dark:text-slate-400'}`}>{l}</button>
               ))}
            </div>

            <button 
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 text-slate-500 dark:text-indigo-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <div className="relative">
              <button 
                onClick={() => setExportMenuOpen(!exportMenuOpen)} 
                disabled={slots.length === 0} 
                className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:text-slate-400 dark:hover:text-indigo-300 dark:hover:bg-indigo-900/30 rounded-lg transition-colors"
              >
                <Download size={20} />
              </button>
              
              {exportMenuOpen && (
                 <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 z-50 overflow-hidden">
                    <button onClick={exportCSV} className="w-full text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
                      <FileSpreadsheet size={16} className="text-emerald-600" /> {t.exportCsv}
                    </button>
                    <button onClick={exportTXT} className="w-full text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200 border-t border-slate-100 dark:border-slate-700">
                      <FileText size={16} className="text-slate-500" /> {t.exportTxt}
                    </button>
                 </div>
              )}
            </div>

            <button onClick={clearSchedule} disabled={slots.length === 0} className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 dark:text-slate-400 dark:hover:text-red-400 dark:hover:bg-red-900/20 rounded-lg transition-colors" title={t.clearAll}>
              <RotateCcw size={20} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {!activeProfile ? (
             <div className="text-center py-20">
                 <h2 className="text-xl font-bold text-slate-400">{t.noChannels}</h2>
                 <button onClick={() => setChannelManagerOpen(true)} className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded-lg">{t.createNewChannel}</button>
             </div>
        ) : (
            <>
                <CalendarSelector selectedDate={selectedDate} onSelect={setSelectedDate} lang={lang} />

                <div className="flex flex-col lg:flex-row gap-8">
                
                {/* Left Sidebar */}
                <aside className="lg:w-80 shrink-0 space-y-6">
                    <ConfigPanel 
                        config={config} 
                        platform={activeProfile.platform}
                        profileName={activeProfile.name}
                        setConfig={handleConfigChange} 
                        onGenerate={generateSchedule} 
                        t={t} 
                    />
                    
                    {/* AI Analysis */}
                    {slots.length > 0 && config.videoType === 'LONG' && (
                    <div className="bg-indigo-900 dark:bg-indigo-950 rounded-2xl p-6 text-indigo-100 shadow-lg relative overflow-hidden border border-indigo-800/50">
                        <div className="absolute top-0 right-0 p-4 opacity-10"><Zap size={64} /></div>
                        <h3 className="font-bold text-white mb-2 flex items-center gap-2"><Zap size={16} className="text-yellow-400" fill="currentColor"/> {t.aiCoachTitle}</h3>
                        <p className="text-sm text-indigo-200 mb-4 leading-relaxed">{aiTip || t.aiCoachDesc}</p>
                        <button onClick={handleGlobalAnalysis} className="w-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold py-2 px-4 rounded-lg transition-colors border border-white/20">{aiTip ? t.aiCoachBtnActive : t.aiCoachBtn}</button>
                    </div>
                    )}
                </aside>

                {/* Main Content */}
                <div className="flex-1">
                    <StatsWidget slots={slots} t={t} />

                    {loadingData ? (
                        <div className="text-center py-10 text-slate-400">Loading schedule...</div>
                    ) : slots.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50 dark:bg-slate-900/50 text-slate-400 dark:text-slate-600">
                        <Zap size={48} className="mb-4 opacity-20" />
                        <p className="font-medium">{t.noScheduleTitle}</p>
                        <p className="text-sm">{t.noScheduleDesc}</p>
                    </div>
                    ) : (
                    <div className={config.videoType === 'SHORT' ? "grid gap-2" : "space-y-4"}>
                        {slots.some(s => s.type === 'SHORT') && (
                            <div className="flex px-3 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
                            <div className="w-12">{t.headerTime}</div>
                            <div className="w-5 mx-3">{t.headerDone}</div>
                            <div className="flex-1">{t.headerTopic}</div>
                            <div className="w-24 text-right">{t.headerStatus}</div>
                            </div>
                        )}
                        
                        {slots.map((slot) => (
                        <VideoCard
                            key={slot.id}
                            slot={slot}
                            onUpdate={updateSlot}
                            onGenerateAI={handleAiGeneration}
                            onDelete={deleteSlot}
                            t={t}
                        />
                        ))}
                    </div>
                    )}
                </div>

                </div>
            </>
        )}
      </main>
      
      {exportMenuOpen && <div className="fixed inset-0 z-40" onClick={() => setExportMenuOpen(false)}></div>}
    </div>
  );
};

export default App;