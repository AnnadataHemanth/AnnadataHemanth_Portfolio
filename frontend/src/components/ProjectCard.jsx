import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

function ProjectCard({ project, index }) {
  const [isHovered, setIsHovered] = useState(false)
  const [mouseOffset, setMouseOffset] = useState({
    x: 0,
    y: 0,
  })
  const [activeImage, setActiveImage] = useState(0)
  const [selectedImage, setSelectedImage] = useState(null)

  const images = project.images ?? []

  const hasGithub = Boolean(project.github?.trim())
  const hasLive = Boolean(project.live?.trim())

  const handleMouseMove = (event) => {
    const rect =
      event.currentTarget.getBoundingClientRect()

    const x =
      ((event.clientX - rect.left) / rect.width - 0.5) *
      24

    const y =
      ((event.clientY - rect.top) / rect.height - 0.5) *
      18

    setMouseOffset({
      x,
      y,
    })
  }

  const handleMouseLeave = () => {
    setIsHovered(false)

    setMouseOffset({
      x: 0,
      y: 0,
    })
  }

  const nextImage = () => {
  if (images.length <= 1) return

  const nextIndex =
    (activeImage + 1) % images.length

  setActiveImage(nextIndex)
  setSelectedImage(images[nextIndex])
}

const previousImage = () => {
  if (images.length <= 1) return

  const previousIndex =
    (activeImage - 1 + images.length) %
    images.length

  setActiveImage(previousIndex)
  setSelectedImage(images[previousIndex])
}

  const openPreview = () => {
    if (images.length === 0) return

    setSelectedImage(images[activeImage])
  }

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setSelectedImage(null)
      }

      if (
        selectedImage &&
        images.length > 1
      ) {
        if (event.key === 'ArrowRight') {
          nextImage()
        }

        if (event.key === 'ArrowLeft') {
          previousImage()
        }
      }
    }

    window.addEventListener(
      'keydown',
      handleKeyDown,
    )

    return () => {
      window.removeEventListener(
        'keydown',
        handleKeyDown,
      )
    }
  }, [selectedImage, images.length])

  return (
    <>
      <motion.article
        initial={{
          opacity: 0,
          y: 60,
        }}
        whileInView={{
          opacity: 1,
          y: 0,
        }}
        viewport={{
          once: true,
          amount: 0.2,
        }}
        transition={{
          duration: 0.8,
          delay: index * 0.1,
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
        className="group relative min-h-[420px] overflow-hidden border border-white/10 p-6 transition-colors duration-500 hover:border-white/30 md:p-10"
      >
        {/* Project number */}
        <div className="absolute right-6 top-6 text-sm text-gray-600">
          {project.number}
        </div>

        {/* ================================
            PROJECT IMAGE
            ================================ */}

        {images.length > 0 && (
          <div className="relative z-20 mb-10 w-full md:absolute md:right-8 md:top-1/2 md:mb-0 md:w-auto md:-translate-y-1/2">
            <motion.div
              animate={{
                x: mouseOffset.x,
                y: mouseOffset.y,
                rotate: isHovered ? -2 : 0,
                scale: isHovered ? 1.02 : 1,
              }}
              transition={{
                type: 'spring',
                stiffness: 180,
                damping: 22,
              }}
              className="relative mx-auto w-full max-w-sm md:mx-0 md:w-72"
            >
              <button
                type="button"
                onClick={openPreview}
                aria-label={`Open ${project.title} image ${
                  activeImage + 1
                }`}
                className="relative block w-full cursor-zoom-in overflow-hidden rounded-xl border border-white/20 bg-black shadow-2xl outline-none"
              >
                <img
                  src={images[activeImage]}
                  alt={`${project.title} preview ${
                    activeImage + 1
                  }`}
                  className="block aspect-video w-full object-cover transition-transform duration-500 hover:scale-105"
                />

                <span className="absolute bottom-3 right-3 rounded-full bg-black/70 px-3 py-1 text-[10px] uppercase tracking-widest text-white opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
                  Click to open
                </span>
              </button>

              {/* Image controls */}
              {images.length > 1 && (
                <div className="mt-4 flex items-center justify-center gap-4">
                  <button
                    type="button"
                    onClick={previousImage}
                    aria-label="Previous project image"
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 text-gray-400 transition-all duration-300 hover:border-white/40 hover:bg-white hover:text-black"
                  >
                    ←
                  </button>

                  <span className="text-xs text-gray-500">
                    {activeImage + 1} / {images.length}
                  </span>

                  <button
                    type="button"
                    onClick={nextImage}
                    aria-label="Next project image"
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 text-gray-400 transition-all duration-300 hover:border-white hover:bg-white hover:text-black"
                  >
                    →
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}

        {/* ================================
            TEXT CONTENT
            ================================ */}

        <div className="relative z-10 max-w-full md:max-w-[55%]">
          <div className="mb-10 md:mb-16">
            <p className="mb-4 text-xs uppercase tracking-[0.3em] text-gray-600">
              Featured Project
            </p>

            <h3 className="text-3xl font-semibold tracking-tight transition-transform duration-500 group-hover:translate-x-2 sm:text-4xl md:text-5xl">
              {project.title}
            </h3>
          </div>

          <p className="mb-8 text-base leading-relaxed text-gray-400 md:text-lg">
            {project.description}
          </p>

          {/* Technologies */}
          <div className="mb-8 flex flex-wrap gap-2">
            {project.technologies?.map(
              (technology) => (
                <span
                  key={technology}
                  className="border border-white/10 px-3 py-1.5 text-xs text-gray-500 transition-colors duration-300 group-hover:border-white/30 group-hover:text-gray-300"
                >
                  {technology}
                </span>
              ),
            )}
          </div>

          {/* Links */}
          <div className="flex h-5 gap-6 text-sm uppercase tracking-widest">
            {hasGithub && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 transition-colors hover:text-white"
              >
                GitHub ↗
              </a>
            )}

            {hasLive && (
              <a
                href={project.live}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 transition-colors hover:text-white"
              >
                Live ↗
              </a>
            )}
          </div>
        </div>

        {/* ================================
            VIEW PREVIEW
            ================================ */}

        {images.length > 0 && (
          <button
            type="button"
            onClick={openPreview}
            className="absolute bottom-6 right-8 z-10 hidden text-xs uppercase tracking-widest text-gray-600 transition-colors duration-300 hover:text-white md:block"
          >
            View preview ↗
          </button>
        )}

        {/* Bottom line */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-white transition-transform duration-500 group-hover:scale-x-100" />
      </motion.article>

      {/* ================================
          FULLSCREEN IMAGE VIEWER
          ================================ */}

      <AnimatePresence>
        {selectedImage && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-6 backdrop-blur-md"
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            onClick={() =>
              setSelectedImage(null)
            }
          >
            <motion.div
              className="relative max-h-[90vh] max-w-[90vw]"
              initial={{
                opacity: 0,
                scale: 0.9,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                scale: 0.9,
              }}
              transition={{
                duration: 0.25,
              }}
              onClick={(event) =>
                event.stopPropagation()
              }
            >
              <img
                src={selectedImage}
                alt={`${project.title} enlarged preview`}
                className="max-h-[85vh] max-w-[90vw] rounded-xl object-contain shadow-2xl"
              />

              {/* Close */}
              <button
                type="button"
                onClick={() =>
                  setSelectedImage(null)
                }
                aria-label="Close image"
                className="absolute -right-3 -top-3 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black text-xl text-white transition-colors hover:bg-white hover:text-black"
              >
                ×
              </button>

              {/* Previous / Next */}
              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={previousImage}
                    aria-label="Previous image"
                    className="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/70 text-xl text-white transition-colors hover:bg-white hover:text-black"
                  >
                    ←
                  </button>

                  <button
                    type="button"
                    onClick={nextImage}
                    aria-label="Next image"
                    className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/70 text-xl text-white transition-colors hover:bg-white hover:text-black"
                  >
                    →
                  </button>

                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/70 px-3 py-1 text-xs text-gray-300">
                    {activeImage + 1} / {images.length}
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default ProjectCard