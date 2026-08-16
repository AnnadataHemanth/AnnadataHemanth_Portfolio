import { useEffect, useState } from 'react'

const API_URL = import.meta.env.VITE_API_URL

const emptyForm = {
  number: '',
  title: '',
  description: '',
  technologies: '',
  images: [],
  github: '',
  live: '',
}

function Projects() {
  const [projects, setProjects] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)

  const [selectedFiles, setSelectedFiles] = useState([])

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const token = localStorage.getItem('adminToken')

  // --------------------------------------------------
  // Fetch projects
  // --------------------------------------------------

  const fetchProjects = async () => {
    try {
      setLoading(true)
      setError('')

      const response = await fetch(`${API_URL}/projects`)

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message || 'Failed to load projects.',
        )
      }

      setProjects(data)
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProjects()
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
    setSelectedFiles([])

    setError('')
    setSuccess('')
  }

  // --------------------------------------------------
  // Image selection
  // --------------------------------------------------

  const handleFileSelection = (event) => {
    const files = Array.from(event.target.files)

    setSelectedFiles(files)
    setError('')
  }

  // --------------------------------------------------
  // Image upload
  // --------------------------------------------------

  const uploadImages = async () => {
    if (selectedFiles.length === 0) {
      setError('Please choose at least one image.')
      return
    }

    setUploading(true)
    setError('')
    setSuccess('')

    try {
      const formData = new FormData()

      selectedFiles.forEach((file) => {
        formData.append('images', file)
      })

      const response = await fetch(
        `${API_URL}/projects/upload`,
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
          data.message || 'Image upload failed.',
        )
      }

      setForm((current) => ({
        ...current,
        images: [
          ...current.images,
          ...data.images,
        ],
      }))

      setSelectedFiles([])

      setSuccess(
        `${data.images.length} image${
          data.images.length !== 1 ? 's' : ''
        } uploaded successfully.`,
      )
    } catch (error) {
      setError(error.message)
    } finally {
      setUploading(false)
    }
  }

  // --------------------------------------------------
  // Remove image from current project
  // --------------------------------------------------

  const removeImage = (indexToRemove) => {
    setForm((current) => ({
      ...current,
      images: current.images.filter(
        (_, index) => index !== indexToRemove,
      ),
    }))
  }

  // --------------------------------------------------
  // Prepare data before sending to backend
  // --------------------------------------------------

  const prepareFormData = () => ({
    number: form.number.trim(),

    title: form.title.trim(),

    description: form.description.trim(),

    technologies: form.technologies
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean),

    images: form.images,

    github: form.github.trim(),

    live: form.live.trim(),
  })

  // --------------------------------------------------
  // Add / Update project
  // --------------------------------------------------

  const handleSubmit = async (event) => {
    event.preventDefault()

    setSaving(true)
    setError('')
    setSuccess('')

    try {
      const projectData = prepareFormData()

      const url = editingId
        ? `${API_URL}/projects/${editingId}`
        : `${API_URL}/projects`

      const method = editingId ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,

        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify(projectData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message || 'Failed to save project.',
        )
      }

      setSuccess(
        editingId
          ? 'Project updated successfully.'
          : 'Project created successfully.',
      )

      setForm(emptyForm)
      setEditingId(null)
      setSelectedFiles([])

      await fetchProjects()
    } catch (error) {
      setError(error.message)
    } finally {
      setSaving(false)
    }
  }

  // --------------------------------------------------
  // Edit
  // --------------------------------------------------

  const handleEdit = (project) => {
    setEditingId(project._id)

    setForm({
      number: project.number || '',
      title: project.title || '',
      description: project.description || '',
      technologies: (
        project.technologies || []
      ).join(', '),
      images: project.images || [],
      github: project.github || '',
      live: project.live || '',
    })

    setSelectedFiles([])

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

  const handleDelete = async (projectId) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this project?',
    )

    if (!confirmed) {
      return
    }

    try {
      setError('')
      setSuccess('')

      const response = await fetch(
        `${API_URL}/projects/${projectId}`,
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
            'Failed to delete project.',
        )
      }

      setSuccess(
        'Project deleted successfully.',
      )

      if (editingId === projectId) {
        resetForm()
      }

      await fetchProjects()
    } catch (error) {
      setError(error.message)
    }
  }

  // --------------------------------------------------
  // Move project up / down
  // --------------------------------------------------

  const moveProject = async (index, direction) => {
    const newIndex = index + direction

    if (
      newIndex < 0 ||
      newIndex >= projects.length
    ) {
      return
    }

    const reordered = [...projects]

    ;[
      reordered[index],
      reordered[newIndex],
    ] = [
      reordered[newIndex],
      reordered[index],
    ]

    // Update UI immediately
    setProjects(reordered)

    setError('')
    setSuccess('')

    try {
      const response = await fetch(
        `${API_URL}/projects/reorder`,
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            orderedIds: reordered.map(
              (project) => project._id,
            ),
          }),
        },
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message ||
            'Failed to reorder projects.',
        )
      }

      setProjects(data)

      setSuccess('Project order updated.')
    } catch (error) {
      setError(error.message)

      // Restore actual backend order
      await fetchProjects()
    }
  }

  return (
    <div className="space-y-10">
      {/* ==================================================
          PROJECT FORM
      ================================================== */}

      <section className="border border-white/10 p-6 md:p-8">
        {/* Header */}

        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-gray-600">
              {editingId
                ? 'Edit Project'
                : 'New Project'}
            </p>

            <h2 className="mt-2 text-2xl font-semibold">
              {editingId
                ? 'Update project'
                : 'Add a project'}
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
          {/* Number + title */}

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label
                htmlFor="number"
                className="mb-2 block text-xs uppercase tracking-widest text-gray-500"
              >
                Number
              </label>

              <input
                id="number"
                name="number"
                type="text"
                value={form.number}
                onChange={handleChange}
                placeholder="e.g. 01"
                required
                className="w-full border-b border-white/10 bg-transparent py-3 text-white outline-none placeholder:text-gray-700 focus:border-white/40"
              />
            </div>

            <div>
              <label
                htmlFor="title"
                className="mb-2 block text-xs uppercase tracking-widest text-gray-500"
              >
                Title
              </label>

              <input
                id="title"
                name="title"
                type="text"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. AI Receptionist"
                required
                className="w-full border-b border-white/10 bg-transparent py-3 text-white outline-none placeholder:text-gray-700 focus:border-white/40"
              />
            </div>
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
              rows="4"
              required
              placeholder="e.g. A voice-based AI receptionist that..."
              className="w-full resize-none border border-white/10 bg-transparent p-4 text-white outline-none placeholder:text-gray-700 focus:border-white/40"
            />
          </div>

          {/* Technologies */}

          <div>
            <label
              htmlFor="technologies"
              className="mb-2 block text-xs uppercase tracking-widest text-gray-500"
            >
              Technologies
            </label>

            <input
              id="technologies"
              name="technologies"
              type="text"
              value={form.technologies}
              onChange={handleChange}
              placeholder="e.g. Python, FastAPI, Twilio"
              className="w-full border-b border-white/10 bg-transparent py-3 text-white outline-none placeholder:text-gray-700 focus:border-white/40"
            />

            <p className="mt-2 text-xs text-gray-700">
              Separate technologies with commas.
            </p>
          </div>

          {/* ==================================================
              IMAGE UPLOAD
          ================================================== */}

          <div>
            <label
              htmlFor="project-images"
              className="mb-3 block text-xs uppercase tracking-widest text-gray-500"
            >
              Project Images
            </label>

            <div className="border border-dashed border-white/15 p-6">
              <input
                id="project-images"
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif"
                multiple
                onChange={handleFileSelection}
                className="block w-full text-sm text-gray-400 file:mr-4 file:border file:border-white/20 file:bg-transparent file:px-4 file:py-2 file:text-xs file:uppercase file:tracking-widest file:text-white file:hover:bg-white file:hover:text-black"
              />

              <p className="mt-3 text-xs text-gray-700">
                JPG, PNG, WEBP or GIF. Maximum 5 MB per image.
              </p>

              {/* Selected files */}

              {selectedFiles.length > 0 && (
                <div className="mt-5 space-y-2">
                  <p className="text-xs uppercase tracking-widest text-gray-600">
                    Selected
                  </p>

                  {selectedFiles.map((file) => (
                    <p
                      key={`${file.name}-${file.size}`}
                      className="text-sm text-gray-400"
                    >
                      {file.name}
                    </p>
                  ))}

                  <button
                    type="button"
                    onClick={uploadImages}
                    disabled={uploading}
                    className="mt-3 border border-white px-5 py-2 text-xs uppercase tracking-widest transition-colors hover:bg-white hover:text-black disabled:opacity-50"
                  >
                    {uploading
                      ? 'Uploading...'
                      : 'Upload Images →'}
                  </button>
                </div>
              )}
            </div>

            {/* Uploaded images */}

            {form.images.length > 0 && (
              <div className="mt-5">
                <p className="mb-3 text-xs uppercase tracking-widest text-gray-600">
                  Uploaded Images
                </p>

                <div className="space-y-2">
                  {form.images.map(
                    (image, index) => (
                      <div
                        key={`${image}-${index}`}
                        className="flex items-center justify-between border border-white/10 p-3"
                      >
                        <span className="truncate text-sm text-gray-400">
                          {image}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            removeImage(index)
                          }
                          className="ml-4 text-xs uppercase tracking-widest text-red-400 hover:text-red-300"
                        >
                          Remove
                        </button>
                      </div>
                    ),
                  )}
                </div>
              </div>
            )}
          </div>

          {/* GitHub + Live */}

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label
                htmlFor="github"
                className="mb-2 block text-xs uppercase tracking-widest text-gray-500"
              >
                GitHub URL
              </label>

              <input
                id="github"
                name="github"
                type="url"
                value={form.github}
                onChange={handleChange}
                placeholder="e.g. https://github.com/username/project"
                className="w-full border-b border-white/10 bg-transparent py-3 text-white outline-none placeholder:text-gray-700 focus:border-white/40"
              />
            </div>

            <div>
              <label
                htmlFor="live"
                className="mb-2 block text-xs uppercase tracking-widest text-gray-500"
              >
                Live URL
              </label>

              <input
                id="live"
                name="live"
                type="url"
                value={form.live}
                onChange={handleChange}
                placeholder="e.g. https://myproject.com"
                className="w-full border-b border-white/10 bg-transparent py-3 text-white outline-none placeholder:text-gray-700 focus:border-white/40"
              />
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
                ? 'Update Project →'
                : 'Add Project →'}
          </button>
        </form>
      </section>

      {/* ==================================================
          EXISTING PROJECTS
      ================================================== */}

      <section>
        <div className="mb-6">
          <p className="text-xs uppercase tracking-[0.25em] text-gray-600">
            Existing Projects
          </p>

          <h2 className="mt-2 text-2xl font-semibold">
            {projects.length} project
            {projects.length !== 1
              ? 's'
              : ''}
          </h2>
        </div>

        {loading ? (
          <p className="text-gray-500">
            Loading projects...
          </p>
        ) : projects.length === 0 ? (
          <p className="text-gray-500">
            No projects found.
          </p>
        ) : (
          <div className="space-y-3">
            {projects.map(
              (project, index) => (
                <div
                  key={project._id}
                  className="flex flex-col gap-5 border border-white/10 p-6 md:flex-row md:items-center md:justify-between"
                >
                  {/* Project information */}

                  <div className="min-w-0">
                    <p className="text-xs uppercase tracking-widest text-gray-600">
                      {project.number}
                    </p>

                    <h3 className="mt-2 text-xl font-medium">
                      {project.title}
                    </h3>

                    <p className="mt-2 text-sm text-gray-500">
                      {project.technologies?.join(
                        ' · ',
                      )}
                    </p>

                    <p className="mt-2 text-xs text-gray-700">
                      {project.images?.length || 0}{' '}
                      image
                      {project.images?.length !==
                      1
                        ? 's'
                        : ''}
                    </p>
                  </div>

                  {/* Controls */}

                  <div className="flex flex-wrap items-center gap-2">
                    {/* Move up */}

                    <button
                      type="button"
                      onClick={() =>
                        moveProject(
                          index,
                          -1,
                        )
                      }
                      disabled={index === 0}
                      aria-label="Move project up"
                      className="flex h-9 w-9 items-center justify-center border border-white/15 text-gray-400 transition-colors hover:border-white hover:text-white disabled:cursor-not-allowed disabled:opacity-20"
                    >
                      ↑
                    </button>

                    {/* Move down */}

                    <button
                      type="button"
                      onClick={() =>
                        moveProject(
                          index,
                          1,
                        )
                      }
                      disabled={
                        index ===
                        projects.length - 1
                      }
                      aria-label="Move project down"
                      className="flex h-9 w-9 items-center justify-center border border-white/15 text-gray-400 transition-colors hover:border-white hover:text-white disabled:cursor-not-allowed disabled:opacity-20"
                    >
                      ↓
                    </button>

                    {/* Edit */}

                    <button
                      type="button"
                      onClick={() =>
                        handleEdit(
                          project,
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
                          project._id,
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

export default Projects