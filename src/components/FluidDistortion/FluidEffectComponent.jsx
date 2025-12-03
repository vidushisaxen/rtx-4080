import React, { useMemo, useRef, useEffect } from 'react';
import { FluidEffect } from './effects/FluidEffect';

export const FluidEffectComponent = React.forwardRef((props, ref) => {
    const effectRef = useRef();

    const effect = useMemo(() => {
        const fluidEffect = new FluidEffect(props);
        effectRef.current = fluidEffect;
        return fluidEffect;
    }, []);

    // Update effect when props change
    useEffect(() => {
        if (effectRef.current) {
            effectRef.current.state = props;
            effectRef.current.update();
        }
    }, [props]);

    // Expose effect instance via ref with additional methods
    React.useImperativeHandle(ref, () => ({
        ...effectRef.current,
        updateTime: (time) => {
            if (effectRef.current && effectRef.current.updateTime) {
                effectRef.current.updateTime(time);
            }
        }
    }), []);

    return <primitive object={effect} />;
});
