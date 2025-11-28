import { MeshReflectorMaterial, useTexture } from "@react-three/drei";
import { degToRad } from "three/src/math/MathUtils";
import { editable as e } from "@theatre/r3f";

export default function ReflectiveBase() {
    const distortionTexture = useTexture("/assets/models/distortionTexture.jpg");
  
    return (
      <e.group theatreKey="ReflectiveBase" position={[0, -2.1, 0]} rotation={[degToRad(-85), 0, 0]}>
        <mesh>
          <planeGeometry args={[10, 10]} />
          <MeshReflectorMaterial
            blur={[100, 400]}
            resolution={1024}
            contrast={1}
            mixBlur={0}
            mixStrength={50}
            depthScale={1}
            minDepthThreshold={0.85}
            color="#111111"
            metalness={1.0}
            roughness={1}
            distortion={0.2}
            distortionMap={distortionTexture}
          />
        </mesh>
      </e.group>
    );
  }