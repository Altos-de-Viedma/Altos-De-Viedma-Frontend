import { useEffect, useRef, useState } from 'react';

interface UseNotificationSoundProps {
  isActive: boolean;
  type: 'emergencies' | 'packages' | 'visitors';
}

export const useNotificationSound = ({ isActive, type }: UseNotificationSoundProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Create iPhone-style notification sounds
  const createiPhoneStyleSound = async (type: string) => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

    // Different sound patterns for each type
    const soundConfig = {
      emergencies: {
        // Urgent but pleasant - C major chord with higher pitch
        frequencies: [523.25, 659.25, 783.99], // C5, E5, G5
        duration: 0.6,
        volume: 0.3,
        attack: 0.05,
        decay: 0.4
      },
      packages: {
        // Gentle notification - F major chord
        frequencies: [349.23, 440.00, 523.25], // F4, A4, C5
        duration: 0.5,
        volume: 0.25,
        attack: 0.08,
        decay: 0.3
      },
      visitors: {
        // Welcoming sound - G major chord
        frequencies: [392.00, 493.88, 587.33], // G4, B4, D5
        duration: 0.5,
        volume: 0.25,
        attack: 0.1,
        decay: 0.35
      }
    };

    const config = soundConfig[type as keyof typeof soundConfig] || soundConfig.packages;

    // Create master gain node
    const masterGain = audioContext.createGain();
    masterGain.connect(audioContext.destination);

    // Create a subtle reverb effect
    const convolver = audioContext.createConvolver();
    const impulseLength = audioContext.sampleRate * 0.5;
    const impulse = audioContext.createBuffer(2, impulseLength, audioContext.sampleRate);

    for (let channel = 0; channel < 2; channel++) {
      const channelData = impulse.getChannelData(channel);
      for (let i = 0; i < impulseLength; i++) {
        channelData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / impulseLength, 2) * 0.1;
      }
    }
    convolver.buffer = impulse;

    // Create oscillators for each frequency (chord)
    const oscillators: OscillatorNode[] = [];

    config.frequencies.forEach((frequency) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);

      // Connect oscillator -> gain -> reverb -> master
      oscillator.connect(gainNode);
      gainNode.connect(convolver);
      convolver.connect(masterGain);

      // Also connect some dry signal
      gainNode.connect(masterGain);

      // Set up envelope (attack, decay)
      const individualVolume = config.volume / config.frequencies.length;
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(individualVolume, audioContext.currentTime + config.attack);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + config.duration);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + config.duration);

      oscillators.push(oscillator);
    });

    // Add a subtle high-frequency sparkle for iPhone-like quality
    const sparkleOsc = audioContext.createOscillator();
    const sparkleGain = audioContext.createGain();

    sparkleOsc.type = 'sine';
    sparkleOsc.frequency.setValueAtTime(2093, audioContext.currentTime); // High C
    sparkleOsc.connect(sparkleGain);
    sparkleGain.connect(masterGain);

    sparkleGain.gain.setValueAtTime(0, audioContext.currentTime);
    sparkleGain.gain.linearRampToValueAtTime(0.05, audioContext.currentTime + 0.02);
    sparkleGain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.2);

    sparkleOsc.start(audioContext.currentTime);
    sparkleOsc.stop(audioContext.currentTime + 0.2);

    return new Promise<void>((resolve) => {
      setTimeout(() => {
        audioContext.close();
        resolve();
      }, config.duration * 1000 + 100);
    });
  };

  const playNotificationSound = async () => {
    try {
      await createiPhoneStyleSound(type);
    } catch (error) {
      console.warn('Could not play notification sound:', error);
    }
  };

  const startNotificationLoop = () => {
    if (intervalRef.current) return;

    // Play immediately
    playNotificationSound();
    setIsPlaying(true);

    // Then repeat every 8 seconds (longer interval for less annoyance)
    intervalRef.current = setInterval(() => {
      playNotificationSound();
    }, 8000);
  };

  const stopNotificationLoop = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsPlaying(false);
  };

  useEffect(() => {
    if (isActive && !isPlaying) {
      // Small delay to avoid immediate sound on page load
      const timeout = setTimeout(() => {
        startNotificationLoop();
      }, 1000);
      return () => clearTimeout(timeout);
    } else if (!isActive && isPlaying) {
      stopNotificationLoop();
    }
  }, [isActive, isPlaying]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopNotificationLoop();
    };
  }, []);

  return {
    isPlaying,
    stopSound: stopNotificationLoop,
  };
};