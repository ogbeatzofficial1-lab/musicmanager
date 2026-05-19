import React from 'react';
import { motion } from 'motion/react';
import { Plus, Music, Video, Share2, Settings } from 'lucide-react';
import { Playlist, Track } from '../../types';
import TrackOptionsMenu from '../TrackOptionsMenu';
import EditPlaylistModal from '../EditPlaylistModal';
import { cn } from '../../lib/utils';
import { useAudio } from '../../context/AudioContext';

interface PlaylistsViewProps {
  playlists: Playlist[];
  selectedPlaylistId: string | null;
  setSelectedPlaylistId: (id: string | null) => void;
  tracks: Track[];
  addPlaylist: (data: any) => Promise<void>;
  updatePlaylist: (id: string, data: any) => Promise<void>;
  deletePlaylist: (id: string) => Promise<void>;
  addTrackToPlaylist: (tId: string, pId: string) => Promise<void>;
  removeTrackFromPlaylist: (tId: string, pId: string) => Promise<void>;
  setEditingTrack: (t: Track) => void;
  handleShare: (t: Track) => void;
  handleDownload: (t: Track) => void;
  handleDeleteTrack: (id: string) => void;
  setSelectedTrackForPromo: (t: Track) => void;
  setSelectedTrackForVideo: (t: Track) => void;
  setSelectedPlaylistForVideo: (p: Playlist | null) => void;
  handleSharePlaylist: (p: Playlist) => void;
  showCreatePlaylist: boolean;
  setShowCreatePlaylist: (s: boolean) => void;
  showAddTracksToPlaylist: boolean;
  setShowAddTracksToPlaylist: (s: boolean) => void;
  editingPlaylist: Playlist | null;
  setEditingPlaylist: (p: Playlist | null) => void;
}

