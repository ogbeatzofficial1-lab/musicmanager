import React from 'react';
import { motion } from 'motion/react';
import { Settings, MessageSquare, Paperclip, Send, X } from 'lucide-react';
import { Client, Message } from '../../types';
import { cn } from '../../lib/utils';

interface MessagesViewProps {
  clients: Client[];
  messages: Message[];
  selectedMessageClientId: string | null;
  setSelectedMessageClientId: (id: string | null) => void;
  clientMessageDraft: string;
  setClientMessageDraft: (s: string) => void;
  chatAttachment: string | null;
  setChatAttachment: (s: string | null) => void;
  handleSendMessage: () => Promise<void>;
  chatImageInputRef: React.RefObject<HTMLInputElement>;
  handleChatImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function MessagesView({
  clients,
  messages,
  selectedMessageClientId,
  setSelectedMessageClientId,
  clientMessageDraft,
  setClientMessageDraft,
  chatAttachment,
  setChatAttachment,
  handleSendMessage,
  chatImageInputRef,
  handleChatImageUpload
}: MessagesViewProps) {
  const activeChatClient = clients.find(c => c.id === selectedMessageClientId);
  const activeChatMessages = messages.filter(m => m.client_id === selectedMessageClientId).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  return (
    <div id="messages-view" className="flex h-[calc(100vh-140px)] bg-black overflow-hidden border-t border-zinc-900 rounded-b-[4rem]">
      {/* Split-Pane Sidebar */}
      <div className="w-80 lg:w-96 bg-zinc-950 border-r border-zinc-900 flex flex-col">
        <div className="p-8 border-b border-zinc-900 bg-zinc-900/10">
          <h2 className="text-2xl font-black tracking-tighter uppercase italic">Communications</h2>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 mt-1">Studio-to-Partner Distribution Directives</p>
        </div>
        
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-3 scrollbar-hide">
          {clients.map(client => {
            const lastMsg = messages.filter(m => m.client_id === client.id).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
            return (
              <button 
                key={client.id}
                onClick={() => setSelectedMessageClientId(client.id)}
                className={cn(
                  "w-full p-5 rounded-3xl flex items-center gap-4 transition-all group relative border",
                  selectedMessageClientId === client.id 
                    ? "bg-zinc-900 border-orange-500/50 shadow-xl shadow-orange-500/5" 
                    : "bg-transparent border-transparent hover:bg-zinc-900/40"
                )}
              >
                <div className="w-12 h-12 rounded-2xl bg-zinc-950 border border-zinc-900 flex items-center justify-center text-lg font-black text-orange-500 italic shrink-0 shadow-lg overflow-hidden">
                  {client.avatar_url ? (
                      <img src={client.avatar_url} className="w-full h-full object-cover" />
                  ) : (
                      client.name[0]
                  )}
                </div>
                <div className="flex flex-col items-start min-w-0 flex-1">
                  <div className="flex items-center justify-between w-full">
                    <span className="text-sm font-black text-white truncate">{client.name}</span>
                    {lastMsg && (
                      <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">
                        {new Date(lastMsg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-zinc-500 font-bold truncate w-full uppercase tracking-widest mt-1 opacity-70">
                    {lastMsg ? lastMsg.content : 'Initialize production loop...'}
                  </p>
                </div>
                {client.status === 'online' && (
                  <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/50" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Focused Chat Pane */}
      <div className="flex-1 flex flex-col relative">
        {activeChatClient ? (
          <>
            {/* Header */}
            <div className="p-6 border-b border-zinc-900 bg-zinc-950/50 backdrop-blur-md flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-zinc-950 border border-orange-500/20 flex items-center justify-center text-xl font-black text-orange-500 italic shadow-xl overflow-hidden">
                  {activeChatClient.avatar_url ? (
                      <img src={activeChatClient.avatar_url} className="w-full h-full object-cover" />
                  ) : (
                      activeChatClient.name[0]
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-black uppercase tracking-tight italic text-white leading-none">{activeChatClient.name}</h3>
                  <div className="flex items-center gap-3 mt-1.5">
                     <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">{activeChatClient.company || 'Private Authorized Personnel'}</span>
                     <div className="flex items-center gap-1.5">
                        <div className={cn("w-1.5 h-1.5 rounded-full", activeChatClient.status === 'online' ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-700')} />
                        <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">{activeChatClient.status}</span>
                     </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                 <button className="p-3 text-zinc-600 hover:text-white transition-colors">
                    <Settings className="w-4 h-4" />
                 </button>
              </div>
            </div>

            {/* Message History Feed */}
            <div className="flex-1 overflow-y-auto p-10 space-y-8 scrollbar-hide">
              {activeChatMessages.map((msg, idx) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  key={msg.id} 
                  className={cn(
                    "max-w-[75%] p-6 rounded-[2.5rem] text-sm leading-relaxed relative group",
                    msg.direction === 'outbound' 
                        ? "bg-orange-500 text-black font-bold self-end rounded-br-none ml-auto shadow-2xl shadow-orange-500/10" 
                        : "bg-zinc-900 text-zinc-300 font-medium self-start rounded-bl-none border border-zinc-800"
                  )}
                >
                  {msg.image_url && (
                      <div className="mb-4 rounded-3xl overflow-hidden border border-black/10">
                          <img src={msg.image_url} alt="Attachment" className="max-w-full h-auto" />
                      </div>
                  )}
                  {msg.content}
                  <div className={cn(
                      "mt-3 text-[9px] font-black uppercase tracking-tighter opacity-40",
                      msg.direction === 'outbound' ? "text-black text-right" : "text-zinc-500"
                  )}>
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </motion.div>
              ))}
              {activeChatMessages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center py-40 opacity-30">
                   <MessageSquare className="w-16 h-16 text-zinc-800 mb-6" />
                   <p className="text-[10px] font-black uppercase tracking-[0.25em]">Awaiting secure input...</p>
                </div>
              )}
            </div>

            {/* Input Interaction Tray */}
            <div className="p-10 border-t border-zinc-900 bg-zinc-950/50 backdrop-blur-md">
              <div className="max-w-4xl mx-auto relative">
                {chatAttachment && (
                    <div className="absolute bottom-full left-0 mb-6 p-3 bg-zinc-950 border border-zinc-900 rounded-[2rem] flex items-center gap-4 shadow-2xl">
                        <div className="w-16 h-16 rounded-2xl overflow-hidden bg-black border border-zinc-900">
                            <img src={chatAttachment} className="w-full h-full object-cover" />
                        </div>
                        <button 
                            onClick={() => setChatAttachment(null)}
                            className="p-2 hover:text-rose-500 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                )}
                <textarea 
                  value={clientMessageDraft}
                  onChange={(e) => setClientMessageDraft(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSendMessage())}
                  placeholder="Draft master direct..."
                  className="w-full bg-black border border-zinc-900 rounded-[2.5rem] p-6 pr-20 text-sm font-medium outline-none focus:border-orange-500 focus:shadow-2xl focus:shadow-orange-500/10 transition-all resize-none h-32 scrollbar-hide"
                />
                <div className="absolute right-4 bottom-4 flex gap-2">
                    <button 
                        onClick={() => chatImageInputRef.current?.click()}
                        className="p-3 text-zinc-500 hover:text-white transition-all hover:rotate-45"
                    >
                        <Paperclip className="w-6 h-6" />
                    </button>
                    <input 
                        type="file"
                        ref={chatImageInputRef}
                        onChange={handleChatImageUpload}
                        accept="image/*"
                        className="hidden"
                    />
                    <button 
                        onClick={handleSendMessage}
                        className="p-4 bg-orange-500 rounded-[1.25rem] text-black shadow-2xl shadow-orange-500/20 hover:scale-110 active:scale-95 transition-all"
                    >
                        <Send className="w-6 h-6" />
                    </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-20">
             <div className="w-32 h-32 bg-zinc-950 border border-zinc-900 rounded-[3.5rem] flex items-center justify-center text-zinc-800 mb-10 shadow-2xl relative overflow-hidden group">
               <div className="absolute inset-0 bg-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
               <MessageSquare className="w-12 h-12 opacity-10 group-hover:opacity-30 transition-all group-hover:scale-110" />
             </div>
             <h3 className="text-3xl font-black tracking-tighter uppercase italic mb-3">Communication Nexus</h3>
             <p className="text-zinc-500 text-xs font-bold uppercase tracking-[0.25em] max-w-sm mx-auto leading-loose opacity-60">
               Select an active studio partner from the vertical directory to initialize bidirectional directive exchange.
             </p>
          </div>
        )}
      </div>
    </div>
  );
}
