import { useState } from 'react'
import { motion } from 'framer-motion'

const API_URL = import.meta.env.VITE_API_URL

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })

  const [status, setStatus] = useState({
    type: '',
    message: '',
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData((current) => ({
      ...current,
      [name]: value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    setIsSubmitting(true)

    setStatus({
      type: '',
      message: '',
    })

    try {
      const response = await fetch(`${API_URL}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message || 'Failed to send message.',
        )
      }

      setStatus({
        type: 'success',
        message: 'Message sent successfully.',
      })

      setFormData({
        name: '',
        email: '',
        message: '',
      })
    } catch (error) {
      setStatus({
        type: 'error',
        message:
          error.message ||
          'Something went wrong. Please try again.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section
      id="contact"
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
          Contact
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1 }}
          className="max-w-5xl text-5xl font-semibold leading-[0.95] tracking-tight sm:text-6xl md:text-8xl"
        >
          LET&apos;S BUILD
          <br />
          SOMETHING
          <br />
          <span className="text-gray-500">TOGETHER.</span>
        </motion.h2>

        <div className="mt-20 grid gap-16 border-t border-white/10 pt-10 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
          >
            <p className="max-w-md text-lg leading-relaxed text-gray-400">
              Have an opportunity, project idea, or just want to connect?
              I&apos;d love to hear from you.
            </p>

            <div className="mt-10 flex flex-wrap gap-6 text-sm uppercase tracking-widest">
              <a
                href="https://github.com/AnnadataHemanth"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 transition-colors hover:text-white"
              >
                GitHub ↗
              </a>

              <a
                href="https://www.linkedin.com/in/annadatahemanth/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 transition-colors hover:text-white"
              >
                LinkedIn ↗
              </a>

              <a
                href="mailto:annadatahemanth@gmail.com"
                className="text-gray-400 transition-colors hover:text-white"
              >
                Email ↗
              </a>
            </div>
          </motion.div>

          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div>
              <label
                htmlFor="name"
                className="mb-3 block text-xs uppercase tracking-widest text-gray-600"
              >
                Name
              </label>

              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
                required
                className="w-full border-b border-white/10 bg-transparent py-3 text-white outline-none transition-colors placeholder:text-gray-700 focus:border-white/40"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-3 block text-xs uppercase tracking-widest text-gray-600"
              >
                Email
              </label>

              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                className="w-full border-b border-white/10 bg-transparent py-3 text-white outline-none transition-colors placeholder:text-gray-700 focus:border-white/40"
              />
            </div>

            <div>
              <label
                htmlFor="message"
                className="mb-3 block text-xs uppercase tracking-widest text-gray-600"
              >
                Message
              </label>

              <textarea
                id="message"
                name="message"
                rows="4"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell me about your idea..."
                required
                className="w-full resize-none border-b border-white/10 bg-transparent py-3 text-white outline-none transition-colors placeholder:text-gray-700 focus:border-white/40"
              />
            </div>

            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={!isSubmitting ? { x: 5 } : {}}
              whileTap={!isSubmitting ? { scale: 0.98 } : {}}
              className="border border-white px-6 py-3 text-sm uppercase tracking-widest transition-all duration-300 hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting
                ? 'Sending...'
                : 'Send Message →'}
            </motion.button>

            {status.message && (
              <p
                className={
                  status.type === 'success'
                    ? 'text-sm text-gray-300'
                    : 'text-sm text-red-400'
                }
              >
                {status.message}
              </p>
            )}
          </motion.form>
        </div>
      </div>
    </section>
  )
}

export default Contact