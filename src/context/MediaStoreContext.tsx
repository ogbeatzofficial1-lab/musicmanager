import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { v4 as uuidv4 } from "uuid";
// @ts-ignore
import { supabase } from "../lib/supabase";

interface MediaItem {
  id: string;
  name: string;
  file_url: string; // Permanent URL link to the audio file in your tracks bucket
  created_at?: string;
  [key: string]: any;
}

interface MediaStoreContextType {
  mediaItems: MediaItem[];
  loading: boolean;
  error: string | null;
  addMediaItemWithFile: (name: string, file: File) => Promise<void>;
}

const MediaStoreContext = createContext<MediaStoreContextType | undefined>(undefined);

export function MediaStoreProvider({ children }: { children: ReactNode }) {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 1. Fetch saved rows from your 'tracks' database table on refresh
  useEffect(() => {
    async function fetchMedia() {
      try {
        setLoading(true);
        setError(null);

        const { data, error: sbError } = await supabase
          .from("tracks") // Target table changed to 'tracks'
          .select("*");

        if (sbError) throw sbError;
        if (data) setMediaItems(data as MediaItem[]);
      } catch (err: any) {
        console.error("Error loading database tracks:", err);
        setError(err.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    }

    fetchMedia();
  }, []);

  // 2. Upload file to 'tracks' bucket, grab URL, and save row to 'tracks' table
  const addMediaItemWithFile = async (name: string, file: File) => {
    try {
      setLoading(true);
      setError(null);

      // Create a unique file name to avoid duplicate overwrites in the bucket
      const fileExtension = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExtension}`;
      const filePath = `uploads/${fileName}`;

      // Step A: Upload raw file payload to your 'tracks' bucket container
      const { error: uploadError } = await supabase.storage
        .from("tracks") // Target bucket: 'tracks'
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Step B: Resolve the accessible public URL path string
      const { data: urlData } = supabase.storage
        .from("tracks") // Target bucket: 'tracks'
        .getPublicUrl(filePath);

      const publicFileUrl = urlData.publicUrl;

      // Step C: Save text data row to your 'tracks' database table
      const newItem = {
        id: uuidv4(),
        name: name,
        file_url: publicFileUrl,
        created_at: new Date().toISOString(),
      };

      const { data: dbData, error: dbError } = await supabase
        .from("tracks") // Target table changed to 'tracks'
        .insert([newItem])
        .select();

      if (dbError) throw dbError;

      if (dbData) {
        setMediaItems((prev) => [...prev, ...(dbData as MediaItem[])]);
      }
    } catch (err: any) {
      console.error("Storage/Database operation processing failed:", err);
      setError(err.message || "Failed to complete data sync operations");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MediaStoreContext.Provider value={{ mediaItems, loading, error, addMediaItemWithFile }}>
      {children}
    </MediaStoreContext.Provider>
  );
}

export function useMediaStore() {
  const context = useContext(MediaStoreContext);
  if (context === undefined) {
    throw new Error("useMediaStore must be used within a MediaStoreProvider");
  }
  return context;
}
