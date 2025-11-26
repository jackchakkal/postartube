import React, { useState } from 'react';
import { ChannelProfile } from '../types';
import { Plus, Trash2, ArrowRightLeft, Copy, Download, Upload, MonitorPlay, Smartphone } from 'lucide-react';

interface ChannelManagerProps {
  profiles: ChannelProfile[];
  activeProfileId: string;
  onSwitch: (id: string) => void;
  onCreate: (name: string) => void;
  onDelete: (id: string) => void;
  onImport: (profiles: ChannelProfile[]) => void;
  onClose: () => void;
  t: any;
}

export const ChannelManager: React.FC<ChannelManagerProps> = ({ 
  profiles, activeProfileId, onSwitch, onCreate, onDelete, onImport, onClose, t 
}) => {
  const [newChannelName, setNewChannelName] = useState('');
  const [importCode, setImportCode] = useState('');
  const [activeTab, setActiveTab] = useState<'list' | 'sync'>('list');

  const handleCreate = () => {
    if (!newChannelName.trim()) return;
    onCreate(newChannelName);
    setNewChannelName('');
  };

  const getExportCode = () => {
    try {
      const json = JSON.stringify(profiles);
      return btoa(encodeURIComponent(json));
    } catch (e) {
      return "Error generating code";
    }
  };

  const handleCopyCode = () => {
    const code = getExportCode();
    navigator.clipboard.writeText(code);
    alert(t.codeCopied);
  };

  const handleImport = () => {
    try {
      const json = decodeURIComponent(atob(importCode));
      const parsedProfiles = JSON.parse(json);
      if (Array.isArray(parsedProfiles) && parsedProfiles.length > 0 && parsedProfiles[0].config) {
        onImport(parsedProfiles);
        setImportCode('');
        alert("Success!");
      } else {
        throw new Error("Invalid structure");
      }
    } catch (e) {
      alert(t.invalidCode);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200 dark:border-slate-700 flex flex-col max-h-[90vh]">
        
        {/* Header Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800">
          <button 
            onClick={() => setActiveTab('list')}
            className={`flex-1 py-4 text-sm font-bold uppercase tracking-wide transition-colors ${activeTab === 'list' ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-500' : 'bg-slate-50 dark:bg-slate-950 text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}
          >
            {t.channelsTitle}
          </button>
          <button 
             onClick={() => setActiveTab('sync')}
             className={`flex-1 py-4 text-sm font-bold uppercase tracking-wide transition-colors ${activeTab === 'sync' ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-500' : 'bg-slate-50 dark:bg-slate-950 text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}
          >
            {t.importExportTitle}
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          
          {/* TAB: LIST */}
          {activeTab === 'list' && (
            <div className="space-y-6">
              {/* Create New */}
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={newChannelName}
                  onChange={(e) => setNewChannelName(e.target.value)}
                  placeholder={t.channelPlaceholder}
                  className="flex-1 px-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:text-white"
                />
                <button 
                  onClick={handleCreate}
                  disabled={!newChannelName.trim()}
                  className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white p-2 rounded-lg transition-colors"
                >
                  <Plus size={20} />
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
                       <div className={`p-2 rounded-lg ${profile.config.videoType === 'SHORT' ? 'bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400' : 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'}`}>
                          {profile.config.videoType === 'SHORT' ? <Smartphone size={18} /> : <MonitorPlay size={18} />}
                       </div>
                       <div>
                         <h4 className="font-bold text-slate-800 dark:text-slate-200 truncate">{profile.name}</h4>
                         <p className="text-xs text-slate-500 dark:text-slate-400">{profile.slots.length} {t.slots}</p>
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
          )}

          {/* TAB: SYNC */}
          {activeTab === 'sync' && (
            <div className="space-y-8">
              <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-xl border border-amber-100 dark:border-amber-800/30 text-amber-800 dark:text-amber-200 text-sm">
                <p>{t.importExportDesc}</p>
              </div>

              {/* Export */}
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">
                  1. {t.copyCode} (Export)
                </label>
                <div className="flex gap-2">
                  <input 
                    readOnly 
                    value={getExportCode()}
                    className="flex-1 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-500 truncate"
                  />
                  <button 
                    onClick={handleCopyCode}
                    className="flex items-center gap-2 bg-slate-800 hover:bg-black dark:bg-slate-700 dark:hover:bg-slate-600 text-white px-4 py-2 rounded-lg font-bold text-xs transition-colors"
                  >
                    <Copy size={14} /> {t.copyCode}
                  </button>
                </div>
              </div>

              <div className="border-t border-slate-200 dark:border-slate-800"></div>

              {/* Import */}
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">
                  2. {t.pasteCode} (Import / Login)
                </label>
                <textarea
                  value={importCode}
                  onChange={(e) => setImportCode(e.target.value)}
                  placeholder={t.pasteCode}
                  className="w-full h-24 p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:text-white mb-3"
                />
                <button
                   onClick={handleImport}
                   disabled={!importCode.trim()}
                   className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <Download size={18} /> {t.loadCodeBtn}
                </button>
              </div>

            </div>
          )}

        </div>

        {/* Footer */}
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