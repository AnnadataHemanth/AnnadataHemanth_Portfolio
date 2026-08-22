import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const API_URL = import.meta.env.VITE_API_URL

function Certificates() {
  const [certificates, setCertificates] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedCertificate, setSelectedCertificate] =
    useState(null)

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const response = await fetch(
          `${API_URL}/certificates`,
        )

        if (!response.ok) {
          throw new Error(
            'Failed to fetch certificates.',
          )
        }

        const data = await response.json()
        setCertificates(data)
      } catch (error) {
        console.error(
          'Certificates fetch error:',
          error,
        )

        setError(
          'Unable to load certificates.',
        )
      } finally {
        setLoading(false)
      }
    }

    fetchCertificates()
  }, [])

  return (
    <section
      id="certificates"
      className="relative bg-black px-6 py-24 md:px-10 md:py-32"
    >
      <div className="mx-auto max-w-7xl">
        {/* Section heading */}

        <motion.p
          initial={{
            opacity: 0,
            y: 20,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.5,
          }}
          transition={{
            duration: 0.8,
          }}
          className="mb-16 text-sm uppercase tracking-[0.3em] text-gray-500"
        >
          Certifications
        </motion.p>

        {/* Loading */}

        {loading && (
          <p className="text-gray-500">
            Loading certificates...
          </p>
        )}

        {/* Error */}

        {error && (
          <p className="text-red-400">
            {error}
          </p>
        )}

        {/* Empty */}

        {!loading &&
          !error &&
          certificates.length === 0 && (
            <p className="text-gray-500">
              No certificates found.
            </p>
          )}

        {/* Certificates */}

        {!loading &&
          !error &&
          certificates.length > 0 && (
            <div className="grid gap-6 md:grid-cols-2">
              {certificates.map(
                (certificate, index) => (
                  <motion.article
                    key={certificate._id}
                    initial={{
                      opacity: 0,
                      y: 40,
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
                      duration: 0.7,
                      delay: index * 0.1,
                    }}
                    className="group border border-white/10 p-5 transition-colors duration-500 hover:border-white/30 md:p-6"
                  >
                    {/* Certificate image */}

                    {certificate.image && (
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedCertificate(
                            certificate,
                          )
                        }
                        className="mb-6 block w-full cursor-zoom-in overflow-hidden border border-white/10 bg-black"
                      >
                        <img
                          src={certificate.image}
                          alt={`${certificate.title} certificate`}
                          className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        />
                      </button>
                    )}

                    {/* Information */}

                    <div>
                      <p className="mb-2 text-xs uppercase tracking-[0.2em] text-gray-600">
                        {certificate.issuer}
                      </p>

                      <h3 className="text-xl font-medium md:text-2xl">
                        {certificate.title}
                      </h3>

                      {certificate.date && (
                        <p className="mt-3 text-sm text-gray-500">
                          {certificate.date}
                        </p>
                      )}

                      {certificate.credentialId && (
                        <p className="mt-2 text-xs text-gray-600">
                          Credential ID:{' '}
                          <span className="text-gray-500">
                            {certificate.credentialId}
                          </span>
                        </p>
                      )}

                      <div className="mt-6 flex gap-5">
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedCertificate(
                              certificate,
                            )
                          }
                          className="text-xs uppercase tracking-widest text-gray-400 transition-colors hover:text-white"
                        >
                          View Certificate ↗
                        </button>

                        {certificate.credentialUrl && (
                          <a
                            href={
                              certificate.credentialUrl
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs uppercase tracking-widest text-gray-400 transition-colors hover:text-white"
                          >
                            Verify ↗
                          </a>
                        )}
                      </div>
                    </div>
                  </motion.article>
                ),
              )}
            </div>
          )}
      </div>

      {/* Fullscreen certificate viewer */}

      {selectedCertificate && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-6 backdrop-blur-md"
          onClick={() =>
            setSelectedCertificate(null)
          }
        >
          <div
            className="relative max-h-[90vh] max-w-6xl"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <img
              src={selectedCertificate.image}
              alt={`${selectedCertificate.title} certificate`}
              className="max-h-[85vh] max-w-full rounded-lg object-contain shadow-2xl"
            />

            <button
              type="button"
              onClick={() =>
                setSelectedCertificate(null)
              }
              aria-label="Close certificate"
              className="absolute -right-3 -top-3 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black text-xl text-white transition-colors hover:bg-white hover:text-black"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </section>
  )
}

export default Certificates