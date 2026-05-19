import React, { useState, useMemo } from 'react';
import Shell from './components/Shell';
import DashboardView from './components/views/DashboardView';
import TracksView from './components/views/TracksView';
import PlaylistsView from './components/views/PlaylistsView';
import ClientsView from './components/views/ClientsView';
import MessagesView from './components/views/MessagesView';
import VideosView from './components/views/VideosView';
import SharingView from './components/views/SharingView';
import ActivityView from './components/views/ActivityView';
import ProfileView from './components/views/ProfileView';
import SettingsView from './components/views/SettingsView';
import AudioPlayer from './components/AudioPlayer';
import { useMediaStore } from './context/MediaStoreContext';
import { 
  Plus, 
  Upload, 
  Database, 
  Shield, 
  ExternalLink, 
  Music, 
  Users, 
  Play, 
  Share2, 
  MessageSquare, 
  Check, 
  Video, 
  Disc, 
  Layout, 
  Zap, 
  AlertCircle 
} from 'lucide-react';
import { Track, Client, Activity, Playlist, PromoVideo } from './types';

// Modals
import AddClientModal from './components/AddClientModal';
import EditClientModal from './components/EditClientModal';
import EditTrackModal from './components/EditTrackModal';
import EditPlaylistModal from './components/EditPlaylistModal';
import ShareModal from './components/ShareModal';
import PromoPackModal from './components/PromoPackModal';
import VideoGenerationModal from './components/VideoGenerationModal';
import VideoPreviewModal from './components/VideoPreviewModal';

