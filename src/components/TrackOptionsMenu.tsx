import React, { useState, useRef, useEffect } from "react";
import { 
  MoreHorizontal, 
  Share2, 
  Sparkles, 
  Edit3, 
  Download, 
  Trash2,
  Lock,
  Video
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../lib/utils";
import { Track } from "../types";

interface TrackOptionsMenuProps {
  track: Track;
  onEdit: () => void;
  onShare: () => void;
  onDownload: () => void;
  onDelete: () => void;
  onCreatePromo: () => void;
  onCreateVideo: () => void;
  onAddToPlaylist?: (playlistId: string) => void;
  playlists?: { id: string, name: string }[];
  className?: string;
}

export default function TrackOptionsMenu({
  track,
  onEdit,
  onShare,
  onDownload,
  onDelete,
  onCreatePromo,
  onCreateVideo,
  onAddToPlaylist,
  playlists = [],
  className
}: TrackOptionsMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showVideoOption, setShowVideoOption] = useState(true); // Always show for this requirement
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleAction = (action: () => void) => {
    action();
    setIsOpen(false);
  };

  return (
    <div className={cn("relative inline-block text-left", className)} ref={menuRef}>
      <button
        type="button"
        onClick={toggleMenu}
        className={cn(
          "flex items-center justify-center w-10 h-10 rounded-full transition-colors",
          "text-zinc-400 hover:text-white hover:bg-zinc-800 focus:outline-none",
          isOpen && "bg-zinc-800 text-white"
        )}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span className="sr-only">Open options</span>
        <MoreHorizontal className="w-5 h-5" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className={cn(
              "absolute right-0 mt-2 w-64 origin-top-right z-50",
              "bg-black border border-zinc-800 rounded-lg shadow-2xl overflow-hidden shadow-orange-500/5"
            )}
          >
            <div className="py-2" role="menu" aria-orientation="vertical">
              {/* Distribution/Promotion Group */}
              <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                Distribution & Growth
              </div>
              
              <button
                type="button"
                onClick={() => handleAction(onShare)}
                className="group flex items-center w-full px-4 py-2.5 text-sm text-zinc-300 hover:text-orange-500 hover:bg-zinc-900 transition-colors"
                role="menuitem"
              >
                <Share2 className="mr-3 h-4 w-4 text-zinc-500 group-hover:text-orange-500 transition-colors" />
                <span className="flex-1 text-left">Share Track Link</span>
                <span className="text-[10px] text-zinc-600 group-hover:text-orange-500/50 font-mono">⌘S</span>
              </button>

              <button
                type="button"
                onClick={() => handleAction(onCreatePromo)}
                className="group flex items-center w-full px-4 py-2.5 text-sm text-zinc-300 hover:text-orange-500 hover:bg-zinc-900 transition-colors"
                role="menuitem"
              >
                <Sparkles className="mr-3 h-4 w-4 text-orange-500" />
                <span className="flex-1 text-left font-medium">Generate AI Promo Pack</span>
                <div className="px-1.5 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-[9px] text-orange-500 uppercase font-black tracking-tighter">AI</div>
              </button>

              <button
                type="button"
                onClick={() => handleAction(onCreateVideo)}
                className="group flex items-center w-full px-4 py-2.5 text-sm text-zinc-300 hover:text-white hover:bg-zinc-900 transition-colors"
                role="menuitem"
              >
                <Video className="mr-3 h-4 w-4 text-orange-500" />
                <span className="flex-1 text-left font-medium">Generate AI Video Clip</span>
                <div className="px-1.5 py-0.5 rounded-full bg-zinc-800 border border-zinc-700 text-[8px] text-zinc-400 uppercase font-black tracking-tighter">BETA</div>
              </button>

              <div className="my-1 border-t border-zinc-800/50" />

              {/* Collections Group */}
              {playlists.length > 0 && onAddToPlaylist && (
                <div className="bg-zinc-900/10">
                  <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                    Collections
                  </div>
                  <div className="max-h-32 overflow-y-auto">
                    {playlists.map(pl => (
                      <button
                        key={pl.id}
                        type="button"
                        onClick={() => handleAction(() => onAddToPlaylist(pl.id))}
                        className="group flex items-center w-full px-4 py-2 text-xs text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors text-left"
                        role="menuitem"
                      >
                        <Lock className="mr-3 h-3 w-3 text-zinc-600 group-hover:text-orange-500 transition-colors" />
                        <span className="truncate">{pl.name}</span>
                      </button>
                    ))}
                  </div>
                  <div className="my-1 border-t border-zinc-800/50" />
                </div>
              )}

              {/* Asset Management Group */}
              <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                Asset Management
              </div>

              <button
                type="button"
                onClick={() => handleAction(onEdit)}
                className="group flex items-center w-full px-4 py-2.5 text-sm text-zinc-300 hover:text-white hover:bg-zinc-900 transition-colors"
                role="menuitem"
              >
                <Edit3 className="mr-3 h-4 w-4 text-zinc-500 group-hover:text-white transition-colors" />
                <span className="flex-1 text-left">Edit Track Metadata</span>
                <span className="text-[10px] text-zinc-600 font-mono">E</span>
              </button>

              <button
                type="button"
                onClick={() => handleAction(onDownload)}
                className="group flex items-center w-full px-4 py-2.5 text-sm text-zinc-300 hover:text-white hover:bg-zinc-900 transition-colors"
                role="menuitem"
              >
                <Download className="mr-3 h-4 w-4 text-zinc-500 group-hover:text-white transition-colors" />
                <span className="flex-1 text-left">Download Master File</span>
                <span className="text-[10px] text-zinc-600 font-mono">D</span>
              </button>

              <div className="my-1 border-t border-zinc-800/50" />

              {/* Destructive Actions Group */}
              <button
                type="button"
                onClick={() => handleAction(onDelete)}
                className="group flex items-center w-full px-4 py-2.5 text-sm text-red-400/70 hover:text-red-500 hover:bg-red-500/5 transition-colors"
                role="menuitem"
              >
                <Trash2 className="mr-3 h-4 w-4 text-red-500/40 group-hover:text-red-500 transition-colors" />
                <span className="flex-1 text-left">Delete Track</span>
                <span className="text-[10px] text-red-900/40 group-hover:text-red-500/40 font-mono">DEL</span>
              </button>
            </div>
            
            {/* Status Indicator */}
            <div className={cn(
              "px-4 py-2 text-[10px] border-t border-zinc-800 bg-zinc-950 flex items-center justify-between",
              track.status === 'ready' ? "text-emerald-500/60" : "text-orange-500/60"
            )}>
              <div className="flex items-center">
                <div className={cn(
                  "w-1.5 h-1.5 rounded-full mr-2",
                  track.status === 'ready' ? "bg-emerald-500" : "bg-orange-500 animate-pulse"
                )} />
                <span className="uppercase tracking-widest">{track.status}</span>
              </div>
              {track.status === 'processing' && <Lock className="w-3 h-3 opacity-50" />}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
