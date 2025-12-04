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

// Bloom uniforms
uniform vec2 uMousePosition;
uniform float uBloomIntensity;
uniform float uEnableBloom;

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

    float enhancedIntensity = intensity;
    vec4 finalColor;

    // Apply bloom effect only if enabled
    if (uEnableBloom > 0.5) {
        // Calculate distance from mouse position for bloom enhancement
        float mouseDistance = distance(uv, uMousePosition);
        float mouseInfluence = 1.0 - smoothstep(0.0, 0.4, mouseDistance);
        
        // Enhanced bloom intensity based on mouse movement and fluid intensity
        // Higher bloom intensity near mouse and in areas with more fluid
        float bloomMultiplier = 1.0 + (uBloomIntensity * mouseInfluence * fluidIntensity * 3.0);
        enhancedIntensity = intensity * bloomMultiplier;
        
        // Create bloom glow effect - brighter and more saturated near mouse
        vec3 bloomColor = colorForFluidEffect.rgb * (1.0 + bloomMultiplier * 0.5);
        float bloomAmount = enhancedIntensity * mouseInfluence * 0.8;

        outputColor = mix(inputTexture, colorForFluidEffect, enhancedIntensity);

        vec4 computedFluidColor = mix(inputTexture, colorForFluidEffect, uBlend * 0.01);

        if(inputTexture.a < 0.1) {
            finalColor = mix(computedBgColor, colorForFluidEffect, enhancedIntensity);
        } else {
            finalColor = mix(computedFluidColor, computedBgColor, 1.0 - inputTexture.a);
        }

        // Apply bloom glow effect with screen blend mode (additive blending for glow)
        // Screen blend: 1 - (1 - a) * (1 - b) = a + b - a*b
        vec3 bloomGlow = bloomColor * bloomAmount;
        finalColor.rgb = finalColor.rgb + bloomGlow - (finalColor.rgb * bloomGlow);
    } else {
        // Standard rendering without bloom
        outputColor = mix(inputTexture, colorForFluidEffect, intensity);

        vec4 computedFluidColor = mix(inputTexture, colorForFluidEffect, uBlend * 0.01);

        if(inputTexture.a < 0.1) {
            finalColor = mix(computedBgColor, colorForFluidEffect, intensity);
        } else {
            finalColor = mix(computedFluidColor, computedBgColor, 1.0 - inputTexture.a);
        }
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
            // Bloom uniforms
            uMousePosition: new Uniform(new Vector2(0.5, 0.5)),
            uBloomIntensity: new Uniform(props.bloomIntensity || 1.0),
            uEnableBloom: new Uniform(props.enableBloom ? 1.0 : 0.0),
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
        
        // Update bloom uniforms
        if (this.state.enableBloom !== undefined) {
            this.updateUniform('uEnableBloom', this.state.enableBloom ? 1.0 : 0.0);
        }
        if (this.state.bloomIntensity !== undefined) {
            this.updateUniform('uBloomIntensity', this.state.bloomIntensity);
        }
    }

    updateMousePosition(mouseX, mouseY) {
        this.updateUniform('uMousePosition', new Vector2(mouseX, mouseY));
    }

    updateTime(time) {
        this.updateUniform('uRgbShiftTime', time);
    }
}