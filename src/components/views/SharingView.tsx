import React from 'react';
import { Share2, X } from 'lucide-react';
import { ShareLink, Track, Playlist, Client } from '../../types';

interface SharingViewProps {
  shareLinks: ShareLink[];
  tracks: Track[];
  playlists: Playlist[];
  clients: Client[];
}

export default function SharingView({
  shareLinks,
  tracks,
  playlists,
  clients
}: SharingViewProps) {
  return (
    <div id="sharing-view" className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tighter uppercase italic">Access Control</h1>
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Manage active portal links and distribution verification.</p>
        </div>
        <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-lg shadow-emerald-500/50" />
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 italic">Distribution Logic Online</span>
        </div>
      </div>

      <div className="bg-zinc-950 border border-zinc-900 rounded-[3rem] overflow-hidden shadow-2xl">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-zinc-900 bg-zinc-900/20">
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.25em] text-zinc-600">Distribution Link</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.25em] text-zinc-600">Recipient / Client</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.25em] text-zinc-600">Usage Metrics</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.25em] text-zinc-600">Expiration</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.25em] text-zinc-600">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-900/50">
            {shareLinks.map(link => {
              const track = tracks.find(t => t.id === link.track_id);
              const playlist = playlists.find(p => p.id === link.playlist_id);
              const assetName = track ? track.name : playlist ? playlist.name : 'Unknown Asset';
              const client = clients.find(c => c.id === link.client_id);
              
              return (
                <tr key={link.id} className="hover:bg-zinc-900/40 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <span className="text-sm font-black italic uppercase text-white truncate max-w-[200px]">{assetName}</span>
                      <span className="text-[9px] font-bold text-zinc-600 font-mono mt-1">ID: {link.token}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-zinc-900 flex items-center justify-center text-[10px] font-black text-orange-500 italic border border-zinc-800">
                        {(client?.name || link.recipient_email || '?')[0]}
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">{client?.name || link.recipient_email || 'Public Link'}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                       <TrendingUp className="w-3 h-3 text-emerald-500" />
                       <span className="text-sm font-black">{link.access_count}</span>
                       <span className="text-[8px] font-black uppercase tracking-widest text-zinc-600 ml-1">Accesses</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600 italic">
                      {link.expires_at ? new Date(link.expires_at).toLocaleDateString() : 'ELITE ACCESS'}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <button className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-500 hover:text-rose-500 transition-all hover:scale-110">
                      <X className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
            {shareLinks.length === 0 && (
              <tr>
                <td colSpan={5} className="py-40 text-center opacity-30">
                  <Share2 className="w-12 h-12 mx-auto mb-4 text-zinc-800" />
                  <p className="text-[10px] font-black uppercase tracking-[0.25em]">No active distribution links generated.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Internal icons needed for SharingView
const TrendingUp = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
);
