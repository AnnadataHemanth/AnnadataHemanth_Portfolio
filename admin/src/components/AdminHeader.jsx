function AdminHeader({ title }) {
  return (
    <header className="border-b border-white/10 px-8 py-6">
      <p className="text-xs uppercase tracking-[0.3em] text-gray-600">
        Admin
      </p>

      <h1 className="mt-2 text-3xl font-semibold tracking-tight">
        {title}
      </h1>
    </header>
  )
}

export default AdminHeader