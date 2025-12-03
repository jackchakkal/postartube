import React from 'react';
import { ChannelConfig, Platform, PLATFORM_CONFIG } from '../types';
import { Settings, Calendar, PlaySquare, Smartphone, MonitorPlay, Youtube, Facebook, Instagram } from 'lucide-react';

interface ConfigPanelProps {
  config: ChannelConfig;
  platform: Platform;
  profileName: string;
  setConfig: (config: ChannelConfig) => void;
  onGenerate: () => void;
  t: any;
}

export const ConfigPanel: React.FC<ConfigPanelProps> = ({ config, platform, profileName, setConfig, onGenerate, t }) => {
  const handleChange = (key: keyof ChannelConfig, value: any) => {
    setConfig({ ...config, [key]: value });
  };

  const getPlatformIcon = (p: Platform) => {
     switch(p) {
        case 'YOUTUBE': return <Youtube size={18} />;
        case 'FACEBOOK': return <Facebook size={18} />;
        case 'INSTAGRAM': return <Instagram size={18} />;
        case 'TIKTOK': return <div className="font-bold text-xs">Tk</div>;
     }
  }

  const platformInfo = PLATFORM_CONFIG[platform];

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 h-fit sticky top-6">
      <div className="flex items-center gap-2 mb-6 text-slate-800 dark:text-white">
        <Settings className="text-indigo-600 dark:text-indigo-400" size={24} />
        <h2 className="text-lg font-bold">{t.configTitle}</h2>
      </div>

      <div className="space-y-6">
        
        {/* Channel Name (Read Only) */}
        <div>
          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">{t.channelName}</label>
          <div className="relative">
            <input
              type="text"
              readOnly
              value={profileName}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-bold text-slate-600 dark:text-slate-400 cursor-not-allowed"
            />
            <div className={`absolute left-3 top-2.5 ${platformInfo.color}`}>
               {getPlatformIcon(platform)}
            </div>
          </div>
        </div>

        {/* Video Format Selector */}
        <div>
          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">{t.format}</label>
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-700 rounded-lg">
            <button
              onClick={() => handleChange('videoType', 'LONG')}
              className={`flex items-center justify-center gap-2 py-2 rounded-md text-sm font-semibold transition-all ${config.videoType === 'LONG' ? 'bg-white dark:bg-slate-600 text-indigo-600 dark:text-indigo-300 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
            >
              <MonitorPlay size={16} /> {t.longVideo}
            </button>
            <button
              onClick={() => handleChange('videoType', 'SHORT')}
              className={`flex items-center justify-center gap-2 py-2 rounded-md text-sm font-semibold transition-all ${config.videoType === 'SHORT' ? 'bg-white dark:bg-slate-600 text-pink-600 dark:text-pink-300 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
            >
              <Smartphone size={16} /> {t.shorts}
            </button>
          </div>
        </div>

        {/* Quantity */}
        <div>
           <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">{t.videosPerDay}</label>
           <div className="flex items-center gap-3">
             <input
                type="number"
                min="1"
                max="200"
                value={config.videosPerDay}
                onChange={(e) => handleChange('videosPerDay', parseInt(e.target.value) || 0)}
                className="w-24 px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-lg font-bold text-center text-indigo-600 dark:text-indigo-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
             />
             <span className="text-sm text-slate-400">{t.slots}</span>
           </div>
           <p className="text-xs text-slate-400 mt-2">
             {config.videoType === 'SHORT' ? t.shortsHint : t.longHint}
           </p>
        </div>

        {/* Time Range */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">{t.firstVideo}</label>
            <input
              type="time"
              value={config.startTime}
              onChange={(e) => handleChange('startTime', e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none font-mono dark:text-white"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">{t.lastVideo}</label>
            <input
              type="time"
              value={config.endTime}
              onChange={(e) => handleChange('endTime', e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none font-mono dark:text-white"
            />
          </div>
        </div>

        <button
          onClick={onGenerate}
          className="w-full bg-slate-900 hover:bg-black dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 mt-4"
        >
          <Calendar size={18} />
          {t.generateBtn}
        </button>

        <p className="text-xs text-slate-400 text-center leading-relaxed">
          {t.generateHint}
        </p>

      </div>
    </div>
  );
};