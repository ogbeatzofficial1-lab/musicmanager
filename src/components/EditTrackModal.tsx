import React, { useState, useEffect } from 'react';
import { Track } from '../types';
import { Save, X, Music, User, Activity, Clock, Image as ImageIcon } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

interface EditTrackModalProps {
  track: Track;
  onClose: () => void;
  onSave: (id: string, updates: Partial<Track>) => void;
}

export default function EditTrackModal({ track, onClose, onSave }: EditTrackModalProps) {
  const [formData, setFormData] = useState<Partial<Track>>({
    name: track.name,
    artist: track.artist,
    bpm: track.bpm,
    key_signature: track.key_signature,
    duration: track.duration,
    status: track.status,
    tags: track.tags || [],
    image_url: track.image_url,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(track.image_url || null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        setFormData({ ...formData, image_url: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(track.id, formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-[2.5rem] overflow-hidden shadow-2xl"
      >
        <div className="p-6 border-b border-zinc-900 flex items-center justify-between">
          <h2 className="text-xl font-black tracking-tight uppercase">Edit Metadata</h2>
          <button onClick={onClose} className="p-2 text-zinc-500 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Artwork Upload Section */}
          <div className="flex justify-center mb-4">
             <div className="relative group">
                <div className="w-32 h-32 rounded-3xl overflow-hidden border-2 border-zinc-800 bg-black">
                   {imagePreview ? (
                      <img src={imagePreview} className="w-full h-full object-cover" />
                   ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-700">
                         <ImageIcon className="w-10 h-10" />
                      </div>
                   )}
                </div>
                <button 
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-2 transition-opacity rounded-3xl"
                >
                   <ImageIcon className="w-6 h-6 text-white" />
                   <span className="text-[8px] font-black uppercase tracking-widest text-white">Change Art</span>
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden"
                />
             </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                <Music className="w-3 h-3 text-orange-500" /> Track Name
              </label>
              <input 
                type="text"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-black border border-zinc-900 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500 transition-all font-medium"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                <User className="w-3 h-3 text-orange-500" /> Artist / Sound Architect
              </label>
              <input 
                type="text"
                value={formData.artist}
                onChange={e => setFormData({ ...formData, artist: e.target.value })}
                className="w-full bg-black border border-zinc-900 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500 transition-all font-medium"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                  <Activity className="w-3 h-3 text-orange-500" /> BPM
                </label>
                <input 
                  type="number"
                  value={formData.bpm}
                  onChange={e => setFormData({ ...formData, bpm: parseInt(e.target.value) })}
                  className="w-full bg-black border border-zinc-900 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500 transition-all font-mono"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                  <Clock className="w-3 h-3 text-orange-500" /> Key Sig
                </label>
                <input 
                  type="text"
                  value={formData.key_signature}
                  onChange={e => setFormData({ ...formData, key_signature: e.target.value })}
                  className="w-full bg-black border border-zinc-900 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500 transition-all font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                  <Clock className="w-3 h-3 text-orange-500" /> Duration (sec)
                </label>
                <input 
                  type="number"
                  value={formData.duration}
                  onChange={e => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                  className="w-full bg-black border border-zinc-900 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500 transition-all font-mono"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                  <Activity className="w-3 h-3 text-orange-500" /> Status
                </label>
                <select 
                  value={formData.status}
                  onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full bg-black border border-zinc-900 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500 transition-all font-mono text-xs uppercase"
                >
                  <option value="ready">Ready</option>
                  <option value="sent">Sent</option>
                  <option value="processing">Processing</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                <Music className="w-3 h-3 text-orange-500" /> Tags (comma separated)
              </label>
              <input 
                type="text"
                value={formData.tags?.join(', ')}
                onChange={e => setFormData({ ...formData, tags: e.target.value.split(',').map(t => t.trim()).filter(t => t) })}
                placeholder="E.g., Dark, Cinematic, Bass-Heavy"
                className="w-full bg-black border border-zinc-900 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500 transition-all font-medium"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                <ImageIcon className="w-3 h-3 text-orange-500" /> Artwork URL
              </label>
              <input 
                type="text"
                value={formData.image_url || ''}
                onChange={e => setFormData({ ...formData, image_url: e.target.value })}
                className="w-full bg-black border border-zinc-900 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500 transition-all text-xs text-zinc-400"
              />
            </div>
          </div>

          <div className="pt-4 flex items-center gap-3">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-4 border border-zinc-900 text-zinc-500 font-bold rounded-2xl hover:text-white hover:border-zinc-700 transition-all text-xs uppercase tracking-widest"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="flex-1 bg-white text-black px-6 py-4 rounded-2xl font-black tracking-widest uppercase text-xs flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform active:scale-[0.98]"
            >
              <Save className="w-4 h-4" /> Save Master
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
