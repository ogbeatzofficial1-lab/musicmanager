import React from 'react';
import { motion } from 'motion/react';
import { Search, Plus, LayoutDashboard, Filter, Database, Zap, Play, Share2 } from 'lucide-react';
import { Track, Playlist } from '../../types';
import UploadZone from '../UploadZone';
import TrackOptionsMenu from '../TrackOptionsMenu';
import { cn } from '../../lib/utils';
import { useAudio } from '../../context/AudioContext';

interface TracksViewProps {
  tracks: Track[];
  filteredTracks: Track[];
  playlists: Playlist[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  trackLayout: 'grid' | 'list';
  setTrackLayout: (l: 'grid' | 'list') => void;
  showUpload: boolean;
  setShowUpload: (s: boolean) => void;
  isSupabaseConfigured: boolean;
  setShowDbGuide: (s: boolean) => void;
  showDbGuide: boolean;
  DatabaseGuide: React.ComponentType;
  setEditingTrack: (t: Track) => void;
  handleShare: (t: Track) => void;
  handleDownload: (t: Track) => void;
  handleDeleteTrack: (id: string) => void;
  setSelectedTrackForPromo: (t: Track) => void;
  setSelectedTrackForVideo: (t: Track) => void;
  addTrackToPlaylist: (tId: string, pId: string) => void;
  activeTrack: Track | null;
}

export default function TracksView({
  tracks,
  filteredTracks,
  playlists,
  searchQuery,
  setSearchQuery,
  trackLayout,
  setTrackLayout,
  showUpload,
  setShowUpload,
  isSupabaseConfigured,
  setShowDbGuide,
  showDbGuide,
  DatabaseGuide,
  setEditingTrack,
  handleShare,
  handleDownload,
  handleDeleteTrack,
  setSelectedTrackForPromo,
  setSelectedTrackForVideo,
  addTrackToPlaylist,
  activeTrack
}: TracksViewProps) {
  const { playTrack } = useAudio();

  return (
    <div id="tracks-view" className="p-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tighter uppercase italic bg-gradient-to-r from-white to-zinc-500 bg-clip-text text-transparent">Master Repository</h1>
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em] mt-1">High-fidelity asset distribution and metadata control.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-zinc-900/50 p-1 rounded-xl border border-white/5">
            <button 
              onClick={() => setTrackLayout('grid')}
              className={cn(
                "p-2 rounded-lg transition-all",
                trackLayout === 'grid' ? "bg-white text-black shadow-lg" : "text-zinc-500 hover:text-white"
              )}
            >
              <LayoutDashboard className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setTrackLayout('list')}
              className={cn(
                "p-2 rounded-lg transition-all",
                trackLayout === 'list' ? "bg-white text-black shadow-lg" : "text-emerald-500 hover:text-emerald-400"
              )}
            >
              <Filter className="w-4 h-4" />
            </button>
          </div>
          <button 
            onClick={() => setShowUpload(true)}
            className="bg-orange-500 text-black px-6 py-3 rounded-xl font-black tracking-widest uppercase text-[10px] flex items-center gap-2 hover:bg-orange-400 transition-all shadow-[0_0_40px_rgba(249,115,22,0.2)]"
          >
            <Plus className="w-4 h-4" /> Register Master
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 group w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-orange-500 transition-colors" />
          <input 
            type="text" 
            placeholder="SEARCH CATALOG BY NAME, ARTIST, OR ATTRIBUTE..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-900 rounded-2xl py-4 pl-12 pr-4 text-[10px] font-black tracking-[0.2em] outline-none focus:border-orange-500/30 transition-all placeholder:opacity-30"
          />
        </div>
      </div>

      {showUpload && (
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <UploadZone onSuccess={() => setShowUpload(false)} />
        </motion.div>
      )}

      {showDbGuide && <DatabaseGuide />}

