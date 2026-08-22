import TouchGlow from './components/TouchGlow'
import Navbar from './components/Navbar'
import CursorGlow from './components/CursorGlow'
import Hero from './sections/Hero'
import About from './sections/About'
import Skills from './sections/Skills'
import Projects from './sections/Projects'
import Certificates from './sections/Certificates'
import Experience from './sections/Experience'
import Education from './sections/Education'
import Contact from './sections/Contact'
import Footer from './components/Footer'

function App() {
  return (
    <main className="min-h-screen bg-black text-white">
      <TouchGlow />
      <CursorGlow />
      

      <Navbar />
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Certificates />
      <Experience />
      <Education />
      <Contact />
      <Footer />
    </main>
  )
}

export default App