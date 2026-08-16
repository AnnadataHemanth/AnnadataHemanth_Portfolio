import { useState } from 'react'
import { loginAdmin } from '../services/api'

function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()

    setError('')
    setIsLoading(true)

    try {
      const data = await loginAdmin(username, password)

      localStorage.setItem('adminToken', data.token)

      window.location.href = '/dashboard'
    } catch (error) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-6 text-white">
      <div className="w-full max-w-md">
        <p className="mb-3 text-xs uppercase tracking-[0.3em] text-gray-600">
          Admin
        </p>

        <h1 className="mb-10 text-5xl font-semibold tracking-tight">
          Welcome back.
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="username"
              className="mb-2 block text-xs uppercase tracking-widest text-gray-500"
            >
              Username
            </label>

            <input
              id="username"
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              required
              className="w-full border-b border-white/10 bg-transparent py-3 text-white outline-none transition-colors placeholder:text-gray-700 focus:border-white/40"
              placeholder="admin"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-xs uppercase tracking-widest text-gray-500"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              className="w-full border-b border-white/10 bg-transparent py-3 text-white outline-none transition-colors placeholder:text-gray-700 focus:border-white/40"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-sm text-red-400">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full border border-white px-6 py-3 text-sm uppercase tracking-widest transition-all duration-300 hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? 'Signing in...' : 'Sign in →'}
          </button>
        </form>
      </div>
    </main>
  )
}

export default Login