      {!isSupabaseConfigured && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 p-6 bg-orange-500/5 border border-orange-500/10 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative group"
        >
           <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl -mr-32 -mt-32 group-hover:bg-orange-500/10 transition-colors" />
           <div className="flex items-center gap-5 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center border border-orange-500/20 shadow-lg shadow-orange-500/5">
                 <Database className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                 <p className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-500 flex items-center gap-2">
                    Infrastructure Protocol <span className="w-1 h-1 rounded-full bg-orange-500 animate-pulse" />
                 </p>
                 <p className="text-sm font-black uppercase tracking-tight text-white italic mt-0.5">Real-time repository sync is inactive. Assets are stored locally.</p>
              </div>
           </div>
           <button 
             onClick={() => setShowDbGuide(true)}
             className="px-8 py-3.5 bg-orange-500 text-black text-[10px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-orange-400 transition-all shadow-[0_0_40px_rgba(249,115,22,0.2)] relative z-10"
           >
              Establish Connection
           </button>
        </motion.div>
      )}

      {trackLayout === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTracks.map(track => (
            <motion.div 
              layout
              key={track.id} 
              className="group relative bg-zinc-950 border border-zinc-900 rounded-[2.5rem] overflow-hidden hover:border-zinc-700 transition-all duration-500 shadow-2xl"
            >
               <div className="aspect-square relative overflow-hidden">
                  <img src={track.image_url!} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 opacity-80" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                  
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                    <button 
                      onClick={() => playTrack(track, filteredTracks)}
                      className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-black shadow-2xl hover:scale-110 transition-transform"
                    >
                      {activeTrack?.id === track.id ? <Zap className="w-8 h-8 fill-current text-orange-500" /> : <Play className="w-8 h-8 fill-current ml-1" />}
                    </button>
                  </div>

                  <div className="absolute top-4 right-4">
                     <TrackOptionsMenu 
                      track={track}
                      onEdit={() => setEditingTrack(track)}
                      onShare={() => handleShare(track)}
                      onDownload={() => handleDownload(track)}
                      onDelete={() => handleDeleteTrack(track.id)}
                      onCreatePromo={() => setSelectedTrackForPromo(track)}
                      onCreateVideo={() => setSelectedTrackForVideo(track)}
                      onAddToPlaylist={(plId) => addTrackToPlaylist(track.id, plId)}
                      playlists={playlists}
                      className="bg-black/60 backdrop-blur-xl rounded-full border border-white/5"
                     />
                  </div>
               </div>

               <div className="p-6 space-y-4">
                  <div>
                     <h3 className="text-lg font-black tracking-tighter uppercase italic line-clamp-1">{track.name}</h3>
                     <p className="text-zinc-500 text-[9px] font-black uppercase tracking-widest">{track.artist}</p>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    <span className="px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-[8px] font-black uppercase tracking-widest text-orange-500">
                      {track.bpm} BPM
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-[8px] font-black uppercase tracking-widest text-zinc-400">
                      {track.key_signature}
                    </span>
                  </div>
               </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="bg-zinc-950 border border-zinc-900 rounded-[2.5rem] overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-900">
                  <th className="py-6 px-8 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 w-16 text-center">#</th>
                  <th className="py-6 px-4 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Asset</th>
                  <th className="py-6 px-4 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Tempo/Key</th>
                  <th className="py-6 px-4 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Plays</th>
                  <th className="py-6 px-4 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Status</th>
                  <th className="py-6 px-8 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900/50">
                {filteredTracks.map((track, idx) => (
                  <motion.tr 
                    layout
                    key={track.id}
                    className="group hover:bg-zinc-900/30 transition-colors"
                  >
                    <td className="py-6 px-8 text-[10px] font-black text-zinc-800 group-hover:text-zinc-600 text-center">{(idx+1).toString().padStart(2, '0')}</td>
                     <td className="py-6 px-4">
                       <div className="flex items-center gap-4">
                          <button 
                            onClick={() => playTrack(track, filteredTracks)}
                            className="relative w-12 h-12 rounded-xl overflow-hidden group/thumb"
                          >
                            <img src={track.image_url!} className="w-full h-full object-cover transition-transform group-hover/thumb:scale-110" />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-opacity">
                               <Play className="w-4 h-4 fill-white" />
                            </div>
                          </button>
                          <div>
                            <p className="text-sm font-black uppercase italic tracking-tight">{track.name}</p>
                            <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">{track.artist}</p>
                          </div>
                       </div>
                    </td>
                    <td className="py-6 px-4">
                       <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">{track.bpm} BPM • {track.key_signature}</span>
                    </td>
                     <td className="py-6 px-4">
                       <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">{track.plays.toLocaleString()}</span>
                    </td>
                    <td className="py-6 px-4">
                       <span className={cn(
                         "px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest",
                         track.status === 'ready' ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" : "bg-orange-500/10 text-orange-500 border border-orange-500/20"
                       )}>
                         {track.status}
                       </span>
                    </td>
                    <td className="py-6 px-8 text-right">
                       <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                          <button 
                             onClick={() => handleShare(track)}
                             className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-500 hover:text-white transition-all"
                          >
                             <Share2 className="w-4 h-4" />
                          </button>
                           <TrackOptionsMenu 
                            track={track}
                            onEdit={() => setEditingTrack(track)}
                            onShare={() => handleShare(track)}
                            onDownload={() => handleDownload(track)}
                            onDelete={() => handleDeleteTrack(track.id)}
                            onCreatePromo={() => setSelectedTrackForPromo(track)}
                            onCreateVideo={() => setSelectedTrackForVideo(track)}
                            onAddToPlaylist={(plId) => addTrackToPlaylist(track.id, plId)}
                            playlists={playlists}
                            className="bg-zinc-900 border border-white/5 rounded-lg"
                           />
                       </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
