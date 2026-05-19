import React, { useState, useEffect } from 'react';
import { X, Copy, Download, Sparkles, Youtube, Instagram, FileText, Check, Loader2 } from 'lucide-react';
import { Track, PromoPack } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { useMediaStore } from '../context/MediaStoreContext';
import { cn } from '../lib/utils';

interface PromoPackModalProps {
  track: Track;
  onClose: () => void;
}

export default function PromoPackModal({ track, onClose }: PromoPackModalProps) {
  const { profile } = useMediaStore();
  const [loading, setLoading] = useState(false);
  const [promoData, setPromoData] = useState<PromoPack | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    // Try to load from localStorage first
    const saved = localStorage.getItem(`promo_${track.id}`);
    if (saved) {
      setPromoData(JSON.parse(saved));
    }
  }, [track.id]);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const { generatePromoPack } = await import('../services/geminiService');
      const data = await generatePromoPack(track);
      
      if (!data) throw new Error("Promo generation failed");

      const newPromo: PromoPack = {
        id: Math.random().toString(36).substring(7),
        track_id: track.id,
        created_at: new Date().toISOString(),
        youtube_copy: data.youtube?.title + "\n\n" + data.youtube?.description,
        instagram_copy: data.instagram,
        generic_copy: data.generic
      };
      
      setPromoData(newPromo);
      localStorage.setItem(`promo_${track.id}`, JSON.stringify(newPromo));
    } catch (e) {
      console.error("Promo generation failed:", e);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const downloadTxt = () => {
    if (!promoData) return;
    const content = `PROMO PACK: ${track.name}\n\nYOUTUBE:\n${promoData.youtube_copy}\n\nINSTAGRAM:\n${promoData.instagram_copy}\n\nGENERIC:\n${promoData.generic_copy}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${track.name}_promo.txt`;
    a.click();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/90 backdrop-blur-md" 
        onClick={onClose}
      />
      
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="relative w-full max-w-4xl bg-zinc-950 border border-zinc-900 rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
      >
        {/* Left Side: Track Info */}
        <div className="w-full md:w-80 bg-zinc-900/50 p-8 border-b md:border-b-0 md:border-r border-zinc-900 flex flex-col">
           <div className="flex items-center justify-between md:mb-12">
              <Sparkles className="w-6 h-6 text-orange-500" />
              <button onClick={onClose} className="md:hidden"><X className="w-5 h-5 text-zinc-500" /></button>
           </div>
           
           <div className="hidden md:block space-y-8">
              <div className="w-full aspect-square rounded-[2.5rem] overflow-hidden border-2 border-zinc-800">
                 <img src={track.image_url || '/input_file_2.png'} className="w-full h-full object-cover" />
              </div>
              <div>
                 <h3 className="text-2xl font-black uppercase tracking-tighter leading-none">{track.name}</h3>
                 <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-2">{track.artist}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div className="bg-black/40 p-4 rounded-2xl border border-zinc-800">
                    <p className="text-[10px] text-zinc-600 font-bold uppercase mb-1">BPM</p>
                    <p className="text-sm font-black">{track.bpm}</p>
                 </div>
                 <div className="bg-black/40 p-4 rounded-2xl border border-zinc-800">
                    <p className="text-[10px] text-zinc-600 font-bold uppercase mb-1">KEY</p>
                    <p className="text-sm font-black">{track.key_signature}</p>
                 </div>
              </div>
           </div>

           <div className="mt-auto hidden md:block">
              <button 
                onClick={downloadTxt}
                disabled={!promoData}
                className="w-full flex items-center justify-center gap-2 h-12 bg-zinc-900 border border-zinc-800 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-zinc-800 transition-all disabled:opacity-50"
              >
                <Download className="w-4 h-4" /> Download .TXT
              </button>
           </div>
        </div>

        {/* Right Side: Content Generation */}
        <div className="flex-1 p-8 overflow-y-auto custom-scrollbar flex flex-col">
           <div className="flex items-center justify-between mb-12">
              <div>
                 <h2 className="text-3xl font-black tracking-tighter uppercase italic">Promo Pack Engine</h2>
                 <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-1">AI-Powered Social Distribution Copy</p>
              </div>
              <button onClick={onClose} className="hidden md:flex w-10 h-10 bg-zinc-900 border border-zinc-800 rounded-2xl items-center justify-center text-zinc-500 hover:text-white transition-all">
                <X className="w-5 h-5" />
              </button>
           </div>

           {!promoData && !loading ? (
             <div className="flex-1 flex flex-col items-center justify-center py-20 text-center space-y-8">
                <div className="w-24 h-24 bg-orange-500/10 text-orange-500 rounded-[2rem] flex items-center justify-center border border-orange-500/20">
                   <Sparkles className="w-10 h-10 animate-pulse" />
                </div>
                <div>
                   <h4 className="text-xl font-black uppercase tracking-tighter">Ready for expansion?</h4>
                   <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest max-w-xs mx-auto mt-2">
                      Generate professional copy for YouTube, Instagram, and Discord in seconds.
                   </p>
                </div>
                <button 
                  onClick={handleGenerate}
                  className="px-10 h-14 bg-white text-black rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-105 transition-all flex items-center gap-3"
                >
                  <Sparkles className="w-4 h-4" /> Initialize Engine
                </button>
             </div>
           ) : loading ? (
             <div className="flex-1 flex flex-col items-center justify-center py-20 text-center space-y-6">
                <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
                <p className="text-xs text-zinc-500 font-bold uppercase tracking-[0.3em]">Analyzing Track DNA...</p>
             </div>
           ) : (
             <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4">
                {/* YouTube */}
                <div className="space-y-4">
                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                         <Youtube className="w-3 h-3 text-red-500" /> YouTube Optimization
                      </div>
                      <button 
                        onClick={() => copyToClipboard(promoData!.youtube_copy, 'yt')}
                        className="text-[10px] font-black uppercase tracking-widest text-orange-500 flex items-center gap-2"
                      >
                         {copied === 'yt' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                         {copied === 'yt' ? 'Copied' : 'Copy Block'}
                      </button>
                   </div>
                   <div className="bg-black border border-zinc-900 rounded-[2rem] p-8 font-mono text-xs text-zinc-400 whitespace-pre-wrap">
                      {promoData!.youtube_copy}
                   </div>
                </div>

                {/* Instagram */}
                <div className="space-y-4">
                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                         <Instagram className="w-3 h-3 text-pink-500" /> Instagram Caption
                      </div>
                      <button 
                        onClick={() => copyToClipboard(promoData!.instagram_copy, 'ig')}
                        className="text-[10px] font-black uppercase tracking-widest text-orange-500 flex items-center gap-2"
                      >
                         {copied === 'ig' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                         {copied === 'ig' ? 'Copied' : 'Copy Block'}
                      </button>
                   </div>
                   <div className="bg-black border border-zinc-900 rounded-[2rem] p-8 font-mono text-xs text-zinc-400 whitespace-pre-wrap">
                      {promoData!.instagram_copy}
                   </div>
                </div>

                {/* Generic */}
                <div className="space-y-4">
                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                         <FileText className="w-3 h-3 text-zinc-500" /> Professional Summary
                      </div>
                      <button 
                        onClick={() => copyToClipboard(promoData!.generic_copy, 'gn')}
                        className="text-[10px] font-black uppercase tracking-widest text-orange-500 flex items-center gap-2"
                      >
                         {copied === 'gn' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                         {copied === 'gn' ? 'Copied' : 'Copy Block'}
                      </button>
                   </div>
                   <div className="bg-black border border-zinc-900 rounded-[2rem] p-8 font-mono text-xs text-zinc-400 whitespace-pre-wrap">
                      {promoData!.generic_copy}
                   </div>
                </div>
             </div>
           )}
        </div>
      </motion.div>
    </div>
  );
}
