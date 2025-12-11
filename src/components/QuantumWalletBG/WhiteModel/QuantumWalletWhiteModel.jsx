'use client'
import { Canvas } from '@react-three/fiber'
import { useGLTF, Environment, Center, OrbitControls } from '@react-three/drei'
import React, { useMemo } from 'react'
import { degToRad } from 'three/src/math/MathUtils'
import * as THREE from 'three'

function Model() {
  const { scene } = useGLTF('assets/models/model-compressed.glb')
  
  const processedScene = useMemo(() => {
    // Clone the scene to avoid mutating the original
    const clonedScene = scene.clone()
    
    const addVectorLines = (object) => {
      object.traverse((child) => {
        if (child.isMesh) {
          // Make the original mesh transparent/invisible
          if (child.material) {
            child.material.transparent = true
            child.material.opacity = 0
            child.material.visible = false
          }

          // Create edges geometry
          const geo = new THREE.EdgesGeometry(child.geometry, 1) // 1 = threshold angle
          const mat = new THREE.LineBasicMaterial({
            color: 0x808080, // Darker grey color for Figma-style look
            transparent: true,
            opacity: .5, // Subtle opacity for softer look
          })

          const edges = new THREE.LineSegments(geo, mat)
          edges.position.copy(child.position)
          edges.rotation.copy(child.rotation)
          edges.scale.copy(child.scale)

          child.add(edges) // Attach outlines to mesh
        }
      })
    }

    addVectorLines(clonedScene)
    return clonedScene
  }, [scene])

  return <primitive rotation={[Math.PI / 2, 0, degToRad(90)]} scale={0.0002} object={processedScene} />
}

export default function QuantumWalletWhiteModel() {
  return (
    <div className='h-screen w-full bg-white'>
      <Canvas camera={{ position: [0, 0, 15], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <Environment preset="studio" environmentIntensity={2} />
        <OrbitControls enableZoom={false} />
        <Center>
          <Model />
        </Center>
      </Canvas>
    </div>
  )
}
