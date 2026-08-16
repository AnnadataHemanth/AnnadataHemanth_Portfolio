import { useEffect, useState } from 'react'
const API_URL = import.meta.env.VITE_API_URL

const emptyForm = {
  category: '',
  items: '',
}

function Skills() {
  const [skills, setSkills] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const token = localStorage.getItem('adminToken')

  // --------------------------------------------------
  // Fetch skills
  // --------------------------------------------------

  const fetchSkills = async () => {
    try {
      setLoading(true)
      setError('')

      const response = await fetch(`${API_URL}/skills`)

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message || 'Failed to load skills.',
        )
      }

      setSkills(data)
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSkills()
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
    category: form.category.trim(),

    items: form.items
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean),
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
      const skillData = prepareFormData()

      const url = editingId
        ? `${API_URL}/skills/${editingId}`
        : `${API_URL}/skills`

      const method = editingId ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,

        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify(skillData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message || 'Failed to save skill group.',
        )
      }

      setSuccess(
        editingId
          ? 'Skill group updated successfully.'
          : 'Skill group created successfully.',
      )

      setForm(emptyForm)
      setEditingId(null)

      await fetchSkills()
    } catch (error) {
      setError(error.message)
    } finally {
      setSaving(false)
    }
  }

  // --------------------------------------------------
  // Edit
  // --------------------------------------------------

  const handleEdit = (skill) => {
    setEditingId(skill._id)

    setForm({
      category: skill.category || '',
      items: (skill.items || []).join(', '),
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

  const handleDelete = async (skillId) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this skill group?',
    )

    if (!confirmed) {
      return
    }

    try {
      setError('')
      setSuccess('')

      const response = await fetch(
        `${API_URL}/skills/${skillId}`,
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
            'Failed to delete skill group.',
        )
      }

      setSuccess(
        'Skill group deleted successfully.',
      )

      if (editingId === skillId) {
        resetForm()
      }

      await fetchSkills()
    } catch (error) {
      setError(error.message)
    }
  }

  // --------------------------------------------------
  // Move skill group up / down
  // --------------------------------------------------

  const moveSkill = async (index, direction) => {
    const newIndex = index + direction

    if (
      newIndex < 0 ||
      newIndex >= skills.length
    ) {
      return
    }

    const reordered = [...skills]

    ;[
      reordered[index],
      reordered[newIndex],
    ] = [
      reordered[newIndex],
      reordered[index],
    ]

    // Update UI immediately
    setSkills(reordered)

    setError('')
    setSuccess('')

    try {
      const response = await fetch(
        `${API_URL}/skills/reorder`,
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            orderedIds: reordered.map(
              (skill) => skill._id,
            ),
          }),
        },
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message ||
            'Failed to reorder skills.',
        )
      }

      setSkills(data)

      setSuccess('Skill order updated.')
    } catch (error) {
      setError(error.message)

      // Restore backend order
      await fetchSkills()
    }
  }

  return (
    <div className="space-y-10">
      {/* ==================================================
          SKILL FORM
      ================================================== */}

      <section className="border border-white/10 p-6 md:p-8">
        {/* Header */}

        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-gray-600">
              {editingId
                ? 'Edit Skills'
                : 'New Skill Group'}
            </p>

            <h2 className="mt-2 text-2xl font-semibold">
              {editingId
                ? 'Update skill group'
                : 'Add a skill group'}
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
          {/* Category */}

          <div>
            <label
              htmlFor="category"
              className="mb-2 block text-xs uppercase tracking-widest text-gray-500"
            >
              Category
            </label>

            <input
              id="category"
              name="category"
              type="text"
              value={form.category}
              onChange={handleChange}
              placeholder="e.g. AI / ML"
              required
              className="w-full border-b border-white/10 bg-transparent py-3 text-white outline-none placeholder:text-gray-700 focus:border-white/40"
            />
          </div>

          {/* Skills */}

          <div>
            <label
              htmlFor="items"
              className="mb-2 block text-xs uppercase tracking-widest text-gray-500"
            >
              Skills
            </label>

            <input
              id="items"
              name="items"
              type="text"
              value={form.items}
              onChange={handleChange}
              placeholder="e.g. Python, Django, Flask, PostgreSQL"
              required
              className="w-full border-b border-white/10 bg-transparent py-3 text-white outline-none placeholder:text-gray-700 focus:border-white/40"
            />

            <p className="mt-2 text-xs text-gray-700">
              Separate skills with commas.
            </p>
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
                ? 'Update Skills →'
                : 'Add Skill Group →'}
          </button>
        </form>
      </section>

      {/* ==================================================
          EXISTING SKILLS
      ================================================== */}

      <section>
        <div className="mb-6">
          <p className="text-xs uppercase tracking-[0.25em] text-gray-600">
            Existing Skills
          </p>

          <h2 className="mt-2 text-2xl font-semibold">
            {skills.length} skill group
            {skills.length !== 1
              ? 's'
              : ''}
          </h2>
        </div>

        {loading ? (
          <p className="text-gray-500">
            Loading skills...
          </p>
        ) : skills.length === 0 ? (
          <p className="text-gray-500">
            No skill groups found.
          </p>
        ) : (
          <div className="space-y-3">
            {skills.map(
              (skill, index) => (
                <div
                  key={skill._id}
                  className="flex flex-col gap-5 border border-white/10 p-6 md:flex-row md:items-center md:justify-between"
                >
                  {/* Skill information */}

                  <div className="min-w-0">
                    <h3 className="text-xl font-medium">
                      {skill.category}
                    </h3>

                    <p className="mt-2 text-sm text-gray-500">
                      {skill.items?.join(
                        ' · ',
                      )}
                    </p>
                  </div>

                  {/* Controls */}

                  <div className="flex flex-wrap items-center gap-2">
                    {/* Move up */}

                    <button
                      type="button"
                      onClick={() =>
                        moveSkill(
                          index,
                          -1,
                        )
                      }
                      disabled={index === 0}
                      aria-label="Move skill group up"
                      className="flex h-9 w-9 items-center justify-center border border-white/15 text-gray-400 transition-colors hover:border-white hover:text-white disabled:cursor-not-allowed disabled:opacity-20"
                    >
                      ↑
                    </button>

                    {/* Move down */}

                    <button
                      type="button"
                      onClick={() =>
                        moveSkill(
                          index,
                          1,
                        )
                      }
                      disabled={
                        index ===
                        skills.length - 1
                      }
                      aria-label="Move skill group down"
                      className="flex h-9 w-9 items-center justify-center border border-white/15 text-gray-400 transition-colors hover:border-white hover:text-white disabled:cursor-not-allowed disabled:opacity-20"
                    >
                      ↓
                    </button>

                    {/* Edit */}

                    <button
                      type="button"
                      onClick={() =>
                        handleEdit(skill)
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
                          skill._id,
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

export default Skills