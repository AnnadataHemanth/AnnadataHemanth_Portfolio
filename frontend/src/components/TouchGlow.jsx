import { useEffect, useRef } from 'react'

function TouchGlow() {
  const glowRef = useRef(null)

  useEffect(() => {
    const glow = glowRef.current

    if (!glow) return

    const moveGlow = (x, y) => {
      glow.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`
    }

    const handleTouchStart = (event) => {
      const touch = event.touches[0]

      if (!touch) return

      moveGlow(touch.clientX, touch.clientY)

      glow.style.opacity = '1'
      glow.style.width = '110px'
      glow.style.height = '110px'
    }

    const handleTouchMove = (event) => {
      const touch = event.touches[0]

      if (!touch) return

      moveGlow(touch.clientX, touch.clientY)
      glow.style.opacity = '1'
    }

    const handleTouchEnd = () => {
      glow.style.opacity = '0'
      glow.style.width = '70px'
      glow.style.height = '70px'
    }

    window.addEventListener('touchstart', handleTouchStart, {
      passive: true,
    })

    window.addEventListener('touchmove', handleTouchMove, {
      passive: true,
    })

    window.addEventListener('touchend', handleTouchEnd, {
      passive: true,
    })

    window.addEventListener('touchcancel', handleTouchEnd, {
      passive: true,
    })

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
  }, [])

  return (
    <div
      ref={glowRef}
      className="pointer-events-none fixed left-0 top-0 z-[9999] h-[70px] w-[70px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/20 opacity-0 blur-2xl transition-all duration-200"
    />
  )
}

export default TouchGlow