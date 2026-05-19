import React from 'react';
import { motion } from 'motion/react';
import { Video as VideoIcon, Play } from 'lucide-react';
import { Track, Playlist } from '../../types';

interface VideosViewProps {
  promoVideos: any[];
  tracks: Track[];
  playlists: Playlist[];
  setSelectedVideoForPreview: (v: any) => void;
}

export default function VideosView({
  promoVideos,
  tracks,
  playlists,
  setSelectedVideoForPreview
}: VideosViewProps) {
  return (
    <div id="videos-view" className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight uppercase">Promo Archive</h1>
          <p className="text-zinc-500 text-sm font-medium">All AI-generated social assets and motion graphics.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {promoVideos.length > 0 ? (
          promoVideos.map((video) => {
            const track = tracks.find(t => t.id === video.track_id);
            const playlist = playlists.find(p => p.id === video.playlist_id);
            const sourceName = track?.name || playlist?.name || 'Unknown Asset';
            
            return (
              <motion.div 
                key={video.id}
                layoutId={video.id}
                onClick={() => setSelectedVideoForPreview(video)}
                className="group relative bg-zinc-950 border border-zinc-900 rounded-[2.5rem] overflow-hidden cursor-pointer hover:border-orange-500/50 transition-all shadow-xl"
              >
                <div className="aspect-square relative overflow-hidden">
                  <img 
                    src={video.thumbnail_url} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-70"
                    alt={sourceName}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                  
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                     <div className="w-12 h-12 bg-white/20 backdrop-blur-xl border border-white/30 rounded-full flex items-center justify-center text-white scale-90 group-hover:scale-100 transition-transform">
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                     </div>
                  </div>

                  <div className="absolute top-4 left-4">
                    <div className="px-3 py-1 bg-black/50 backdrop-blur-md border border-white/10 rounded-full text-[8px] font-black uppercase tracking-widest text-orange-500">
                      {video.style}
                    </div>
                  </div>
                </div>

                <div className="p-6">
                   <h3 className="text-lg font-black italic uppercase tracking-tighter truncate">{sourceName}</h3>
                   <div className="flex justify-between items-center mt-2">
                       <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">
                         {new Date(video.created_at).toLocaleDateString()}
                       </span>
                       <div className="flex items-center gap-1">
                         <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                         <span className="text-[8px] font-black uppercase tracking-widest text-emerald-500">READY</span>
                       </div>
                   </div>
                </div>
              </motion.div>
            );
          })
        ) : (
          <div className="col-span-full py-32 bg-zinc-950/50 border border-zinc-900 rounded-[3.5rem] flex flex-col items-center justify-center text-center space-y-6">
             <div className="w-20 h-20 rounded-[2rem] bg-zinc-900 flex items-center justify-center text-zinc-700">
                <VideoIcon className="w-10 h-10" />
             </div>
             <div className="space-y-2">
                <h3 className="text-xl font-black uppercase tracking-tighter">Archive is empty</h3>
                <p className="text-zinc-500 text-xs font-black uppercase tracking-widest">Generate motion assets from the Tracks or Playlists menu.</p>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
