import React from 'react';
import { VideoSlot, VideoStatus } from '../types';

export const StatsWidget: React.FC<{ slots: VideoSlot[], t: any }> = ({ slots, t }) => {
  const total = slots.length;
  if (total === 0) return null;

  const ready = slots.filter(s => s.status === VideoStatus.READY || s.status === VideoStatus.PUBLISHED).length;
  const editing = slots.filter(s => s.status === VideoStatus.EDITING).length;
  const scripting = slots.filter(s => s.status === VideoStatus.SCRIPTING || s.status === VideoStatus.FILMING).length;
  
  const percentage = Math.round((ready / total) * 100);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col">
            <span className="text-xs font-bold text-slate-400 uppercase">{t.statsCompletion}</span>
            <span className="text-2xl font-bold text-slate-800 dark:text-white">{percentage}%</span>
            <div className="w-full bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full mt-2 overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full transition-all duration-1000" style={{ width: `${percentage}%` }}></div>
            </div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <span className="text-xs font-bold text-slate-400 uppercase">{t.statsReady}</span>
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{ready} <span className="text-slate-300 dark:text-slate-600 text-sm font-normal">/ {total}</span></div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <span className="text-xs font-bold text-slate-400 uppercase">{t.statsEdit}</span>
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{editing}</div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <span className="text-xs font-bold text-slate-400 uppercase">{t.statsProd}</span>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{scripting}</div>
        </div>
    </div>
  );
}