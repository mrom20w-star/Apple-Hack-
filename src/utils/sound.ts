export type SoundEffect = 'tap' | 'copy' | 'scan' | 'success' | 'reveal' | 'error';

const MUTE_STORAGE_KEY = 'guardiola_muted';

let audioContext: AudioContext | null = null;
let mutedState = false;

try {
  mutedState = typeof window !== 'undefined' && window.localStorage.getItem(MUTE_STORAGE_KEY) === '1';
} catch {
  mutedState = false;
}

export function isMuted(): boolean {
  return mutedState;
}

export function setMuted(muted: boolean): void {
  mutedState = muted;
  try {
    window.localStorage.setItem(MUTE_STORAGE_KEY, muted ? '1' : '0');
  } catch {
    // Ignore storage errors in restricted contexts
  }
}

function playTone(
  freq: number,
  delay: number,
  duration: number,
  type: OscillatorType,
  gainAmount = 0.06,
  rampFreq?: number
): void {
  if (!audioContext) return;

  const startTime = audioContext.currentTime + delay;
  const osc = audioContext.createOscillator();
  const gain = audioContext.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(freq, startTime);
  if (rampFreq) {
    osc.frequency.exponentialRampToValueAtTime(rampFreq, startTime + duration);
  }

  gain.gain.setValueAtTime(0.0001, startTime);
  gain.gain.exponentialRampToValueAtTime(gainAmount, startTime + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

  osc.connect(gain).connect(audioContext.destination);
  osc.start(startTime);
  osc.stop(startTime + duration + 0.02);
}

export function playSound(effect: SoundEffect): void {
  if (mutedState || typeof window === 'undefined') return;

  try {
    if (!audioContext) {
      const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctx) return;
      audioContext = new Ctx();
    }

    if (audioContext.state === 'suspended') {
      void audioContext.resume();
    }

    switch (effect) {
      case 'tap':
        playTone(880, 0, 0.07, 'sine', 0.05, 1200);
        break;
      case 'copy':
        playTone(1046, 0, 0.08, 'sine');
        playTone(1568, 0.07, 0.1, 'sine');
        break;
      case 'scan':
        playTone(220, 0, 0.5, 'triangle', 0.04, 880);
        break;
      case 'success':
        [523, 659, 784, 1046].forEach((freq, idx) => {
          playTone(freq, idx * 0.08, 0.16, 'sine', 0.05);
        });
        break;
      case 'reveal':
        [660, 990].forEach((freq, idx) => {
          playTone(freq, idx * 0.06, 0.12, 'triangle', 0.045);
        });
        break;
      case 'error':
        playTone(300, 0, 0.18, 'sawtooth', 0.035, 160);
        playTone(220, 0.16, 0.22, 'sawtooth', 0.03, 120);
        break;
    }
  } catch {
    // Audio playback unavailable
  }
}
