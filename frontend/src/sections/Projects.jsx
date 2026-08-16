import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import ProjectCard from '../components/ProjectCard'

const API_URL = import.meta.env.VITE_API_URL

function Projects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(`${API_URL}/projects`)

        if (!response.ok) {
          throw new Error('Failed to fetch projects.')
        }

        const data = await response.json()
        setProjects(data)
      } catch (error) {
        console.error('Projects fetch error:', error)
        setError('Unable to load projects.')
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  return (
    <section
      id="projects"
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
          Selected Work
        </motion.p>

        {loading && (
          <p className="text-gray-500">Loading projects...</p>
        )}

        {error && (
          <p className="text-red-400">{error}</p>
        )}

        {!loading && !error && projects.length === 0 && (
          <p className="text-gray-500">No projects found.</p>
        )}

        {!loading && !error && projects.length > 0 && (
          <div className="space-y-6">
            {projects.map((project, index) => (
              <ProjectCard
                key={project._id}
                project={project}
                index={index}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default Projects