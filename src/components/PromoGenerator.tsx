import React, { useState } from 'react';
import { Sparkles, Copy, Download, Check, Youtube, Instagram, Share2, Loader2 } from 'lucide-react';
import { generatePromoPack } from '../services/geminiService';
import { Track } from '../types';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface PromoGeneratorProps {
  track: Track;
  onClose: () => void;
}

export default function PromoGenerator({ track, onClose }: PromoGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [promoData, setPromoData] = useState<any>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const startGeneration = async () => {
    setIsGenerating(true);
    const result = await generatePromoPack(track);
    setPromoData(result);
    setIsGenerating(false);
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl"
      >
        <div className="p-6 border-b border-zinc-900 flex items-center justify-between bg-gradient-to-r from-orange-500/10 to-transparent">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-500 rounded-xl text-black">
              <Sparkles className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tight">TUNEMOTE AI</h2>
              <p className="text-xs text-zinc-500 font-medium">Generating Assets for "{track.name}"</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-zinc-500 hover:text-white p-2"
          >
            ×
          </button>
        </div>

        <div className="p-8">
          <AnimatePresence mode="wait">
            {!promoData ? (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center space-y-6"
              >
                <div className="p-8 rounded-2xl border border-zinc-900 bg-zinc-900/20">
                   <p className="text-zinc-400 max-w-sm mx-auto leading-relaxed">
                     Gemini will generate optimized marketing copy for YouTube and Instagram, enforcing strict industry-first brand constraints.
                   </p>
                </div>
                <button 
                  onClick={startGeneration}
                  disabled={isGenerating}
                  className="bg-orange-500 text-black px-8 py-4 rounded-full font-black tracking-widest uppercase text-xs flex items-center gap-3 mx-auto hover:scale-105 transition-transform disabled:opacity-50"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Analyzing Track Context...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Generate Promo Pack
                    </>
                  )}
                </button>
              </motion.div>
            ) : (
              <motion.div 
                key="result"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                {/* Youtube Section */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-red-500 text-[10px] uppercase font-black tracking-widest">
                      <Youtube className="w-4 h-4" /> YouTube Optimized
                    </div>
                    <button 
                      onClick={() => copyToClipboard(`${promoData.youtube.title}\n\n${promoData.youtube.description}`, 'youtube')}
                      className="text-xs text-zinc-500 hover:text-white flex items-center gap-1.5"
                    >
                      {copiedKey === 'youtube' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                      {copiedKey === 'youtube' ? 'Copied' : 'Copy Full Suite'}
                    </button>
                  </div>
                  <div className="p-4 rounded-xl border border-zinc-800 bg-black space-y-2">
                    <p className="text-white font-bold text-sm">Title: {promoData.youtube.title}</p>
                    <p className="text-zinc-500 text-xs whitespace-pre-wrap leading-relaxed border-t border-zinc-900 pt-2">
                      {promoData.youtube.description}
                    </p>
                  </div>
                </div>

                {/* Instagram Section */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-pink-500 text-[10px] uppercase font-black tracking-widest">
                      <Instagram className="w-4 h-4" /> Instagram Caption
                    </div>
                    <button 
                      onClick={() => copyToClipboard(promoData.instagram, 'instagram')}
                      className="text-xs text-zinc-500 hover:text-white flex items-center gap-1.5"
                    >
                      {copiedKey === 'instagram' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                      {copiedKey === 'instagram' ? 'Copied' : 'Copy Caption'}
                    </button>
                  </div>
                  <div className="p-4 rounded-xl border border-zinc-800 bg-black">
                    <p className="text-zinc-300 text-xs whitespace-pre-wrap italic">
                      "{promoData.instagram}"
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-4">
                  <button className="flex-1 bg-white text-black py-3 rounded-xl text-xs font-bold uppercase tracking-tighter flex items-center justify-center gap-2">
                    <Download className="w-4 h-4" /> Download .txt Pack
                  </button>
                  <button 
                    onClick={onClose}
                    className="px-6 py-3 border border-zinc-800 text-zinc-500 hover:text-white hover:border-zinc-700 rounded-xl text-xs font-bold transition-colors"
                  >
                    Done
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
