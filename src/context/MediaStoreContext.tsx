import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Track, Playlist, Client, Activity, ShareLink, UserProfile, Message, PromoVideo } from '../types';
import { getSupabase } from '../lib/supabase';

interface MediaStoreContextType {
  tracks: Track[];
  playlists: Playlist[];
  clients: Client[];
  activities: Activity[];
  profile: UserProfile | null;
  loading: boolean;
  addTrack: (track: Partial<Track>) => Promise<Track>;
  updateTrack: (id: string, updates: Partial<Track>) => Promise<void>;
  deleteTrack: (id: string) => Promise<void>;
  addPlaylist: (playlist: Partial<Playlist>) => Promise<void>;
  updatePlaylist: (id: string, updates: Partial<Playlist>) => Promise<void>;
  deletePlaylist: (id: string) => Promise<void>;
  addTrackToPlaylist: (trackId: string, playlistId: string) => Promise<void>;
  removeTrackFromPlaylist: (trackId: string, playlistId: string) => Promise<void>;
  addClient: (client: Partial<Client>) => Promise<void>;
  updateClient: (id: string, updates: Partial<Client>) => Promise<void>;
  deleteClient: (id: string) => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  shareLinks: ShareLink[];
  addShareLink: (link: Partial<ShareLink>) => Promise<ShareLink>;
  addActivity: (activity: Partial<Activity>) => Promise<void>;
  analyzeTrack: (name: string) => Promise<{ bpm: number, key: string, duration?: number }>;
  messages: Message[];
  sendMessage: (clientId: string, content: string, image_url?: string | null) => Promise<void>;
  promoVideos: PromoVideo[];
  addPromoVideo: (video: Partial<PromoVideo>) => Promise<void>;
  deletePromoVideo: (id: string) => Promise<void>;
  incrementShareLinkAccess: (id: string) => Promise<void>;
}

const MediaStoreContext = createContext<MediaStoreContextType | undefined>(undefined);

