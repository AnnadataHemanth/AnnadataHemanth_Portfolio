import { useCallback, useEffect, useState } from 'react'

const API_URL = import.meta.env.VITE_API_URL

function Dashboard() {
  const [stats, setStats] = useState({
    projects: 0,
    skills: 0,
    messages: 0,
  })

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const token = localStorage.getItem('adminToken')

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true)
      setError('')

      const response = await fetch(`${API_URL}/stats`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message || 'Failed to load dashboard stats.',
        )
      }

      setStats(data)
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  const statCards = [
    {
      label: 'Projects',
      value: stats.projects,
    },
    {
      label: 'Skill Groups',
      value: stats.skills,
    },
    {
      label: 'Messages',
      value: stats.messages,
    },
  ]

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-gray-600">
            Overview
          </p>

          <h2 className="mt-2 text-2xl font-semibold">
            Portfolio Statistics
          </h2>
        </div>

        <button
          type="button"
          onClick={fetchStats}
          disabled={loading}
          className="border border-white/15 px-4 py-2 text-xs uppercase tracking-widest text-gray-400 transition-colors hover:border-white hover:text-white disabled:opacity-50"
        >
          {loading ? 'Refreshing...' : 'Refresh ↻'}
        </button>
      </div>

      {error && (
        <p className="text-sm text-red-400">
          {error}
        </p>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className="border border-white/10 p-6"
          >
            <p className="text-xs uppercase tracking-[0.25em] text-gray-600">
              {stat.label}
            </p>

            <p className="mt-4 text-4xl font-semibold">
              {loading ? '—' : stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="border border-white/10 p-6">
        <p className="text-xs uppercase tracking-[0.25em] text-gray-600">
          System Status
        </p>

        <div className="mt-5 flex items-center gap-3">
          <span className="h-2.5 w-2.5 rounded-full bg-green-400" />

          <p className="text-gray-300">
            Portfolio backend connected to MongoDB Atlas
          </p>
        </div>
      </div>
    </div>
  )
}

export default Dashboard