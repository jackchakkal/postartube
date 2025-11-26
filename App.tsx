import React, { useState, useEffect } from 'react';
import { ChannelConfig, VideoSlot, VideoStatus, Language, ChannelProfile } from './types';
import { ConfigPanel } from './components/ConfigPanel';
import { VideoCard } from './components/VideoCard';
import { StatsWidget } from './components/StatsWidget';
import { ChannelManager } from './components/ChannelManager';
import { generateVideoDetails, analyzeSchedule } from './services/geminiService';
import { translations } from './translations';
import { Zap, Download, RotateCcw, Smartphone, Moon, Sun, FileText, FileSpreadsheet, Users, ChevronDown } from 'lucide-react';

// Helper to convert HH:mm to minutes
const timeToMins = (time: string) => {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
};

// Helper to convert minutes to HH:mm
const minsToTime = (mins: number) => {
  const h = Math.floor(mins / 60);
  const m = Math.floor(mins % 60);
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
};

const DEFAULT_CONFIG: ChannelConfig = {
  channelName: '',
  videoType: 'LONG',
  videosPerDay: 3,
  startTime: '09:00',
  endTime: '18:00',
};

const App: React.FC = () => {
  // --- GLOBAL UI STATE ---
  const [lang, setLang] = useState<Language>(() => {
    return (localStorage.getItem('postartube_lang') as Language) || 'pt';
  });

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('postartube_theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [exportMenuOpen, setExportMenuOpen] = useState(false);
  const [channelManagerOpen, setChannelManagerOpen] = useState(false);
  const [aiTip, setAiTip] = useState<string>("");

  // --- DATA STATE (MULTI-CHANNEL) ---
  const [profiles, setProfiles] = useState<ChannelProfile[]>([]);
  const [activeProfileId, setActiveProfileId] = useState<string>('');

  // Initial Load & Migration Logic
  useEffect(() => {
    const savedProfilesStr = localStorage.getItem('postartube_profiles');
    const savedActiveId = localStorage.getItem('postartube_active_profile_id');
    
    if (savedProfilesStr) {
      // Normal Load
      const loadedProfiles = JSON.parse(savedProfilesStr);
      setProfiles(loadedProfiles);
      if (loadedProfiles.length > 0) {
        setActiveProfileId(savedActiveId && loadedProfiles.find((p: any) => p.id === savedActiveId) ? savedActiveId : loadedProfiles[0].id);
      }
    } else {
      // MIGRATION: Check for legacy single-channel data
      const oldConfig = localStorage.getItem('postartube_config');
      const oldSlots = localStorage.getItem('postartube_slots');
      
      const initialProfile: ChannelProfile = {
        id: crypto.randomUUID(),
        name: oldConfig ? JSON.parse(oldConfig).channelName || 'My First Channel' : 'My First Channel',
        config: oldConfig ? JSON.parse(oldConfig) : DEFAULT_CONFIG,
        slots: oldSlots ? JSON.parse(oldSlots) : [],
        lastModified: Date.now()
      };
      
      setProfiles([initialProfile]);
      setActiveProfileId(initialProfile.id);
    }
  }, []);

  // Persistence
  useEffect(() => {
    if (profiles.length > 0) {
      localStorage.setItem('postartube_profiles', JSON.stringify(profiles));
    }
  }, [profiles]);

  useEffect(() => {
    if (activeProfileId) {
      localStorage.setItem('postartube_active_profile_id', activeProfileId);
    }
  }, [activeProfileId]);

  useEffect(() => {
    localStorage.setItem('postartube_lang', lang);
  }, [lang]);

  useEffect(() => {
    localStorage.setItem('postartube_theme', darkMode ? 'dark' : 'light');
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Derived State (Active Profile)
  const activeProfile = profiles.find(p => p.id === activeProfileId) || profiles[0];
  const config = activeProfile?.config || DEFAULT_CONFIG;
  const slots = activeProfile?.slots || [];
  const t = translations[lang];

  // --- PROFILE MANAGEMENT ---

  const updateActiveProfile = (updates: Partial<ChannelProfile> | { config: ChannelConfig } | { slots: VideoSlot[] }) => {
    setProfiles(prev => prev.map(p => 
      p.id === activeProfileId ? { ...p, ...updates, lastModified: Date.now() } : p
    ));
  };

  const createProfile = (name: string) => {
    const newProfile: ChannelProfile = {
      id: crypto.randomUUID(),
      name: name,
      config: { ...DEFAULT_CONFIG, channelName: name },
      slots: [],
      lastModified: Date.now()
    };
    setProfiles(prev => [...prev, newProfile]);
    setActiveProfileId(newProfile.id);
  };

  const deleteProfile = (id: string) => {
    const newProfiles = profiles.filter(p => p.id !== id);
    setProfiles(newProfiles);
    if (newProfiles.length > 0) {
      setActiveProfileId(newProfiles[0].id);
    } else {
      // Create empty default if all deleted
      createProfile('New Channel');
    }
  };

  const importProfiles = (newProfiles: ChannelProfile[]) => {
    setProfiles(newProfiles);
    if (newProfiles.length > 0) setActiveProfileId(newProfiles[0].id);
    setChannelManagerOpen(false);
  };

  // --- SCHEDULING LOGIC ---

  const setConfig = (newConfig: ChannelConfig) => {
    // Also update profile name if channel name changes
    updateActiveProfile({ 
      config: newConfig,
      name: newConfig.channelName || activeProfile.name
    });
  };

  const setSlots = (newSlots: VideoSlot[]) => {
    updateActiveProfile({ slots: newSlots });
  };

  const generateSchedule = () => {
    const startMins = timeToMins(config.startTime);
    const endMins = timeToMins(config.endTime);
    const count = config.videosPerDay;

    if (endMins <= startMins) {
      alert(t.endTimeError);
      return;
    }

    if (count > 200) {
      if (!window.confirm(t.confirmHighVolume)) return;
    }

    const newSlots: VideoSlot[] = [];
    const interval = count > 1 ? (endMins - startMins) / (count - 1) : 0;

    for (let i = 0; i < count; i++) {
      const timeMins = Math.round(startMins + (i * interval));
      const timeStr = minsToTime(timeMins);
      
      const existing = slots.find(s => s.time === timeStr);
      
      if (existing) {
        newSlots.push(existing);
      } else {
        newSlots.push({
          id: crypto.randomUUID(),
          time: timeStr,
          type: config.videoType,
          topic: '',
          title: '',
          description: '',
          status: VideoStatus.PLANNING,
          aiLoading: false,
        });
      }
    }
    setSlots(newSlots);
    setAiTip(""); 
  };

  const updateSlot = (id: string, updates: Partial<VideoSlot>) => {
    setSlots(slots.map(slot => slot.id === id ? { ...slot, ...updates } : slot));
  };

  const deleteSlot = (id: string) => {
     setSlots(slots.filter(s => s.id !== id));
  };

  const handleAiGeneration = async (id: string, topic: string) => {
    if (!topic) return;
    updateSlot(id, { aiLoading: true });
    try {
      const data = await generateVideoDetails(topic, config.channelName);
      updateSlot(id, {
        title: data.title,
        description: data.description,
        aiLoading: false
      });
    } catch (error) {
      alert("AI Generation failed. Check API Key or try again.");
      updateSlot(id, { aiLoading: false });
    }
  };

  const handleGlobalAnalysis = async () => {
    if (slots.length === 0) return;
    const tip = await analyzeSchedule(slots);
    setAiTip(tip);
  };

  const clearSchedule = () => {
    if(window.confirm(t.confirmClear)) {
      setSlots([]);
      setAiTip("");
    }
  };

  // --- EXPORT FUNCTIONS ---

  const exportCSV = () => {
    const BOM = "\uFEFF"; 
    const headers = ['Time', 'Type', 'Topic', 'Status', 'Title', 'Description'];
    const csvContent = "data:text/csv;charset=utf-8," + BOM
      + [headers.join(','), ...slots.map(s => {
          const statusTranslated = t.status[s.status];
          return [
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
      link.setAttribute("download", `PostarTube_${config.channelName || 'schedule'}_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      setExportMenuOpen(false);
  };

  const exportTXT = () => {
    let content = `PostarTube Schedule - ${config.channelName}\n`;
    content += `Date: ${new Date().toLocaleDateString()}\n`;
    content += "========================================\n\n";

    slots.forEach(s => {
      content += `[${s.time}] ${s.topic || "(No Topic)"}\n`;
      content += `Status: ${t.status[s.status]}\n`;
      if (s.title) content += `Title: ${s.title}\n`;
      if (s.description) content += `Desc: ${s.description}\n`;
      content += "----------------------------------------\n";
    });

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `PostarTube_${config.channelName || 'schedule'}.txt`;
    document.body.appendChild(link);
    link.click();
    setExportMenuOpen(false);
  };

  if (!activeProfile) return <div className="min-h-screen bg-slate-50 flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20 transition-colors duration-200">
      
      {/* CHANNEL MANAGER MODAL */}
      {channelManagerOpen && (
        <ChannelManager 
          profiles={profiles}
          activeProfileId={activeProfileId}
          onSwitch={(id) => { setActiveProfileId(id); setChannelManagerOpen(false); }}
          onCreate={createProfile}
          onDelete={deleteProfile}
          onImport={importProfiles}
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
            
            {/* Channel Selector Pill */}
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
          </div>
          
          <div className="flex items-center gap-3">
            {/* Language Switcher */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
               <button onClick={() => setLang('pt')} className={`px-2 py-1 text-xs font-bold rounded ${lang === 'pt' ? 'bg-white dark:bg-slate-600 shadow-sm text-indigo-600 dark:text-indigo-300' : 'text-slate-500 dark:text-slate-400'}`}>PT</button>
               <button onClick={() => setLang('es')} className={`px-2 py-1 text-xs font-bold rounded ${lang === 'es' ? 'bg-white dark:bg-slate-600 shadow-sm text-indigo-600 dark:text-indigo-300' : 'text-slate-500 dark:text-slate-400'}`}>ES</button>
               <button onClick={() => setLang('en')} className={`px-2 py-1 text-xs font-bold rounded ${lang === 'en' ? 'bg-white dark:bg-slate-600 shadow-sm text-indigo-600 dark:text-indigo-300' : 'text-slate-500 dark:text-slate-400'}`}>EN</button>
            </div>

            {/* Dark Mode Toggle */}
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 text-slate-500 dark:text-indigo-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-1"></div>

            {/* Export Menu */}
            <div className="relative">
              <button 
                onClick={() => setExportMenuOpen(!exportMenuOpen)} 
                disabled={slots.length === 0} 
                className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:text-slate-400 dark:hover:text-indigo-300 dark:hover:bg-indigo-900/30 rounded-lg transition-colors"
                title="Export"
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

            {/* Clear Button */}
            <button onClick={clearSchedule} disabled={slots.length === 0} className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 dark:text-slate-400 dark:hover:text-red-400 dark:hover:bg-red-900/20 rounded-lg transition-colors" title={t.clearAll}>
              <RotateCcw size={20} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Sidebar: Configuration */}
          <aside className="lg:w-80 shrink-0">
            <ConfigPanel config={config} setConfig={setConfig} onGenerate={generateSchedule} t={t} />
            
            {/* AI Analysis Box */}
            {slots.length > 0 && config.videoType === 'LONG' && (
              <div className="mt-6 bg-indigo-900 dark:bg-indigo-950 rounded-2xl p-6 text-indigo-100 shadow-lg relative overflow-hidden border border-indigo-800/50">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                   <Zap size={64} />
                </div>
                <h3 className="font-bold text-white mb-2 flex items-center gap-2">
                   <Zap size={16} className="text-yellow-400" fill="currentColor"/> {t.aiCoachTitle}
                </h3>
                <p className="text-sm text-indigo-200 mb-4 leading-relaxed">
                  {aiTip || t.aiCoachDesc}
                </p>
                <button 
                  onClick={handleGlobalAnalysis}
                  className="w-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold py-2 px-4 rounded-lg transition-colors border border-white/20"
                >
                  {aiTip ? t.aiCoachBtnActive : t.aiCoachBtn}
                </button>
              </div>
            )}
            
            {/* Hints for Shorts Mode */}
            {config.videoType === 'SHORT' && (
              <div className="mt-6 p-4 bg-pink-50 dark:bg-pink-900/20 border border-pink-100 dark:border-pink-900/30 rounded-xl text-pink-800 dark:text-pink-300 text-sm">
                <div className="font-bold flex items-center gap-2 mb-2">
                  <Smartphone size={16} /> {t.shortsModeTitle}
                </div>
                <p className="opacity-80">
                  {t.shortsModeDesc}
                </p>
              </div>
            )}
          </aside>

          {/* Main Content: Schedule List */}
          <div className="flex-1">
            <StatsWidget slots={slots} t={t} />

            {slots.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50 dark:bg-slate-900/50 text-slate-400 dark:text-slate-600">
                <Zap size={48} className="mb-4 opacity-20" />
                <p className="font-medium">{t.noScheduleTitle}</p>
                <p className="text-sm">{t.noScheduleDesc}</p>
              </div>
            ) : (
              <div className={config.videoType === 'SHORT' ? "grid gap-2" : "space-y-4"}>
                 {/* Header for Checklist if Shorts */}
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
      </main>
      
      {/* Background Toggle Overlay to prevent FOUC for exportMenu */}
      {exportMenuOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setExportMenuOpen(false)}></div>
      )}
    </div>
  );
};

export default App;