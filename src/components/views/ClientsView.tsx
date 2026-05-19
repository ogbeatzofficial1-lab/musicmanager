import React from 'react';
import { motion } from 'motion/react';
import { Users, Plus, Mail, MessageSquare, Edit3, Trash2 } from 'lucide-react';
import { Client } from '../../types';
import { cn } from '../../lib/utils';

interface ClientsViewProps {
  clients: Client[];
  setShowAddClient: (s: boolean) => void;
  setSelectedMessageClientId: (id: string) => void;
  setActiveView: (view: any) => void;
  setEditingClient: (c: Client) => void;
  deleteClient: (id: string) => void;
  setSelectedClient: (c: Client) => void;
}

export default function ClientsView({
  clients,
  setShowAddClient,
  setSelectedMessageClientId,
  setActiveView,
  setEditingClient,
  deleteClient,
  setSelectedClient
}: ClientsViewProps) {
  return (
    <div id="clients-view" className="p-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tighter uppercase italic leading-none">Collaborator CRM</h1>
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em] mt-1">Strategic relationship management and pipeline control.</p>
        </div>
        <button 
          onClick={() => setShowAddClient(true)}
          className="bg-white text-black px-6 py-3 rounded-xl font-black tracking-widest uppercase text-[10px] flex items-center gap-2 hover:bg-zinc-200 transition-all"
        >
          <Plus className="w-4 h-4" /> Add Partner
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {clients.map(client => (
          <motion.div 
            key={client.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="group relative bg-zinc-950 border border-zinc-900 rounded-[2.5rem] p-8 hover:border-zinc-700 transition-all shadow-2xl"
          >
            <div className="flex items-start justify-between mb-8">
              <div className="w-16 h-16 rounded-[1.5rem] bg-zinc-900 border border-zinc-800 p-4 flex items-center justify-center font-black text-2xl group-hover:scale-110 transition-transform">
                {client.name.charAt(0)}
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                 <button onClick={() => setEditingClient(client)} className="p-2 hover:bg-zinc-900 rounded-lg text-zinc-500 hover:text-white">
                    <Edit3 className="w-4 h-4" />
                 </button>
                 <button onClick={() => deleteClient(client.id)} className="p-2 hover:bg-zinc-900 rounded-lg text-red-500/50 hover:text-red-500">
                    <Trash2 className="w-4 h-4" />
                 </button>
              </div>
            </div>
            
            <div className="space-y-1 mb-8">
              <h3 
                className="text-xl font-black tracking-tighter uppercase italic truncate cursor-pointer hover:text-orange-500 transition-colors"
                onClick={() => setSelectedClient(client)}
              >
                {client.name}
              </h3>
              <p className="text-zinc-600 text-[10px] font-black uppercase tracking-widest">{client.company || 'Partner'}</p>
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={() => {
                  setSelectedMessageClientId(client.id);
                  setActiveView('messages');
                }}
                className="flex-1 bg-zinc-900 border border-zinc-800 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest text-zinc-400 hover:text-white hover:border-zinc-700 transition-all flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-3.5 h-3.5" /> Direct
              </button>
              <a 
                href={`mailto:${client.email}`}
                className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-500 hover:text-white transition-all"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
