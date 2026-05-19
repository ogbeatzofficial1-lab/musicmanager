import React, { useState, useRef } from 'react';
import { X, User, Mail, Building, Plus, Image as ImageIcon } from 'lucide-react';
import { motion } from 'motion/react';
import { useMediaStore } from '../context/MediaStoreContext';

interface AddClientModalProps {
  onClose: () => void;
}

export default function AddClientModal({ onClose }: AddClientModalProps) {
  const { addClient } = useMediaStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    avatar_url: null as string | null,
    tags: [] as string[]
  });
  const [currentTag, setCurrentTag] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);

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
    if (!formData.email) return;
    await addClient(formData);
    onClose();
  };

  const addTag = () => {
    if (currentTag && !formData.tags.includes(currentTag)) {
      setFormData({ ...formData, tags: [...formData.tags, currentTag] });
      setCurrentTag('');
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-md" 
      />
      
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative w-full max-w-xl bg-zinc-950 border border-zinc-900 rounded-[3rem] shadow-2xl overflow-hidden"
      >
        <div className="p-8 border-b border-zinc-900 bg-zinc-900/20">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-black tracking-tighter uppercase italic">Onboard Contact</h2>
              <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.25em] mt-1">Initialize industry identity and relational mapping.</p>
            </div>
            <button 
              onClick={onClose}
              className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 hover:text-white transition-all shadow-xl"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Avatar Upload */}
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
                   <span className="text-[7px] font-black uppercase tracking-widest text-white">Avatar</span>
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
                <User className="w-3 h-3 text-orange-500" /> Full Name
              </label>
              <input 
                type="text"
                placeholder="Leave blank to auto-derive"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-black border border-zinc-900 rounded-2xl px-4 py-3 focus:outline-none focus:border-orange-500 transition-all font-bold"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1 flex items-center gap-2">
                <Mail className="w-3 h-3 text-orange-500" /> Business Email
              </label>
              <input 
                type="email"
                required
                placeholder="e.g., label@contact.com"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-black border border-zinc-900 rounded-2xl px-4 py-3 focus:outline-none focus:border-orange-500 transition-all font-bold"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1 flex items-center gap-2">
              <Building className="w-3 h-3 text-orange-500" /> Organization / Label
            </label>
            <input 
              type="text"
              placeholder="e.g., Universal Music Group"
              value={formData.company}
              onChange={e => setFormData({ ...formData, company: e.target.value })}
              className="w-full bg-black border border-zinc-900 rounded-2xl px-4 py-3 focus:outline-none focus:border-orange-500 transition-all font-bold"
            />
          </div>

          <div className="space-y-4">
             <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Industry Tags</label>
             <div className="flex gap-2">
                <input 
                  type="text"
                  placeholder="A&R, Manager, Lawyer..."
                  value={currentTag}
                  onChange={e => setCurrentTag(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  className="flex-1 bg-black border border-zinc-900 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500 transition-all text-xs font-bold"
                />
                <button 
                  type="button"
                  onClick={addTag}
                  className="w-12 h-12 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center text-orange-500 hover:bg-orange-500 hover:text-black transition-all shadow-lg"
                >
                  <Plus className="w-5 h-5" />
                </button>
             </div>
             <div className="flex flex-wrap gap-2">
                {formData.tags.map(tag => (
                  <span 
                    key={tag} 
                    className="px-3 py-1.5 bg-zinc-900/50 border border-zinc-800 rounded-full text-[9px] font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2"
                  >
                    {tag}
                    <button 
                      onClick={() => setFormData({ ...formData, tags: formData.tags.filter(t => t !== tag) })}
                      className="hover:text-rose-500 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
             </div>
          </div>

          <div className="pt-6 flex gap-4">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 px-8 py-4 bg-zinc-900 text-zinc-400 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors border border-zinc-800"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="flex-1 px-8 py-4 bg-orange-500 text-black rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] transition-all shadow-xl shadow-orange-500/20"
            >
              Initialize Profile
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
