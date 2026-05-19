import React from 'react';
import { Activity as ActivityIcon } from 'lucide-react';
import { Activity } from '../../types';
import { cn } from '../../lib/utils';

interface ActivityViewProps {
  activities: Activity[];
  getActivityIcon: (type: string) => any;
  getActivityVerb: (type: string) => string;
  getActivityLabel: (act: any) => string;
}

export default function ActivityView({
  activities,
  getActivityIcon,
  getActivityVerb,
  getActivityLabel
}: ActivityViewProps) {
  return (
    <div id="activity-view" className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tighter uppercase italic">Audit Trail</h1>
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Full transparency on master interactions and distribution.</p>
        </div>
        <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-lg shadow-emerald-500/50" />
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 italic">Live Stream Enabled</span>
        </div>
      </div>

      {activities.length > 0 ? (
        <div className="bg-zinc-950 border border-zinc-900 rounded-[3rem] overflow-hidden shadow-2xl">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-zinc-900 bg-zinc-900/20">
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.25em] text-zinc-600">Event Transaction</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.25em] text-zinc-600">Asset Identity</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.25em] text-zinc-600">Entity / Authority</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.25em] text-zinc-600">Temporal Stamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900/50">
              {activities.slice().sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).map((act) => {
                const { Icon, color, bg } = getActivityIcon(act.type);
                return (
                  <tr key={act.id} className="hover:bg-zinc-900/40 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className={cn("w-10 h-10 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110", bg)}>
                          <Icon className={cn("w-5 h-5", color)} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-zinc-400">
                             {getActivityVerb(act.type)}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-sm font-black italic uppercase text-zinc-300 truncate max-w-[300px]">
                        {getActivityLabel(act)}
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-[10px] font-black uppercase tracking-widest text-orange-500 bg-orange-500/5 px-3 py-1 rounded-full border border-orange-500/10">
                        {act.user || 'System'}
                      </span>
                    </td>
                    <td className="px-8 py-6 font-mono text-[10px] text-zinc-600">
                      {new Date(act.timestamp).toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="py-40 text-center bg-zinc-950 border border-zinc-900 rounded-[3rem] opacity-30">
          <ActivityIcon className="w-12 h-12 mx-auto mb-4 text-zinc-800" />
          <p className="text-[10px] font-black uppercase tracking-[0.25em]">No synchronization logs recovered.</p>
        </div>
      )}
    </div>
  );
}
