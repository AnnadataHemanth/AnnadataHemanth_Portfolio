import { useMemo } from 'react'

function ParticleField() {
  const positions = useMemo(() => {
    const count = 3000
    const values = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      values[i * 3] = (Math.random() - 0.5) * 18
      values[i * 3 + 1] = (Math.random() - 0.5) * 12
      values[i * 3 + 2] = (Math.random() - 0.5) * 10
    }

    return values
  }, [])

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>

      <pointsMaterial
        size={0.035}
        sizeAttenuation
        transparent
        opacity={0.85}
        depthWrite={false}
      />
    </points>
  )
}

export default ParticleField