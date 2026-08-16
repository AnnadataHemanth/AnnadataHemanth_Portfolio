import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const API_URL = import.meta.env.VITE_API_URL

function Skills() {
  const [skills, setSkills] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await fetch(`${API_URL}/skills`)

        if (!response.ok) {
          throw new Error('Failed to fetch skills.')
        }

        const data = await response.json()
        setSkills(data)
      } catch (error) {
        console.error('Skills fetch error:', error)
        setError('Unable to load skills.')
      } finally {
        setLoading(false)
      }
    }

    fetchSkills()
  }, [])

  return (
    <section
      id="skills"
      className="relative bg-black px-6 py-24 md:px-10 md:py-32"
    >
      <div className="mx-auto max-w-7xl">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8 }}
          className="mb-16 text-sm uppercase tracking-[0.3em] text-gray-500"
        >
          Skills
        </motion.p>

        {loading && (
          <p className="text-gray-500">Loading skills...</p>
        )}

        {error && (
          <p className="text-red-400">{error}</p>
        )}

        {!loading && !error && skills.length === 0 && (
          <p className="text-gray-500">No skills found.</p>
        )}

        {!loading && !error && skills.length > 0 && (
          <div className="grid gap-px overflow-hidden border border-white/10 md:grid-cols-2">
            {skills.map((skill, index) => (
              <motion.div
                key={skill._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.7,
                  delay: index * 0.1,
                }}
                whileHover={{
                  backgroundColor: 'rgba(255,255,255,0.05)',
                }}
                className="group border border-white/10 p-8 transition-colors duration-300 md:p-10"
              >
                <div className="mb-8 flex items-center justify-between">
                  <h3 className="text-2xl font-medium">
                    {skill.category}
                  </h3>

                  <span className="text-sm text-gray-600 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
                    ↗
                  </span>
                </div>

                <div className="flex flex-wrap gap-3">
                  {skill.items.map((item) => (
                    <span
                      key={item}
                      className="border border-white/10 px-4 py-2 text-sm text-gray-400 transition-all duration-300 group-hover:border-white/30 group-hover:text-white"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default Skills