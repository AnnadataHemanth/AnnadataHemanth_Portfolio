import { useEffect, useRef, useState } from 'react'

function TouchGlow() {
  const target = useRef({ x: 0, y: 0 })
  const current = useRef({ x: 0, y: 0 })
  const animationFrame = useRef(null)

  const [visible, setVisible] = useState(false)
  const [position, setPosition] = useState({
    x: 0,
    y: 0,
  })

  useEffect(() => {
    const animate = () => {
      current.current.x +=
        (target.current.x - current.current.x) * 0.22

      current.current.y +=
        (target.current.y - current.current.y) * 0.22

      setPosition({
        x: current.current.x,
        y: current.current.y,
      })

      animationFrame.current =
        requestAnimationFrame(animate)
    }

    animationFrame.current =
      requestAnimationFrame(animate)

    return () => {
      if (animationFrame.current) {
        cancelAnimationFrame(
          animationFrame.current,
        )
      }
    }
  }, [])

  useEffect(() => {
    const updateTouch = (event) => {
      const touch = event.touches[0]

      if (!touch) return

      target.current.x = touch.clientX
      target.current.y = touch.clientY

      if (!visible) {
        current.current.x = touch.clientX
        current.current.y = touch.clientY
      }

      setVisible(true)
    }

    const handleTouchStart = (event) => {
      updateTouch(event)
    }

    const handleTouchMove = (event) => {
      updateTouch(event)
    }

    const handleTouchEnd = () => {
      setVisible(false)
    }

    window.addEventListener(
      'touchstart',
      handleTouchStart,
      { passive: true },
    )

    window.addEventListener(
      'touchmove',
      handleTouchMove,
      { passive: true },
    )

    window.addEventListener(
      'touchend',
      handleTouchEnd,
      { passive: true },
    )

    window.addEventListener(
      'touchcancel',
      handleTouchEnd,
      { passive: true },
    )

    return () => {
      window.removeEventListener(
        'touchstart',
        handleTouchStart,
      )

      window.removeEventListener(
        'touchmove',
        handleTouchMove,
      )

      window.removeEventListener(
        'touchend',
        handleTouchEnd,
      )

      window.removeEventListener(
        'touchcancel',
        handleTouchEnd,
      )
    }
  }, [visible])

  return (
    <>
      {/* Outer glow */}
      <div
        className="pointer-events-none fixed z-[99999] h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/20 blur-3xl transition-opacity duration-300"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          opacity: visible ? 1 : 0,
        }}
      />

      {/* Inner glow */}
      <div
        className="pointer-events-none fixed z-[100000] h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/35 blur-xl transition-opacity duration-200"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          opacity: visible ? 1 : 0,
        }}
      />
    </>
  )
}

export default TouchGlow