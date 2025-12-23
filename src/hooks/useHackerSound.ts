import { useCallback, useRef } from "react";

export const useHackerSound = () => {
  const audioContextRef = useRef<AudioContext | null>(null);

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  const playHackerSound = useCallback(async () => {
    const ctx = getAudioContext();
    if (ctx.state === "suspended") {
      await ctx.resume();
    }
    const now = ctx.currentTime;

    const masterGain = ctx.createGain();
    masterGain.connect(ctx.destination);
    masterGain.gain.setValueAtTime(0.3, now);

    const playTone = (freq: number, startTime: number, duration: number, type: OscillatorType = "square") => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = type;
      osc.frequency.setValueAtTime(freq, startTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.5, startTime + duration);
      
      gain.gain.setValueAtTime(0.15, startTime);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
      
      osc.connect(gain);
      gain.connect(masterGain);
      
      osc.start(startTime);
      osc.stop(startTime + duration);
    };

    const playNoise = (startTime: number, duration: number) => {
      const bufferSize = ctx.sampleRate * duration;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      
      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(2000, startTime);
      filter.frequency.exponentialRampToValueAtTime(500, startTime + duration);
      filter.Q.value = 5;
      
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.08, startTime);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
      
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(masterGain);
      
      noise.start(startTime);
      noise.stop(startTime + duration);
    };

    playTone(800, now, 0.08, "square");
    playTone(1200, now + 0.05, 0.06, "sawtooth");
    playTone(600, now + 0.1, 0.1, "square");
    playNoise(now, 0.15);
    
    for (let i = 0; i < 4; i++) {
      const freq = 400 + Math.random() * 800;
      playTone(freq, now + 0.15 + i * 0.04, 0.03, "square");
    }

    playTone(300, now + 0.35, 0.15, "triangle");
    playTone(450, now + 0.4, 0.1, "sine");
  }, [getAudioContext]);

  const playDataStreamSound = useCallback(async () => {
    const ctx = getAudioContext();
    if (ctx.state === "suspended") {
      await ctx.resume();
    }
    const now = ctx.currentTime;

    const masterGain = ctx.createGain();
    masterGain.connect(ctx.destination);
    masterGain.gain.setValueAtTime(0.2, now);

    const playBeep = (freq: number, startTime: number, duration: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, startTime);
      
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.1, startTime + 0.01);
      gain.gain.linearRampToValueAtTime(0, startTime + duration);
      
      osc.connect(gain);
      gain.connect(masterGain);
      
      osc.start(startTime);
      osc.stop(startTime + duration);
    };

    const frequencies = [523, 659, 784, 880, 1047];
    frequencies.forEach((freq, i) => {
      playBeep(freq, now + i * 0.06, 0.08);
    });
  }, [getAudioContext]);

  return { playHackerSound, playDataStreamSound };
};
