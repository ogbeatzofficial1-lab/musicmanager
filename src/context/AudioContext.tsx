import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { Track } from '../types';

interface AudioContextType {
  activeTrack: Track | null;
  isPlaying: boolean;
  progress: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  playTrack: (track: Track, queue?: Track[]) => void;
  togglePlay: () => void;
  seek: (time: number) => void;
  setVolume: (vol: number) => void;
  toggleMute: () => void;
  playNext: () => void;
  playPrevious: () => void;
  stop: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [activeTrack, setActiveTrack] = useState<Track | null>(null);
  const [queue, setQueue] = useState<Track[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.addEventListener('timeupdate', () => {
        setProgress(audioRef.current?.currentTime || 0);
      });
      audioRef.current.addEventListener('loadedmetadata', () => {
        setDuration(audioRef.current?.duration || 0);
      });
      audioRef.current.addEventListener('ended', () => {
        playNext();
      });
      audioRef.current.addEventListener('error', (e) => {
        console.error("Audio element error:", e);
        setIsPlaying(false);
      });
    }
  }, []); // Run once on mount

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const playTrack = async (track: Track, newQueue?: Track[]) => {
    if (newQueue) {
      setQueue(newQueue);
    }
    
    if (activeTrack?.id === track.id) {
      togglePlay();
      return;
    }

    setActiveTrack(track);
    if (audioRef.current && track.file_url) {
      try {
        audioRef.current.src = track.file_url;
        await audioRef.current.play();
        setIsPlaying(true);
      } catch (error: any) {
        console.error("Playback failed for track:", track.name, error);
        setIsPlaying(false);
        
        // Specific handling for dead blob URLs after refresh
        if (track.file_url.startsWith('blob:') || error.message?.includes('no supported source')) {
          alert(`Playback failed for "${track.name}". \n\nNote: In this demo, uploaded files are stored temporarily. Please re-upload the file if you recently refreshed the page.`);
        }
      }
    } else {
      console.warn("No file_url for track:", track.name);
      alert(`No audio source found for "${track.name}".`);
    }
  };

  const playNext = () => {
    if (queue.length === 0 || !activeTrack) return;
    const currentIndex = queue.findIndex(t => t.id === activeTrack.id);
    const nextIndex = (currentIndex + 1) % queue.length;
    playTrack(queue[nextIndex]);
  };

  const playPrevious = () => {
    if (queue.length === 0 || !activeTrack) return;
    const currentIndex = queue.findIndex(t => t.id === activeTrack.id);
    const prevIndex = (currentIndex - 1 + queue.length) % queue.length;
    playTrack(queue[prevIndex]);
  };

  const togglePlay = async () => {
    if (audioRef.current) {
      try {
        if (isPlaying) {
          audioRef.current.pause();
          setIsPlaying(false);
        } else {
          await audioRef.current.play();
          setIsPlaying(true);
        }
      } catch (error) {
        console.error("Toggle play failed:", error);
      }
    }
  };

  const seek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setProgress(time);
    }
  };

  const setVolume = (vol: number) => {
    setVolumeState(vol);
    setIsMuted(false);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const stop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setActiveTrack(null);
    setIsPlaying(false);
  };

  return (
    <AudioContext.Provider value={{
      activeTrack, isPlaying, progress, duration, volume, isMuted,
      playTrack, togglePlay, seek, setVolume, toggleMute, playNext, playPrevious, stop
    }}>
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (!context) throw new Error('useAudio must be used within AudioProvider');
  return context;
}
