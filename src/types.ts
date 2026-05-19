export interface UserProfile {
  id: string;
  name: string;
  artist_name: string;
  bio: string;
  email: string;
  avatar_url: string;
  social_links: {
    instagram?: string;
    spotify?: string;
    soundcloud?: string;
  };
}

export type TrackStatus = "ready" | "sent" | "processing";

export interface Track {
  id: string;
  name: string;
  artist: string;
  duration: number; // in seconds
  bpm: number;
  key_signature: string;
  tags: string[];
  file_url: string | null;
  image_url?: string | null;
  size: number;
  type: string;
  plays: number;
  likes: number;
  status: TrackStatus;
  created_at: string;
  _brokenBlob?: boolean;
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
  track_ids: string[];
  start_color: string;
  end_color: string;
  created_at: string;
  image_url?: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  avatar_url?: string | null;
  company?: string;
  status: "online" | "offline";
  last_active: string;
  tags: string[];
  created_at: string;
}

export interface ShareLink {
  id: string;
  token: string;
  track_id?: string;
  playlist_id?: string;
  recipient_email?: string;
  client_id?: string;
  download_enabled: boolean;
  expires_at: string | null;
  access_count: number;
  created_at: string;
}

export interface Activity {
  id: string;
  type: "view" | "play" | "download" | "like" | "social" | "comment" | "upload" | "system" | "share" | "analyze" | "thumbs_up" | "thumbs_down" | "zip_upload";
  track_id?: string;
  playlist_id?: string;
  client_id?: string;
  timestamp: string;
  user: string;
  action: string;
  target?: string;
  details?: string;
}

export interface Message {
  id: string;
  client_id: string; // Maintain internal UUID for mapping if needed
  recipient_id: string; // Dynamic mapping to email
  content: string;
  image_url?: string | null;
  direction: "inbound" | "outbound";
  timestamp: string;
  is_read: boolean;
}

export interface PromoPack {
  id: string;
  track_id: string;
  youtube_copy: string;
  instagram_copy: string;
  generic_copy: string;
  created_at: string;
}

export interface PromoVideo {
  id: string;
  track_id?: string;
  playlist_id?: string;
  video_url: string;
  thumbnail_url?: string;
  style: string;
  status: "processing" | "ready" | "failed";
  created_at: string;
  _brokenBlob?: boolean;
}
