'use client'

import { useRef, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import * as THREE from 'three'
import ParticleField from './ParticleField'
import FloatingOrb from './FloatingOrb'
import SceneWrapper from './SceneWrapper'

function CameraRig() {
  const mouse = useRef<[number, number]>([0, 0])
  const { camera } = useThree()

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current = [
        (e.clientX / window.innerWidth - 0.5) * 0.6,
        -(e.clientY / window.innerHeight - 0.5) * 0.6,
      ]
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  useFrame(() => {
    camera.position.x += (mouse.current[0] - camera.position.x) * 0.05
    camera.position.y += (mouse.current[1] - camera.position.y) * 0.05
  })

  return null
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={0.8} />
      <Environment preset="city" />

      <ParticleField />

      <FloatingOrb position={[-3, 1, -2]} color="#6C63FF" speed={0.5} />
      <FloatingOrb position={[3, -1, -3]} color="#00D4FF" speed={0.7} />
      <FloatingOrb position={[0.5, 2.5, -4]} color="#A855F7" speed={0.35} />

      <EffectComposer>
        <Bloom
          intensity={1.4}
          luminanceThreshold={0.25}
          luminanceSmoothing={0.9}
          mipmapBlur
        />
      </EffectComposer>

      <CameraRig />
    </>
  )
}

export default function HeroCanvas() {
  return (
    <SceneWrapper>
      <Canvas
        camera={{ position: [0, 0, 5] as [number, number, number], fov: 75 }}
        dpr={[1, 2]}
        gl={{ antialias: false, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Scene />
      </Canvas>
    </SceneWrapper>
  )
}
