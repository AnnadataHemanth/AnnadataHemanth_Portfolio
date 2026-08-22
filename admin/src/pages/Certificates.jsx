import { useEffect, useState } from 'react'

const API_URL = import.meta.env.VITE_API_URL

const emptyForm = {
  title: '',
  issuer: '',
  date: '',
  credentialId: '',
  credentialUrl: '',
  image: '',
}

function Certificates() {
  const [certificates, setCertificates] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)

  const [selectedFile, setSelectedFile] = useState(null)

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const token = localStorage.getItem('adminToken')

  // --------------------------------------------------
  // Fetch certificates
  // --------------------------------------------------

  const fetchCertificates = async () => {
    try {
      setLoading(true)
      setError('')

      const response = await fetch(
        `${API_URL}/certificates`,
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message ||
            'Failed to load certificates.',
        )
      }

      setCertificates(data)
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCertificates()
  }, [])

  // --------------------------------------------------
  // Form handling
  // --------------------------------------------------

  const handleChange = (event) => {
    const { name, value } = event.target

    setForm((current) => ({
      ...current,
      [name]: value,
    }))
  }

  const resetForm = () => {
    setForm(emptyForm)
    setEditingId(null)
    setSelectedFile(null)

    setError('')
    setSuccess('')
  }

  // --------------------------------------------------
  // File selection
  // --------------------------------------------------

  const handleFileSelection = (event) => {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    setSelectedFile(file)
    setError('')
    setSuccess('')
  }

  // --------------------------------------------------
  // Upload certificate image
  // --------------------------------------------------

  const uploadImage = async () => {
    if (!selectedFile) {
      setError(
        'Please choose a certificate image.',
      )
      return null
    }

    setUploading(true)
    setError('')
    setSuccess('')

    try {
      const formData = new FormData()

      formData.append('image', selectedFile)

      const response = await fetch(
        `${API_URL}/certificates/upload`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        },
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message ||
            'Certificate image upload failed.',
        )
      }

      setForm((current) => ({
        ...current,
        image: data.image,
      }))

      setSelectedFile(null)

      setSuccess(
        'Certificate image uploaded successfully.',
      )

      return data.image
    } catch (error) {
      setError(error.message)
      return null
    } finally {
      setUploading(false)
    }
  }

  // --------------------------------------------------
  // Add / Update certificate
  // --------------------------------------------------

  const handleSubmit = async (event) => {
    event.preventDefault()

    setSaving(true)
    setError('')
    setSuccess('')

    try {
      let imageUrl = form.image

      // Upload image first if a new file was selected
      if (selectedFile) {
        imageUrl = await uploadImage()

        if (!imageUrl) {
          setSaving(false)
          return
        }
      }

      if (!imageUrl) {
        throw new Error(
          'Please upload a certificate image.',
        )
      }

      const certificateData = {
        title: form.title.trim(),
        issuer: form.issuer.trim(),
        date: form.date.trim(),
        credentialId:
          form.credentialId.trim(),
        credentialUrl:
          form.credentialUrl.trim(),
        image: imageUrl,
      }

      const url = editingId
        ? `${API_URL}/certificates/${editingId}`
        : `${API_URL}/certificates`

      const method = editingId ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,

        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify(
          certificateData,
        ),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message ||
            'Failed to save certificate.',
        )
      }

      setSuccess(
        editingId
          ? 'Certificate updated successfully.'
          : 'Certificate created successfully.',
      )

      setForm(emptyForm)
      setEditingId(null)
      setSelectedFile(null)

      await fetchCertificates()
    } catch (error) {
      setError(error.message)
    } finally {
      setSaving(false)
    }
  }

  // --------------------------------------------------
  // Edit
  // --------------------------------------------------

  const handleEdit = (certificate) => {
    setEditingId(certificate._id)

    setForm({
      title: certificate.title || '',
      issuer: certificate.issuer || '',
      date: certificate.date || '',
      credentialId:
        certificate.credentialId || '',
      credentialUrl:
        certificate.credentialUrl || '',
      image: certificate.image || '',
    })

    setSelectedFile(null)

    setError('')
    setSuccess('')

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  // --------------------------------------------------
  // Delete
  // --------------------------------------------------

  const handleDelete = async (
    certificateId,
  ) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this certificate?',
    )

    if (!confirmed) {
      return
    }

    try {
      setError('')
      setSuccess('')

      const response = await fetch(
        `${API_URL}/certificates/${certificateId}`,
        {
          method: 'DELETE',

          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message ||
            'Failed to delete certificate.',
        )
      }

      setSuccess(
        'Certificate deleted successfully.',
      )

      if (editingId === certificateId) {
        resetForm()
      }

      await fetchCertificates()
    } catch (error) {
      setError(error.message)
    }
  }

  // --------------------------------------------------
  // Move certificate up / down
  // --------------------------------------------------

  const moveCertificate = async (
    index,
    direction,
  ) => {
    const newIndex = index + direction

    if (
      newIndex < 0 ||
      newIndex >= certificates.length
    ) {
      return
    }

    const reordered = [...certificates]

    ;[
      reordered[index],
      reordered[newIndex],
    ] = [
      reordered[newIndex],
      reordered[index],
    ]

    // Update UI immediately
    setCertificates(reordered)

    setError('')
    setSuccess('')

    try {
      const response = await fetch(
        `${API_URL}/certificates/reorder`,
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            orderedIds: reordered.map(
              (certificate) =>
                certificate._id,
            ),
          }),
        },
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message ||
            'Failed to reorder certificates.',
        )
      }

      setCertificates(data)

      setSuccess(
        'Certificate order updated.',
      )
    } catch (error) {
      setError(error.message)

      await fetchCertificates()
    }
  }

  return (
    <div className="space-y-10">
      {/* ==================================================
          CERTIFICATE FORM
      ================================================== */}

      <section className="border border-white/10 p-6 md:p-8">
        {/* Header */}

        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-gray-600">
              {editingId
                ? 'Edit Certificate'
                : 'New Certificate'}
            </p>

            <h2 className="mt-2 text-2xl font-semibold">
              {editingId
                ? 'Update certificate'
                : 'Add a certificate'}
            </h2>
          </div>

          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="text-sm text-gray-500 transition-colors hover:text-white"
            >
              Cancel
            </button>
          )}
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          {/* Title + Issuer */}

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label
                htmlFor="title"
                className="mb-2 block text-xs uppercase tracking-widest text-gray-500"
              >
                Certificate Name
              </label>

              <input
                id="title"
                name="title"
                type="text"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. AWS Certified Cloud Practitioner"
                required
                className="w-full border-b border-white/10 bg-transparent py-3 text-white outline-none placeholder:text-gray-700 focus:border-white/40"
              />
            </div>

            <div>
              <label
                htmlFor="issuer"
                className="mb-2 block text-xs uppercase tracking-widest text-gray-500"
              >
                Issuing Organization
              </label>

              <input
                id="issuer"
                name="issuer"
                type="text"
                value={form.issuer}
                onChange={handleChange}
                placeholder="e.g. Amazon Web Services"
                required
                className="w-full border-b border-white/10 bg-transparent py-3 text-white outline-none placeholder:text-gray-700 focus:border-white/40"
              />
            </div>
          </div>

          {/* Date + Credential ID */}

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label
                htmlFor="date"
                className="mb-2 block text-xs uppercase tracking-widest text-gray-500"
              >
                Issue Date
              </label>

              <input
                id="date"
                name="date"
                type="text"
                value={form.date}
                onChange={handleChange}
                placeholder="e.g. August 2026"
                className="w-full border-b border-white/10 bg-transparent py-3 text-white outline-none placeholder:text-gray-700 focus:border-white/40"
              />
            </div>

            <div>
              <label
                htmlFor="credentialId"
                className="mb-2 block text-xs uppercase tracking-widest text-gray-500"
              >
                Credential ID
              </label>

              <input
                id="credentialId"
                name="credentialId"
                type="text"
                value={form.credentialId}
                onChange={handleChange}
                placeholder="Optional"
                className="w-full border-b border-white/10 bg-transparent py-3 text-white outline-none placeholder:text-gray-700 focus:border-white/40"
              />
            </div>
          </div>

          {/* Credential URL */}

          <div>
            <label
              htmlFor="credentialUrl"
              className="mb-2 block text-xs uppercase tracking-widest text-gray-500"
            >
              Credential URL
            </label>

            <input
              id="credentialUrl"
              name="credentialUrl"
              type="url"
              value={form.credentialUrl}
              onChange={handleChange}
              placeholder="e.g. https://..."
              className="w-full border-b border-white/10 bg-transparent py-3 text-white outline-none placeholder:text-gray-700 focus:border-white/40"
            />
          </div>

          {/* Certificate Image */}

          <div>
            <label
              htmlFor="certificate-image"
              className="mb-3 block text-xs uppercase tracking-widest text-gray-500"
            >
              Certificate Image
            </label>

            <div className="border border-dashed border-white/15 p-6">
              <input
                id="certificate-image"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleFileSelection}
                className="block w-full text-sm text-gray-400 file:mr-4 file:border file:border-white/20 file:bg-transparent file:px-4 file:py-2 file:text-xs file:uppercase file:tracking-widest file:text-white file:hover:bg-white file:hover:text-black"
              />

              <p className="mt-3 text-xs text-gray-700">
                JPG, PNG or WEBP. Maximum 5 MB.
              </p>

              {selectedFile && (
                <div className="mt-5">
                  <p className="text-sm text-gray-400">
                    Selected: {selectedFile.name}
                  </p>
                </div>
              )}

              {form.image && (
                <div className="mt-5">
                  <p className="mb-3 text-xs uppercase tracking-widest text-gray-600">
                    Current Image
                  </p>

                  <img
                    src={form.image}
                    alt="Certificate preview"
                    className="max-h-48 border border-white/10 object-contain"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Status */}

          {error && (
            <p className="text-sm text-red-400">
              {error}
            </p>
          )}

          {success && (
            <p className="text-sm text-green-400">
              {success}
            </p>
          )}

          {/* Save */}

          <button
            type="submit"
            disabled={saving || uploading}
            className="border border-white px-6 py-3 text-sm uppercase tracking-widest transition-all duration-300 hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving
              ? 'Saving...'
              : editingId
                ? 'Update Certificate →'
                : 'Add Certificate →'}
          </button>
        </form>
      </section>

      {/* ==================================================
          EXISTING CERTIFICATES
      ================================================== */}

      <section>
        <div className="mb-6">
          <p className="text-xs uppercase tracking-[0.25em] text-gray-600">
            Existing Certificates
          </p>

          <h2 className="mt-2 text-2xl font-semibold">
            {certificates.length} certificate
            {certificates.length !== 1
              ? 's'
              : ''}
          </h2>
        </div>

        {loading ? (
          <p className="text-gray-500">
            Loading certificates...
          </p>
        ) : certificates.length === 0 ? (
          <p className="text-gray-500">
            No certificates found.
          </p>
        ) : (
          <div className="space-y-3">
            {certificates.map(
              (certificate, index) => (
                <div
                  key={certificate._id}
                  className="flex flex-col gap-5 border border-white/10 p-6 md:flex-row md:items-center md:justify-between"
                >
                  {/* Certificate information */}

                  <div className="flex min-w-0 items-center gap-5">
                    {certificate.image && (
                      <img
                        src={certificate.image}
                        alt={certificate.title}
                        className="h-20 w-28 shrink-0 border border-white/10 object-cover"
                      />
                    )}

                    <div className="min-w-0">
                      <h3 className="text-xl font-medium">
                        {certificate.title}
                      </h3>

                      <p className="mt-2 text-sm text-gray-500">
                        {certificate.issuer}
                      </p>

                      {certificate.date && (
                        <p className="mt-2 text-xs text-gray-700">
                          {certificate.date}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Controls */}

                  <div className="flex flex-wrap items-center gap-2">
                    {/* Move up */}

                    <button
                      type="button"
                      onClick={() =>
                        moveCertificate(
                          index,
                          -1,
                        )
                      }
                      disabled={index === 0}
                      aria-label="Move certificate up"
                      className="flex h-9 w-9 items-center justify-center border border-white/15 text-gray-400 transition-colors hover:border-white hover:text-white disabled:cursor-not-allowed disabled:opacity-20"
                    >
                      ↑
                    </button>

                    {/* Move down */}

                    <button
                      type="button"
                      onClick={() =>
                        moveCertificate(
                          index,
                          1,
                        )
                      }
                      disabled={
                        index ===
                        certificates.length - 1
                      }
                      aria-label="Move certificate down"
                      className="flex h-9 w-9 items-center justify-center border border-white/15 text-gray-400 transition-colors hover:border-white hover:text-white disabled:cursor-not-allowed disabled:opacity-20"
                    >
                      ↓
                    </button>

                    {/* Edit */}

                    <button
                      type="button"
                      onClick={() =>
                        handleEdit(
                          certificate,
                        )
                      }
                      className="border border-white/15 px-4 py-2 text-xs uppercase tracking-widest text-gray-400 transition-colors hover:border-white hover:text-white"
                    >
                      Edit
                    </button>

                    {/* Delete */}

                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(
                          certificate._id,
                        )
                      }
                      className="border border-red-500/20 px-4 py-2 text-xs uppercase tracking-widest text-red-400 transition-colors hover:border-red-400 hover:bg-red-500/10"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ),
            )}
          </div>
        )}
      </section>
    </div>
  )
}

export default Certificates