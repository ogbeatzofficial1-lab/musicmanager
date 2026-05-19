import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  Play, Pause, Download, ThumbsUp, ThumbsDown, 
  MessageSquare, Send, Music, Clock, Lock, ChevronRight
} from 'lucide-react';
import { Track, ShareLink, Playlist } from '../types';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { useMediaStore } from '../context/MediaStoreContext';

interface SharePortalProps {
  track?: Track;
  playlist?: Playlist;
  shareLink: ShareLink;
}

export default function SharePortal({ track: initialTrack, playlist, shareLink }: SharePortalProps) {
  const { tracks: allTracks, addActivity } = useMediaStore();
  const [activeTrack, setActiveTrack] = useState<Track | null>(initialTrack || null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [rating, setRating] = useState<'up' | 'down' | null>(null);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<any[]>([]);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playlistTracks = useMemo(() => {
    if (!playlist) return [];
    return allTracks.filter(t => playlist.track_ids.includes(t.id));
  }, [playlist, allTracks]);

  useEffect(() => {
    if (playlistTracks.length > 0 && !activeTrack) {
        setActiveTrack(playlistTracks[0]);
    }
  }, [playlistTracks, activeTrack]);

  useEffect(() => {
    if (activeTrack?.file_url) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      audioRef.current = new Audio(activeTrack.file_url);
      audioRef.current.addEventListener('timeupdate', () => {
        setProgress(audioRef.current?.currentTime || 0);
      });
      audioRef.current.addEventListener('loadedmetadata', () => {
        setDuration(audioRef.current?.duration || 0);
      });
      audioRef.current.addEventListener('ended', () => {
        setIsPlaying(false);
      });
      audioRef.current.addEventListener('error', (e) => {
        console.error("Share portal audio error:", e);
        setIsPlaying(false);
      });
    }

    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, [activeTrack?.file_url]);

  const togglePlay = async () => {
    if (audioRef.current) {
      try {
        if (isPlaying) {
          audioRef.current.pause();
          setIsPlaying(false);
        } else {
          await audioRef.current.play();
          setIsPlaying(true);
        }
      } catch (error) {
        console.error("Share portal playback failed:", error);
      }
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = x / rect.width;
    if (audioRef.current) {
      audioRef.current.currentTime = pct * duration;
    }
  };

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleRating = (type: 'up' | 'down') => {
    setRating(type);
    addActivity({
      type: type === 'up' ? 'social' as any : 'system' as any,
      user: 'Client User' + (shareLink.recipient_email ? ` (${shareLink.recipient_email})` : ''),
      action: type === 'up' ? 'liked' : 'disliked',
      target: activeTrack?.name || playlist?.name || 'Asset',
      details: type === 'up' ? 'Approved the mix.' : 'Requested revisions.',
      client_id: shareLink.client_id
    });
  };

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    
    const newComment = { id: Date.now().toString(), user: 'Client', text: comment, time: 'Just now' };
    setComments([newComment, ...comments]);
    
    addActivity({
      type: 'comment' as any,
      user: 'Client User' + (shareLink.recipient_email ? ` (${shareLink.recipient_email})` : ''),
      action: 'commented on',
      target: activeTrack?.name || playlist?.name || 'Asset',
      details: comment,
      client_id: shareLink.client_id
    });

    setComment('');
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12 font-sans selection:bg-orange-500 selection:text-black">
      <div className="max-w-6xl mx-auto flex items-center justify-between mb-12">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl overflow-hidden border border-orange-500/20 flex items-center justify-center bg-zinc-900">
            <img src="/favicon.svg" className="w-8 h-8 object-contain" alt="OG BEATZ" />
          </div>
          <span className="text-2xl font-black tracking-tighter uppercase italic">OG BEATZ</span>
        </div>
        <div className="hidden md:flex flex-col items-end">
           <span className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-500">Master Reference Portal</span>
           <span className="text-[10px] text-zinc-600 font-medium">Session ID: {Math.random().toString(36).substring(7).toUpperCase()}</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        {/* Left Side: Visuals & Player */}
        <div className="space-y-12">
          <div className="relative aspect-square max-w-[400px] mx-auto group">
            <motion.div 
               animate={isPlaying ? { scale: 1.05 } : { scale: 1 }}
               className="w-full h-full rounded-[4rem] overflow-hidden shadow-[0_0_100px_rgba(249,115,22,0.15)] border-2 border-zinc-800"
            >
              {activeTrack?.image_url ? (
                <img src={activeTrack.image_url} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-zinc-900 flex items-center justify-center">
                   <Music className="w-12 h-12 text-zinc-800" />
                </div>
              )}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={togglePlay}
                  className="w-24 h-24 bg-white text-black rounded-full flex items-center justify-center hover:scale-110 active:scale-95 transition-transform"
                >
                  {isPlaying ? <Pause className="w-10 h-10 fill-current" /> : <Play className="w-10 h-10 fill-current ml-2" />}
                </button>
              </div>
            </motion.div>
            
            {/* Play Button for Mobile */}
            <div className="md:hidden absolute -bottom-6 left-1/2 -translate-x-1/2">
                <button 
                  onClick={togglePlay}
                  className="w-20 h-20 bg-orange-500 text-black rounded-full flex items-center justify-center shadow-2xl shadow-orange-500/20"
                >
                  {isPlaying ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1" />}
                </button>
            </div>
          </div>

          <div className="text-center md:text-left space-y-4">
             <div className="flex items-center justify-center md:justify-start gap-3 text-orange-500 text-[10px] font-black uppercase tracking-widest">
                <Music className="w-4 h-4" /> MASTER REFERENCE • 48KHZ / 24-BIT
             </div>
             <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none">{activeTrack?.name || 'Untitled'}</h1>
             <p className="text-zinc-500 text-xl font-medium">{activeTrack?.artist || 'Unknown'}</p>
          </div>

          {/* New: Progress Bar for Share Portal */}
          <div className="space-y-4">
             <div 
               onClick={handleSeek}
               className="h-2 w-full bg-zinc-900 rounded-full cursor-pointer overflow-hidden relative group"
             >
                <motion.div 
                  className="absolute inset-y-0 left-0 bg-orange-500"
                  animate={{ width: `${(progress / duration) * 100}%` }}
                />
             </div>
             <div className="flex justify-between text-[10px] font-mono text-zinc-600 uppercase tracking-widest">
                <span>{formatTime(progress)}</span>
                <span>{formatTime(duration)}</span>
             </div>
          </div>
        </div>

        {/* Right Side: Interaction */}
        <div className="space-y-12 bg-zinc-950/50 p-8 md:p-12 rounded-[3.5rem] border border-zinc-900">
           <div className="space-y-8">
              <div className="flex items-center justify-between">
                 <h2 className="text-2xl font-black tracking-tight">Reference Action</h2>
                 {shareLink.download_enabled ? (
                   <button className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-zinc-400 hover:text-white transition-colors">
                     <Download className="w-4 h-4" /> Download Master
                   </button>
                 ) : (
                   <div className="flex items-center gap-2 text-xs text-zinc-600 font-bold uppercase tracking-widest">
                     <Lock className="w-4 h-4" /> Downloads Disabled
                   </div>
                 )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <button 
                   onClick={() => handleRating('up')}
                   className={cn(
                     "flex flex-col items-center justify-center gap-4 p-8 rounded-3xl border transition-all duration-300",
                     rating === 'up' ? "bg-emerald-500 border-emerald-400 text-black font-black" : "bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-emerald-500"
                   )}
                 >
                    <ThumbsUp className={cn("w-8 h-8", rating === 'up' && "fill-current")} />
                    <span className="text-[10px] uppercase tracking-widest">Approve Mix</span>
                 </button>
                 <button 
                    onClick={() => handleRating('down')}
                    className={cn(
                      "flex flex-col items-center justify-center gap-4 p-8 rounded-3xl border transition-all duration-300",
                      rating === 'down' ? "bg-red-500 border-red-400 text-black font-black" : "bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-red-500"
                    )}
                 >
                    <ThumbsDown className={cn("w-8 h-8", rating === 'down' && "fill-current")} />
                    <span className="text-[10px] uppercase tracking-widest">Needs Revisions</span>
                 </button>
              </div>
           </div>

           <div className="space-y-6">
              <div className="flex items-center gap-2 text-zinc-300 text-sm font-bold">
                 {playlist ? <Music className="w-4 h-4" /> : <MessageSquare className="w-4 h-4" />}
                 {playlist ? 'Collection Assets' : 'Leave Detailed Feedback'}
              </div>

              {playlist && (
                <div className="space-y-2 mb-8">
                   {playlistTracks.map((t, idx) => (
                     <button 
                       key={t.id}
                       onClick={() => setActiveTrack(t)}
                       className={cn(
                         "w-full flex items-center justify-between p-4 rounded-2xl border transition-all text-left",
                         activeTrack?.id === t.id ? "bg-orange-500 border-orange-400 text-black font-black" : "bg-black border-zinc-900 text-zinc-500 hover:border-zinc-700"
                       )}
                     >
                       <div className="flex items-center gap-3">
                          <div className={cn("w-6 h-6 rounded-lg bg-zinc-900 border border-black/20 flex items-center justify-center text-[10px]", activeTrack?.id === t.id ? "bg-white/20" : "")}>{idx + 1}</div>
                          <span className="text-xs uppercase tracking-tight truncate font-bold">{t.name}</span>
                       </div>
                       {activeTrack?.id === t.id && <ChevronRight className="w-4 h-4" />}
                     </button>
                   ))}
                </div>
              )}

              {!playlist && (
                <form onSubmit={handleComment} className="relative group">
                   <textarea 
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="E.g., Turn down the bass on the chorus..."
                      className="w-full h-32 bg-black border border-zinc-800 rounded-3xl p-6 text-sm focus:outline-none focus:border-orange-500 transition-all resize-none placeholder:text-zinc-700"
                   />
                   <button 
                     type="submit"
                     className="absolute bottom-4 right-4 p-3 bg-zinc-900 text-zinc-400 rounded-2xl hover:bg-white hover:text-black transition-all"
                   >
                      <Send className="w-4 h-4" />
                   </button>
                </form>
              )}

              <div className="space-y-4 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                {comments.map(c => (
                  <div key={c.id} className="bg-zinc-900/40 p-4 rounded-3xl border border-zinc-900">
                    <div className="flex items-center justify-between mb-2">
                       <span className="text-[10px] font-black uppercase text-orange-500 tracking-tighter">{c.user}</span>
                       <span className="text-[10px] text-zinc-600 uppercase font-mono">{c.time}</span>
                    </div>
                    <p className="text-xs text-zinc-400 leading-relaxed italic">"{c.text}"</p>
                  </div>
                ))}
              </div>
           </div>
        </div>
      </div>

      <footer className="mt-24 pb-12 text-center border-t border-zinc-900 pt-12 flex flex-col items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg overflow-hidden border border-zinc-800 flex items-center justify-center bg-zinc-900">
               <img src="/favicon.svg" className="w-5 h-5 object-contain" />
            </div>
            <span className="text-lg font-black tracking-tighter">OG BEATZ</span>
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-700">Secured with Cryptographic Tokens • MEDIA MANAGER PRO</p>
          <div className="flex items-center gap-2 opacity-20 filter grayscale">
             <div className="w-4 h-4 rounded-full bg-blue-500" />
             <div className="w-4 h-4 rounded-full bg-purple-500" />
             <div className="w-4 h-4 rounded-full bg-orange-500" />
          </div>
      </footer>
    </div>
  );
}
