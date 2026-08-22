import { useState } from 'react'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Sidebar from './components/Sidebar'
import AdminHeader from './components/AdminHeader'
import Projects from './pages/Projects'
import Skills from './pages/Skills'
import Messages from './pages/Messages'
import Certificates from './pages/Certificates'

function App() {
  const [activePage, setActivePage] = useState('dashboard')

  const token = localStorage.getItem('adminToken')

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    window.location.href = '/'
  }

  if (!token) {
    return <Login />
  }

  const renderPage = () => {
    switch (activePage) {
      case 'projects':
        return <Projects />

      case 'skills':
        return <Skills />

      case 'messages':
        return <Messages />

      case 'certificates':
        return <Certificates />

      default:
        return <Dashboard />
    }
  }

  const pageTitles = {
    dashboard: 'Dashboard',
    projects: 'Projects',
    skills: 'Skills',
    messages: 'Messages',
    certificates: 'Certificates',
  }

  return (
    <div className="flex min-h-screen bg-black text-white">
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        onLogout={handleLogout}
      />

      <main className="flex-1">
        <AdminHeader title={pageTitles[activePage]} />

        <div className="p-8">
          {renderPage()}
        </div>
      </main>
    </div>
  )
}

export default App