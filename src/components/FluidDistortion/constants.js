import { BlendFunction } from 'postprocessing';

export const DEFAULT_CONFIG = {
    blend: 5,
    intensity: 2,
    force: 1.1,
    distortion: 0.4,
    curl: 1.9,
    radius: 0.3,
    swirl: 4,
    pressure: 0.8,
    densityDissipation: 0.96,
    velocityDissipation: 1.0,
    fluidColor: '#3300ff',
    backgroundColor: '#070410',
    showBackground: true,
    rainbow: false,
    dyeRes: 512,
    simRes: 128,
    blendFunction: BlendFunction.SET,
    // RGB Shift Configuration
    rgbShiftIntensity: 0.0,        // 0.0 = no shift, 5.0 = strong shift
    rgbShiftRadius: 1.0,           // 0.1 = tight separation, 2.0 = wide separation
    rgbShiftDirection: { x: 1.0, y: 0.0 }, // Base direction vector for RGB shift
};

export const REFRESH_RATE = 60;
