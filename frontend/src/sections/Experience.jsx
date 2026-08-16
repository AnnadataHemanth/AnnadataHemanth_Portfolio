import { motion } from 'framer-motion'
import { experience } from '../data/experience'

function Experience() {
  return (
    <section
      id="experience"
      className="relative bg-black px-6 py-24 md:px-10 md:py-32"
    >
      <div className="mx-auto max-w-7xl">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8 }}
          className="mb-20 text-sm uppercase tracking-[0.3em] text-gray-500"
        >
          Experience
        </motion.p>

        <div className="relative border-l border-white/10">
          {experience.map((item, index) => (
            <motion.div
              key={`${item.company}-${item.role}`}
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                duration: 0.8,
                delay: index * 0.15,
              }}
              className="relative ml-8 pb-16 last:pb-0 md:ml-12"
            >
              <div className="absolute -left-[37px] top-1 h-2.5 w-2.5 rounded-full bg-white md:-left-[49px]" />

              <div className="grid gap-6 md:grid-cols-[160px_1fr]">
                <div className="text-sm uppercase tracking-widest text-gray-600">
                  {item.year}
                </div>

                <div>
                  <h3 className="text-3xl font-medium tracking-tight md:text-4xl">
                    {item.role}
                  </h3>

                  <p className="mt-2 text-lg text-gray-400">
                    {item.company}
                  </p>

                  <p className="mt-6 max-w-2xl text-base leading-relaxed text-gray-500 md:text-lg">
                    {item.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Experience