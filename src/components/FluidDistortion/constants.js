import { BlendFunction } from 'postprocessing';

export const DEFAULT_CONFIG = {
    blend: 0.3,
    intensity: 0.1,
    force: 0.8,
    distortion: 0.3,
    curl: 1.9,
    radius: 0.5,
    swirl: 4,
    pressure: 0.7,
    densityDissipation: 0.91,
    velocityDissipation: 1.0,
    fluidColor: '#07251e',
    backgroundColor: '#000000',
    showBackground: true,
    rainbow: false,
    dyeRes: 512,
    simRes: 128,
    blendFunction: BlendFunction.NORMAL,
    // RGB Shift Configuration
    rgbShiftIntensity: 0.1,        // 0.0 = no shift, 5.0 = strong shift
    rgbShiftRadius: 0.2,           // 0.1 = tight separation, 2.0 = wide separation
    rgbShiftDirection: { x: 1.0, y: 0.5 }, // Base direction vector for RGB shift
    // Bloom Configuration
    enableBloom: false,          // Enable/disable bloom effect
    bloomIntensity: 0,         // Bloom intensity multiplier (higher = more bloom)
    // Random Movement Configuration
    enableRandomMovement: true,  // Enable/disable random cursor movement when idle
    randomMovementIdleThreshold: 2000,  // Milliseconds of inactivity before random movement starts
    randomMovementInterval: 100,  // Interval in milliseconds between random target updates
    randomMovementLerpFactor: 0.01,  // Smoothness of random movement (0.0 = instant, 1.0 = very slow)
    randomMovementForceMultiplier: 0.3,  // Force multiplier for random movement (0.0 - 1.0)
    randomMovementMargin: 0.1,  // Margin from viewport edges (0.0 - 0.5)
};

export const REFRESH_RATE = 60;
