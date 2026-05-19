import React, { useState, useCallback, useRef } from 'react';
import { Upload, FileAudio, Loader2, CheckCircle2, AlertCircle, Image as ImageIcon, X } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { useMediaStore } from '../context/MediaStoreContext';

interface UploadZoneProps {
  onSuccess: (track: any) => void;
}

export default function UploadZone({ onSuccess }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [artworkPreview, setArtworkPreview] = useState<string | null>(null);
  const { addTrack, analyzeTrack } = useMediaStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    // Use Object URL instead of DataURL to avoid massive strings in performance/storage
    const url = URL.createObjectURL(file);
    setArtworkPreview(url);
  };

  const handleAudioFile = useCallback(async (file: File) => {
    if (!file.type.startsWith('audio/')) {
       alert("Please upload an audio file.");
       return;
    }

    setIsProcessing(true);
    setUploadProgress(0);
    setTimeRemaining(5); // Start with 5 seconds estimated

    // Progress simulation
    const startTime = Date.now();
    const duration = 5000; // 5 seconds simulated duration
    
    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(Math.floor((elapsed / duration) * 100), 95);
      const remaining = Math.max(Math.ceil((duration - elapsed) / 1000), 0);
      
      setUploadProgress(progress);
      setTimeRemaining(remaining);
      
      if (progress >= 95) {
        clearInterval(progressInterval);
      }
    }, 100);
    
    // AI Analysis using the context helper
    const aiMetadata = await analyzeTrack(file.name);
    
    setUploadProgress(100);
    setTimeRemaining(0);
    clearInterval(progressInterval);
    
    const trackData = {
      name: file.name.replace(/\.[^/.]+$/, ""),
      artist: "OGBeatz",
      bpm: aiMetadata?.bpm || 120,
      key_signature: aiMetadata?.key || "C",
      duration: aiMetadata?.duration || 0,
      tags: aiMetadata?.tags || [],
      size: file.size,
      type: file.type,
      status: "ready" as const,
      image_url: artworkPreview || "/input_file_2.png",
      // In a real app, I'd upload to Supabase Storage and get a URL
      file_url: URL.createObjectURL(file), 
    };

    const savedTrack = await addTrack(trackData);
    setIsProcessing(false);
    onSuccess(savedTrack);
  }, [addTrack, onSuccess, artworkPreview]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files) as File[];
    
    const imageFile = files.find(f => f.type.startsWith('image/'));
    const audioFile = files.find(f => f.type.startsWith('audio/'));

    if (imageFile) handleImageFile(imageFile);
    if (audioFile) handleAudioFile(audioFile);
  };

  return (
    <div className="space-y-4">
      <div 
        className={cn(
          "relative group cursor-pointer",
          "border-2 border-dashed rounded-3xl p-12 transition-all duration-500",
          isDragging ? "border-orange-500 bg-orange-500/5" : "border-zinc-800 bg-zinc-950 hover:border-zinc-700",
          isProcessing && "pointer-events-none opacity-50"
        )}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input 
          type="file" 
          ref={fileInputRef}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleAudioFile(file);
          }}
          accept="audio/*"
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <div className={cn(
            "w-20 h-20 rounded-2xl flex items-center justify-center transition-all duration-500",
            isDragging ? "bg-orange-500 text-black scale-110 shadow-2xl shadow-orange-500/20" : "bg-zinc-900 text-zinc-500 group-hover:text-white"
          )}>
            {isProcessing ? (
              <Loader2 className="w-10 h-10 animate-spin text-orange-500" />
            ) : (
              <Upload className="w-10 h-10" />
            )}
          </div>
          
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight">
              {isProcessing ? "AI Analysis in Progress..." : "Drag Master Files Here"}
            </h3>
            <p className="text-zinc-500 text-sm mt-1">
              {isProcessing ? "Gemini is identifying BPM, Key, and Metadata" : "High-fidelity WAV, MP3, or AIFF support"}
            </p>
          </div>

          <AnimatePresence>
            {artworkPreview && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="mt-4 flex items-center gap-4 p-3 bg-zinc-900 rounded-2xl border border-zinc-800"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="w-12 h-12 rounded-lg overflow-hidden border border-zinc-800">
                  <img src={artworkPreview} className="w-full h-full object-cover" />
                </div>
                <div className="text-left">
                  <p className="text-[10px] font-black uppercase tracking-widest text-orange-500">Artwork Linked</p>
                  <p className="text-xs text-zinc-500">Ready for master upload</p>
                </div>
                <button 
                  onClick={() => setArtworkPreview(null)}
                  className="p-1.5 hover:bg-zinc-800 rounded-lg text-zinc-500 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {!artworkPreview && !isProcessing && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                imageInputRef.current?.click();
              }}
              className="mt-2 flex items-center gap-2 text-xs font-bold text-zinc-500 hover:text-white transition-colors"
            >
              <ImageIcon className="w-4 h-4" /> Add Artwork (Optional)
            </button>
          )}

          <input 
            type="file" 
            ref={imageInputRef}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleImageFile(file);
            }}
            accept="image/*"
            className="hidden"
          />

          {isProcessing && (
            <div className="mt-8 w-full max-w-xs space-y-4">
              <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                <span className="text-orange-500">Uploading Master</span>
                <span className="text-zinc-500">{uploadProgress}%</span>
              </div>
              
              <div className="h-1 lg:h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${uploadProgress}%` }}
                  className="h-full bg-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.4)]"
                />
              </div>

              <div className="flex items-center justify-between text-[9px] font-bold text-zinc-600">
                <div className="flex items-center gap-1.5">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  <span>Bitrate Analysis...</span>
                </div>
                {timeRemaining !== null && (
                  <span>EST. {timeRemaining}S REMAINING</span>
                )}
              </div>

              <div className="flex items-center gap-2 text-orange-500/80 text-[10px] font-black uppercase tracking-widest pt-2 border-t border-zinc-900/50">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                Connecting to Gemini-3-Flash
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
