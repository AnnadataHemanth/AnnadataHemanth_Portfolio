import { useEffect, useState } from 'react'

const API_URL =
  'https://annadatahemanth-portfolio.onrender.com/api'

const emptyForm = {
  year: '',
  role: '',
  company: '',
  description: '',
}

function Experiences() {
  const [experiences, setExperiences] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const token = localStorage.getItem('adminToken')

  // --------------------------------------------------
  // Fetch experiences
  // --------------------------------------------------

  const fetchExperiences = async () => {
    try {
      setLoading(true)
      setError('')

      const response = await fetch(
        `${API_URL}/experiences`,
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message || 'Failed to load experiences.',
        )
      }

      setExperiences(data)
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchExperiences()
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
    setError('')
    setSuccess('')
  }

  // --------------------------------------------------
  // Prepare data
  // --------------------------------------------------

  const prepareFormData = () => ({
    year: form.year.trim(),
    role: form.role.trim(),
    company: form.company.trim(),
    description: form.description.trim(),
  })

  // --------------------------------------------------
  // Add / Update
  // --------------------------------------------------

  const handleSubmit = async (event) => {
    event.preventDefault()

    setSaving(true)
    setError('')
    setSuccess('')

    try {
      const experienceData = prepareFormData()

      const url = editingId
        ? `${API_URL}/experiences/${editingId}`
        : `${API_URL}/experiences`

      const method = editingId ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(experienceData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message || 'Failed to save experience.',
        )
      }

      setSuccess(
        editingId
          ? 'Experience updated successfully.'
          : 'Experience created successfully.',
      )

      setForm(emptyForm)
      setEditingId(null)

      await fetchExperiences()
    } catch (error) {
      setError(error.message)
    } finally {
      setSaving(false)
    }
  }

  // --------------------------------------------------
  // Edit
  // --------------------------------------------------

  const handleEdit = (experience) => {
    setEditingId(experience._id)

    setForm({
      year: experience.year || '',
      role: experience.role || '',
      company: experience.company || '',
      description: experience.description || '',
    })

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

  const handleDelete = async (experienceId) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this experience?',
    )

    if (!confirmed) {
      return
    }

    try {
      setError('')
      setSuccess('')

      const response = await fetch(
        `${API_URL}/experiences/${experienceId}`,
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
            'Failed to delete experience.',
        )
      }

      setSuccess(
        'Experience deleted successfully.',
      )

      if (editingId === experienceId) {
        resetForm()
      }

      await fetchExperiences()
    } catch (error) {
      setError(error.message)
    }
  }

  // --------------------------------------------------
  // Move experience up / down
  // --------------------------------------------------

  const moveExperience = async (
    index,
    direction,
  ) => {
    const newIndex = index + direction

    if (
      newIndex < 0 ||
      newIndex >= experiences.length
    ) {
      return
    }

    const reordered = [...experiences]

    ;[
      reordered[index],
      reordered[newIndex],
    ] = [
      reordered[newIndex],
      reordered[index],
    ]

    setExperiences(reordered)

    setError('')
    setSuccess('')

    try {
      const response = await fetch(
        `${API_URL}/experiences/reorder`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            orderedIds: reordered.map(
              (experience) => experience._id,
            ),
          }),
        },
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message ||
            'Failed to reorder experiences.',
        )
      }

      setExperiences(data)
      setSuccess('Experience order updated.')
    } catch (error) {
      setError(error.message)

      await fetchExperiences()
    }
  }

  return (
    <div className="space-y-10">
      {/* ==================================================
          EXPERIENCE FORM
      ================================================== */}

      <section className="border border-white/10 p-6 md:p-8">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-gray-600">
              {editingId
                ? 'Edit Experience'
                : 'New Experience'}
            </p>

            <h2 className="mt-2 text-2xl font-semibold">
              {editingId
                ? 'Update experience'
                : 'Add an experience'}
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
          {/* Year + Role */}

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label
                htmlFor="year"
                className="mb-2 block text-xs uppercase tracking-widest text-gray-500"
              >
                Year
              </label>

              <input
                id="year"
                name="year"
                type="text"
                value={form.year}
                onChange={handleChange}
                placeholder="e.g. 2025"
                required
                className="w-full border-b border-white/10 bg-transparent py-3 text-white outline-none placeholder:text-gray-700 focus:border-white/40"
              />
            </div>

            <div>
              <label
                htmlFor="role"
                className="mb-2 block text-xs uppercase tracking-widest text-gray-500"
              >
                Role
              </label>

              <input
                id="role"
                name="role"
                type="text"
                value={form.role}
                onChange={handleChange}
                placeholder="e.g. Tech Lead Intern"
                required
                className="w-full border-b border-white/10 bg-transparent py-3 text-white outline-none placeholder:text-gray-700 focus:border-white/40"
              />
            </div>
          </div>

          {/* Company */}

          <div>
            <label
              htmlFor="company"
              className="mb-2 block text-xs uppercase tracking-widest text-gray-500"
            >
              Company / Organization
            </label>

            <input
              id="company"
              name="company"
              type="text"
              value={form.company}
              onChange={handleChange}
              placeholder="e.g. Swecha Telangana × Viswam AI"
              required
              className="w-full border-b border-white/10 bg-transparent py-3 text-white outline-none placeholder:text-gray-700 focus:border-white/40"
            />
          </div>

          {/* Description */}

          <div>
            <label
              htmlFor="description"
              className="mb-2 block text-xs uppercase tracking-widest text-gray-500"
            >
              Description
            </label>

            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="5"
              required
              placeholder="Describe your responsibilities, contributions and achievements..."
              className="w-full resize-none border border-white/10 bg-transparent p-4 text-white outline-none placeholder:text-gray-700 focus:border-white/40"
            />
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
            disabled={saving}
            className="border border-white px-6 py-3 text-sm uppercase tracking-widest transition-all duration-300 hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving
              ? 'Saving...'
              : editingId
                ? 'Update Experience →'
                : 'Add Experience →'}
          </button>
        </form>
      </section>

      {/* ==================================================
          EXISTING EXPERIENCES
      ================================================== */}

      <section>
        <div className="mb-6">
          <p className="text-xs uppercase tracking-[0.25em] text-gray-600">
            Existing Experiences
          </p>

          <h2 className="mt-2 text-2xl font-semibold">
            {experiences.length} experience
            {experiences.length !== 1 ? 's' : ''}
          </h2>
        </div>

        {loading ? (
          <p className="text-gray-500">
            Loading experiences...
          </p>
        ) : experiences.length === 0 ? (
          <p className="text-gray-500">
            No experiences found.
          </p>
        ) : (
          <div className="space-y-3">
            {experiences.map(
              (experience, index) => (
                <div
                  key={experience._id}
                  className="flex flex-col gap-5 border border-white/10 p-6 md:flex-row md:items-center md:justify-between"
                >
                  {/* Information */}

                  <div className="min-w-0">
                    <p className="text-xs uppercase tracking-widest text-gray-600">
                      {experience.year}
                    </p>

                    <h3 className="mt-2 text-xl font-medium">
                      {experience.role}
                    </h3>

                    <p className="mt-2 text-sm text-gray-400">
                      {experience.company}
                    </p>
                  </div>

                  {/* Controls */}

                  <div className="flex flex-wrap items-center gap-2">
                    {/* Move up */}

                    <button
                      type="button"
                      onClick={() =>
                        moveExperience(
                          index,
                          -1,
                        )
                      }
                      disabled={index === 0}
                      aria-label="Move experience up"
                      className="flex h-9 w-9 items-center justify-center border border-white/15 text-gray-400 transition-colors hover:border-white hover:text-white disabled:cursor-not-allowed disabled:opacity-20"
                    >
                      ↑
                    </button>

                    {/* Move down */}

                    <button
                      type="button"
                      onClick={() =>
                        moveExperience(
                          index,
                          1,
                        )
                      }
                      disabled={
                        index ===
                        experiences.length - 1
                      }
                      aria-label="Move experience down"
                      className="flex h-9 w-9 items-center justify-center border border-white/15 text-gray-400 transition-colors hover:border-white hover:text-white disabled:cursor-not-allowed disabled:opacity-20"
                    >
                      ↓
                    </button>

                    {/* Edit */}

                    <button
                      type="button"
                      onClick={() =>
                        handleEdit(experience)
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
                          experience._id,
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

export default Experiences