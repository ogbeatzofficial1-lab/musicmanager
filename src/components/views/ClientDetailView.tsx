import React from 'react';
import { ChevronLeft, Mail, Users, ThumbsUp, ThumbsDown, MessageSquare, Play, Download, AlertCircle, Paperclip, Send, X, Lock, Share2 } from 'lucide-react';
import { Client, Activity, Message, Track, Playlist, ShareLink } from '../../types';
import { cn } from '../../lib/utils';

interface ClientDetailViewProps {
  selectedClient: Client | null;
  setActiveView: (view: any) => void;
  activities: Activity[];
  messages: Message[];
  tracks: Track[];
  playlists: Playlist[];
  shareLinks: ShareLink[];
  clientMessageDraft: string;
  setClientMessageDraft: (s: string) => void;
  chatAttachment: string | null;
  setChatAttachment: (s: string | null) => void;
  sendMessage: (clientId: string, content: string, attachment?: string | null) => Promise<void>;
  handleChatImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  chatImageInputRef: React.RefObject<HTMLInputElement>;
  zipInputRef: React.RefObject<HTMLInputElement>;
  handleSendZip: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function ClientDetailView({
  selectedClient,
  setActiveView,
  activities,
  messages,
  tracks,
  playlists,
  shareLinks,
  clientMessageDraft,
  setClientMessageDraft,
  chatAttachment,
  setChatAttachment,
  sendMessage,
  handleChatImageUpload,
  chatImageInputRef,
  zipInputRef,
  handleSendZip
}: ClientDetailViewProps) {
  if (!selectedClient) return null;

  const clientActivities = activities.filter(a => a.client_id === selectedClient.id);
  const clientMessages = messages.filter(m => m.client_id === selectedClient.id);
  
  const feedbackCounts = {
      likes: clientActivities.filter(a => a.type === 'like').length,
      dislikes: clientActivities.filter(a => a.type === 'comment' && a.details?.toLowerCase().includes('dislike')).length,
      comments: clientActivities.filter(a => a.type === 'comment').length
  };

  const handleSendMessageInternal = async () => {
      if (!clientMessageDraft.trim() && !chatAttachment) return;
      await sendMessage(selectedClient.id, clientMessageDraft, chatAttachment);
      setClientMessageDraft('');
      setChatAttachment(null);
  };

  return (
    <div id="client-detail-view" className="p-8 space-y-12">
      <div className="flex items-center gap-4 text-zinc-500 mb-4">
        <button 
          onClick={() => setActiveView('clients')}
          className="flex items-center gap-2 hover:text-white transition-colors text-xs font-black uppercase tracking-widest"
        >
          <ChevronLeft className="w-4 h-4" /> Network Directory
        </button>
      </div>

      <div className="flex items-start justify-between">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-[2.5rem] bg-zinc-950 border border-orange-500/20 flex items-center justify-center text-4xl font-black text-orange-500 italic shadow-2xl relative overflow-hidden">
            {selectedClient.avatar_url ? (
                <img src={selectedClient.avatar_url} className="w-full h-full object-cover" />
            ) : (
                selectedClient.name[0]
            )}
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-zinc-950 border-4 border-black flex items-center justify-center">
               <div className={`w-2 h-2 rounded-full ${selectedClient.status === 'online' ? 'bg-emerald-500' : 'bg-zinc-700'}`} />
            </div>
          </div>
          <div>
            <h1 className="text-5xl font-black tracking-tighter uppercase italic">{selectedClient.name}</h1>
            <div className="flex items-center gap-4 mt-3">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 flex items-center gap-2">
                 <Mail className="w-3 h-3 text-orange-500" /> {selectedClient.email}
              </span>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 flex items-center gap-2">
                 <Users className="w-3 h-3 text-orange-500" /> Authorized Partner
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-4">
           <div className="grid grid-cols-3 gap-3 mr-6">
              {[
                  { label: 'Likes', icon: ThumbsUp, color: 'text-emerald-500', value: feedbackCounts.likes },
                  { label: 'Dislikes', icon: ThumbsDown, color: 'text-rose-500', value: feedbackCounts.dislikes },
                  { label: 'Feedback', icon: MessageSquare, color: 'text-orange-500', value: feedbackCounts.comments },
              ].map(stat => (
                  <div key={stat.label} className="bg-zinc-950 border border-zinc-900 rounded-2xl p-3 text-center min-w-[80px]">
                      <stat.icon className={cn("w-4 h-4 mx-auto mb-1", stat.color)} />
                      <p className="text-xl font-black">{stat.value}</p>
                      <p className="text-[8px] font-black uppercase tracking-widest text-zinc-500">{stat.label}</p>
                  </div>
              ))}
           </div>
           <div className="flex gap-3">
              <button 
                  onClick={() => {
                     const url = `${window.location.origin}/?client_portal=${selectedClient.id}`;
                     window.open(url, '_blank');
                  }}
                  className="border border-zinc-800 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-orange-500 hover:text-orange-500 transition-colors"
              >
                  View Portal
              </button>
              <button 
                  onClick={() => zipInputRef.current?.click()}
                  className="bg-orange-500 text-black px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-transform shadow-xl shadow-orange-500/20"
              >
                  Ship Masters
              </button>
              <input 
                  type="file" 
                  ref={zipInputRef} 
                  onChange={handleSendZip} 
                  accept=".zip" 
                  className="hidden" 
              />
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          <div className="space-y-6">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500">Activity Timeline</h3>
            <div className="bg-zinc-950 border border-zinc-900 rounded-[3rem] overflow-hidden p-8">
              <div className="max-h-[400px] overflow-y-auto pr-4 scrollbar-hide relative">
                  {clientActivities.length > 0 ? (
                      <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-zinc-800 before:to-transparent">
                          {clientActivities.map((act, index) => (
                              <div key={act.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-zinc-950 bg-zinc-900 text-orange-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 transition-transform group-hover:scale-110">
                                      {act.type === 'play' && <Play className="w-4 h-4 fill-current" />}
                                      {act.type === 'like' && <ThumbsUp className="w-4 h-4" />}
                                      {act.type === 'download' && <Download className="w-4 h-4" />}
                                      {act.type === 'social' && <MessageSquare className="w-4 h-4" />}
                                      {!['play', 'like', 'download', 'social'].includes(act.type) && <div className="w-2 h-2 rounded-full bg-orange-500" />}
                                  </div>
                                  
                                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-2xl border border-zinc-900 bg-zinc-950/50 hover:bg-zinc-900/50 transition-colors shadow-xl group-hover:border-zinc-800">
                                      <div className="flex flex-col space-y-2">
                                          <div className="flex items-center justify-between">
                                              <span className="text-sm font-bold text-white">{act.action}</span>
                                              <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">{new Date(act.timestamp).toLocaleDateString()}</span>
                                          </div>
                                          <span className="text-xs italic font-black uppercase text-zinc-500 truncate">{act.target || 'System Port'}</span>
                                          {act.details && (
                                              <p className="text-xs text-zinc-400 mt-2">{act.details}</p>
                                          )}
                                      </div>
                                  </div>
                              </div>
                          ))}
                      </div>
                  ) : (
                      <div className="flex flex-col items-center justify-center py-20 text-center">
                          <div className="w-16 h-16 rounded-3xl bg-zinc-900 flex items-center justify-center text-zinc-700 mb-4">
                              <AlertCircle className="w-6 h-6" />
                          </div>
                          <p className="text-zinc-600 text-[10px] font-black uppercase tracking-widest">
                              No historical logs found for this entity.
                          </p>
                      </div>
                  )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
              <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500">Communication Terminal</h3>
                  <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600 italic">Live Stream Enabled</span>
                  </div>
              </div>
              <div className="bg-zinc-950 border border-zinc-900 rounded-[3rem] p-8 flex flex-col h-[500px]">
                  <div className="flex-1 overflow-y-auto space-y-6 pr-4 mb-8 scrollbar-hide">
                      {clientMessages.length > 0 ? clientMessages.map(msg => (
                          <div key={msg.id} className={cn(
                              "max-w-[80%] p-5 rounded-3xl text-sm leading-relaxed",
                              msg.direction === 'outbound' 
                                  ? "bg-orange-500 text-black font-bold self-end rounded-br-none ml-auto" 
                                  : "bg-zinc-900 text-zinc-300 font-medium self-start rounded-bl-none"
                          )}>
                              {msg.image_url && (
                                  <div className="mb-3 rounded-2xl overflow-hidden border border-black/10">
                                      <img src={msg.image_url} alt="Attachment" className="max-w-full h-auto" />
                                  </div>
                              )}
                              {msg.content}
                              <div className={cn(
                                  "mt-2 text-[8px] font-black uppercase tracking-widest",
                                  msg.direction === 'outbound' ? "text-black/40" : "text-zinc-600"
                              )}>
                                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </div>
                          </div>
                      )) : (
                          <div className="h-full flex flex-col items-center justify-center text-center">
                              <MessageSquare className="w-12 h-12 text-zinc-900 mb-4" />
                              <p className="text-zinc-600 text-[10px] font-black uppercase tracking-widest">Initialization successful. Awaiting first transmission.</p>
                          </div>
                      )}
                  </div>
                  <div className="relative">
                      {chatAttachment && (
                          <div className="absolute bottom-full left-0 mb-4 p-2 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center gap-3">
                              <div className="w-12 h-12 rounded-xl overflow-hidden bg-black border border-zinc-800">
                                  <img src={chatAttachment} className="w-full h-full object-cover" />
                              </div>
                              <button 
                                  onClick={() => setChatAttachment(null)}
                                  className="p-1 hover:text-rose-500 transition-colors"
                              >
                                  <X className="w-4 h-4" />
                              </button>
                          </div>
                      )}
                      <textarea 
                          value={clientMessageDraft}
                          onChange={(e) => setClientMessageDraft(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSendMessageInternal())}
                          placeholder="Draft production update..."
                          className="w-full bg-black border border-zinc-900 rounded-2xl p-5 pr-16 text-sm font-medium outline-none focus:border-orange-500 focus:shadow-xl focus:shadow-orange-500/5 transition-all resize-none h-24"
                      />
                      <div className="absolute right-4 bottom-4 flex gap-2">
                          <button 
                              onClick={() => chatImageInputRef.current?.click()}
                              className="p-3 text-zinc-600 hover:text-white transition-colors"
                          >
                              <Paperclip className="w-5 h-5" />
                          </button>
                          <input 
                              type="file"
                              ref={chatImageInputRef}
                              onChange={handleChatImageUpload}
                              accept="image/*"
                              className="hidden"
                          />
                          <button 
                              onClick={handleSendMessageInternal}
                              className="p-3 bg-orange-500 rounded-xl text-black shadow-lg shadow-orange-500/20 hover:scale-110 active:scale-95 transition-all"
                          >
                              <Send className="w-5 h-5" />
                          </button>
                      </div>
                  </div>
              </div>
          </div>
        </div>

        <div className="space-y-12">
           <div className="space-y-6">
               <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500">Intelligence Briefing</h3>
               <div className="p-8 bg-zinc-950 border border-zinc-900 rounded-[3rem] space-y-8">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Primary Hub</label>
                    <p className="text-lg font-black uppercase italic tracking-tight">{selectedClient.company || 'Private Agent'}</p>
                 </div>
                 
                 <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Assigned Tags</label>
                    <div className="flex flex-wrap gap-2">
                      {selectedClient.tags.length > 0 ? selectedClient.tags.map(tag => (
                          <span key={tag} className="px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-full text-[9px] font-black uppercase tracking-widest text-orange-500">{tag}</span>
                      )) : <span className="text-zinc-700 italic text-xs">No tags allocated</span>}
                    </div>
                 </div>

                 <div className="pt-8 border-t border-zinc-900">
                    <div className="flex justify-between items-end mb-3">
                      <div className="space-y-1">
                          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Relational Strength</p>
                          <p className="text-2xl font-black italic">ELITE</p>
                      </div>
                      <span className="text-3xl font-black italic text-orange-500">92%</span>
                    </div>
                    <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden p-0.5 border border-zinc-800">
                      <div className="h-full bg-orange-500 rounded-full w-[92%] shadow-lg shadow-orange-500/50" />
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-zinc-900/50 border border-zinc-900 rounded-2xl">
                       <p className="text-[8px] font-black uppercase text-zinc-600 tracking-widest mb-1">Downloads</p>
                       <p className="text-lg font-black">{clientActivities.filter(a => a.type === 'download').length}</p>
                    </div>
                    <div className="p-4 bg-zinc-900/50 border border-zinc-900 rounded-2xl">
                       <p className="text-[8px] font-black uppercase text-zinc-600 tracking-widest mb-1">Streams</p>
                       <p className="text-lg font-black">{clientActivities.filter(a => a.type === 'play').length}</p>
                    </div>
                 </div>
              </div>
           </div>

           <div className="space-y-6">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500">Active Access Nodes</h3>
              <div className="bg-zinc-950 border border-zinc-900 rounded-[3rem] p-8 space-y-4">
                {shareLinks.filter(l => l.client_id === selectedClient.id).length > 0 ? (
                  shareLinks.filter(l => l.client_id === selectedClient.id).map(link => {
                    const track = tracks.find(t => t.id === link.track_id);
                    const playlist = playlists.find(p => p.id === link.playlist_id);
                    const name = track?.name || playlist?.name || 'Unknown Hub';
                    
                    return (
                      <div key={link.id} className="p-4 bg-zinc-900 border border-zinc-800 rounded-3xl flex items-center justify-between group hover:border-orange-500/50 transition-all font-sans">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-black border border-zinc-800 flex items-center justify-center text-orange-500 text-xs">
                              {track ? 'TRK' : 'PLL'}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[10px] font-black uppercase tracking-tight truncate max-w-[120px]">{name}</span>
                            <span className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest mt-0.5 font-mono">
                              {link.expires_at ? `EXPIRES: ${new Date(link.expires_at).toLocaleDateString()}` : 'ELITE STATUS'}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-black">{link.access_count}</p>
                          <p className="text-[6px] font-black text-zinc-600 uppercase tracking-widest">Accesses</p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="py-12 flex flex-col items-center justify-center text-center opacity-30">
                     <Share2 className="w-8 h-8 mb-3" />
                     <p className="text-[8px] font-black uppercase tracking-widest">No dedicated nodes active.</p>
                  </div>
                )}
              </div>
           </div>

           <div className="p-10 bg-orange-500 rounded-[3.5rem] text-black space-y-8 shadow-2xl shadow-orange-500/20 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-1000" />
              <div className="w-16 h-16 bg-black rounded-[2rem] flex items-center justify-center shadow-2xl relative z-10">
                 <Lock className="w-8 h-8 text-orange-500" />
              </div>
              <div className="relative z-10">
                 <h4 className="text-3xl font-black uppercase italic tracking-tighter leading-none">Security<br/>Handshake</h4>
                 <p className="text-sm font-bold leading-tight mt-4 opacity-80 max-w-[200px]">
                      Cryptographic stream verification is active for this partner identity.
                 </p>
              </div>
              <button 
                 onClick={() => alert("Credentials rotated successfully.")}
                 className="w-full py-4 bg-black text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all relative z-10"
              >
                 Rotate Access Key
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
