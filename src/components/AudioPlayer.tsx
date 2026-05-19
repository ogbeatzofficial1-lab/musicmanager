import React from 'react';
import { 
  Play, Pause, SkipBack, SkipForward, 
  Volume2, VolumeX, Maximize2, Heart, Share2, Download
} from 'lucide-react';
import { useAudio } from '../context/AudioContext';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

import { Track } from '../types';

interface AudioPlayerProps {
  onEdit?: (track: Track) => void;
}

export default function AudioPlayer({ onEdit }: AudioPlayerProps) {
  const { 
    activeTrack, isPlaying, progress, duration, 
    togglePlay, seek, volume, setVolume, isMuted, toggleMute, playNext, playPrevious 
  } = useAudio();

  if (!activeTrack) return null;

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPct = duration > 0 ? (progress / duration) * 100 : 0;

  return (
    <motion.div 
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-2xl border-t border-zinc-900 px-6 py-4 select-none"
    >
      <div className="max-w-[1920px] mx-auto flex items-center justify-between gap-8">
        
        {/* Track Info */}
        <div className="flex items-center gap-4 w-1/4 min-w-0">
          <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-zinc-900 shadow-2xl">
            <img 
              src={activeTrack.image_url || 'https://via.placeholder.com/150'} 
              className={cn("w-full h-full object-cover", isPlaying && "animate-[pulse_10s_infinite]")}
              alt={activeTrack.name}
            />
          </div>
          <div className="min-w-0 flex flex-col">
            <h4 className="text-sm font-black text-white truncate leading-tight uppercase tracking-tight">{activeTrack.name}</h4>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{activeTrack.artist}</span>
              <span className="text-zinc-700">•</span>
              <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">{activeTrack.bpm} BPM</span>
            </div>
          </div>
          <button className="text-zinc-600 hover:text-orange-500 ml-2 transition-colors">
            <Heart className="w-4 h-4" />
          </button>

          <button 
            onClick={() => onEdit?.(activeTrack)}
            className="ml-4 px-4 py-2 border border-zinc-800 rounded-xl text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:bg-zinc-900 hover:text-white transition-all whitespace-nowrap hidden lg:block"
          >
            EDIT TRACK INFO
          </button>
        </div>

        {/* Controls & Progress */}
        <div className="flex-1 flex flex-col items-center gap-2 max-w-2xl px-4">
          <div className="flex items-center gap-8">
            <button 
              onClick={playPrevious}
              className="text-zinc-500 hover:text-white transition-all hover:scale-110 active:scale-90"
            >
              <SkipBack className="w-5 h-5 fill-current" />
            </button>
            <button 
              onClick={togglePlay}
              className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-all active:scale-95 shadow-xl shadow-white/5"
            >
              {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-1" />}
            </button>
            <button 
              onClick={playNext}
              className="text-zinc-500 hover:text-white transition-all hover:scale-110 active:scale-90"
            >
              <SkipForward className="w-5 h-5 fill-current" />
            </button>
          </div>
          
          <div className="w-full flex items-center gap-4">
            <span className="text-[10px] font-black text-zinc-600 w-10 text-right tabular-nums">{formatTime(progress)}</span>
            <div className="flex-1 h-1.5 bg-zinc-900 rounded-full cursor-pointer relative group"
                 onClick={(e) => {
                   const rect = e.currentTarget.getBoundingClientRect();
                   const x = e.clientX - rect.left;
                   const pct = x / rect.width;
                   seek(pct * duration);
                 }}>
              <div 
                className="absolute top-0 left-0 h-full bg-white rounded-full group-hover:bg-orange-500 transition-all duration-300"
                style={{ width: `${progressPct}%` }}
              />
              <div 
                className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity border-2 border-orange-500"
                style={{ left: `${progressPct}%` }}
              />
            </div>
            <span className="text-[10px] font-black text-zinc-600 w-10 tabular-nums">{formatTime(duration)}</span>
          </div>
        </div>

        {/* Volume & Extras */}
        <div className="w-1/4 hidden md:flex items-center justify-end gap-6 text-zinc-500">
          <div className="flex items-center gap-3">
            <button className="hover:text-white transition-colors">
              <Share2 className="w-4 h-4" />
            </button>
            <button className="hover:text-white transition-colors">
              <Download className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center gap-3 w-40 group">
            <button onClick={toggleMute} className="hover:text-white transition-colors shrink-0">
              {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <div className="flex-1 h-1 bg-zinc-900 rounded-full cursor-pointer relative group"
                 onClick={(e) => {
                   const rect = e.currentTarget.getBoundingClientRect();
                   const x = e.clientX - rect.left;
                   const pct = Math.max(0, Math.min(1, x / rect.width));
                   setVolume(pct);
                 }}>
               <div 
                 className="absolute top-0 left-0 h-full bg-orange-500 rounded-full"
                 style={{ width: `${(isMuted ? 0 : volume) * 100}%` }}
               />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
