import React from 'react';
// Fix: Removed subDays from import as it is not consistently available in all environments/versions
import { format, addDays, isSameDay } from 'date-fns';
import { ptBR, es, enUS } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Calendar as CalIcon } from 'lucide-react';
import { Language } from '../types';

interface CalendarSelectorProps {
  selectedDate: Date;
  onSelect: (date: Date) => void;
  lang: Language;
}

export const CalendarSelector: React.FC<CalendarSelectorProps> = ({ selectedDate, onSelect, lang }) => {
  const locale = lang === 'pt' ? ptBR : lang === 'es' ? es : enUS;

  const dates = [];
  for (let i = -2; i <= 2; i++) {
    dates.push(addDays(selectedDate, i));
  }

  return (
    <div className="flex items-center justify-center gap-4 py-4 mb-6">
        <button 
            // Fix: Replaced subDays(selectedDate, 1) with addDays(selectedDate, -1) to achieve same result
            onClick={() => onSelect(addDays(selectedDate, -1))}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400"
        >
            <ChevronLeft size={24} />
        </button>

        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
            {dates.map((date, idx) => {
                const isSelected = isSameDay(date, selectedDate);
                const isToday = isSameDay(date, new Date());
                
                return (
                    <button
                        key={idx}
                        onClick={() => onSelect(date)}
                        className={`flex flex-col items-center justify-center w-14 h-16 rounded-xl border transition-all shrink-0
                            ${isSelected 
                                ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg scale-110 z-10' 
                                : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-indigo-300'
                            }
                        `}
                    >
                        <span className="text-[10px] font-bold uppercase">{format(date, 'EEE', { locale })}</span>
                        <span className={`text-lg font-bold ${isSelected ? 'text-white' : 'text-slate-800 dark:text-white'}`}>
                            {format(date, 'd')}
                        </span>
                        {isToday && !isSelected && <div className="w-1 h-1 bg-indigo-500 rounded-full mt-1"></div>}
                    </button>
                )
            })}
        </div>

        <button 
            onClick={() => onSelect(addDays(selectedDate, 1))}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400"
        >
            <ChevronRight size={24} />
        </button>

        <div className="hidden md:flex items-center ml-4 border-l border-slate-200 dark:border-slate-700 pl-4">
             <div className="flex flex-col">
                <span className="text-xs text-slate-400 uppercase font-bold">Selected</span>
                <span className="text-sm font-medium text-slate-800 dark:text-white flex items-center gap-2">
                    <CalIcon size={14} className="text-indigo-500" />
                    {format(selectedDate, 'MMMM yyyy', { locale })}
                </span>
             </div>
        </div>
    </div>
  );
};