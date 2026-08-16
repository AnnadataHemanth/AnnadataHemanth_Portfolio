import { motion } from 'framer-motion'
import { education } from '../data/education'

function Education() {
  return (
    <section
      id="education"
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
          Education
        </motion.p>

        {education.map((item, index) => (
          <motion.div
            key={item.institution}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{
              duration: 0.8,
              delay: index * 0.15,
            }}
            className="border-y border-white/10 py-10 md:py-14"
          >
            <div className="grid gap-8 md:grid-cols-[180px_1fr_auto] md:items-center">
              <p className="text-sm uppercase tracking-widest text-gray-600">
                {item.period}
              </p>

              <div>
                <h2 className="text-3xl font-medium tracking-tight md:text-5xl">
                  {item.degree}
                </h2>

                <p className="mt-3 text-lg text-gray-400">
                  {item.institution}
                </p>
              </div>

              <div className="md:text-right">
                <p className="text-xs uppercase tracking-[0.25em] text-gray-600">
                  Current CGPA
                </p>

                <p className="mt-2 text-4xl font-semibold">
                  {item.cgpa}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

export default Education