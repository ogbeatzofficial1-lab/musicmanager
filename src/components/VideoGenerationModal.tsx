import React, { useState, useEffect } from 'react';
import { X, Video, Sparkles, Wand2, Loader2, Play, CheckCircle2, AlertCircle, Share2, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useMediaStore } from '../context/MediaStoreContext';
import { Track, Playlist, PromoVideo } from '../types';
import { generateVideoAesthetic } from '../services/geminiService';

interface VideoGenerationModalProps {
  track?: Track;
  playlist?: Playlist;
  onClose: () => void;
}

export default function VideoGenerationModal({ track, playlist, onClose }: VideoGenerationModalProps) {
  const { addPromoVideo, promoVideos } = useMediaStore();
  const [step, setStep] = useState<'config' | 'processing' | 'preview'>('config');
  const [style, setStyle] = useState('minimalist');
  const [progress, setProgress] = useState(0);
  const [aesthetic, setAesthetic] = useState<any>(null);
  const [generatedVideo, setGeneratedVideo] = useState<PromoVideo | null>(null);

  const name = track?.name || playlist?.name || 'Untitled';
  const artist = track?.artist || 'OGBeatz';

  const styles = [
    { id: 'minimalist', name: 'Clean Chrome', icon: '✨' },
    { id: 'grunge', name: 'Distressed Metal', icon: '⛓️' },
    { id: 'vibrant', name: 'Neon Pulse', icon: '⚡' },
    { id: 'abstract', name: 'Ethereal Flow', icon: '🌫️' }
  ];

  const handleGenerate = async () => {
    setStep('processing');
    setProgress(10);

    // 1. Analyze aesthetic with Gemini
    const trackInfo = track || { name, artist, bpm: 120, key_signature: 'C' };
    const aes = await generateVideoAesthetic(trackInfo);
    setAesthetic(aes);
    setProgress(30);

    // 2. Simulate "Video Rendering"
    const duration = 5000;
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) {
          clearInterval(interval);
          return 95;
        }
        return prev + Math.random() * 5;
      });
    }, 200);

    // Wait for simulation
    await new Promise(resolve => setTimeout(resolve, duration));
    clearInterval(interval);
    
    // 3. Create the "Video" record
    const isSourceVideo = track?.type?.startsWith('video/');
    const newVideo: Partial<PromoVideo> = {
      track_id: track?.id,
      playlist_id: playlist?.id,
      video_url: isSourceVideo ? track.file_url : (track?.image_url || ''), 
      thumbnail_url: track?.image_url || '',
      style: style,
      status: 'ready'
    };
    await addPromoVideo(newVideo);
    
    // Set preview state for UI immediate feedback
    setGeneratedVideo({
      id: Math.random().toString(),
      ...newVideo,
      created_at: new Date().toISOString()
    } as PromoVideo);

    setProgress(100);
    setStep('preview');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/95 backdrop-blur-2xl"
      />
      
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative w-full max-w-4xl bg-zinc-950 border border-zinc-900 rounded-[3.5rem] overflow-hidden shadow-2xl"
      >
        <div className="p-8 border-b border-zinc-900 flex items-center justify-between bg-zinc-900/20">
          <div>
            <h2 className="text-2xl font-black italic uppercase tracking-tighter flex items-center gap-3">
               <Video className="w-6 h-6 text-orange-500" />
               Promo Engine v1.0
            </h2>
            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Generate high-fidelity motion assets for {name}.</p>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-zinc-900 rounded-2xl transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-8 md:p-12 h-[600px] flex flex-col">
          <AnimatePresence mode="wait">
            {step === 'config' && (
              <motion.div 
                key="config"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex-1 flex flex-col justify-center max-w-2xl mx-auto w-full space-y-12"
              >
                <div className="text-center space-y-4">
                   <div className="w-24 h-24 rounded-[2.5rem] bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mx-auto mb-6">
                      <Sparkles className="w-10 h-10 text-orange-500" />
                   </div>
                   <h3 className="text-3xl font-black tracking-tight">Select Visual Aesthetic</h3>
                   <p className="text-zinc-500 text-sm max-w-md mx-auto">Gemini will analyze your track's BPM and frequency spectrum to coordinate visual motion components.</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {styles.map(s => (
                    <button
                      key={s.id}
                      onClick={() => setStyle(s.id)}
                      className={`p-6 rounded-[2rem] border-2 transition-all flex flex-col items-center gap-3 ${
                        style === s.id 
                        ? 'bg-orange-500 border-orange-400 text-black shadow-xl shadow-orange-500/20 scale-105' 
                        : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700'
                      }`}
                    >
                      <span className="text-3xl">{s.icon}</span>
                      <span className="text-[10px] font-black uppercase tracking-widest">{s.name}</span>
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleGenerate}
                  className="w-full bg-white text-black py-6 rounded-[2rem] font-black tracking-[0.3em] uppercase text-xs hover:scale-105 active:scale-95 transition-all shadow-2xl flex items-center justify-center gap-3"
                >
                  <Wand2 className="w-5 h-5" /> Initialize Rendering Sequence
                </button>
              </motion.div>
            )}

            {step === 'processing' && (
              <motion.div 
                key="processing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col items-center justify-center space-y-12"
              >
                 <div className="relative">
                    <div className="w-32 h-32 rounded-full border border-zinc-900 flex items-center justify-center">
                       <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
                    </div>
                    {/* Pulsing rings */}
                    <div className="absolute inset-0 rounded-full border border-orange-500/20 animate-ping" />
                    <div className="absolute inset-0 rounded-full border border-orange-500/10 animate-ping delay-75" />
                 </div>

                 <div className="text-center space-y-6 w-full max-w-md">
                    <div className="space-y-2">
                       <h3 className="text-xl font-black uppercase tracking-tighter">
                          {progress < 40 ? 'Neural Aesthetic Mapping...' : progress < 80 ? 'Synthesizing Motion Frames...' : 'Finalizing Output Buffer...'}
                       </h3>
                       <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
                          <motion.div 
                            className="h-full bg-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.4)]"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                          />
                       </div>
                       <div className="flex justify-between text-[10px] font-black text-zinc-600 uppercase tracking-widest">
                          <span>Progress</span>
                          <span>{Math.floor(progress)}%</span>
                       </div>
                    </div>

                    <div className="p-6 bg-zinc-900/50 border border-zinc-900 rounded-[2rem] text-left">
                       <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                          <AlertCircle className="w-3 h-3" /> System Dispatch
                       </p>
                       <p className="text-xs text-zinc-400 leading-relaxed font-mono italic">
                          {aesthetic?.imagePrompt || 'Waiting for Gemini logic initialization...'}
                       </p>
                    </div>
                 </div>
              </motion.div>
            )}

            {step === 'preview' && (
              <motion.div 
                key="preview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
              >
                  <div className="aspect-[9/16] bg-black rounded-[3rem] border border-zinc-900 overflow-hidden relative shadow-2xl group">
                    {(generatedVideo?.video_url?.match(/\.(mp4|webm|mov)$/i) || generatedVideo?.video_url?.startsWith('data:video') || generatedVideo?.video_url?.startsWith('blob:')) ? (
                       <video 
                         src={generatedVideo?.video_url} 
                         className="w-full h-full object-cover opacity-60"
                         autoPlay
                         loop
                         muted
                         playsInline
                         controls={false}
                         onCanPlay={(e) => e.currentTarget.play()}
                       />
                    ) : (
                       <div className="w-full h-full relative overflow-hidden bg-zinc-900">
                          {generatedVideo?.video_url ? (
                             <>
                               <motion.img src={generatedVideo?.video_url} className="w-full h-full object-cover opacity-60" initial={{ scale: 1 }} animate={{ scale: 1.15 }} transition={{ duration: 10, repeat: Infinity, repeatType: "reverse", ease: "linear" }} />
                               {track?.file_url && (
                                 <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-10 w-3/4 max-w-sm">
                                   <audio src={track.file_url} controls autoPlay loop className="w-full opacity-80 hover:opacity-100 transition-opacity rounded-full shadow-2xl" />
                                 </div>
                               )}
                             </>
                          ) : (
                             <div className="w-full h-full bg-gradient-to-br from-orange-500/20 to-purple-500/20 opacity-60" />
                          )}
                       </div>
                    )}
                    
                    {/* Overlay Graphics */}
                    <div className="absolute inset-0 p-8 flex flex-col justify-between pointer-events-none">
                       <div className="space-y-1">
                          <div className="text-[10px] font-black text-orange-500 uppercase tracking-widest">OG BEATZ</div>
                          <div className="text-2xl font-black italic uppercase tracking-tighter leading-tight">{name}</div>
                       </div>
                       
                       <div className="space-y-4">
                          <div className="h-0.5 w-full bg-white/20 rounded-full overflow-hidden">
                             <div className="h-full bg-orange-500 w-1/3" />
                          </div>
                          <div className="flex justify-between text-[8px] font-black uppercase tracking-widest">
                             <span>0:12</span>
                             <span>0:30 PROMO</span>
                          </div>
                       </div>
                    </div>

                    <div className="absolute inset-0 flex items-center justify-center">
                       <div className="w-16 h-16 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center hover:scale-110 active:scale-95 transition-all text-white">
                          <Play className="w-6 h-6 fill-current ml-1" />
                       </div>
                    </div>

                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 border border-orange-500/30 bg-orange-500/10 backdrop-blur-md rounded-full text-[8px] font-black uppercase tracking-widest text-orange-500">
                       Rendering Complete
                    </div>
                 </div>

                 <div className="space-y-8">
                    <div className="space-y-4">
                       <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                          <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                       </div>
                       <h3 className="text-4xl font-black tracking-tight leading-none">Your master is ready for distribution.</h3>
                       <p className="text-zinc-500 text-sm leading-relaxed">
                          This promotion clip has been optimized for Instagram Reels and TikTok. The neural aesthetic alignment was calibrated to your track's frequency response.
                       </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                       <button className="flex items-center justify-center gap-2 p-5 bg-zinc-900 border border-zinc-800 rounded-[2rem] text-[10px] font-black uppercase tracking-widest hover:border-zinc-700 transition-all">
                          <Download className="w-4 h-4" /> Export HQ
                       </button>
                       <button className="flex items-center justify-center gap-2 p-5 bg-zinc-900 border border-zinc-800 rounded-[2rem] text-[10px] font-black uppercase tracking-widest hover:border-zinc-700 transition-all">
                          <Share2 className="w-4 h-4" /> Share Asset
                       </button>
                    </div>

                    <button 
                      onClick={onClose}
                      className="w-full p-5 bg-white text-black rounded-[2rem] text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-transform"
                    >
                       Return to Hub
                    </button>
                 </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
