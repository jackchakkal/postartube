import React, { useState } from 'react';
import { ChannelProfile, Platform, PLATFORM_CONFIG } from '../types';
import { Plus, Trash2, Smartphone, MonitorPlay, Youtube, Facebook, Instagram, LogOut } from 'lucide-react';
import { supabase } from '../services/supabase';

interface ChannelManagerProps {
  profiles: ChannelProfile[];
  activeProfileId: string;
  onSwitch: (id: string) => void;
  onCreate: (name: string, platform: Platform) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
  t: any;
}

export const ChannelManager: React.FC<ChannelManagerProps> = ({ 
  profiles, activeProfileId, onSwitch, onCreate, onDelete, onClose, t 
}) => {
  const [newChannelName, setNewChannelName] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>('YOUTUBE');

  const handleCreate = () => {
    if (!newChannelName.trim()) return;
    onCreate(newChannelName, selectedPlatform);
    setNewChannelName('');
  };

  const handleLogout = async () => {
      await supabase.auth.signOut();
      window.location.reload();
  }

  const getPlatformIcon = (p: Platform) => {
     switch(p) {
        case 'YOUTUBE': return <Youtube size={18} />;
        case 'FACEBOOK': return <Facebook size={18} />;
        case 'INSTAGRAM': return <Instagram size={18} />;
        case 'TIKTOK': return <div className="font-bold text-xs">Tk</div>;
     }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200 dark:border-slate-700 flex flex-col max-h-[90vh]">
        
        <div className="flex border-b border-slate-200 dark:border-slate-800 p-4 justify-between items-center">
             <h2 className="text-lg font-bold text-slate-800 dark:text-white">{t.channelsTitle}</h2>
             <button onClick={handleLogout} className="text-xs text-red-500 hover:underline flex items-center gap-1">
                <LogOut size={12} /> {t.logout}
             </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 space-y-6">
              {/* Create New */}
              <div className="space-y-3 p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800">
                <label className="text-xs font-bold uppercase text-slate-500">{t.createNewChannel}</label>
                <input 
                  type="text" 
                  value={newChannelName}
                  onChange={(e) => setNewChannelName(e.target.value)}
                  placeholder={t.channelPlaceholder}
                  className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:text-white"
                />
                
                <div className="grid grid-cols-4 gap-2">
                    {(Object.keys(PLATFORM_CONFIG) as Platform[]).map(p => (
                        <button
                            key={p}
                            onClick={() => setSelectedPlatform(p)}
                            className={`flex flex-col items-center justify-center p-2 rounded-lg border text-xs transition-all
                                ${selectedPlatform === p 
                                    ? 'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-500 text-indigo-700 dark:text-indigo-300' 
                                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500'
                                }
                            `}
                        >
                           <div className={selectedPlatform === p ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}>
                                {getPlatformIcon(p)}
                           </div>
                           <span className="mt-1 scale-90">{PLATFORM_CONFIG[p].label}</span>
                        </button>
                    ))}
                </div>

                <button 
                  onClick={handleCreate}
                  disabled={!newChannelName.trim()}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white p-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Plus size={16} /> {t.createNewChannel}
                </button>
              </div>

              {/* List */}
              <div className="space-y-3">
                {profiles.length === 0 && (
                  <p className="text-center text-slate-400 py-4">{t.noChannels}</p>
                )}
                
                {profiles.map(profile => (
                  <div 
                    key={profile.id}
                    className={`flex items-center justify-between p-4 rounded-xl border transition-all ${activeProfileId === profile.id ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800 ring-1 ring-indigo-500' : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 hover:border-slate-300'}`}
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                       <div className={`p-2 rounded-lg ${PLATFORM_CONFIG[profile.platform].color} bg-white dark:bg-slate-700 shadow-sm`}>
                          {getPlatformIcon(profile.platform)}
                       </div>
                       <div>
                         <h4 className="font-bold text-slate-800 dark:text-slate-200 truncate">{profile.name}</h4>
                         <p className="text-xs text-slate-500 dark:text-slate-400">{PLATFORM_CONFIG[profile.platform].label}</p>
                       </div>
                    </div>
                    
                    <div className="flex gap-2">
                      {activeProfileId !== profile.id && (
                        <button 
                          onClick={() => onSwitch(profile.id)}
                          className="px-3 py-1.5 text-xs font-bold bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-md hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors text-slate-700 dark:text-slate-200"
                        >
                          {t.switchChannel}
                        </button>
                      )}
                      
                      <button 
                        onClick={() => {
                          if(window.confirm(t.confirmDeleteChannel)) onDelete(profile.id);
                        }}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};