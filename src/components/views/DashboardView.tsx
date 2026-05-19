import React from 'react';
import { motion } from 'motion/react';
import { Mail, MessageSquare, Edit3, Trash2, Users, Music, Activity as ActivityIcon, Play, Zap, Database } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Track, Client, Activity, UserProfile } from '../../types';
import { cn } from '../../lib/utils';
import { useAudio } from '../../context/AudioContext';

interface DashboardViewProps {
  stats: any;
  chartData: any[];
  activities: Activity[];
  tracks: Track[];
  clients: Client[];
  isSupabaseConfigured: boolean;
  connectionError: string | null;
  setActiveView: (view: any) => void;
  setSelectedMessageClientId: (id: string) => void;
  setEditingClient: (c: Client) => void;
  deleteClient: (id: string) => void;
  setSelectedClient: (c: Client) => void;
  handleImportClients: (e: any) => void;
  getActivityIcon: (type: string) => any;
  getActivityVerb: (type: string) => string;
  getActivityLabel: (act: any) => string;
}

export default function DashboardView({
  stats,
  chartData,
  activities,
  tracks,
  clients,
  isSupabaseConfigured,
  connectionError,
  setActiveView,
  setSelectedMessageClientId,
  setEditingClient,
  deleteClient,
  setSelectedClient,
  handleImportClients,
  getActivityIcon,
  getActivityVerb,
  getActivityLabel
}: DashboardViewProps) {
  const { playTrack } = useAudio();

  return (
    <div id="dashboard-view" className="p-8 space-y-12">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div>
           <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">Node Active: Production Repository</span>
           </div>
           <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic leading-none">
             Command <span className="text-zinc-800">Center</span>
           </h1>
        </div>
        
        <div className="flex items-center gap-4 bg-zinc-950 p-2 rounded-[2rem] border border-zinc-900">
           <div className="px-6 py-3 bg-zinc-900 rounded-3xl border border-zinc-800 flex items-center gap-3">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Yield Optimize</span>
           </div>
        </div>
      </header>

      {/* Stats Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Object.entries(stats).map(([key, val]: [string, any], idx) => (
          <motion.div 
            key={key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="group relative bg-zinc-950 border border-zinc-900 p-8 rounded-[2.5rem] overflow-hidden hover:border-zinc-700 transition-all shadow-2xl"
          >
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
               <TrendingUp className="w-20 h-20" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 mb-4">{key.replace(/([A-Z])/g, ' $1')}</p>
            <div className="flex items-end gap-3 leading-none">
              <h3 className="text-4xl font-black tracking-tighter italic uppercase">{val}</h3>
              {key === 'activityTrend' && <span className="text-[10px] font-bold text-emerald-500 pb-1 mb-1">UP</span>}
            </div>
            <div className="mt-6 flex items-center gap-2">
               <div className="h-1 flex-1 bg-zinc-900 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-500 w-[60%] rounded-full shadow-[0_0_10px_rgba(249,115,22,0.5)]" />
               </div>
               <span className="text-[8px] font-black text-zinc-700">60%</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Engagement Analytics */}
        <div className="lg:col-span-2 bg-zinc-950 border border-zinc-900 rounded-[3rem] p-8 md:p-10 shadow-2xl">
          <div className="flex items-center justify-between mb-12">
            <div>
               <h2 className="text-2xl font-black tracking-tighter uppercase italic">Engagement Velocity</h2>
               <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mt-1">Real-time interaction mapping across distribution endpoints.</p>
            </div>
            <div className="flex gap-4">
               <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-orange-500" />
                  <span className="text-[8px] font-black uppercase tracking-widest text-zinc-500">Impressions</span>
               </div>
               <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-zinc-800" />
                  <span className="text-[8px] font-black uppercase tracking-widest text-zinc-500">Retainment</span>
               </div>
            </div>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPlays" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#18181b" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#52525b', fontSize: 10, fontWeight: 900 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#52525b', fontSize: 10, fontWeight: 900 }}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#09090b', border: '1px solid #18181b', borderRadius: '12px' }}
                  itemStyle={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase' }}
                  labelStyle={{ display: 'none' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="plays" 
                  stroke="#f97316" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorPlays)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Recent Activity */}
        <div className="bg-zinc-950 border border-zinc-900 rounded-[2.5rem] p-8 flex flex-col">
          <h2 className="text-xl font-black tracking-tight uppercase mb-8">Pulse Feed</h2>
          <div className="space-y-6 flex-1 overflow-y-auto max-h-[350px] pr-2 scrollbar-hide">
             {activities.slice().sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 8).map((act) => {
               const { Icon, color, bg } = getActivityIcon(act.type);
               return (
                 <div key={act.id} className="flex gap-4 items-start group">
                   <div className={cn("w-10 h-10 rounded-2xl flex items-center justify-center border border-white/5 shadow-xl shrink-0 transition-transform group-hover:scale-110", bg)}>
                     <Icon className={cn("w-5 h-5", color)} />
                   </div>
                   <div className="flex flex-col min-w-0">
                      <p className="text-[11px] leading-tight flex flex-wrap items-center">
                        <span className="font-black text-white">{act.user || 'System'}</span>
                        <span className="text-zinc-500 mx-1.5">{getActivityVerb(act.type)}</span>
                        <span className="font-black text-orange-500 hover:underline cursor-pointer truncate">
                          {getActivityLabel(act)}
                        </span>
                      </p>
                      <span className="text-[8px] font-black text-zinc-700 uppercase tracking-widest mt-1.5">
                        {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                   </div>
                 </div>
               );
             })}
             {activities.length === 0 && (
               <div className="py-20 flex flex-col items-center justify-center text-center opacity-40">
                  <ActivityIcon className="w-12 h-12 mb-4" />
                  <p className="text-xs font-black uppercase tracking-widest">No recent transaction logs</p>
               </div>
             )}
          </div>
          <button onClick={() => setActiveView('activity')} className="w-full mt-8 pt-6 border-t border-zinc-900 text-center text-[10px] font-black uppercase tracking-widest text-zinc-600 hover:text-white transition-colors">
            Full Audit Path
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-zinc-950 border border-zinc-900 rounded-[2.5rem] p-8 overflow-hidden">
           <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-black uppercase tracking-tight">Top Performance</h3>
              <button onClick={() => setActiveView('tracks')} className="text-[10px] font-black uppercase tracking-widest text-orange-500">View Library</button>
           </div>
           <div className="space-y-4">
              {tracks.slice(0, 4).map(track => (
                <div key={track.id} className="flex items-center justify-between p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800 group hover:bg-zinc-900 transition-all">
                  <div className="flex items-center gap-4 min-w-0">
                     <div className="w-10 h-10 rounded-xl overflow-hidden border border-zinc-800">
                        <img src={track.image_url!} className="w-full h-full object-cover" />
                     </div>
                     <div className="min-w-0">
                        <p className="text-xs font-black uppercase truncate">{track.name}</p>
                        <p className="text-[10px] text-zinc-500 font-medium">{track.artist}</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-6">
                     <div className="flex flex-col items-end">
                        <span className="text-[10px] font-black">{track.plays}</span>
                        <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Plays</span>
                     </div>
                     <button 
                       onClick={() => playTrack(track, tracks)}
                       className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                     >
                        <Play className="w-4 h-4 fill-current ml-0.5" />
                     </button>
                  </div>
                </div>
              ))}
           </div>
        </div>

        <div className="bg-zinc-950 border border-zinc-900 rounded-[2.5rem] p-8 overflow-hidden">
           <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-black uppercase tracking-tight">System Status</h3>
              <div className="flex items-center gap-2">
                 <div className={cn("w-2 h-2 rounded-full", isSupabaseConfigured ? (connectionError ? "bg-amber-500" : "bg-emerald-500 animate-pulse") : "bg-orange-500")} />
                 <span className={cn("text-[10px] font-black uppercase tracking-widest", isSupabaseConfigured ? (connectionError ? "text-amber-500" : "text-emerald-500") : "text-orange-500")}>
                   {isSupabaseConfigured ? (connectionError ? "Sync Alert" : "Cloud Sync Active") : "Local Protocol Only"}
                 </span>
              </div>
           </div>
           {connectionError && (
              <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl">
                <p className="text-[10px] font-black uppercase tracking-widest text-amber-500 flex items-center gap-2">
                  <Zap className="w-3 h-3" /> Initialization Warning
                </p>
                <p className="text-[11px] font-medium text-amber-500/80 mt-1 leading-relaxed">{connectionError}</p>
              </div>
           )}
           <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Repository', value: isSupabaseConfigured ? 'Supabase' : 'Browser', status: 'optimal' },
                { label: 'Object Storage', value: tracks.length > 0 ? 'Integrated' : 'Ready', status: 'optimal' },
                { label: 'API Gateway', value: 'V3.1.2', status: 'optimal' },
                { label: 'Latency Node', value: 'Edge-US', status: 'optimal' },
              ].map(item => (
                <div key={item.label} className="p-6 rounded-3xl bg-zinc-900/50 border border-zinc-800 flex flex-col items-center text-center space-y-2">
                   <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">{item.label}</span>
                   <span className="text-sm font-black uppercase italic tracking-tighter">{item.value}</span>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
}

// Internal icons needed for DashboardView
const TrendingUp = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
);
