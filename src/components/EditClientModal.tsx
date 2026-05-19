import React, { useState, useRef, useEffect } from 'react';
import { X, User, Mail, Building, Image as ImageIcon, Save } from 'lucide-react';
import { motion } from 'motion/react';
import { useMediaStore } from '../context/MediaStoreContext';
import { Client } from '../types';

interface EditClientModalProps {
  client: Client;
  onClose: () => void;
}

export default function EditClientModal({ client, onClose }: EditClientModalProps) {
  const { updateClient } = useMediaStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: client.name,
    email: client.email,
    company: client.company || '',
    avatar_url: client.avatar_url || null as string | null,
    tags: client.tags || []
  });
  const [currentTag, setCurrentTag] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(client.avatar_url || null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        setFormData({ ...formData, avatar_url: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateClient(client.id, {
      ...formData,
      last_active: new Date().toISOString()
    });
    onClose();
  };

  const addTag = () => {
    if (currentTag && !formData.tags.includes(currentTag)) {
      setFormData({ ...formData, tags: [...formData.tags, currentTag] });
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData({ ...formData, tags: formData.tags.filter(tag => tag !== tagToRemove) });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/90 backdrop-blur-xl"
      />
      
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative w-full max-w-2xl bg-zinc-950 border border-zinc-900 rounded-[3rem] overflow-hidden shadow-2xl"
      >
        <div className="p-8 border-b border-zinc-900 flex items-center justify-between bg-zinc-900/20">
          <div>
            <h2 className="text-2xl font-black italic uppercase tracking-tighter">Edit Partner Entity</h2>
            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Update institutional contact coordinates.</p>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-zinc-900 rounded-2xl transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="flex justify-center mb-4">
             <div className="relative group">
                <div className="w-24 h-24 rounded-[2rem] overflow-hidden border-2 border-zinc-900 bg-black flex items-center justify-center">
                   {imagePreview ? (
                      <img src={imagePreview} className="w-full h-full object-cover" />
                   ) : (
                      <User className="w-8 h-8 text-zinc-800" />
                   )}
                </div>
                <button 
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-1 transition-opacity rounded-[2rem]"
                >
                   <ImageIcon className="w-5 h-5 text-white" />
                   <span className="text-[7px] font-black uppercase tracking-widest text-white">Update</span>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1 flex items-center gap-2">
                <User className="w-3 h-3" /> Partner Name
              </label>
              <input 
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-black border border-zinc-900 rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:border-orange-500 transition-all"
                placeholder="FULL LEGAL NAME..."
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1 flex items-center gap-2">
                <Mail className="w-3 h-3" /> Communication Node
              </label>
              <input 
                required
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-black border border-zinc-900 rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:border-orange-500 transition-all uppercase placeholder:normal-case"
                placeholder="partner@institution.com"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1 flex items-center gap-2">
                <Building className="w-3 h-3" /> Agency / Association
              </label>
              <input 
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="w-full bg-black border border-zinc-900 rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:border-orange-500 transition-all"
                placeholder="UNIVERSAL MUSIC / INDEPENDENT..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Classification Tags</label>
              <div className="flex gap-2">
                <input 
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  className="flex-1 bg-black border border-zinc-900 rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:border-orange-500 transition-all uppercase"
                  placeholder="ADD TAG..."
                />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {formData.tags.map(tag => (
              <span key={tag} className="px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-full text-[9px] font-black uppercase tracking-widest text-orange-500 flex items-center gap-2">
                {tag}
                <button type="button" onClick={() => removeTag(tag)} className="hover:text-white transition-colors">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>

          <div className="pt-6 border-t border-zinc-900 flex justify-end gap-4">
            <button 
              type="button"
              onClick={onClose}
              className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors"
            >
              Abort Changes
            </button>
            <button 
              type="submit"
              className="bg-orange-500 hover:bg-orange-400 text-black px-8 py-4 rounded-2xl font-black tracking-widest uppercase text-xs flex items-center gap-2 shadow-xl shadow-orange-500/10 hover:scale-105 active:scale-95 transition-all"
            >
              <Save className="w-4 h-4" /> Commit Entity Updates
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
