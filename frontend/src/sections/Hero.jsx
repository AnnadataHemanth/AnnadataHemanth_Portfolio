import { motion } from 'framer-motion'
import { useState } from 'react'
import HeroScene from '../three/HeroScene'

const firstName = 'ANNADATA'
const lastName = 'HEMANTH'

function InteractiveWord({ word, hoveredLetter, setHoveredLetter, offset }) {
  return (
    <div className="flex">
      {Array.from(word).map((letter, index) => {
        const id = `${offset}-${index}`
        const isHovered = hoveredLetter === id

        return (
          <motion.span
            key={id}
            onMouseEnter={() => setHoveredLetter(id)}
            onMouseLeave={() => setHoveredLetter(null)}
            animate={{
              y: isHovered ? -16 : 0,
              scale: isHovered ? 1.1 : 1,
            }}
            transition={{
              type: 'spring',
              stiffness: 350,
              damping: 18,
            }}
            className="relative inline-block cursor-default"
            style={{
              textShadow: isHovered
                ? '0 0 30px rgba(255,255,255,0.3)'
                : 'none',
            }}
          >
            {letter}

            <motion.span
              className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-white/10 blur-xl"
              animate={{
                opacity: isHovered ? 1 : 0,
                scale: isHovered ? 1.5 : 0.5,
              }}
              transition={{ duration: 0.2 }}
            />
          </motion.span>
        )
      })}
    </div>
  )
}

function Hero() {
  const [hoveredLetter, setHoveredLetter] = useState(null)

  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center overflow-hidden px-6 md:px-10"
    >
      <HeroScene />

      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-6 text-sm uppercase tracking-[0.3em] text-gray-500"
        >
          AI & Data Science Engineer
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.15 }}
          className="text-6xl font-bold leading-[0.9] tracking-tight sm:text-7xl md:text-8xl lg:text-[7rem]"
          onMouseLeave={() => setHoveredLetter(null)}
        >
          <InteractiveWord
            word={firstName}
            hoveredLetter={hoveredLetter}
            setHoveredLetter={setHoveredLetter}
            offset="first"
          />

          <InteractiveWord
            word={lastName}
            hoveredLetter={hoveredLetter}
            setHoveredLetter={setHoveredLetter}
            offset="last"
          />
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.35 }}
          className="mt-8 max-w-xl text-lg leading-relaxed text-gray-400"
        >
          I build intelligent systems, full-stack applications,
          and experiences powered by AI.
        </motion.p>

        <motion.a
          href="#projects"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          whileHover={{
            scale: 1.05,
            x: 4,
          }}
          whileTap={{
            scale: 0.97,
          }}
          className="group relative mt-10 inline-flex items-center gap-3 overflow-hidden border border-white px-6 py-3 text-sm uppercase tracking-widest transition-colors duration-300 hover:bg-white hover:text-black"
        >
          <span>View My Work</span>

          <span className="transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </motion.a>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          delay: 1.2,
          duration: 1,
        }}
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 md:flex"
      >
        <span className="text-[10px] uppercase tracking-[0.4em] text-gray-500">
          Scroll
        </span>

        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="h-10 w-px bg-gray-600"
        />
      </motion.div>
    </section>
  )
}

export default Hero