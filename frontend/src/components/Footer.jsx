function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black px-6 py-8 md:px-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 text-sm text-gray-600 md:flex-row md:items-center md:justify-between">
        <p>
          © {new Date().getFullYear()} Annadata Hemanth. All rights reserved.
        </p>

        <a
          href="#home"
          className="uppercase tracking-widest transition-colors hover:text-white"
        >
          Back to top ↑
        </a>
      </div>
    </footer>
  )
}

export default Footer