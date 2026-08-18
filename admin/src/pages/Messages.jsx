import { useEffect, useState } from 'react'

const API_URL = import.meta.env.VITE_API_URL

function Messages() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const token = localStorage.getItem('adminToken')

  const fetchMessages = async () => {
    try {
      setLoading(true)
      setError('')

      const response = await fetch(`${API_URL}/messages`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message || 'Failed to load messages.',
        )
      }

      setMessages(data)
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMessages()
  }, [])

  const handleDelete = async (messageId) => {
    const confirmed = window.confirm(
      'Delete this message permanently?',
    )

    if (!confirmed) {
      return
    }

    try {
      setError('')
      setSuccess('')

      const response = await fetch(
        `${API_URL}/messages/${messageId}`,
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
          data.message || 'Failed to delete message.',
        )
      }

      setSuccess('Message deleted successfully.')

      await fetchMessages()
    } catch (error) {
      setError(error.message)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.25em] text-gray-600">
          Inbox
        </p>

        <h2 className="mt-2 text-2xl font-semibold">
          {messages.length} message
          {messages.length !== 1 ? 's' : ''}
        </h2>
      </div>

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

      {loading ? (
        <p className="text-gray-500">
          Loading messages...
        </p>
      ) : messages.length === 0 ? (
        <div className="border border-white/10 p-10 text-center">
          <p className="text-gray-500">
            No messages yet.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((message) => (
            <article
              key={message._id}
              className="border border-white/10 p-6 transition-colors hover:border-white/20"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <h3 className="text-xl font-medium">
                    {message.name}
                  </h3>

                  <a
                    href={`mailto:${message.email}`}
                    className="mt-1 block text-sm text-gray-500 transition-colors hover:text-white"
                  >
                    {message.email}
                  </a>
                </div>

                <p className="text-xs uppercase tracking-widest text-gray-600">
                  {new Date(
                    message.createdAt,
                  ).toLocaleDateString()}
                </p>
              </div>

              <p className="mt-6 whitespace-pre-wrap leading-relaxed text-gray-400">
                {message.message}
              </p>

              <div className="mt-6">
                <button
                  type="button"
                  onClick={() =>
                    handleDelete(message._id)
                  }
                  className="border border-red-500/20 px-4 py-2 text-xs uppercase tracking-widest text-red-400 transition-colors hover:border-red-400 hover:bg-red-500/10"
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}

export default Messages