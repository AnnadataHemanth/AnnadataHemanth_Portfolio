import { motion } from 'framer-motion'

function About() {
  return (
    <section
      id="about"
      className="relative bg-black px-6 py-24 md:px-10 md:py-32"
    >
      <div className="mx-auto max-w-7xl">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8 }}
          className="mb-12 text-sm uppercase tracking-[0.3em] text-gray-500"
        >
          About Me
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9 }}
          className="max-w-5xl text-4xl font-medium leading-[1.08] tracking-tight text-gray-300 sm:text-5xl md:text-5xl lg:text-6xl"
        >
          I build at the intersection of{' '}
          <span className="text-white">AI</span>,{' '}
          <span className="text-white">software</span>, and{' '}
          <span className="text-white">data</span>.
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="mt-16 grid gap-10 border-t border-white/10 pt-10 md:grid-cols-2 md:gap-20"
        >
          <div>
            <p className="text-lg leading-relaxed text-gray-400 md:text-xl">
              I&apos;m an AI &amp; Data Science engineer who enjoys building
              things from the ground up — from machine learning and computer
              vision systems to Python full-stack applications and AI-powered
              products.
            </p>
          </div>

          <div>
            <p className="text-lg leading-relaxed text-gray-500 md:text-xl">
              I learn by building. I like taking an idea, figuring out how
              it should work, and turning it into something I can actually
              run, test, and use. Right now, I&apos;m focused on AI
              engineering, Python full-stack development, data, and building
              useful products.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-16 flex flex-wrap gap-x-10 gap-y-4 border-t border-white/10 pt-8 text-sm uppercase tracking-widest text-gray-600"
        >
          <span>AI Engineering</span>
          <span>Python Full Stack</span>
          <span>Data &amp; Analytics</span>
          <span>Computer Vision</span>
        </motion.div>
      </div>
    </section>
  )
}

export default About