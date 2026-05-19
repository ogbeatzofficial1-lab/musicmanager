import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Disc, 
  Users, 
  Share2, 
  ListMusic, 
  Activity as ActivityIcon,
  Settings,
  Menu,
  ChevronRight,
  MessageSquare,
  Video
} from 'lucide-react';
import { cn } from '../lib/utils';

interface ShellProps {
  children: React.ReactNode;
  activeView: string;
  onViewChange: (view: any) => void;
}

export default function Shell({ children, activeView, onViewChange }: ShellProps) {
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'tracks', label: 'Tracks', icon: Disc },
    { id: 'playlists', label: 'Playlists', icon: ListMusic },
    { id: 'clients', label: 'Clients', icon: Users },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'videos', label: 'Promo Archive', icon: Video },
    { id: 'sharing', label: 'Sharing', icon: Share2 },
    { id: 'activity', label: 'Activity', icon: ActivityIcon },
  ];

  return (
    <div className="flex h-screen bg-black text-white font-sans overflow-hidden">
      {/* Sidebar */}
      <aside 
        className={cn(
          "bg-zinc-950 border-r border-zinc-900 transition-all duration-300 flex flex-col",
          collapsed ? "w-20" : "w-64"
        )}
      >
        <div className="p-6 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            {!collapsed && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden border border-orange-500 bg-zinc-900 flex items-center justify-center">
                  <img src="/favicon.svg" className="w-7 h-7 object-contain" alt="OG BEATZ" />
                </div>
                <div className="flex flex-col">
                  <h1 className="text-sm font-black tracking-tighter leading-none">OGBEATZ</h1>
                  <span className="text-[10px] font-black text-orange-500 tracking-[0.2em]">HUB</span>
                </div>
              </div>
            )}
            <button 
              onClick={() => setCollapsed(!collapsed)}
              className="p-2 hover:bg-zinc-900 rounded-lg text-zinc-500 hover:text-white transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>

        <nav className="flex-1 px-3 space-y-1 mt-4">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group",
                activeView === item.id 
                  ? "bg-orange-500 text-black font-bold shadow-lg shadow-orange-500/10" 
                  : "text-zinc-500 hover:text-white hover:bg-zinc-900"
              )}
            >
              <item.icon className={cn("w-5 h-5 shrink-0 transition-transform group-hover:scale-110", activeView === item.id ? "text-black" : "text-zinc-600 group-hover:text-orange-500")} />
              {!collapsed && <span className="truncate">{item.label}</span>}
              {!collapsed && activeView === item.id && <ChevronRight className="ml-auto w-4 h-4 opacity-50" />}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-zinc-900 space-y-4">
           <button 
             onClick={() => onViewChange('settings')}
             className={cn(
               "w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all group",
               activeView === 'settings' ? "bg-zinc-800 text-white" : "text-zinc-500 hover:text-white hover:bg-zinc-900"
             )}
           >
             <Settings className={cn("w-5 h-5 transition-transform group-hover:rotate-90", activeView === 'settings' ? "text-orange-500" : "text-zinc-600")} />
             {!collapsed && <span className="text-sm font-medium">Settings</span>}
           </button>

           {!collapsed && (
             <div className="bg-zinc-900/50 p-3 rounded-2xl border border-zinc-800 flex items-center gap-3">
               <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-xs font-black text-black shrink-0">
                 OB
               </div>
               <div className="flex flex-col min-w-0">
                 <span className="text-xs font-bold truncate">OGBeatz Admin</span>
                 <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider truncate">PRO PRODUCER</span>
               </div>
             </div>
           )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-32">
        {children}
      </main>
    </div>
  );
}
