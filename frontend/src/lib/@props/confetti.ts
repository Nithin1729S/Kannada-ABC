import confetti from 'canvas-confetti';

type ConfettiConfig = {
  particleCount?: number;
  spread?: number;
  startVelocity?: number;
  decay?: number;
  gravity?: number;
  drift?: number;
  ticks?: number;
  origin?: { x: number; y: number };
  colors?: string[];
  shapes?: ('square' | 'circle')[];
  scalar?: number;
  zIndex?: number;
  disableForReducedMotion?: boolean;
};

const defaults: ConfettiConfig = {
  particleCount: 100,
  spread: 70,
  startVelocity: 30,
  decay: 0.95,
  gravity: 1,
  drift: 0,
  ticks: 200,
  origin: { y: 0.6, x: 0.5 },
  colors: ['#ff0000', '#ffa500', '#ffff00', '#008000', '#0000ff', '#4b0082', '#ee82ee'],
  shapes: ['square', 'circle'],
  scalar: 1,
  zIndex: 100,
  disableForReducedMotion: false,
};

export const triggerConfetti = (config: ConfettiConfig = {}) => {
  const mergedConfig = { ...defaults, ...config };
  
  // Create multiple bursts for a more dramatic effect
  const burstCount = 3;
  for (let i = 0; i < burstCount; i++) {
    setTimeout(() => {
      // Randomize the origin.x slightly for each burst
      const originX = mergedConfig.origin!.x + (Math.random() - 0.5) * 0.2;
      confetti({
        ...mergedConfig,
        origin: { ...mergedConfig.origin, x: originX },
      });
    }, i * 200); // Stagger the bursts
  }

  // Add some random confetti from the sides
  setTimeout(() => {
    // Left side
    confetti({
      ...mergedConfig,
      particleCount: 20,
      origin: { x: 0, y: 0.5 },
      angle: 60,
    });
    
    // Right side
    confetti({
      ...mergedConfig,
      particleCount: 20,
      origin: { x: 1, y: 0.5 },
      angle: 120,
    });
  }, 500);
};

// Realistic firework effect
export const triggerFireworks = () => {
  const duration = 5 * 1000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

  const interval: NodeJS.Timeout = setInterval(() => {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / duration);
    
    // Launch fireworks from random positions
    confetti({
      ...defaults,
      particleCount,
      origin: { x: Math.random(), y: Math.random() - 0.2 }
    });
    confetti({
      ...defaults,
      particleCount,
      origin: { x: Math.random(), y: Math.random() - 0.2 }
    });
  }, 250);
};

// Rain effect
export const triggerConfettiRain = () => {
  const duration = 5 * 1000;
  const animationEnd = Date.now() + duration;
  
  const interval: NodeJS.Timeout = setInterval(() => {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    confetti({
      particleCount: 3,
      startVelocity: 0,
      spread: 70,
      ticks: 100,
      origin: { x: Math.random(), y: -0.1 },
      colors: ['#ffffff'],
      shapes: ['circle'],
      gravity: 0.6,
      scalar: 0.75,
      drift: 0
    });
  }, 50);
};