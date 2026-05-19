import React, { useState } from 'react';
import { Track, Playlist, Client, ShareLink } from '../types';
import { Music, Clock, Play, Download, Package, ChevronLeft, Disc } from 'lucide-react';
import { useMediaStore } from '../context/MediaStoreContext';
import SharePortal from './SharePortal';

interface ClientPortalProps {
  client: Client;
}

export default function ClientPortal({ client }: ClientPortalProps) {
  const { tracks, playlists, shareLinks } = useMediaStore();
  const [activeLink, setActiveLink] = useState<ShareLink | null>(null);

  const clientLinks = shareLinks.filter(l => l.client_id === client.id);

  if (activeLink) {
    return (
      <div className="bg-black text-white relative">
        <button 
          onClick={() => setActiveLink(null)}
          className="absolute top-4 left-4 z-50 p-2 bg-zinc-900 rounded-full hover:bg-white hover:text-black transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <SharePortal 
          track={tracks.find(t => t.id === activeLink.track_id)}
          playlist={playlists.find(p => p.id === activeLink.playlist_id)}
          shareLink={activeLink} 
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="flex items-center gap-6 mt-12 pb-12 border-b border-zinc-900">
          <div className="w-24 h-24 rounded-3xl overflow-hidden shrink-0 border border-zinc-800">
             {client.avatar_url ? (
               <img src={client.avatar_url} className="w-full h-full object-cover" />
             ) : (
               <div className="w-full h-full bg-zinc-900 flex items-center justify-center text-3xl font-black text-zinc-700">
                 {client.name.substring(0, 2).toUpperCase()}
               </div>
             )}
          </div>
          <div>
            <h1 className="text-5xl font-black uppercase tracking-tighter italic">{client.name}</h1>
            <p className="text-orange-500 font-bold uppercase tracking-[0.3em] text-xs mt-2">Personal Client Portal • OG Beatz</p>
          </div>
        </div>

        <div>
          <h2 className="text-sm font-black uppercase tracking-widest text-zinc-500 mb-6">Deliverables</h2>
          <div className="grid gap-4">
            {clientLinks.length === 0 ? (
               <div className="text-center p-12 border border-dashed border-zinc-900 rounded-3xl text-zinc-600 font-bold uppercase tracking-widest text-xs">
                 No Deliverables Found
               </div>
            ) : clientLinks.map(link => {
              const track = tracks.find(t => t.id === link.track_id);
              const playlist = playlists.find(p => p.id === link.playlist_id);
              const isTrack = !!track;
              const item = isTrack ? track : playlist;

              if (!item) return null;

              return (
                <div 
                  key={link.id} 
                  onClick={() => setActiveLink(link)}
                  className="flex items-center gap-6 p-4 border border-zinc-900 rounded-2xl hover:border-orange-500/50 hover:bg-orange-500/5 cursor-pointer transition-all group"
                >
                  <div className="w-16 h-16 bg-zinc-950 rounded-xl overflow-hidden shrink-0 relative border border-zinc-800 group-hover:border-orange-500/50 transition-colors">
                     {item.image_url ? (
                       <img src={item.image_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                     ) : (
                       <div className="w-full h-full flex items-center justify-center bg-zinc-900">
                          {isTrack ? <Disc className="text-zinc-700 w-6 h-6" /> : <Package className="text-zinc-700 w-6 h-6" />}
                       </div>
                     )}
                     <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity backdrop-blur-[2px]">
                       <Play className="fill-white text-white w-6 h-6" />
                     </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg truncate group-hover:text-orange-500 transition-colors">{item.name}</h3>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1 truncate">
                      {isTrack ? (track as Track).artist : 'Playlist'}
                    </p>
                  </div>
                  <div className="text-right hidden sm:block">
                    <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">
                      {new Date(link.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
