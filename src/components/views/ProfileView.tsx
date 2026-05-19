import React from 'react';
import { Plus, Mail, Zap } from 'lucide-react';
import { UserProfile } from '../../types';

interface ProfileViewProps {
  profile: UserProfile | null;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
}

export default function ProfileView({
  profile,
  updateProfile
}: ProfileViewProps) {
  if (!profile) return null;

  return (
    <div id="profile-view" className="p-8 space-y-12 max-w-4xl">
      <div className="flex items-end gap-8">
        <div className="relative group">
          <div className="w-32 h-32 rounded-[2.5rem] overflow-hidden border-2 border-orange-500/20 group-hover:border-orange-500 transition-colors">
            <img src={profile.avatar_url} className="w-full h-full object-cover" />
          </div>
          <button className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl bg-orange-500 text-black flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <div className="pb-2">
          <h1 className="text-4xl font-black tracking-tighter uppercase italic">{profile.artist_name}</h1>
          <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px] bg-zinc-900 px-3 py-1 rounded-full inline-block mt-2">Master Engineer & Producer</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-8">
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500">Artist Bio</h3>
            <textarea 
              value={profile.bio}
              onChange={(e) => updateProfile({ bio: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-900 rounded-3xl p-6 text-sm font-medium leading-relaxed outline-none focus:border-orange-500/50 transition-colors h-40 resize-none"
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500">Contact Integration</h3>
            <div className="space-y-3">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                <input 
                  value={profile.email}
                  onChange={(e) => updateProfile({ email: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-900 rounded-2xl py-3 pl-12 pr-4 text-sm font-bold outline-none focus:border-orange-500/50 transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500">Network Presence</h3>
            <div className="bg-zinc-950 border border-zinc-900 rounded-[2.5rem] p-8 space-y-6">
              {[
                { label: 'Instagram', value: profile.social_links.instagram, key: 'instagram' },
                { label: 'Spotify', value: profile.social_links.spotify, key: 'spotify' },
                { label: 'SoundCloud', value: profile.social_links.soundcloud, key: 'soundcloud' },
              ].map((link) => (
                <div key={link.label} className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 ml-1">{link.label}</label>
                  <input 
                    value={link.value || ''}
                    onChange={(e) => updateProfile({ 
                      social_links: { ...profile.social_links, [link.key]: e.target.value } 
                    })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs font-bold outline-none focus:border-orange-500/50 transition-all"
                    placeholder={`Enter ${link.label} handle...`}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="p-8 bg-zinc-900 border border-zinc-800 rounded-[2.5rem] flex items-center gap-6">
             <div className="w-16 h-16 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                <Zap className="w-8 h-8 text-orange-500" />
             </div>
             <div>
                <h3 className="text-xl font-black uppercase tracking-tight italic">Elite Producer Account</h3>
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mt-1">Authorized access to OGBeatz Proprietary Hub</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
