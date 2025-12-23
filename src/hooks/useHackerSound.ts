import { useCallback, useRef } from "react";

export const useHackerSound = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isPlayingRef = useRef(false);

  const startHackerSound = useCallback(() => {
    if (isPlayingRef.current) return;
    
    if (!audioRef.current) {
      audioRef.current = new Audio("/sound/hacking-at-a-keyboard.wav");
      audioRef.current.loop = true;
      audioRef.current.volume = 0.5;
    }
    
    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(() => {});
    isPlayingRef.current = true;
  }, []);

  const stopHackerSound = useCallback(() => {
    if (audioRef.current && isPlayingRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      isPlayingRef.current = false;
    }
  }, []);

  return { startHackerSound, stopHackerSound };
};
