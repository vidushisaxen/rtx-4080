import { Effect, EffectAttribute } from 'postprocessing';
import { Uniform, Vector2 } from 'three';
import { hexToRgb } from '../utils';

const compositeFrag = `uniform sampler2D tFluid;

uniform vec3 uColor;
uniform vec3 uBackgroundColor;

uniform float uDistort;
uniform float uIntensity;
uniform float uRainbow;
uniform float uBlend;
uniform float uShowBackground;

// RGB Shift uniforms
uniform float uRgbShiftIntensity;
uniform float uRgbShiftRadius;
uniform vec2 uRgbShiftDirection;
uniform float uRgbShiftTime;

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {

    vec3 fluidColor = texture2D(tFluid, uv).rgb;

    vec2 distortedUv = uv - fluidColor.rg * uDistort * 0.001;

    // RGB Shift Effect
    float fluidIntensity = length(fluidColor);
    float rgbShiftAmount = uRgbShiftIntensity * fluidIntensity * 0.01;
    
    // Create dynamic shift direction based on fluid flow and time
    vec2 shiftDir = normalize(fluidColor.rg + uRgbShiftDirection);
    vec2 timeOffset = vec2(sin(uRgbShiftTime * 2.0), cos(uRgbShiftTime * 1.5)) * 0.3;
    vec2 dynamicShiftDir = normalize(shiftDir + timeOffset);
    
    // Sample RGB channels with different offsets
    vec2 redOffset = distortedUv + dynamicShiftDir * rgbShiftAmount * uRgbShiftRadius;
    vec2 greenOffset = distortedUv;
    vec2 blueOffset = distortedUv - dynamicShiftDir * rgbShiftAmount * uRgbShiftRadius;
    
    // Sample each channel separately
    float r = texture2D(inputBuffer, redOffset).r;
    float g = texture2D(inputBuffer, greenOffset).g;
    float b = texture2D(inputBuffer, blueOffset).b;
    float a = texture2D(inputBuffer, distortedUv).a;
    
    vec4 inputTexture = vec4(r, g, b, a);

    float intensity = length(fluidColor) * uIntensity * 0.0001;

    vec3 selectedColor = uColor * length(fluidColor);

    // Enhanced color mixing with RGB shift consideration
    vec3 rgbShiftedFluidColor = fluidColor;
    if (uRgbShiftIntensity > 0.0) {
        // Apply RGB shift to fluid color as well
        rgbShiftedFluidColor.r = texture2D(tFluid, uv + dynamicShiftDir * rgbShiftAmount * 0.5).r;
        rgbShiftedFluidColor.g = fluidColor.g;
        rgbShiftedFluidColor.b = texture2D(tFluid, uv - dynamicShiftDir * rgbShiftAmount * 0.5).b;
    }

    vec4 colorForFluidEffect = vec4(uRainbow == 1.0 ? rgbShiftedFluidColor : selectedColor, 1.0);

    vec4 computedBgColor = uShowBackground != 0.0 ? vec4(uBackgroundColor, 1.0) : vec4(0.0, 0.0, 0.0, 0.0);

    outputColor = mix(inputTexture, colorForFluidEffect, intensity);

    vec4 computedFluidColor = mix(inputTexture, colorForFluidEffect, uBlend * 0.01);

    vec4 finalColor;

    if(inputTexture.a < 0.1) {
        finalColor = mix(computedBgColor, colorForFluidEffect, intensity);
    } else {
        finalColor = mix(computedFluidColor, computedBgColor, 1.0 - inputTexture.a);
    }

    outputColor = finalColor;
}`;

export class FluidEffect extends Effect {
    constructor(props) {
        const uniforms = {
            tFluid: new Uniform(props.tFluid),
            uDistort: new Uniform(props.distortion),
            uRainbow: new Uniform(props.rainbow),
            uIntensity: new Uniform(props.intensity),
            uBlend: new Uniform(props.blend),
            uShowBackground: new Uniform(props.showBackground),
            uColor: new Uniform(hexToRgb(props.fluidColor)),
            uBackgroundColor: new Uniform(hexToRgb(props.backgroundColor)),
            // RGB Shift uniforms
            uRgbShiftIntensity: new Uniform(props.rgbShiftIntensity || 0.0),
            uRgbShiftRadius: new Uniform(props.rgbShiftRadius || 1.0),
            uRgbShiftDirection: new Uniform(new Vector2(props.rgbShiftDirection?.x || 1.0, props.rgbShiftDirection?.y || 0.0)),
            uRgbShiftTime: new Uniform(0.0),
        };

        super('FluidEffect', compositeFrag, {
            blendFunction: props.blendFunction,
            attributes: EffectAttribute.CONVOLUTION,
            uniforms: new Map(Object.entries(uniforms)),
        });

        this.state = props;
    }

    updateUniform(key, value) {
        const uniform = this.uniforms.get(key);
        if (uniform) {
            uniform.value = value;
        }
    }

    update() {
        this.updateUniform('uIntensity', this.state.intensity);
        this.updateUniform('uDistort', this.state.distortion);
        this.updateUniform('uRainbow', this.state.rainbow);
        this.updateUniform('uBlend', this.state.blend);
        this.updateUniform('uShowBackground', this.state.showBackground);
        this.updateUniform('uColor', hexToRgb(this.state.fluidColor));
        this.updateUniform('uBackgroundColor', hexToRgb(this.state.backgroundColor));
        
        // Update RGB shift uniforms
        if (this.state.rgbShiftIntensity !== undefined) {
            this.updateUniform('uRgbShiftIntensity', this.state.rgbShiftIntensity);
        }
        if (this.state.rgbShiftRadius !== undefined) {
            this.updateUniform('uRgbShiftRadius', this.state.rgbShiftRadius);
        }
        if (this.state.rgbShiftDirection !== undefined) {
            this.updateUniform('uRgbShiftDirection', new Vector2(this.state.rgbShiftDirection.x, this.state.rgbShiftDirection.y));
        }
    }

    updateTime(time) {
        this.updateUniform('uRgbShiftTime', time);
    }
}