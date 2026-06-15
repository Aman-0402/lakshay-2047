'use client'

import { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface FloatingOrbProps {
  position: [number, number, number]
  color: string
  speed: number
}

export default function FloatingOrb({ position, color, speed }: FloatingOrbProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const originY = position[1]

  const geometry = useMemo(() => new THREE.SphereGeometry(0.75, 32, 32), [])

  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color,
        emissive: color,
        emissiveIntensity: 0.6,
        transparent: true,
        opacity: 0.85,
        roughness: 0.1,
        metalness: 0.2,
      }),
    [color]
  )

  useEffect(() => {
    return () => {
      geometry.dispose()
      material.dispose()
    }
  }, [geometry, material])

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.position.y =
        originY + Math.sin(clock.elapsedTime * speed) * 0.4
      meshRef.current.rotation.y += 0.005 * speed
    }
  })

  return (
    <mesh
      ref={meshRef}
      position={position}
      geometry={geometry}
      material={material}
    />
  )
}
