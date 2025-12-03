export enum VideoStatus {
  PLANNING = 'PLANNING',
  SCRIPTING = 'SCRIPTING',
  FILMING = 'FILMING',
  EDITING = 'EDITING',
  REVIEW = 'REVIEW',
  READY = 'READY',
  PUBLISHED = 'PUBLISHED'
}

export type VideoType = 'LONG' | 'SHORT';
export type Platform = 'YOUTUBE' | 'TIKTOK' | 'INSTAGRAM' | 'FACEBOOK';

export type Language = 'en' | 'pt' | 'es';

// Estrutura do Banco de Dados (Snake Case)
export interface DbProfile {
  id: string;
  user_id: string;
  name: string;
  platform: Platform;
  default_videos_per_day: number;
  default_start_time: string;
  default_end_time: string;
}

export interface DbSlot {
  id: string;
  profile_id: string;
  date: string; // YYYY-MM-DD
  time: string;
  type: VideoType;
  topic: string | null;
  title: string | null;
  description: string | null;
  status: VideoStatus;
}

// Extracted ChannelConfig for shared use
export interface ChannelConfig {
  videosPerDay: number;
  startTime: string;
  endTime: string;
  videoType: VideoType;
}

// Estrutura da Aplicação (Camel Case para uso no React)
export interface ChannelProfile {
  id: string;
  name: string;
  platform: Platform;
  config: ChannelConfig;
}

export interface VideoSlot {
  id: string;
  time: string; // HH:mm format
  type: VideoType;
  topic: string;
  title: string;
  description: string;
  status: VideoStatus;
  aiLoading: boolean;
  date: string;
}

export const STATUS_COLORS: Record<VideoStatus, string> = {
  [VideoStatus.PLANNING]: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
  [VideoStatus.SCRIPTING]: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800',
  [VideoStatus.FILMING]: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800',
  [VideoStatus.EDITING]: 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800',
  [VideoStatus.REVIEW]: 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800',
  [VideoStatus.READY]: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800',
  [VideoStatus.PUBLISHED]: 'bg-slate-800 text-white border-slate-800 dark:bg-slate-700 dark:border-slate-600',
};

export const PLATFORM_CONFIG: Record<Platform, { label: string, color: string, icon: string }> = {
  YOUTUBE: { label: 'YouTube', color: 'text-red-600', icon: 'youtube' },
  TIKTOK: { label: 'TikTok', color: 'text-black dark:text-white', icon: 'smartphone' },
  INSTAGRAM: { label: 'Instagram', color: 'text-pink-600', icon: 'instagram' },
  FACEBOOK: { label: 'Facebook', color: 'text-blue-600', icon: 'facebook' },
};