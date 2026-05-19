import React, { useState } from 'react';
import { X, Search, Plus, Play, Check, Music } from 'lucide-react';
import { Track, Playlist } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { useMediaStore } from '../context/MediaStoreContext';
import { useAudio } from '../context/AudioContext';
import { cn } from '../lib/utils';

interface AddTrackToPlaylistModalProps {
  playlist: Playlist;
  onClose: () => void;
}

export default function AddTrackToPlaylistModal({ playlist, onClose }: AddTrackToPlaylistModalProps) {
  const { tracks, addTrackToPlaylist } = useMediaStore();
  const { playTrack, activeTrack, isPlaying } = useAudio();
  const [searchQuery, setSearchQuery] = useState('');

  // Filter out tracks already in the playlist
  const availableTracks = tracks.filter(t => 
    !playlist.track_ids.includes(t.id) &&
    (t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
     t.artist.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleAdd = async (trackId: string) => {
    await addTrackToPlaylist(trackId, playlist.id);
    // Modal stays open for bulk adding usually, but user choice. 
    // Let's keep it open for convenience.
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-md" 
      />
      
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="relative w-full max-w-2xl bg-zinc-950 border border-zinc-900 rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
      >
        <div className="p-8 border-b border-zinc-900">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-black tracking-tight uppercase italic">Add to {playlist.name}</h2>
              <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mt-1">Select masters from your library to associate with this collection.</p>
            </div>
            <button 
              onClick={onClose}
              className="w-10 h-10 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 hover:text-white transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-orange-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Search library..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black border border-zinc-900 rounded-2xl py-3 pl-12 pr-4 text-sm font-bold outline-none focus:border-orange-500 transition-all"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-hide">
          {availableTracks.length > 0 ? availableTracks.map(track => (
            <div 
              key={track.id} 
              className="p-4 bg-zinc-900/30 border border-zinc-900 rounded-2xl flex items-center justify-between hover:bg-zinc-900/50 hover:border-zinc-800 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-zinc-800 relative">
                   <img src={track.image_url!} className="w-full h-full object-cover" />
                   <button 
                    onClick={() => playTrack(track, availableTracks)}
                    className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                   >
                     <Play className={cn("w-5 h-5 fill-white", activeTrack?.id === track.id && isPlaying ? "text-orange-500 fill-orange-500" : "text-white")} />
                   </button>
                </div>
                <div>
                   <h4 className="text-sm font-black text-white">{track.name}</h4>
                   <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{track.artist}</p>
                </div>
              </div>
              
              <button 
                onClick={() => handleAdd(track.id)}
                className="w-10 h-10 rounded-xl bg-orange-500 text-black flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-lg shadow-orange-500/20"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          )) : (
            <div className="py-12 flex flex-col items-center justify-center text-center">
               <Music className="w-10 h-10 text-zinc-800 mb-4" />
               <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">No matching masters available.</p>
            </div>
          )}
        </div>

        <div className="p-6 bg-zinc-900/50 border-t border-zinc-900 flex justify-end">
           <button 
             onClick={onClose}
             className="px-8 py-3 bg-white text-black rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-transform"
           >
             Finished
           </button>
        </div>
      </motion.div>
    </div>
  );
}
