import { useEffect, useState } from 'react'

function TouchGlow() {
  const [touch, setTouch] = useState(null)

  useEffect(() => {
    const handleTouchStart = (event) => {
      const currentTouch = event.touches[0]

      if (!currentTouch) return

      setTouch({
        x: currentTouch.clientX,
        y: currentTouch.clientY,
      })
    }

    const handleTouchMove = (event) => {
      const currentTouch = event.touches[0]

      if (!currentTouch) return

      setTouch({
        x: currentTouch.clientX,
        y: currentTouch.clientY,
      })
    }

    const handleTouchEnd = () => {
      setTouch(null)
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

  if (!touch) {
    return null
  }

  return (
    <div
      className="pointer-events-none fixed z-[9999] h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/20 blur-2xl"
      style={{
        left: touch.x,
        top: touch.y,
      }}
    />
  )
}

export default TouchGlow