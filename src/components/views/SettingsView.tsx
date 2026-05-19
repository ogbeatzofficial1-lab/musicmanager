import React from 'react';
import { Database, Trash2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Track, Client, Activity } from '../../types';

interface SettingsViewProps {
  isSupabaseConfigured: boolean;
  setShowDbGuide: (s: boolean) => void;
  tracks: Track[];
  clients: Client[];
  activities: Activity[];
  clearLocalCache: () => void;
}

export default function SettingsView({
  isSupabaseConfigured,
  setShowDbGuide,
  tracks,
  clients,
  activities,
  clearLocalCache
}: SettingsViewProps) {
  return (
    <div id="settings-view" className="p-8 space-y-12 max-w-4xl">
      <div>
        <h1 className="text-4xl font-black tracking-tighter uppercase italic bg-gradient-to-r from-white to-zinc-500 bg-clip-text text-transparent">System Control</h1>
        <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em] mt-1">Infrastructure calibration and security protocol management.</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-zinc-950 border border-zinc-900 p-8 rounded-[2.5rem] space-y-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-500/10 rounded-2xl flex items-center justify-center border border-orange-500/20">
              <Database className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <h3 className="text-lg font-black uppercase italic tracking-tighter">Instance Protocol</h3>
              <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Repository persistence status</p>
            </div>
          </div>

          <div className="space-y-4">
             <div className="flex items-center justify-between p-4 bg-zinc-900/50 rounded-2xl border border-zinc-800">
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Connection State</span>
                <span className={cn("text-[10px] font-black uppercase tracking-widest", isSupabaseConfigured ? "text-emerald-500" : "text-orange-500")}>
                   {isSupabaseConfigured ? "ESTABLISHED" : "OFFLINE / LOCAL"}
                </span>
             </div>
             {!isSupabaseConfigured && (
               <button 
                 onClick={() => setShowDbGuide(true)}
                 className="w-full py-4 bg-orange-500 text-black text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-orange-400 transition-all shadow-[0_0_40px_rgba(249,115,22,0.1)]"
               >
                  Establish Cloud Connection
               </button>
             )}
          </div>
        </div>

        <div className="bg-zinc-950 border border-red-900/30 p-8 rounded-[2.5rem] space-y-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-500/10 rounded-2xl flex items-center justify-center border border-red-500/20">
              <Trash2 className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <h3 className="text-lg font-black uppercase italic tracking-tighter">Cold Reset</h3>
              <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Purge local browser cache</p>
            </div>
          </div>

          <div className="space-y-4">
             <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600 italic">Clear local state if legacy mock data persists after connecting Supabase.</p>
             <button 
               onClick={() => {
                 if(confirm("Confirm hard reset? This will wipe all local data and reload the application.")) {
                    clearLocalCache();
                 }
               }}
               className="w-full py-4 bg-red-500/10 text-red-500 border border-red-500/20 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-red-500 hover:text-white transition-all"
             >
                PURGE LOCAL TRANSACTIONS
             </button>
          </div>
        </div>
      </div>

      <div className="bg-zinc-950 border border-zinc-900 p-8 rounded-[2.5rem] space-y-6">
         <h3 className="text-sm font-black uppercase tracking-widest text-zinc-400">Environment Metadata</h3>
         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Master Assets', value: tracks.length },
              { label: 'Authorized Partners', value: clients.length },
              { label: 'Total Sync Events', value: activities.length },
              { label: 'Cloud Node', value: isSupabaseConfigured ? 'CONNECTED' : 'DISCONNECTED' },
            ].map(stat => (
              <div key={stat.label} className="p-6 bg-zinc-900/50 rounded-3xl border border-zinc-800 text-center space-y-1">
                 <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">{stat.label}</p>
                 <p className="text-lg font-black italic">{stat.value}</p>
              </div>
            ))}
         </div>
      </div>
    </div>
  );
}
