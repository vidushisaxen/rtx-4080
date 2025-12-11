import { useEffect, useRef, useState } from "react";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { gsap } from "gsap";
import * as THREE from "three";

gsap.registerPlugin(ScrollTrigger);

export function useLineArtEffect(rootGroupRef, nodes, LineArtActive, setLineArtActive) {
  const edgeLinesRef = useRef([]);
  const meshMaterialsRef = useRef([]);
  const [edgesReady, setEdgesReady] = useState(false);

  // Add edge geometries to all meshes
  useEffect(() => {
    if (!rootGroupRef.current) return;

    const edgeLines = [];
    const meshMaterials = [];

    rootGroupRef.current.traverse((child) => {
      if (child.isMesh && child.geometry) {
        // Store original material reference
        if (child.material) {
          meshMaterials.push(child.material);
          child.material.side = THREE.DoubleSide;

        }

        // Create edges geometry
        try {
          const edgesGeometry = new THREE.EdgesGeometry(child.geometry, 1);
          const edgesMaterial = new THREE.LineBasicMaterial({
            color: 0x808080,
            transparent: true,
            // side: THREE.DoubleSide,
            opacity: 0,
            depthTest: false,
            depthWrite: true,
          });

          const edges = new THREE.LineSegments(edgesGeometry, edgesMaterial);
          
          // Add edges as a child of the mesh so they inherit all transforms
          child.add(edges);
          edgeLines.push(edges);
        } catch (error) {
          console.warn("Could not create edges for mesh:", child.name, error);
        }
      }
    });

    edgeLinesRef.current = edgeLines;
    meshMaterialsRef.current = meshMaterials;
    setEdgesReady(edgeLines.length > 0);

    return () => {
      // Cleanup edge lines
      edgeLines.forEach((edge) => {
        if (edge.parent) {
          edge.parent.remove(edge);
        }
        if (edge.geometry) edge.geometry.dispose();
        if (edge.material) edge.material.dispose();
      });
      edgeLinesRef.current = [];
      meshMaterialsRef.current = [];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodes]);

  // Line art effect scroll trigger - triggers between 50% and 70% of #SequenceContainer
  useEffect(() => {
    if (typeof window === "undefined" || !edgesReady || edgeLinesRef.current.length === 0) return;

    const showLineArt = () => {
      // Animate line art fade in
      edgeLinesRef.current.forEach((edgeLine) => {
        if (edgeLine && edgeLine.material) {
          gsap.to(edgeLine.material, {
            opacity: 0.2,
            duration: 0.8,
            ease: "linear",
          });
        }
      });

      // Animate mesh fade out
      meshMaterialsRef.current.forEach((material) => {
        if (material) {
          material.transparent = true;
          gsap.to(material, {
            opacity: 0,
            duration: 0.8,
            ease: "linear",
          });
        }
      });
    };

    const hideLineArt = () => {
      // Animate line art fade out
      edgeLinesRef.current.forEach((edgeLine) => {
        if (edgeLine && edgeLine.material) {
          gsap.to(edgeLine.material, {
            opacity: 0,
            duration: 0.8,
            ease: "linear",
          });
        }
      });

      // Animate mesh fade in
      meshMaterialsRef.current.forEach((material) => {
        if (material) {
          gsap.to(material, {
            opacity: 1,
            duration: 0.8,
            ease: "linear",
            onComplete: () => {
              material.transparent = false;
            },
          });
        }
      });
    };

    // Create ScrollTrigger for line art effect between 50% and 70% of #SequenceContainer
    const scrollTrigger = ScrollTrigger.create({
      trigger: '#SequenceContainer',
      start: "43% center",
      end: "74.5% center",
      onEnter: () => {
        showLineArt();
        setLineArtActive(true);
      },
      onEnterBack: () => {
        showLineArt();
        setLineArtActive(true);
      },
      onLeave: () => {
        // Scrolling down past 70% - hide line art
        hideLineArt();
        setLineArtActive(false);
      },
      onLeaveBack: () => {
        // Scrolling back up past 50% - hide line art
        hideLineArt();
        setLineArtActive(false);
      },
    });

    return () => {
      if (scrollTrigger) {
        scrollTrigger.kill();
      }
    };
  }, [edgesReady, LineArtActive]);

  return { edgesReady };
}
