function Sidebar({ activePage, setActivePage, onLogout }) {
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
    },
    {
      id: 'projects',
      label: 'Projects',
    },
    {
      id: 'certificates',
      label: 'Certificates',
    },
    {
      id: 'skills',
      label: 'Skills',
    },
    {
    id: 'experiences',
    label: 'Experiences',
    },
    {
      id: 'messages',
      label: 'Messages',
    },
  ]

  return (
    <aside className="flex min-h-screen w-64 flex-col border-r border-white/10 bg-black">
      <div className="border-b border-white/10 px-6 py-6">
        <p className="text-xl font-bold tracking-widest">
          AH.
        </p>

        <p className="mt-1 text-xs uppercase tracking-[0.25em] text-gray-600">
          Admin Panel
        </p>
      </div>

      <nav className="flex-1 p-4">
        <div className="space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActivePage(item.id)}
              className={`w-full px-4 py-3 text-left text-sm transition-colors ${
                activePage === item.id
                  ? 'bg-white text-black'
                  : 'text-gray-500 hover:bg-white/5 hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </nav>

      <div className="border-t border-white/10 p-4">
        <button
          type="button"
          onClick={onLogout}
          className="w-full px-4 py-3 text-left text-sm text-gray-500 transition-colors hover:bg-red-500/10 hover:text-red-400"
        >
          Logout
        </button>
      </div>
    </aside>
  )
}

export default Sidebar