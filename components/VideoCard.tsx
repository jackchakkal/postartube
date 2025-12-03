import React, { useState } from 'react';
import { VideoSlot, VideoStatus, STATUS_COLORS } from '../types';
import { Clock, Wand2, Check, Youtube, Trash2, ChevronDown } from 'lucide-react';

interface VideoCardProps {
  slot: VideoSlot;
  onUpdate: (id: string, updates: Partial<VideoSlot>) => void;
  onGenerateAI: (id: string, topic: string) => void;
  onDelete: (id: string) => void;
  t: any;
}

export const VideoCard: React.FC<VideoCardProps> = ({ slot, onUpdate, onGenerateAI, onDelete, t }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleStatusChange = (newStatus: VideoStatus) => {
    onUpdate(slot.id, { status: newStatus });
  };

  const statusOptions = Object.values(VideoStatus);

  // --------------------------------------------------------------------------
  // RENDER: SHORTS (Checklist Mode)
  // --------------------------------------------------------------------------
  if (slot.type === 'SHORT') {
    const isDone = slot.status === VideoStatus.READY || slot.status === VideoStatus.PUBLISHED;
    
    return (
      <div className={`group flex items-center gap-3 p-3 rounded-lg border transition-all hover:shadow-sm ${isDone ? 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'}`}>
        {/* Time */}
        <div className="font-mono text-xs font-bold text-slate-500 dark:text-slate-400 w-12 shrink-0">
          {slot.time}
        </div>

        {/* Checkbox-like Status Toggle */}
        <button 
          onClick={() => handleStatusChange(isDone ? VideoStatus.PLANNING : VideoStatus.READY)}
          className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isDone ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 hover:border-emerald-400'}`}
          title="Mark Ready"
        >
          {isDone && <Check size={12} strokeWidth={4} />}
        </button>

        {/* Topic Input - Compact */}
        <input
          type="text"
          value={slot.topic}
          onChange={(e) => onUpdate(slot.id, { topic: e.target.value })}
          placeholder={t.shortsTopicPlaceholder}
          className={`flex-1 bg-transparent border-none text-sm focus:ring-0 p-0 ${isDone ? 'text-slate-400 dark:text-slate-500 line-through' : 'text-slate-800 dark:text-slate-200 font-medium'}`}
        />

        {/* Detailed Status Selector (Small) */}
        <div className="relative shrink-0">
          <select
            value={slot.status}
            onChange={(e) => handleStatusChange(e.target.value as VideoStatus)}
            className={`appearance-none pl-2 pr-6 py-1 rounded text-[10px] font-bold uppercase tracking-wider cursor-pointer border focus:outline-none ${STATUS_COLORS[slot.status]}`}
          >
            {statusOptions.map(s => (
              <option key={s} value={s}>{t.status[s]}</option>
            ))}
          </select>
          <ChevronDown size={10} className="absolute right-1 top-1/2 -translate-y-1/2 pointer-events-none opacity-50" />
        </div>

        {/* Delete */}
        <button 
          onClick={() => onDelete(slot.id)}
          className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-500 dark:text-slate-600 dark:hover:text-red-400 transition-opacity p-1"
        >
          <Trash2 size={14} />
        </button>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // RENDER: LONG VIDEO (Full Card Mode)
  // --------------------------------------------------------------------------
  return (
    <div className={`relative bg-white dark:bg-slate-800 rounded-xl shadow-sm border transition-all duration-200 ${slot.status === VideoStatus.PUBLISHED ? 'opacity-75 border-slate-200 dark:border-slate-700' : 'border-slate-200 dark:border-slate-700 hover:shadow-md'}`}>
      
      {/* Time Badge */}
      <div className="absolute -left-3 top-4 bg-slate-800 dark:bg-slate-950 text-white text-xs font-bold px-2 py-1 rounded-md shadow-sm z-10 flex items-center gap-1">
        <Clock size={12} />
        {slot.time}
      </div>

      <div className="p-5 pl-8">
        <div className="flex justify-between items-start gap-4">
          
          {/* Main Content Area */}
          <div className="flex-1 space-y-3">
            
            {/* Topic Input */}
            <div>
              <label className="text-xs uppercase tracking-wider text-slate-400 dark:text-slate-500 font-semibold mb-1 block">{t.topicLabel}</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={slot.topic}
                  onChange={(e) => onUpdate(slot.id, { topic: e.target.value })}
                  placeholder={t.topicPlaceholder}
                  className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-slate-800 dark:text-slate-200 placeholder:text-slate-400"
                />
                <button
                  onClick={() => onGenerateAI(slot.id, slot.topic)}
                  disabled={!slot.topic || slot.aiLoading}
                  className={`p-2 rounded-lg transition-colors flex items-center justify-center ${slot.aiLoading ? 'bg-indigo-100 text-indigo-400 dark:bg-indigo-900 dark:text-indigo-300' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm'}`}
                  title="Generate Title & Desc with AI"
                >
                  <Wand2 size={16} className={slot.aiLoading ? 'animate-spin' : ''} />
                </button>
              </div>
            </div>

            {/* Title Display (if present) */}
            {slot.title && (
              <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-3 border border-slate-100 dark:border-slate-700/50">
                <div className="flex items-start gap-2">
                  <Youtube size={16} className="text-red-500 mt-1 shrink-0" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-800 dark:text-slate-200 text-sm leading-tight">{slot.title}</h4>
                    {isExpanded && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">{slot.description}</p>
                    )}
                  </div>
                  <button onClick={() => setIsExpanded(!isExpanded)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                    <ChevronDown size={16} className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* Status & Actions Column */}
          <div className="flex flex-col items-end gap-3 shrink-0">
             <div className="relative">
                <select
                  value={slot.status}
                  onChange={(e) => handleStatusChange(e.target.value as VideoStatus)}
                  className={`appearance-none pl-3 pr-8 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide cursor-pointer border focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 ${STATUS_COLORS[slot.status]}`}
                >
                  {statusOptions.map(s => (
                    <option key={s} value={s}>{t.status[s]}</option>
                  ))}
                </select>
                <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
                  <ChevronDown size={12} strokeWidth={3} />
                </div>
             </div>

             <div className="flex gap-1">
                <button 
                  onClick={() => onDelete(slot.id)}
                  className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
                >
                  <Trash2 size={16} />
                </button>
             </div>
          </div>
        </div>
      </div>
      
      {/* Progress Bar (Visual Flair) */}
      <div className="h-1 w-full bg-slate-100 dark:bg-slate-700 rounded-b-xl overflow-hidden flex">
        <div 
          className={`h-full transition-all duration-500 ${
            slot.status === VideoStatus.READY || slot.status === VideoStatus.PUBLISHED ? 'bg-emerald-500' :
            slot.status === VideoStatus.EDITING ? 'bg-orange-400' :
            slot.status === VideoStatus.FILMING ? 'bg-purple-400' : 'bg-transparent'
          }`}
          style={{ width: '100%' }}
        />
      </div>
    </div>
  );
};