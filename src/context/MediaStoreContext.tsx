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
          const { data: trData } = await supabase.from('tracks').select('*');
          const { data: plData } = await supabase.from('playlists').select('*');
          const { data: clData } = await supabase.from('clients').select('*');
          const { data: slData } = await supabase.from('share_links').select('*');
          const { data: actData } = await supabase.from('activities').select('*');
          const { data: msgData } = await supabase.from('messages').select('*');
          const { data: pvData } = await supabase.from('promo_videos').select('*');

          setTracks(trData || []);
          setPlaylists(plData || []);
          setClients(clData || []);
          setShareLinks(slData || []);
          setActivities(actData || []);
          setMessages(msgData || []);
          setPromoVideos(pvData || []);
          
          const { data: profData } = await supabase.from('profiles').select('*').single();
          setProfile(profData || null);
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
      const localProfile = localStorage.getItem('mm_profile');
      
      let parsedTracks = localTracks ? JSON.parse(localTracks) : [];
      
      // Filter out or fix broken blob URLs that don't work after refresh
      parsedTracks = parsedTracks.map((t: Track) => {
        if (t.file_url?.startsWith('blob:')) {
          // In this demo environment, blob URLs don't persist after refresh.
          // We'll keep the track entry but it will have an error if played.
          // Ideally, we'd have a persistent storage URL.
          return { ...t, _brokenBlob: true }; 
        }
        return t;
      });

      // Seed if empty or only broken user tracks exist
      if (parsedTracks.length === 0 || parsedTracks.every((t: any) => t.id.startsWith('sample-') || t._brokenBlob)) {
        // We always ensure sample tracks are there and working
        const sampleTracks: Track[] = [
          {
            id: 'sample-1',
            name: 'Vapor Wave Master',
            artist: 'OGBeatz',
            duration: 184,
            bpm: 128,
            key_signature: 'Am',
            tags: ['Vaporwave', 'Electronic', 'Chill'],
            file_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
            image_url: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=600&h=600&fit=crop',
            size: 5000000,
            type: 'audio/mpeg',
            plays: 12500,
            likes: 450,
            status: 'ready',
            created_at: new Date().toISOString()
          },
          {
            id: 'sample-2',
            name: 'Neon Nights Edit',
            artist: 'OGBeatz',
            duration: 215,
            bpm: 95,
            key_signature: 'F#m',
            tags: ['Neon', 'Synthwave', 'Upbeat'],
            file_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
            image_url: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&h=800&fit=crop',
            size: 6000000,
            type: 'audio/mpeg',
            plays: 8900,
            likes: 310,
            status: 'ready',
            created_at: new Date().toISOString()
          }
        ];
        
        // Merge samples with existing tracks, prioritizing samples for playback
        const merged = [...sampleTracks, ...parsedTracks.filter((t: any) => !t.id.startsWith('sample-'))];
        setTracks(merged);
        safeSave('mm_tracks', merged);
      } else {
        setTracks(parsedTracks);
      }

      setPlaylists(localPlaylists ? JSON.parse(localPlaylists) : []);
      setClients(localClients ? JSON.parse(localClients) : []);
      setMessages(localMessages ? JSON.parse(localMessages) : []);
      setShareLinks(localShareLinks ? JSON.parse(localShareLinks) : []);
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
    
    if (supabase) {
      await supabase.from('tracks').insert(newTrack);
    } else {
      safeSave('mm_tracks', updated);
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
    if (supabase) {
      await supabase.from('tracks').update(updates).eq('id', id);
    } else {
      safeSave('mm_tracks', updated);
    }
  };

  const deleteTrack = async (id: string) => {
    const updatedTracks = tracks.filter(t => t.id !== id);
    setTracks(updatedTracks);
    
    // Cascading delete: remove from playlists
    const updatedPlaylists = playlists.map(pl => ({
      ...pl,
      track_ids: pl.track_ids.filter(tid => tid !== id)
    }));
    setPlaylists(updatedPlaylists);

    if (supabase) {
      await supabase.from('tracks').delete().eq('id', id);
      // Supabase should handle the relational part if schema is right, but manually updating state here
    } else {
      safeSave('mm_tracks', updatedTracks);
      safeSave('mm_playlists', updatedPlaylists);
    }

    addActivity({
      type: 'system',
      user: 'OGBeatz',
      action: `Deleted track ${id}`,
      timestamp: new Date().toISOString()
    });
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
    if (!supabase) safeSave('mm_playlists', updated);
  };

  const removeTrackFromPlaylist = async (trackId: string, playlistId: string) => {
    const updated = playlists.map(pl => {
      if (pl.id === playlistId) {
        return { ...pl, track_ids: pl.track_ids.filter(tid => tid !== trackId) };
      }
      return pl;
    });
    setPlaylists(updated);
    if (!supabase) safeSave('mm_playlists', updated);
    else await supabase.from('playlists').update({ track_ids: updated.find(p => p.id === playlistId)?.track_ids }).eq('id', playlistId);
  };

  const updatePlaylist = async (id: string, updates: Partial<Playlist>) => {
    const updated = playlists.map(pl => pl.id === id ? { ...pl, ...updates } : pl);
    setPlaylists(updated);
    if (supabase) {
      await supabase.from('playlists').update(updates).eq('id', id);
    } else {
      safeSave('mm_playlists', updated);
    }
  };

  const deletePlaylist = async (id: string) => {
    const updated = playlists.filter(pl => pl.id !== id);
    setPlaylists(updated);
    if (supabase) {
      await supabase.from('playlists').delete().eq('id', id);
    } else {
      safeSave('mm_playlists', updated);
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
    if (!supabase) safeSave('mm_playlists', updated);
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
      if (supabase) {
        await supabase.from('clients').update(updates).eq('id', existingClient.id);
      } else {
        safeSave('mm_clients', updatedClients);
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
    if (supabase) {
      await supabase.from('clients').insert(newClient);
    } else {
      safeSave('mm_clients', updated);
    }
  };

  const updateClient = async (id: string, updates: Partial<Client>) => {
    const updated = clients.map(c => c.id === id ? { ...c, ...updates } : c);
    setClients(updated);
    if (supabase) {
      await supabase.from('clients').update(updates).eq('id', id);
    } else {
      safeSave('mm_clients', updated);
    }
  };

  const deleteClient = async (id: string) => {
    const updated = clients.filter(c => c.id !== id);
    setClients(updated);
    if (supabase) {
      await supabase.from('clients').delete().eq('id', id);
    } else {
      safeSave('mm_clients', updated);
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
    
    if (supabase) {
      await supabase.from('messages').insert(newMessage);
    } else {
      safeSave('mm_messages', updated);
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
    if (supabase) {
      await supabase.from('profiles').update(updates).eq('id', profile.id);
    } else {
      safeSave('mm_profile', updated);
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
    if (supabase) {
      await supabase.from('share_links').insert(newLink);
    } else {
      safeSave('mm_share_links', updated);
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
    if (supabase) {
      await supabase.from('activities').insert(newActivity);
    } else {
      safeSave('mm_activities', updated);
    }
  };

  const deleteActivity = (id: string) => {
    // ...
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
    if (supabase) {
      await supabase.from('promo_videos').insert(newVideo);
    } else {
      safeSave('mm_promo_videos', updated);
    }
  };

  const deletePromoVideo = async (id: string) => {
    const updated = promoVideos.filter(v => v.id !== id);
    setPromoVideos(updated);
    if (supabase) {
      await supabase.from('promo_videos').delete().eq('id', id);
    } else {
      safeSave('mm_promo_videos', updated);
    }
  };

  const analyzeTrack = async (name: string): Promise<{ bpm: number, key: string, duration?: number, tags?: string[] }> => {
    try {
      const { GoogleGenAI, Type } = await import('@google/genai');
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
      
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Analyze this music track name: "${name}". Suggest its likely BPM (number), Key Signature (string like "Am", "F#m", "C"), approximate duration in seconds, and 3-5 descriptive tags (genres/moods). Return as JSON.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              bpm: { type: Type.NUMBER },
              key: { type: Type.STRING },
              duration: { type: Type.NUMBER },
              tags: { 
                type: Type.ARRAY,
                items: { type: Type.STRING }
              }
            },
            required: ["bpm", "key", "tags"]
          }
        }
      });
      
      return JSON.parse(response.text.trim());
    } catch (e) {
      console.error("AI Analysis failed:", e);
      return { bpm: 120, key: "C", tags: [] };
    }
  };

  return (
    <MediaStoreContext.Provider value={{
      tracks, playlists, clients, activities, profile, loading, shareLinks, messages, promoVideos,
      addTrack, updateTrack, deleteTrack, addPlaylist, updatePlaylist, deletePlaylist, addTrackToPlaylist, removeTrackFromPlaylist,
      addClient, updateClient, deleteClient, updateProfile, addShareLink, addActivity, analyzeTrack, sendMessage, addPromoVideo, deletePromoVideo
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
