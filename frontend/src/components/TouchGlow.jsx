import { useEffect, useState } from 'react'

function TouchGlow() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handleTouch = () => {
      setVisible(true)

      setTimeout(() => {
        setVisible(false)
      }, 1000)
    }

    window.addEventListener('touchstart', handleTouch)

    return () => {
      window.removeEventListener('touchstart', handleTouch)
    }
  }, [])

  return (
    <div
      className={`fixed left-1/2 top-1/2 z-[99999] h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-500 transition-opacity ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
    />
  )
}

export default TouchGlow