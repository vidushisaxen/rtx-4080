import { useThree, useFrame } from '@react-three/fiber';
import { useCallback, useEffect, useRef } from 'react';
import { Vector2 } from 'three';

export const usePointer = ({ 
    force,
    enableRandomMovement = false,
    randomMovementIdleThreshold = 2000,
    randomMovementInterval = 100,
    randomMovementLerpFactor = 0.05,
    randomMovementForceMultiplier = 0.3,
    randomMovementMargin = 0.01,
}) => {
    const size = useThree((three) => three.size);

    const splatStack = useRef([]).current;

    // Smoothed real mouse movement
    const hasMoved = useRef(false);
    const targetPointerPos = useRef(new Vector2(0.5, 0.5));
    const currentPointerPos = useRef(new Vector2(0.5, 0.5));
    const lastPointerPos = useRef(new Vector2(0.5, 0.5));

    // Idle detection and random movement
    const lastRealMouseMove = useRef(Date.now());
    const currentRandomPos = useRef(new Vector2(0.5, 0.5));
    const lastRandomPos = useRef(new Vector2(0.5, 0.5));
    const isIdle = useRef(false);
    
    // Random movement path
    const randomPath = useRef([]);
    const currentPathIndex = useRef(0);
    const pathProgress = useRef(0);

    const generateRandomPath = () => {
        const margin = Math.min(Math.max(randomMovementMargin, 0), 0.45);
        const minX = margin;
        const maxX = 1 - margin;
        const minY = margin;
        const maxY = 1 - margin;

        // Generate a smooth path with multiple points
        const pathPoints = [];
        const numPoints = 8; // Number of points in the path
        
        for (let i = 0; i < numPoints; i++) {
            pathPoints.push(new Vector2(
                minX + Math.random() * (maxX - minX),
                minY + Math.random() * (maxY - minY)
            ));
        }
        
        // Make it a loop by adding the first point at the end
        pathPoints.push(pathPoints[0].clone());
        
        randomPath.current = pathPoints;
        currentPathIndex.current = 0;
        pathProgress.current = 0;
    };

    const onPointerMove = useCallback(
        (event) => {
            const normalizedX = event.x / size.width;
            const normalizedY = 1.0 - event.y / size.height;

            // Reset idle timer on real mouse movement
            lastRealMouseMove.current = Date.now();
            isIdle.current = false;

            targetPointerPos.current.set(normalizedX, normalizedY);

            if (!hasMoved.current) {
                hasMoved.current = true;
                currentPointerPos.current.set(normalizedX, normalizedY);
                lastPointerPos.current.set(normalizedX, normalizedY);
            }
        },
        [size.width, size.height],
    );

    useFrame(() => {
        const now = Date.now();
        const timeSinceLastMove = now - lastRealMouseMove.current;

        // Smooth real mouse movement across the screen
        if (hasMoved.current) {
            // Lerp current pointer position towards the latest target
            currentPointerPos.current.lerp(targetPointerPos.current, 0.2);

            // Compute velocity based on smoothed movement
            const deltaX = (currentPointerPos.current.x - lastPointerPos.current.x) * size.width;
            const deltaY = (currentPointerPos.current.y - lastPointerPos.current.y) * size.height;

            if (Math.abs(deltaX) > 0.1 || Math.abs(deltaY) > 0.1) {
                const splatInfo = {
                    mouseX: currentPointerPos.current.x,
                    mouseY: currentPointerPos.current.y,
                    velocityX: deltaX * force,
                    velocityY: -deltaY * force,
                };

                splatStack.push(splatInfo);
            }

            lastPointerPos.current.copy(currentPointerPos.current);
        }

        // Random idle movement (optional)
        if (enableRandomMovement && timeSinceLastMove > randomMovementIdleThreshold) {
            isIdle.current = true;

            // Initialize path if needed
            if (randomPath.current.length === 0) {
                generateRandomPath();
            }

            // Smooth continuous movement along the path
            const pathSpeed = 0.008; // Adjust this to control movement speed
            pathProgress.current += pathSpeed;

            // Move to next segment when progress reaches 1
            if (pathProgress.current >= 1) {
                pathProgress.current = 0;
                currentPathIndex.current = (currentPathIndex.current + 1) % (randomPath.current.length - 1);
                
                // Generate new path when we complete a full cycle
                if (currentPathIndex.current === 0) {
                    generateRandomPath();
                }
            }

            // Interpolate between current and next point
            const currentPoint = randomPath.current[currentPathIndex.current];
            const nextPoint = randomPath.current[currentPathIndex.current + 1];
            
            if (currentPoint && nextPoint) {
                // Smooth interpolation between points
                const t = pathProgress.current;
                // Use smoothstep for even smoother transitions
                const smoothT = t * t * (3 - 2 * t);
                
                currentRandomPos.current.lerpVectors(currentPoint, nextPoint, smoothT);

                // Calculate velocity for fluid effect
                const randomDeltaX = (currentRandomPos.current.x - lastRandomPos.current.x) * size.width;
                const randomDeltaY = (currentRandomPos.current.y - lastRandomPos.current.y) * size.height;

                // Always add splat for continuous movement (lower threshold)
                if (Math.abs(randomDeltaX) > 0.01 || Math.abs(randomDeltaY) > 0.01) {
                    const splatInfo = {
                        mouseX: currentRandomPos.current.x,
                        mouseY: currentRandomPos.current.y,
                        velocityX: randomDeltaX * force * randomMovementForceMultiplier * 2.5,
                        velocityY: -randomDeltaY * force * randomMovementForceMultiplier * 2.5,
                    };

                    splatStack.push(splatInfo);
                }

                lastRandomPos.current.copy(currentRandomPos.current);
            }
        } else {
            isIdle.current = false;
            // Reset path when not idle
            randomPath.current = [];
        }
    });

    useEffect(() => {
        addEventListener('pointermove', onPointerMove);
        return () => {
            removeEventListener('pointermove', onPointerMove);
        };
    }, [onPointerMove]);

    return splatStack;
};