export default function PlaylistsView({
  playlists,
  selectedPlaylistId,
  setSelectedPlaylistId,
  tracks,
  addPlaylist,
  updatePlaylist,
  deletePlaylist,
  addTrackToPlaylist,
  removeTrackFromPlaylist,
  setEditingTrack,
  handleShare,
  handleDownload,
  handleDeleteTrack,
  setSelectedTrackForPromo,
  setSelectedTrackForVideo,
  setSelectedPlaylistForVideo,
  handleSharePlaylist,
  showCreatePlaylist,
  setShowCreatePlaylist,
  showAddTracksToPlaylist,
  setShowAddTracksToPlaylist,
  editingPlaylist,
  setEditingPlaylist
}: PlaylistsViewProps) {
  const { playTrack, stop, activeTrack } = useAudio();
  const selectedPlaylist = playlists.find(p => p.id === selectedPlaylistId) || null;

  const handleRemoveTrack = async (trackId: string, playlistId: string) => {
    if (confirm("Remove this track from the collection? (Source file will remain in library)")) {
      if (activeTrack?.id === trackId) {
        stop();
      }
      await removeTrackFromPlaylist(trackId, playlistId);
    }
  };

  return (
    <div id="playlists-view" className="p-8 space-y-8">
      <div className="flex items-center justify-between">
         <div className="flex items-center gap-6">
            {selectedPlaylist && (
              <button 
                onClick={() => setSelectedPlaylistId(null)}
                className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white transition-all shrink-0"
              >
                <Plus className="w-5 h-5 rotate-45" />
              </button>
            )}
            {selectedPlaylist?.image_url && (
              <div className="w-20 h-20 rounded-3xl overflow-hidden border border-zinc-800 shrink-0 shadow-2xl">
                <img src={selectedPlaylist.image_url} className="w-full h-full object-cover" />
              </div>
            )}
            <div>
              <h1 className="text-3xl font-black tracking-tighter uppercase">
                {selectedPlaylist ? selectedPlaylist.name : 'Collections Engine'}
              </h1>
              <p className="text-zinc-500 text-sm mt-1">
                {selectedPlaylist ? (selectedPlaylist.description || 'Master collection view.') : 'Organize your repertoire with persistent dynamic themes.'}
              </p>
            </div>
         </div>
        <div className="flex items-center gap-3">
          {selectedPlaylist && (
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setSelectedPlaylistForVideo(selectedPlaylist)}
                className="px-6 py-3 border border-zinc-900 rounded-full text-xs font-black uppercase tracking-widest hover:border-zinc-700 transition-all text-zinc-400 hover:text-white flex items-center gap-2"
              >
                <Video className="w-4 h-4 text-orange-500" /> Promo Clip
              </button>
              <button 
                onClick={() => handleSharePlaylist(selectedPlaylist)}
                className="px-6 py-3 border border-zinc-900 rounded-full text-xs font-black uppercase tracking-widest hover:border-zinc-700 transition-all text-zinc-400 hover:text-white flex items-center gap-2"
              >
                <Share2 className="w-4 h-4" /> Share Collection
              </button>
            </div>
          )}
          {!selectedPlaylist && (
            <button 
              onClick={() => setShowCreatePlaylist(true)}
              className="bg-white text-black px-6 py-3 rounded-full font-black tracking-widest uppercase text-xs flex items-center gap-2 hover:scale-105 transition-transform"
            >
              <Plus className="w-4 h-4" /> Create Collection
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {selectedPlaylist ? (
          <div className="col-span-full space-y-4">
            <div className="flex justify-between items-center bg-zinc-950 border border-zinc-900 rounded-3xl p-6 mb-8">
               <div className="flex gap-4 items-center">
                  <div className="w-12 h-12 rounded-xl bg-zinc-900 flex items-center justify-center text-zinc-600">
                    <Music className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black uppercase tracking-tight">Compilation Logic</h3>
                    <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">{selectedPlaylist.track_ids.length} Linked Assets</p>
                  </div>
               </div>
               <button 
                 onClick={() => setShowAddTracksToPlaylist(true)}
                 className="px-6 py-3 bg-orange-500 text-black rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-transform shadow-lg shadow-orange-500/20"
               >
                 Assemble Assets
               </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {tracks.filter(t => selectedPlaylist.track_ids.includes(t.id)).length > 0 ? (
                tracks.filter(t => selectedPlaylist.track_ids.includes(t.id)).map(track => (
                  <div 
                    key={track.id} 
                    className="group relative h-80 rounded-[2.5rem] overflow-hidden border border-zinc-800 transition-all hover:border-zinc-700 hover:shadow-2xl hover:shadow-orange-500/5 bg-zinc-950"
                  >
                    <div className="absolute inset-0">
                        <img 
                          src={track.image_url!} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                    </div>
                    
                    <div className="absolute top-6 right-6 flex items-center gap-2">
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
                         className="bg-black/40 backdrop-blur-md rounded-full border border-white/10"
                       />
                       <button 
                         onClick={(e) => {
                           e.stopPropagation();
                           handleRemoveTrack(track.id, selectedPlaylist.id);
                         }}
                         title="Remove from Playlist"
                         className="w-10 h-10 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-rose-500 hover:bg-rose-500 hover:text-white transition-all"
                       >
                         <X className="w-5 h-5" />
                       </button>
                    </div>

                    <div className="absolute inset-0 flex flex-col justify-end p-8">
                        <h3 className="text-xl font-black text-white uppercase tracking-tight truncate leading-none">{track.name}</h3>
                        <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mt-2">{track.artist}</p>
                        
                        <div className="flex items-center gap-3 mt-6">
                          <button 
                            onClick={() => playTrack(track, tracks.filter(t => selectedPlaylist.track_ids.includes(t.id)))}
                            className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-xl"
                          >
                            <Play className="w-5 h-5 fill-black ml-1" />
                          </button>
                          <div className="flex flex-col">
                            <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">{track.bpm} BPM • {track.key_signature}</span>
                            <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">{((track.plays || 0) / 1000).toFixed(1)}k Plays</span>
                          </div>
                        </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-32 bg-zinc-950 border border-dashed border-zinc-900 rounded-[3rem] flex flex-col items-center justify-center text-center">
                  <Music className="w-12 h-12 mb-4 opacity-20" />
                  <h3 className="text-xl font-bold uppercase italic tracking-tight">Empty Collection</h3>
                  <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest max-w-xs mx-auto mt-2 leading-relaxed">
                    This reference set currently lacks mapped audio assets.
                  </p>
                  <button 
                    onClick={() => setShowAddTracksToPlaylist(true)}
                    className="mt-8 px-8 py-3 bg-white text-black rounded-full text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-transform"
                  >
                    Linked Masters
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
           playlists.map(pl => (
             <div 
               key={pl.id} 
               className="group relative h-80 rounded-[3rem] overflow-hidden border border-zinc-900 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer shadow-2xl hover:shadow-black/80"
               onClick={() => setSelectedPlaylistId(pl.id)}
             >
               <div className="absolute inset-0">
                  {pl.image_url ? (
                    <>
                      <img src={pl.image_url} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-1000" />
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all" />
                    </>
                  ) : (
                    <div 
                      className="w-full h-full opacity-80 group-hover:opacity-100 transition-opacity"
                      style={{ background: `linear-gradient(135deg, ${pl.start_color}, ${pl.end_color})` }}
                    />
                  )}
               </div>
              <div className="absolute top-8 right-8 flex gap-2">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSharePlaylist(pl);
                  }}
                  className="p-3 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 text-white/60 hover:text-white transition-all opacity-0 group-hover:opacity-100 active:scale-95"
                >
                  <Share2 className="w-5 h-5" />
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingPlaylist(pl);
                  }}
                  className="p-3 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 text-white/60 hover:text-white transition-all opacity-0 group-hover:opacity-100 active:scale-95"
                >
                  <Settings className="w-5 h-5" />
                </button>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-10 space-y-3">
                 <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse shadow-lg shadow-orange-500/50" />
                    <span className="text-[10px] font-black uppercase tracking-[0.25em] text-white/60">{pl.track_ids.length} Tracks Inscribed</span>
                 </div>
                 <h3 className="text-4xl font-black tracking-tighter text-white leading-none uppercase italic">{pl.name}</h3>
                 <p className="text-white/60 text-[10px] font-black uppercase tracking-widest line-clamp-1 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
                    {pl.description || 'Reference vault collection'}
                 </p>
              </div>
            </div>
          ))
        )}
        
        {!selectedPlaylist && (
          <button 
            onClick={() => setShowCreatePlaylist(true)}
            className="h-80 rounded-[2.5rem] border-2 border-dashed border-zinc-800 bg-zinc-950/50 flex flex-col items-center justify-center p-8 text-center group hover:border-zinc-700 transition-all"
          >
             <div className="w-16 h-16 rounded-3xl bg-zinc-900 flex items-center justify-center text-zinc-500 group-hover:bg-zinc-800 group-hover:text-white transition-all mb-4">
               <Plus className="w-8 h-8" />
             </div>
             <p className="text-zinc-500 font-bold uppercase tracking-tight text-sm">Add Reference Set</p>
          </button>
        )}
      </div>

      {showCreatePlaylist && (
         <EditPlaylistModal 
           playlist={{}} 
           isNew={true}
           onClose={() => setShowCreatePlaylist(false)}
           onSave={(data) => addPlaylist(data)}
         />
      )}
    </div>
  );
}

// Internal icons needed for PlaylistsView
const Play = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
);

const X = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
);