export function MediaStoreProvider({ children }: { children: React.ReactNode }) {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [shareLinks, setShareLinks] = useState<ShareLink[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [promoVideos, setPromoVideos] = useState<PromoVideo[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const supabase = getSupabase();

  useEffect(() => {
    async function init() {
      if (supabase) {
        try {
          const fetchSafely = async (table: string) => {
            const { data, error } = await supabase!.from(table).select('*');
            if (error) {
              console.warn(`Error fetching ${table}:`, error);
              return null;
            }
            return data;
          };

          const trData = await fetchSafely('tracks');
          const plData = await fetchSafely('playlists');
          const clData = await fetchSafely('clients');
          const slData = await fetchSafely('share_links');
          const actData = await fetchSafely('activities');
          const msgData = await fetchSafely('messages');
          const pvData = await fetchSafely('promo_videos');

          // Only fallback to local if fetch failed
          const safeParseList = (tableData: any, localKey: string) => {
            if (tableData) return tableData;
            const locally = localStorage.getItem(localKey);
            return locally ? JSON.parse(locally) : [];
          };

          setTracks(safeParseList(trData, 'mm_tracks'));
          setPlaylists(safeParseList(plData, 'mm_playlists'));
          setClients(safeParseList(clData, 'mm_clients'));
          setShareLinks(safeParseList(slData, 'mm_share_links'));
          setActivities(safeParseList(actData, 'mm_activities'));
          setMessages(safeParseList(msgData, 'mm_messages'));
          setPromoVideos(safeParseList(pvData, 'mm_promo_videos'));
          
          const { data: profData, error: profError } = await supabase.from('profiles').select('*').single();
          if (profError && profError.code !== 'PGRST116') { // Ignore zero rows error for profile
            console.warn("Profile fetch error:", profError);
          }
          if (profData) {
            setProfile(profData);
          } else {
             const localProf = localStorage.getItem('mm_profile');
             setProfile(localProf ? JSON.parse(localProf) : null);
          }

        } catch (e) {
          console.error("Supabase load error:", e);
          loadFromLocal();
        }
      } else {
        loadFromLocal();
      }
      setLoading(false);
    }

    function loadFromLocal() {
      const localTracks = localStorage.getItem('mm_tracks');
      const localPlaylists = localStorage.getItem('mm_playlists');
      const localClients = localStorage.getItem('mm_clients');
      const localShareLinks = localStorage.getItem('mm_share_links');
      const localMessages = localStorage.getItem('mm_messages');
      const localPromoVideos = localStorage.getItem('mm_promo_videos');
      const localProfile = localStorage.getItem('mm_profile');
      
      let parsedTracks = localTracks ? JSON.parse(localTracks) : [];
      
      const cleanedTracks = (parsedTracks || []).map((t: Track) => {
        if (t.file_url?.startsWith('blob:')) {
          return { ...t, _brokenBlob: true }; 
        }
        return t;
      });
      setTracks(cleanedTracks);

      setPlaylists(localPlaylists ? JSON.parse(localPlaylists) : []);
      setClients(localClients ? JSON.parse(localClients) : []);
      setMessages(localMessages ? JSON.parse(localMessages) : []);
      setShareLinks(localShareLinks ? JSON.parse(localShareLinks) : []);
      
      const parsedVideos = localPromoVideos ? JSON.parse(localPromoVideos) : [];
      const cleanedVideos = (parsedVideos || []).map((v: PromoVideo) => {
        if (v.video_url?.startsWith('blob:')) {
          return { ...v, _brokenBlob: true };
        }
        return v;
      });
      setPromoVideos(cleanedVideos);
      
      setActivities([]);
      
      const defaultProfile: UserProfile = {
        id: 'user-1',
        name: 'OG Beatz',
        artist_name: 'OGBeatz',
        bio: 'Premium sound architecture and master engineering.',
        email: 'og@beatz.com',
        avatar_url: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=400&h=400&fit=crop',
        social_links: {
          instagram: '@ogbeatz',
          spotify: 'ogbeatz-official'
        }
      };
      setProfile(localProfile ? JSON.parse(localProfile) : defaultProfile);
    }

    init();
  }, []);

  const safeSave = (key: string, data: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.warn(`LocalStorage save error for ${key}:`, e);
      if (e instanceof Error && e.name === 'QuotaExceededError') {
        // If quota exceeded, try to clear non-essential data or just warn
        // For tracks, maybe remove tracks with large base64 artworks
        if (key === 'mm_tracks' && Array.isArray(data)) {
          const reducedData = data.map(t => ({
            ...t,
            image_url: t.image_url?.length > 1000 ? '/input_file_2.png' : t.image_url 
          }));
          try {
            localStorage.setItem(key, JSON.stringify(reducedData));
          } catch (e2) {
             console.error("Critical storage failure even after reduction", e2);
          }
        }
      }
    }
  };

  const addTrack = async (track: Partial<Track>) => {
    const newTrack: Track = {
      id: uuidv4(),
      name: track.name || "Untitled",
      artist: track.artist || "OGBeatz",
      duration: track.duration || 0,
      bpm: track.bpm || 120,
      key_signature: track.key_signature || "C",
      tags: track.tags || [],
      file_url: track.file_url || null,
      image_url: track.image_url || null,
      size: track.size || 0,
      type: track.type || "audio/mpeg",
      plays: 0,
      likes: 0,
      status: "ready",
      created_at: new Date().toISOString(),
      ...track
    };

    const updated = [...tracks, newTrack];
    setTracks(updated);
    
    safeSave('mm_tracks', updated);
    if (supabase) {
      const { error } = await supabase.from('tracks').insert(newTrack);
      if (error) console.error(error);
    }

    addActivity({
      type: 'upload',
      user: 'OGBeatz',
      action: 'uploaded',
      target: newTrack.name,
      timestamp: new Date().toISOString()
    });

    return newTrack;
  };

  const updateTrack = async (id: string, updates: Partial<Track>) => {
    const updated = tracks.map(t => t.id === id ? { ...t, ...updates } : t);
    setTracks(updated);
    safeSave('mm_tracks', updated);
    if (supabase) {
      const { error } = await supabase.from('tracks').update(updates).eq('id', id);
      if (error) console.error(error);
    }
  };

  const deleteTrack = async (id: string) => {
    console.log(`[MediaStore] Initializing deletion for track: ${id}`);
    try {
      // 1. Update React states using functional updates to ensure consistency
      setTracks(prev => prev.filter(t => t.id !== id));
      setPlaylists(prev => prev.map(pl => ({
        ...pl,
        track_ids: (pl.track_ids || []).filter(tid => tid !== id)
      })));
      setPromoVideos(prev => prev.filter(v => v.track_id !== id));
      setShareLinks(prev => prev.filter(l => l.track_id !== id));

      // 2. Persist to local storage (or DB if available)
      if (supabase) {
        await Promise.all([
          supabase.from('share_links').delete().eq('track_id', id),
          supabase.from('promo_videos').delete().eq('track_id', id),
          supabase.from('tracks').delete().eq('id', id)
        ]);
      } else {
        // Compute and save to local storage immediately
        const localTracks = JSON.parse(localStorage.getItem('mm_tracks') || '[]');
        safeSave('mm_tracks', localTracks.filter((t: any) => t.id !== id));
        
        const localPlaylists = JSON.parse(localStorage.getItem('mm_playlists') || '[]');
        safeSave('mm_playlists', localPlaylists.map((pl: any) => ({
          ...pl,
          track_ids: (pl.track_ids || []).filter((tid: any) => tid !== id)
        })));
        
        const localVideos = JSON.parse(localStorage.getItem('mm_promo_videos') || '[]');
        safeSave('mm_promo_videos', localVideos.filter((v: any) => v.track_id !== id));
        
        const localLinks = JSON.parse(localStorage.getItem('mm_share_links') || '[]');
        safeSave('mm_share_links', localLinks.filter((l: any) => l.track_id !== id));
      }

      addActivity({
        type: 'system',
        user: 'OGBeatz',
        action: `Purged asset ${id} from reference library`,
        timestamp: new Date().toISOString()
      });
      
      console.log(`[MediaStore] Successfully deleted track: ${id}`);
    } catch (error) {
      console.error("[MediaStore] Deletion Failure:", error);
      alert("Terminal delete operation failed. Please check network connectivity or permissions.");
    }
  };

  const addTrackToPlaylist = async (trackId: string, playlistId: string) => {
    const updated = playlists.map(pl => {
      if (pl.id === playlistId) {
        if (pl.track_ids.includes(trackId)) return pl;
        return { ...pl, track_ids: [...pl.track_ids, trackId] };
      }
      return pl;
    });
    setPlaylists(updated);
    safeSave('mm_playlists', updated);
    if (supabase) {
      const { error } = await supabase.from('playlists').update({ track_ids: updated.find(p => p.id === playlistId)?.track_ids }).eq('id', playlistId);
      if (error) console.error(error);
    }
  };

  const removeTrackFromPlaylist = async (trackId: string, playlistId: string) => {
    const updated = playlists.map(pl => {
      if (pl.id === playlistId) {
        return { ...pl, track_ids: pl.track_ids.filter(tid => tid !== trackId) };
      }
      return pl;
    });
    setPlaylists(updated);
    safeSave('mm_playlists', updated);
    if (supabase) {
      const { error } = await supabase.from('playlists').update({ track_ids: updated.find(p => p.id === playlistId)?.track_ids }).eq('id', playlistId);
      if (error) console.error(error);
    }
  };

  const updatePlaylist = async (id: string, updates: Partial<Playlist>) => {
    const updated = playlists.map(pl => pl.id === id ? { ...pl, ...updates } : pl);
    setPlaylists(updated);
    safeSave('mm_playlists', updated);
    if (supabase) {
      const { error } = await supabase.from('playlists').update(updates).eq('id', id);
      if (error) console.error(error);
    }
  };

  const deletePlaylist = async (id: string) => {
    const updated = playlists.filter(pl => pl.id !== id);
    setPlaylists(updated);
    safeSave('mm_playlists', updated);
    if (supabase) {
      const { error } = await supabase.from('playlists').delete().eq('id', id);
      if (error) console.error(error);
    }
  };

  const addPlaylist = async (playlist: Partial<Playlist>) => {
    const newPl: Playlist = {
      id: uuidv4(),
      name: playlist.name || "New Playlist",
      description: playlist.description || "",
      image_url: playlist.image_url || "",
      track_ids: [],
      start_color: playlist.start_color || "#f97316",
      end_color: playlist.end_color || "#ea580c",
      created_at: new Date().toISOString()
    };
    const updated = [...playlists, newPl];
    setPlaylists(updated);
    safeSave('mm_playlists', updated);
    if (supabase) {
      const { error } = await supabase.from('playlists').insert(newPl);
      if (error) console.error(error);
    }
  };

  const addClient = async (client: Partial<Client>) => {
    const rawEmail = client.email || "unknown@client.com";
    const normalizedEmail = rawEmail.trim().toLowerCase();
    
    // Check if email already exists
    const existingClient = clients.find(c => c.email.toLowerCase() === normalizedEmail);
    
    if (existingClient) {
      // Merge logic: Update name if provided, set status to online
      const updates = {
        name: client.name || existingClient.name,
        status: 'online' as const,
        last_active: new Date().toISOString(),
      };
      const updatedClients = clients.map(c => c.id === existingClient.id ? { ...c, ...updates } : c);
      setClients(updatedClients);
      safeSave('mm_clients', updatedClients);
      if (supabase) {
        const { error } = await supabase.from('clients').update(updates).eq('id', existingClient.id);
        if (error) console.error(error);
      }
      return;
    }

    // Helper to derive name from email
    const deriveDisplayNameFromEmail = (email: string) => {
      const localPart = email.split('@')[0];
      return localPart
        .split(/[._-]+/)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    };

    const newClient: Client = {
      id: uuidv4(),
      name: client.name || deriveDisplayNameFromEmail(normalizedEmail),
      email: normalizedEmail,
      status: client.status || "online",
      last_active: new Date().toISOString(),
      tags: client.tags || [],
      created_at: new Date().toISOString(),
      ...client
    };
    const updated = [...clients, newClient];
    setClients(updated);
    safeSave('mm_clients', updated);
    if (supabase) {
      const { error } = await supabase.from('clients').insert(newClient);
      if (error) console.error(error);
    }
  };

  const updateClient = async (id: string, updates: Partial<Client>) => {
    const updated = clients.map(c => c.id === id ? { ...c, ...updates } : c);
    setClients(updated);
    safeSave('mm_clients', updated);
    if (supabase) {
      const { error } = await supabase.from('clients').update(updates).eq('id', id);
      if (error) console.error(error);
    }
  };

  const deleteClient = async (id: string) => {
    const updated = clients.filter(c => c.id !== id);
    setClients(updated);
    safeSave('mm_clients', updated);
    if (supabase) {
      const { error } = await supabase.from('clients').delete().eq('id', id);
      if (error) console.error(error);
    }
    
    // Also cleanup activity references if needed, or just let them stay with null references
    addActivity({
      type: 'system',
      user: 'OGBeatz',
      action: `Removed client ${id}`,
      timestamp: new Date().toISOString()
    });
  };

  const sendMessage = async (clientId: string, content: string, image_url?: string | null) => {
    const client = clients.find(c => c.id === clientId);
    if (!client) return;

    const newMessage: Message = {
      id: uuidv4(),
      client_id: clientId,
      recipient_id: client.email,
      content,
      image_url: image_url || null,
      direction: 'outbound',
      timestamp: new Date().toISOString(),
      is_read: false
    };
    
    const updated = [...messages, newMessage];
    setMessages(updated);
    
    safeSave('mm_messages', updated);
    if (supabase) {
      const { error } = await supabase.from('messages').insert(newMessage);
      if (error) console.error(error);
    }

    // Also add to activity log
    addActivity({
      type: 'social',
      user: 'OGBeatz',
      action: `Sent message to ${client?.name || 'Client'}`,
      details: content,
      client_id: clientId
    });
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!profile) return;
    const updated = { ...profile, ...updates };
    setProfile(updated);
    safeSave('mm_profile', updated);
    if (supabase) {
      const { error } = await supabase.from('profiles').update(updates).eq('id', profile.id);
      if (error) console.error(error);
    }
  };

  const addShareLink = async (link: Partial<ShareLink>) => {
    // Cryptographically secure token generation
    const secureToken = Array.from(window.crypto.getRandomValues(new Uint8Array(20)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    const newLink: ShareLink = {
      id: uuidv4(),
      token: secureToken,
      download_enabled: link.download_enabled ?? true,
      expires_at: link.expires_at || null,
      access_count: 0,
      created_at: new Date().toISOString(),
      ...link
    };
    const updated = [...shareLinks, newLink];
    setShareLinks(updated);
    safeSave('mm_share_links', updated);
    if (supabase) {
      const { error } = await supabase.from('share_links').insert(newLink);
      if (error) console.error(error);
    }
    return newLink;
  };

  const addActivity = async (activity: Partial<Activity>) => {
    const newActivity: Activity = {
      id: uuidv4(),
      type: activity.type || 'system',
      user: activity.user || 'Unknown',
      action: activity.action || 'Performed action',
      timestamp: new Date().toISOString(),
      ...activity
    };
    const updated = [newActivity, ...activities].slice(0, 50); // Keep last 50
    setActivities(updated);
    safeSave('mm_activities', updated);
    if (supabase) {
      const { error } = await supabase.from('activities').insert(newActivity);
      if (error) console.error(error);
    }
  };

  const deleteActivity = (id: string) => {
    // ...
  };

  const incrementShareLinkAccess = async (id: string) => {
    const link = shareLinks.find(l => l.id === id);
    if (!link) return;

    const newCount = (link.access_count || 0) + 1;
    const updated = shareLinks.map(l => 
      l.id === id ? { ...l, access_count: newCount } : l
    );
    
    setShareLinks(updated);
    
    safeSave('mm_share_links', updated);
    if (supabase) {
      const { error } = await supabase
        .from('share_links')
        .update({ access_count: newCount })
        .eq('id', id);
      if (error) console.error(error);
    }
  };

  const addPromoVideo = async (video: Partial<PromoVideo>) => {
    const newVideo: PromoVideo = {
      id: uuidv4(),
      video_url: video.video_url || '',
      thumbnail_url: video.thumbnail_url || '',
      style: video.style || 'minimalist',
      status: video.status || 'processing',
      created_at: new Date().toISOString(),
      ...video
    };
    const updated = [...promoVideos, newVideo];
    setPromoVideos(updated);
    safeSave('mm_promo_videos', updated);
    if (supabase) {
      const { error } = await supabase.from('promo_videos').insert(newVideo);
      if (error) console.error(error);
    }
  };

  const deletePromoVideo = async (id: string) => {
    const updated = promoVideos.filter(v => v.id !== id);
    setPromoVideos(updated);
    safeSave('mm_promo_videos', updated);
    if (supabase) {
      const { error } = await supabase.from('promo_videos').delete().eq('id', id);
      if (error) console.error(error);
    }
  };

  const analyzeTrack = async (name: string): Promise<{ bpm: number, key: string, duration?: number, tags?: string[] }> => {
    try {
      const response = await fetch("/api/analyze-metadata", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileName: name }),
      });
      
      if (!response.ok) throw new Error("Server analysis failed");
      
      return await response.json();
    } catch (e) {
      console.error("AI Analysis failed:", e);
      return { bpm: 120, key: "C", tags: [] };
    }
  };

  return (
    <MediaStoreContext.Provider value={{
      tracks, playlists, clients, activities, profile, loading, shareLinks, messages, promoVideos,
      addTrack, updateTrack, deleteTrack, addPlaylist, updatePlaylist, deletePlaylist, addTrackToPlaylist, removeTrackFromPlaylist,
      addClient, updateClient, deleteClient, updateProfile, addShareLink, addActivity, analyzeTrack, sendMessage, addPromoVideo, deletePromoVideo, incrementShareLinkAccess
    }}>
      {children}
    </MediaStoreContext.Provider>
  );
}

export function useMediaStore() {
  const context = useContext(MediaStoreContext);
  if (!context) throw new Error('useMediaStore must be used within MediaStoreProvider');
  return context;
}
