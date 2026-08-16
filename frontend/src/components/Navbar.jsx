function Navbar() {
  return (
    <nav className="fixed left-0 top-0 z-50 w-full px-6 py-6 md:px-10">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <a
          href="#home"
          className="text-xl font-bold tracking-widest"
        >
          AH.
        </a>

        <div className="hidden items-center gap-8 text-sm text-gray-400 md:flex">
          <a
            href="#about"
            className="transition-colors hover:text-white"
          >
            About
          </a>

          <a
            href="#skills"
            className="transition-colors hover:text-white"
          >
            Skills
          </a>

          <a
            href="#projects"
            className="transition-colors hover:text-white"
          >
            Projects
          </a>

          <a
            href="#experience"
            className="transition-colors hover:text-white"
          >
            Experience
          </a>

          <a
            href="#education"
            className="transition-colors hover:text-white"
          >
            Education
          </a>
          <a
            href="#contact"
            className="transition-colors hover:text-white"
          >
            Contact
          </a>
        </div>
      </div>
    </nav>
  )
}

export default Navbar