export default function App() {
  const { 
    tracks, 
    playlists, 
    clients, 
    activities, 
    messages,
    promoVideos,
    shareLinks,
    profile,
    loading, 
    isSupabaseConfigured, 
    connectionError,
    addClient,
    updateClient,
    deleteClient,
    updateTrack,
    deleteTrack,
    addPlaylist,
    updatePlaylist,
    deletePlaylist,
    addTrackToPlaylist,
    removeTrackFromPlaylist,
    sendMessage,
    updateProfile,
    clearLocalCache
  } = useMediaStore();

  const [activeView, setActiveView] = useState('dashboard');
  
  // View States
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null);
  const [selectedMessageClientId, setSelectedMessageClientId] = useState<string | null>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [trackLayout, setTrackLayout] = useState<'grid' | 'list'>('grid');
  
  // UI Toggle States
  const [showAddClient, setShowAddClient] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [showDbGuide, setShowDbGuide] = useState(false);
  const [showCreatePlaylist, setShowCreatePlaylist] = useState(false);
  const [showAddTracksToPlaylist, setShowAddTracksToPlaylist] = useState(false);

  // Editing States
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [editingTrack, setEditingTrack] = useState<Track | null>(null);
  const [editingPlaylist, setEditingPlaylist] = useState<Playlist | null>(null);
  
  // Selection States for Modals
  const [sharingTrack, setSharingTrack] = useState<Track | null>(null);
  const [sharingPlaylist, setSharingPlaylist] = useState<Playlist | null>(null);
  const [selectedTrackForPromo, setSelectedTrackForPromo] = useState<Track | null>(null);
  const [selectedTrackForVideo, setSelectedTrackForVideo] = useState<Track | null>(null);
  const [selectedPlaylistForVideo, setSelectedPlaylistForVideo] = useState<Playlist | null>(null);
  const [selectedVideoForPreview, setSelectedVideoForPreview] = useState<PromoVideo | null>(null);
  
  // Messaging States
  const [clientMessageDraft, setClientMessageDraft] = useState('');
  const [chatAttachment, setChatAttachment] = useState<string | null>(null);
  const chatImageInputRef = React.useRef<HTMLInputElement>(null);

  const handleSendMessage = async () => {
    if (!selectedMessageClientId || (!clientMessageDraft && !chatAttachment)) return;
    await sendMessage(selectedMessageClientId, clientMessageDraft, chatAttachment);
    setClientMessageDraft('');
    setChatAttachment(null);
  };

  const handleChatImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setChatAttachment(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Derived data
  const filteredTracks = useMemo(() => {
    return tracks.filter(t => 
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      t.artist.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [tracks, searchQuery]);

  const stats = useMemo(() => ({
    activeTracks: tracks.length,
    totalEngagement: tracks.reduce((acc, t) => acc + (t.plays || 0), 0),
    activeClients: clients.length,
    activityTrend: '+12%'
  }), [tracks, clients]);

  const chartData = [
    { name: 'Mon', plays: 2400 },
    { name: 'Tue', plays: 1398 },
    { name: 'Wed', plays: 9800 },
    { name: 'Thu', plays: 3908 },
    { name: 'Fri', plays: 4800 },
    { name: 'Sat', plays: 3800 },
    { name: 'Sun', plays: 4300 },
  ];

  if (loading) {
    return (
      <div className="h-screen bg-black flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-full border-2 border-zinc-900 border-t-orange-500 animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 animate-pulse">Initializing OS Core</p>
      </div>
    );
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'upload': return { Icon: Music, color: 'text-emerald-500', bg: 'bg-emerald-500/10' };
      case 'share': return { Icon: Share2, color: 'text-sky-500', bg: 'bg-sky-500/10' };
      case 'social': return { Icon: MessageSquare, color: 'text-orange-500', bg: 'bg-orange-500/10' };
      default: return { Icon: Zap, color: 'text-zinc-400', bg: 'bg-zinc-900' };
    }
  };

  const getActivityVerb = (type: string) => {
    switch (type) {
      case 'upload': return 'uploaded asset';
      case 'share': return 'generated link for';
      case 'social': return 'messaged agent';
      default: return 'synchronized';
    }
  };

  const getActivityLabel = (act: Activity) => act.target || act.action || 'system process';

  const DatabaseGuide = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
      <div className="max-w-xl w-full bg-zinc-950 border border-zinc-900 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Database className="w-32 h-32" />
        </div>
        <button onClick={() => setShowDbGuide(false)} className="absolute top-6 right-6 p-2 text-zinc-500 hover:text-white"><AlertCircle className="w-6 h-6 rotate-45" /></button>
        <h2 className="text-3xl font-black uppercase italic tracking-tighter mb-4">Repository Protocol</h2>
        <p className="text-zinc-500 text-sm leading-relaxed mb-8">Establish a persistent cloud connection to synchronize your hub across all distribution nodes. High-fidelity persistence enabled via Supabase.</p>
        
        <div className="space-y-4 mb-10">
          <div className="flex gap-4 p-4 bg-zinc-900/50 rounded-2xl border border-zinc-800">
            <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center text-black font-black text-xs">01</div>
            <div>
              <p className="text-xs font-black uppercase tracking-widest mb-1">Environmental Configuration</p>
              <p className="text-[11px] text-zinc-500">Add <code className="text-orange-500">VITE_SUPABASE_URL</code> and <code className="text-orange-500">VITE_SUPABASE_ANON_KEY</code> to your environment settings.</p>
            </div>
          </div>
          <div className="flex gap-4 p-4 bg-zinc-900/50 rounded-2xl border border-zinc-800">
            <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center text-black font-black text-xs">02</div>
            <div>
              <p className="text-xs font-black uppercase tracking-widest mb-1">Schema Deployment</p>
              <p className="text-[11px] text-zinc-500">Initialize the required tables: tracks, playlists, clients, activities, messages, promo_videos, and share_links.</p>
            </div>
          </div>
        </div>

        <button 
          onClick={() => {
            setShowDbGuide(false);
            setActiveView('settings');
          }}
          className="w-full py-4 bg-white text-black font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-orange-500 transition-all"
        >
          Open Security Parameters
        </button>
      </div>
    </div>
  );

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return (
          <DashboardView 
            stats={stats}
            chartData={chartData}
            activities={activities}
            tracks={tracks}
            clients={clients}
            isSupabaseConfigured={isSupabaseConfigured}
            connectionError={connectionError}
            setActiveView={setActiveView}
            setSelectedMessageClientId={setSelectedMessageClientId}
            setEditingClient={setEditingClient}
            deleteClient={deleteClient}
            setSelectedClient={setSelectedClient}
            handleImportClients={() => {}}
            getActivityIcon={getActivityIcon}
            getActivityVerb={getActivityVerb}
            getActivityLabel={getActivityLabel}
          />
        );
      case 'tracks':
        return (
          <TracksView 
            tracks={tracks}
            filteredTracks={filteredTracks}
            playlists={playlists}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            trackLayout={trackLayout}
            setTrackLayout={setTrackLayout}
            showUpload={showUpload}
            setShowUpload={setShowUpload}
            isSupabaseConfigured={isSupabaseConfigured}
            setShowDbGuide={setShowDbGuide}
            showDbGuide={showDbGuide}
            DatabaseGuide={DatabaseGuide}
            setEditingTrack={setEditingTrack}
            handleShare={setSharingTrack}
            handleDownload={(t) => window.open(t.file_url!)}
            handleDeleteTrack={deleteTrack}
            setSelectedTrackForPromo={setSelectedTrackForPromo}
            setSelectedTrackForVideo={setSelectedTrackForVideo}
            addTrackToPlaylist={addTrackToPlaylist}
            activeTrack={null}
          />
        );
      case 'playlists':
        return (
          <PlaylistsView 
            playlists={playlists}
            selectedPlaylistId={selectedPlaylistId}
            setSelectedPlaylistId={setSelectedPlaylistId}
            tracks={tracks}
            addPlaylist={addPlaylist}
            updatePlaylist={updatePlaylist}
            deletePlaylist={deletePlaylist}
            addTrackToPlaylist={addTrackToPlaylist}
            removeTrackFromPlaylist={removeTrackFromPlaylist}
            setEditingTrack={setEditingTrack}
            handleShare={setSharingTrack}
            handleDownload={(t) => window.open(t.file_url!)}
            handleDeleteTrack={deleteTrack}
            setSelectedTrackForPromo={setSelectedTrackForPromo}
            setSelectedTrackForVideo={setSelectedTrackForVideo}
            setSelectedPlaylistForVideo={setSelectedPlaylistForVideo}
            handleSharePlaylist={setSharingPlaylist}
            showCreatePlaylist={showCreatePlaylist}
            setShowCreatePlaylist={setShowCreatePlaylist}
            showAddTracksToPlaylist={showAddTracksToPlaylist}
            setShowAddTracksToPlaylist={setShowAddTracksToPlaylist}
            editingPlaylist={editingPlaylist}
            setEditingPlaylist={setEditingPlaylist}
          />
        );
      case 'clients':
        return (
          <ClientsView 
            clients={clients}
            setShowAddClient={setShowAddClient}
            setSelectedMessageClientId={(id) => {
              setSelectedMessageClientId(id);
              setActiveView('messages');
            }}
            setActiveView={setActiveView}
            setEditingClient={setEditingClient}
            deleteClient={deleteClient}
            setSelectedClient={setSelectedClient}
          />
        );
      case 'messages':
        return (
          <MessagesView 
            clients={clients}
            messages={messages}
            selectedMessageClientId={selectedMessageClientId}
            setSelectedMessageClientId={setSelectedMessageClientId}
            clientMessageDraft={clientMessageDraft}
            setClientMessageDraft={setClientMessageDraft}
            chatAttachment={chatAttachment}
            setChatAttachment={setChatAttachment}
            handleSendMessage={handleSendMessage}
            chatImageInputRef={chatImageInputRef}
            handleChatImageUpload={handleChatImageUpload}
          />
        );
      case 'videos':
        return (
          <VideosView 
            promoVideos={promoVideos}
            tracks={tracks}
            playlists={playlists}
            setSelectedVideoForPreview={setSelectedVideoForPreview}
          />
        );
      case 'sharing':
        return (
          <SharingView 
            shareLinks={shareLinks}
            tracks={tracks}
            playlists={playlists}
            clients={clients}
          />
        );
      case 'activity':
        return (
          <ActivityView 
            activities={activities}
            getActivityIcon={getActivityIcon}
            getActivityVerb={getActivityVerb}
            getActivityLabel={getActivityLabel}
          />
        );
      case 'profile':
        return (
          <ProfileView 
            profile={profile}
            updateProfile={updateProfile}
          />
        );
      case 'settings':
        return (
          <SettingsView 
            isSupabaseConfigured={isSupabaseConfigured}
            setShowDbGuide={setShowDbGuide}
            tracks={tracks}
            clients={clients}
            activities={activities}
            clearLocalCache={clearLocalCache}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Shell activeView={activeView} onViewChange={setActiveView}>
      {renderView()}

      <AudioPlayer onEdit={setEditingTrack} />

      {/* Modals */}
      {showAddClient && (
        <AddClientModal 
          onClose={() => setShowAddClient(false)} 
        />
      )}
      
      {editingClient && (
        <EditClientModal 
          client={editingClient} 
          onClose={() => setEditingClient(null)} 
        />
      )}

      {editingTrack && (
        <EditTrackModal 
          track={editingTrack} 
          onClose={() => setEditingTrack(null)} 
          onSave={updateTrack}
          onDelete={deleteTrack}
        />
      )}

      {editingPlaylist && (
        <EditPlaylistModal 
          playlist={editingPlaylist} 
          onClose={() => setEditingPlaylist(null)} 
          onSave={(updates) => updatePlaylist(editingPlaylist.id, updates)}
          onDelete={deletePlaylist}
        />
      )}

      {sharingTrack && (
        <ShareModal 
          track={sharingTrack} 
          onClose={() => setSharingTrack(null)} 
        />
      )}

      {sharingPlaylist && (
        <ShareModal 
          playlist={sharingPlaylist} 
          onClose={() => setSharingPlaylist(null)} 
        />
      )}

      {selectedTrackForPromo && (
        <PromoPackModal 
          track={selectedTrackForPromo} 
          onClose={() => setSelectedTrackForPromo(null)} 
        />
      )}

      {selectedTrackForVideo && (
        <VideoGenerationModal 
          track={selectedTrackForVideo} 
          onClose={() => setSelectedTrackForVideo(null)}
        />
      )}

      {selectedPlaylistForVideo && (
        <VideoGenerationModal 
          playlist={selectedPlaylistForVideo} 
          onClose={() => setSelectedPlaylistForVideo(null)}
        />
      )}

      {selectedVideoForPreview && (
        <VideoPreviewModal 
          video={selectedVideoForPreview} 
          onClose={() => setSelectedVideoForPreview(null)} 
        />
      )}
      
      {showDbGuide && <DatabaseGuide />}
    </Shell>
  );
}
