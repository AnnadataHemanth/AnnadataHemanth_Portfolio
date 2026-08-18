import { Canvas, useFrame } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import ParticleField from './ParticleField'

function CameraController() {
  const target = useRef({ x: 0, y: 0 })
  const current = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const updatePosition = (clientX, clientY) => {
      target.current.x =
        ((clientX / window.innerWidth) - 0.5) * 2

      target.current.y =
        -((clientY / window.innerHeight) - 0.5) * 2
    }

    const handleMouseMove = (event) => {
      updatePosition(event.clientX, event.clientY)
    }

    const handleTouchMove = (event) => {
      const touch = event.touches[0]

      if (!touch) return

      updatePosition(
        touch.clientX,
        touch.clientY,
      )
    }

    window.addEventListener(
      'mousemove',
      handleMouseMove,
      { passive: true },
    )

    window.addEventListener(
      'touchmove',
      handleTouchMove,
      { passive: true },
    )

    return () => {
      window.removeEventListener(
        'mousemove',
        handleMouseMove,
      )

      window.removeEventListener(
        'touchmove',
        handleTouchMove,
      )
    }
  }, [])

  useFrame(({ camera, clock }) => {
    current.current.x = THREE.MathUtils.lerp(
      current.current.x,
      target.current.x * 0.18,
      0.07,
    )

    current.current.y = THREE.MathUtils.lerp(
      current.current.y,
      target.current.y * 0.12,
      0.07,
    )

    camera.position.x =
      current.current.x +
      Math.sin(clock.elapsedTime * 0.15) * 0.015

    camera.position.y =
      current.current.y +
      Math.cos(clock.elapsedTime * 0.12) * 0.01
  })

  return null
}

function StarMotion() {
  const groupRef = useRef()

  useFrame((state) => {
    if (!groupRef.current) return

    const time = state.clock.elapsedTime

    groupRef.current.rotation.y =
      time * 0.006

    groupRef.current.rotation.x =
      Math.sin(time * 0.1) * 0.012
  })

  return (
    <group ref={groupRef}>
      <ParticleField />
    </group>
  )
}

function HeroScene() {
  return (
    <div className="pointer-events-none absolute inset-0 opacity-70">
      <Canvas
        camera={{
          position: [0, 0, 8],
          fov: 50,
        }}
        dpr={[1, 2]}
      >
        <CameraController />
        <StarMotion />
      </Canvas>
    </div>
  )
}

export default HeroScene