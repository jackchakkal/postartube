
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
import { supabase } from './services/supabase';
import { format } from 'date-fns';
import { Zap, Download, RotateCcw, Smartphone, Moon, Sun, FileText, FileSpreadsheet, Users, ChevronDown, CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react';

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
  const [lang, setLang] = useState<Language>('pt'); // Default inicial
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [exportMenuOpen, setExportMenuOpen] = useState(false);
  const [channelManagerOpen, setChannelManagerOpen] = useState(false);
  const [aiTip, setAiTip] = useState<string>("");

  // --- DATA STATE ---
  const [profiles, setProfiles] = useState<ChannelProfile[]>([]);
  const [activeProfileId, setActiveProfileId] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [slots, setSlots] = useState<VideoSlot[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  // 1. Auth Init & Config Load
  useEffect(() => {
    let mounted = true;

    const init = async () => {
        try {
            console.log("App: Initializing authentication...");
            const { data, error } = await supabase.auth.getSession();
            
            if (error) { 
                console.warn("Session check error:", error.message);
            }
            
            if (mounted) {
                if (data?.session) {
                    setSession(data.session);
                    console.log("App: Session found.");
                    await loadUserConfig(data.session.user.id);
                }
                setSessionLoading(false);
            }

        } catch (e: any) {
            console.error("Auth init exception:", e);
            if (mounted) setSessionLoading(false);
        }
    };

    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event: any, session: any) => {
      if (!mounted) return;
      setSession(session);
      if (session) {
          await loadUserConfig(session.user.id);
      } else {
          // Reset state on logout
          setProfiles([]);
          setActiveProfileId('');
          setSlots([]);
      }
    });

    return () => {
        mounted = false;
        subscription.unsubscribe();
    };
  }, []);

  // 2. Load User Configuration (Theme/Lang) from DB
  const loadUserConfig = async (userId: string) => {
      try {
          const { data, error } = await supabase
              .from('p12_user_config')
              .select('*')
              .eq('user_id', userId)
              .single();
          
          if (data) {
              setLang(data.language as Language);
              setDarkMode(data.theme === 'dark');
          } else {
              // Create default config if not exists
              await supabase.from('p12_user_config').upsert({
                  user_id: userId,
                  theme: 'light',
                  language: 'pt'
              });
          }
      } catch (err) {
          console.error("Error loading config", err);
      }
  };

  const updateUserConfig = async (updates: { theme?: string, language?: string }) => {
      if (!session) return;
      await supabase.from('p12_user_config').upsert({
          user_id: session.user.id,
          ...updates
      });
  };

  // 3. Load Profiles
  useEffect(() => {
    if (session) {
       loadProfiles();
    }
  }, [session]);

  const loadProfiles = async () => {
      const { data, error } = await supabase.from('p12_profiles').select('*');
      if (error) {
          console.error("Error loading profiles:", error);
          return;
      }
      if (data) {
          const mapped: ChannelProfile[] = data.map((p: DbProfile) => ({
              id: p.id,
              name: p.name,
              platform: p.platform,
              config: {
                  videosPerDay: p.default_videos_per_day,
                  startTime: p.default_start_time,
                  endTime: p.default_end_time,
                  videoType: 'LONG'
              }
          }));
          setProfiles(mapped);
          
          // If active profile is deleted or not set, default to first one
          if (mapped.length > 0) {
             if (!activeProfileId || !mapped.find(p => p.id === activeProfileId)) {
                 setActiveProfileId(mapped[0].id);
             }
          } else {
              setActiveProfileId('');
          }
      }
  };

  // 4. Load Slots
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

      if (error) console.error("Error loading slots:", error);
      
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
      } else {
          setSlots([]);
      }
      setLoadingData(false);
  };

  // --- THEME & LANG EFFECT ---
  useEffect(() => {
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    // Backup local
    localStorage.setItem('postartube_theme', darkMode ? 'dark' : 'light');
    localStorage.setItem('postartube_lang', lang);
  }, [darkMode, lang]);

  const toggleTheme = () => {
      const newVal = !darkMode;
      setDarkMode(newVal);
      updateUserConfig({ theme: newVal ? 'dark' : 'light' });
  };

  const changeLang = (l: Language) => {
      setLang(l);
      updateUserConfig({ language: l });
  };

  // Derived State
  const t = translations[lang];
  const activeProfile = profiles.find(p => p.id === activeProfileId);
  const config = activeProfile?.config || { videosPerDay: 3, startTime: '09:00', endTime: '18:00', videoType: 'LONG' };

  // --- ACTIONS ---

  const handleConfigChange = async (newConfig: ChannelConfig) => {
      setProfiles(prev => prev.map(p => 
          p.id === activeProfileId ? { ...p, config: newConfig } : p
      ));
      await supabase.from('p12_profiles').update({
          default_videos_per_day: newConfig.videosPerDay,
          default_start_time: newConfig.startTime,
          default_end_time: newConfig.endTime
      }).eq('id', activeProfileId);
  };

  const handleCreateProfile = async (name: string, platform: Platform) => {
      try {
          console.log("Creating profile...", {name, platform});
          const { data, error } = await supabase.from('p12_profiles').insert({
              user_id: session.user.id,
              name: name,
              platform: platform,
              default_videos_per_day: 3,
              default_start_time: '09:00',
              default_end_time: '18:00'
          }).select().single();

          if (error) {
              console.error("Supabase Create Profile Error:", error);
              alert(`Erro ao salvar no banco de dados: ${error.message}`);
              return;
          }

          if (data) {
              await loadProfiles();
              setActiveProfileId(data.id);
              setChannelManagerOpen(false);
          }
      } catch (err: any) {
          console.error("Exception creating profile:", err);
          alert(`Erro inesperado: ${err.message || 'Consulte o console'}`);
      }
  };

  const handleDeleteProfile = async (id: string) => {
      const { error } = await supabase.from('p12_profiles').delete().eq('id', id);
      if (error) {
          alert(`Erro ao deletar: ${error.message}`);
          return;
      }
      await loadProfiles();
  };

  // --- GENERATOR ---

  const generateSchedule = async () => {
    if (!activeProfileId) return;
    
    // Clear immediately in UI
    setSlots([]);
    setLoadingData(true);

    const startMins = timeToMins(config.startTime);
    const endMins = timeToMins(config.endTime);
    const count = config.videosPerDay;

    if (endMins <= startMins) {
      alert(t.endTimeError);
      setLoadingData(false);
      return;
    }

    if (count > 200 && !window.confirm(t.confirmHighVolume)) {
      setLoadingData(false);
      return;
    }

    // RANDOM ALGORITHM
    const randomTimes: number[] = [];
    for (let i = 0; i < count; i++) {
        const rand = Math.floor(Math.random() * (endMins - startMins + 1)) + startMins;
        randomTimes.push(rand);
    }
    randomTimes.sort((a, b) => a - b);

    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    console.log(`Generating schedule for ${dateStr}. Deleting old slots first.`);

    // 1. CLEAR EXISTING SLOTS FOR THIS PROFILE AND DATE
    const { error: delError } = await supabase.from('p12_slots')
        .delete()
        .eq('profile_id', activeProfileId)
        .eq('date', dateStr);

    if (delError) {
        console.error("Error clearing slots:", delError);
        alert(`Failed to clear old schedule: ${delError.message}`);
        setLoadingData(false);
        return;
    }

    // 2. INSERT NEW SLOTS
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

    const { error: insError } = await supabase.from('p12_slots').insert(newDbSlots);
    if (insError) {
        console.error("Error inserting slots:", insError);
        alert(`Error saving schedule: ${insError.message}`);
    } else {
        await loadSlots(); // Reload to ensure sync
    }
  };

  const updateSlot = async (id: string, updates: Partial<VideoSlot>) => {
    setSlots(slots.map(s => s.id === id ? { ...s, ...updates } : s));
    const dbUpdates: any = {};
    if (updates.status) dbUpdates.status = updates.status;
    if (updates.topic !== undefined) dbUpdates.topic = updates.topic;
    if (updates.title !== undefined) dbUpdates.title = updates.title;
    if (updates.description !== undefined) dbUpdates.description = updates.description;
    
    const { error } = await supabase.from('p12_slots').update(dbUpdates).eq('id', id);
    if (error) console.error("Error updating slot:", error);
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

  // --- AI & EXPORT ---
  const handleAiGeneration = async (id: string, topic: string) => {
    if (!topic) return;
    updateSlot(id, { aiLoading: true });
    try {
      const data = await generateVideoDetails(topic, activeProfile?.name || '');
      updateSlot(id, { title: data.title, description: data.description, aiLoading: false });
    } catch (error) {
      alert("AI Error");
      updateSlot(id, { aiLoading: false });
    }
  };

  const handleGlobalAnalysis = async () => {
      const tip = await analyzeSchedule(slots);
      setAiTip(tip);
  };

  const exportCSV = () => {
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

  if (sessionLoading) {
      return (
          <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-500 gap-4">
              <div className="animate-spin text-indigo-500"><RotateCcw size={32} /></div>
              <p>Carregando sistema...</p>
          </div>
      );
  }

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
                   <button key={l} onClick={() => changeLang(l)} className={`px-2 py-1 text-xs font-bold rounded uppercase ${lang === l ? 'bg-white dark:bg-slate-600 shadow-sm text-indigo-600 dark:text-indigo-300' : 'text-slate-500 dark:text-slate-400'}`}>{l}</button>
               ))}
            </div>

            <button 
              onClick={toggleTheme}
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
                
                <aside className="lg:w-80 shrink-0 space-y-6">
                    <ConfigPanel 
                        config={config} 
                        platform={activeProfile.platform}
                        profileName={activeProfile.name}
                        setConfig={handleConfigChange} 
                        onGenerate={generateSchedule} 
                        t={t} 
                    />
                    
                    {slots.length > 0 && config.videoType === 'LONG' && (
                    <div className="bg-indigo-900 dark:bg-indigo-950 rounded-2xl p-6 text-indigo-100 shadow-lg relative overflow-hidden border border-indigo-800/50">
                        <div className="absolute top-0 right-0 p-4 opacity-10"><Zap size={64} /></div>
                        <h3 className="font-bold text-white mb-2 flex items-center gap-2"><Zap size={16} className="text-yellow-400" fill="currentColor"/> {t.aiCoachTitle}</h3>
                        <p className="text-sm text-indigo-200 mb-4 leading-relaxed">{aiTip || t.aiCoachDesc}</p>
                        <button onClick={handleGlobalAnalysis} className="w-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold py-2 px-4 rounded-lg transition-colors border border-white/20">{aiTip ? t.aiCoachBtnActive : t.aiCoachBtn}</button>
                    </div>
                    )}
                </aside>

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
