import { useEffect, useRef, useState } from 'react'

function CursorGlow() {
  const target = useRef({ x: -300, y: -300 })
  const current = useRef({ x: -300, y: -300 })

  const [position, setPosition] = useState({
    x: -300,
    y: -300,
  })

  useEffect(() => {
    const handleMouseMove = (event) => {
      target.current = {
        x: event.clientX,
        y: event.clientY,
      }
    }

    window.addEventListener('mousemove', handleMouseMove)

    let animationFrame

    const animate = () => {
      current.current.x +=
        (target.current.x - current.current.x) * 0.08

      current.current.y +=
        (target.current.y - current.current.y) * 0.08

      setPosition({
        x: current.current.x,
        y: current.current.y,
      })

      animationFrame = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(animationFrame)
    }
  }, [])

  return (
    <div
      className="pointer-events-none fixed z-[9998] h-72 w-72 rounded-full"
      style={{
        left: position.x,
        top: position.y,
        transform: 'translate(-50%, -50%)',
        background:
          'radial-gradient(circle, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.09) 25%, rgba(255,255,255,0.04) 45%, transparent 72%)',
        filter: 'blur(20px)',
      }}
    />
  )
}

export default CursorGlow