import React, { useState, useEffect, useRef } from 'react';
import { X, Save, Trash2, Palette, Image as ImageIcon, Upload } from 'lucide-react';
import { Playlist } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface EditPlaylistModalProps {
  playlist: Playlist | Partial<Playlist>;
  isNew?: boolean;
  onClose: () => void;
  onSave: (updates: Partial<Playlist>) => void;
  onDelete?: (id: string) => void;
}

export default function EditPlaylistModal({ playlist, isNew, onClose, onSave, onDelete }: EditPlaylistModalProps) {
  const [name, setName] = useState(playlist.name || '');
  const [description, setDescription] = useState(playlist.description || '');
  const [imageUrl, setImageUrl] = useState(playlist.image_url || '');
  const [startColor, setStartColor] = useState(playlist.start_color || '#f97316');
  const [endColor, setEndColor] = useState(playlist.end_color || '#ea580c');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name,
      description,
      image_url: imageUrl,
      start_color: startColor,
      end_color: endColor
    });
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
      />
      
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="relative w-full max-w-lg bg-zinc-950 border border-zinc-900 rounded-[2.5rem] shadow-2xl overflow-hidden"
      >
        <form onSubmit={handleSave} className="p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black tracking-tight uppercase italic">{isNew ? 'New Collection' : 'Edit Collection'}</h2>
              <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-1">
                {isNew ? 'Create a new master assembly.' : 'Refine your repertoire grouping.'}
              </p>
            </div>
            <button 
              type="button"
              onClick={onClose}
              className="p-2 text-zinc-500 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-6 overflow-y-auto max-h-[60vh] pr-2 scrollbar-hide">
            <div className="flex gap-6">
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="w-32 h-32 rounded-3xl bg-zinc-900 border border-zinc-800 flex flex-col items-center justify-center cursor-pointer transition-all hover:border-orange-500/50 group shrink-0 overflow-hidden relative"
              >
                {imageUrl ? (
                  <img src={imageUrl} className="w-full h-full object-cover" />
                ) : (
                  <>
                    <ImageIcon className="w-8 h-8 text-zinc-700 group-hover:text-orange-500 transition-colors" />
                    <span className="text-[8px] font-black uppercase text-zinc-500 mt-2">Artwork</span>
                  </>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <Upload className="w-6 h-6 text-white" />
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  className="hidden" 
                  accept="image/*" 
                />
              </div>

              <div className="flex-1 space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Name</label>
                  <input 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl px-5 py-3 text-sm font-bold outline-none focus:border-orange-500/50 transition-colors"
                    placeholder="e.g. Midnight Selection"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Artwork URL</label>
                  <input 
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl px-5 py-3 text-sm font-bold outline-none focus:border-orange-500/50 transition-colors"
                    placeholder="https://..."
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Description</label>
              <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl px-5 py-4 text-sm font-medium outline-none focus:border-orange-500/50 transition-colors resize-none h-24"
                placeholder="Optional description of this collection..."
              />
            </div>

            <div className="space-y-3">
               <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1 flex items-center gap-2">
                 <Palette className="w-3 h-3 text-orange-500" /> Theme Accent
               </label>
               <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 bg-zinc-900/50 border border-zinc-800 p-3 rounded-2xl">
                    <input 
                      type="color" 
                      value={startColor}
                      onChange={(e) => setStartColor(e.target.value)}
                      className="w-8 h-8 rounded-lg bg-transparent cursor-pointer border-none"
                    />
                    <span className="text-[10px] font-black uppercase text-zinc-400">Start Color</span>
                  </div>
                  <div className="flex items-center gap-3 bg-zinc-900/50 border border-zinc-800 p-3 rounded-2xl">
                    <input 
                      type="color" 
                      value={endColor}
                      onChange={(e) => setEndColor(e.target.value)}
                      className="w-8 h-8 rounded-lg bg-transparent cursor-pointer border-none"
                    />
                    <span className="text-[10px] font-black uppercase text-zinc-400">End Color</span>
                  </div>
               </div>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-6 border-t border-zinc-900">
            <button 
              type="submit"
              className="flex-1 bg-white text-black h-12 rounded-2xl font-black tracking-widest uppercase text-xs flex items-center justify-center gap-2 hover:scale-105 transition-all"
            >
              <Save className="w-4 h-4" /> {isNew ? 'Create Collection' : 'Save Changes'}
            </button>
            {!isNew && onDelete && (
              <button 
                type="button"
                onClick={() => {
                  if (confirm('Are you sure you want to delete this collection?')) {
                    onDelete(playlist.id as string);
                    onClose();
                  }
                }}
                className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 text-rose-500 flex items-center justify-center hover:bg-rose-500 hover:text-black transition-all"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
          </div>
        </form>
      </motion.div>
    </div>
  );
}
