import { Canvas, useFrame } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import ParticleField from './ParticleField'

function CameraController() {
  const target = useRef({ x: 0, y: 0 })
  const current = useRef({ x: 0, y: 0 })

  const lastDirection = useRef({
    x: 0,
    y: 0,
  })

  useEffect(() => {
    const handleMouseMove = (event) => {
      const normalizedX =
        (event.clientX / window.innerWidth - 0.5) * 2

      const normalizedY =
        (event.clientY / window.innerHeight - 0.5) * -2

      const dx = normalizedX - target.current.x
      const dy = normalizedY - target.current.y

      // Remember the direction the cursor was moving.
      if (Math.abs(dx) > 0.001) {
        lastDirection.current.x = Math.sign(dx)
      }

      if (Math.abs(dy) > 0.001) {
        lastDirection.current.y = Math.sign(dy)
      }

      target.current.x = normalizedX
      target.current.y = normalizedY
    }

    window.addEventListener('mousemove', handleMouseMove, {
      passive: true,
    })

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  useFrame(({ camera }) => {
    /*
      Cursor direction controls the star direction.

      Cursor → right
      camera → right
      visible stars → left

      Cursor → left
      camera → left
      visible stars → right
    */

    const movementSpeedX = 0.030
    const movementSpeedY = 0.030

    // Keep the camera movement continuous.
    current.current.x +=
      lastDirection.current.x * movementSpeedX

    current.current.y +=
      lastDirection.current.y * movementSpeedY

    // Keep the movement safely bounded.
    current.current.x = THREE.MathUtils.clamp(
      current.current.x,
      -0.45,
      0.45,
    )

    current.current.y = THREE.MathUtils.clamp(
      current.current.y,
      -0.3,
      0.3,
    )

    // Smoothly follow the camera target.
    camera.position.x = THREE.MathUtils.lerp(
      camera.position.x,
      current.current.x,
      0.08,
    )

    camera.position.y = THREE.MathUtils.lerp(
      camera.position.y,
      current.current.y,
      0.08,
    )
  })

  return null
}

function StarMotion() {
  const groupRef = useRef()

  useFrame((state) => {
    if (!groupRef.current) return

    const time = state.clock.elapsedTime

    // Continuous ambient movement.
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