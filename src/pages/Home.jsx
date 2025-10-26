import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

function Home() {
  const [particles, setParticles] = useState([])
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  
  useEffect(() => {
    const newParticles = []
    for (let i = 0; i < 50; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 1,
        speed: Math.random() * 2 + 1
      })
    }
    setParticles(newParticles)

    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white relative overflow-hidden">
      {/* Animated Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating Particles */}
        {particles.map(particle => (
          <div
            key={particle.id}
            className="absolute bg-white rounded-full opacity-20 animate-pulse"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              animation: `float ${particle.speed * 3}s ease-in-out infinite alternate`
            }}
          />
        ))}
        
        {/* Interactive Mouse Trail */}
        <div 
          className="absolute w-64 h-64 bg-gradient-to-r from-cyan-400/10 to-purple-400/10 rounded-full blur-3xl transition-all duration-500"
          style={{
            left: `${mousePosition.x}%`,
            top: `${mousePosition.y}%`,
            transform: 'translate(-50%, -50%)'
          }}
        />
        
        {/* Animated Grid Background */}
        <div className="absolute inset-0 opacity-5">
          <div className="grid grid-cols-12 grid-rows-12 h-full w-full">
            {Array.from({length: 144}).map((_, i) => (
              <div 
                key={i} 
                className="border border-cyan-400 animate-pulse" 
                style={{animationDelay: `${i * 0.1}s`}} 
              />
            ))}
          </div>
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-6">
        {/* Hero Section with Special Branding */}
        <div className="text-center py-20">
          {/* Special Brand Logo */}
          <div className="relative inline-block mb-8">
            <div className="absolute -inset-8 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 rounded-full opacity-20 blur-2xl animate-pulse"></div>
            <div className="relative">
              <div className="text-9xl mb-4 filter drop-shadow-2xl transform hover:scale-110 transition-all duration-500 cursor-pointer">
                <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent font-bold animate-bounce">🎯</span>
                <span className="bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent font-bold animate-pulse">⚡</span>
                <span className="bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 bg-clip-text text-transparent font-bold animate-bounce">🚀</span>
              </div>
              <div className="text-sm text-cyan-300 font-bold tracking-widest">CODE • LEARN • CREATE</div>
            </div>
          </div>
          
          <div className="mb-12">
            <h1 className="text-7xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse">
              ALEX GUO
            </h1>
            
            <div className="space-y-3">
              <p className="text-2xl text-cyan-300">
                Founder of <a 
                  href="https://codecub.org/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-cyan-400 hover:text-cyan-200 underline decoration-2 underline-offset-4 hover:decoration-cyan-400 transition-all duration-300 font-bold"
                >
                  CodeCub.org
                </a>
              </p>
              <p className="text-xl text-purple-300">
                Programming Teacher at <a 
                  href="https://occachildcare.ca/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-purple-400 hover:text-purple-200 underline decoration-2 underline-offset-4 hover:decoration-purple-400 transition-all duration-300 font-bold"
                >
                  OCCA Childcare Center
                </a>
              </p>
            </div>
          </div>

          {/* Enhanced Mission Statement */}
          <div className="max-w-5xl mx-auto mb-16 p-8 bg-black/40 backdrop-blur-md rounded-3xl border border-cyan-500/50 shadow-2xl hover:shadow-cyan-500/30 transition-all duration-500 transform hover:scale-105">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 rounded-3xl opacity-20 blur animate-pulse"></div>
              <div className="relative">
                <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent flex items-center justify-center gap-4">
                  <span className="text-5xl animate-spin">🎯</span>
                  My Mission
                  <span className="text-5xl animate-bounce">⚡</span>
                </h2>
                <p className="text-xl leading-relaxed text-gray-100 font-medium">
                  Empowering the next generation through innovative programming education. 
                  At CodeCub, we make coding accessible, fun, and engaging for children, 
                  fostering creativity and problem-solving skills that will serve them throughout their lives.
                </p>
              </div>
            </div>
          </div>

          {/* Enhanced Quick Links */}
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
            {/* Interactive Games Link */}
            <Link 
              to="/games" 
              className="block p-8 bg-gradient-to-br from-cyan-600 to-blue-700 rounded-2xl hover:from-cyan-500 hover:to-blue-600 transition-all transform hover:scale-105 hover:rotate-1 border border-cyan-400/50 shadow-2xl hover:shadow-cyan-500/40 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
              <div className="relative">
                <div className="text-5xl mb-4 animate-bounce">🎮</div>
                <h3 className="text-2xl font-bold mb-3 text-white">Interactive Games</h3>
                <p className="text-cyan-100 text-lg">Play advanced programming games with real controls and epic challenges!</p>
              </div>
            </Link>

            {/* CodeCub Link */}
            <a 
              href="https://codecub.org/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="block p-8 bg-gradient-to-br from-purple-600 to-indigo-700 rounded-2xl hover:from-purple-500 hover:to-indigo-600 transition-all transform hover:scale-105 hover:rotate-1 border border-purple-400/50 shadow-2xl hover:shadow-purple-500/40 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
              <div className="relative">
                <div className="text-5xl mb-4 animate-pulse">📚</div>
                <h3 className="text-2xl font-bold mb-3 text-white">Learning Resources</h3>
                <p className="text-purple-100 text-lg">Access tutorials, guides, and educational materials at CodeCub.org</p>
              </div>
            </a>

            {/* Email Link */}
            <a 
              href="mailto:alex.guo@codecub.org" 
              className="block p-8 bg-gradient-to-br from-green-600 to-teal-700 rounded-2xl hover:from-green-500 hover:to-teal-600 transition-all transform hover:scale-105 hover:rotate-1 border border-green-400/50 shadow-2xl hover:shadow-green-500/40 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
              <div className="relative">
                <div className="text-5xl mb-4 animate-bounce">📧</div>
                <h3 className="text-2xl font-bold mb-3 text-white">Email Me</h3>
                <p className="text-green-100 text-lg">alex.guo@codecub.org<br/>Get in touch for collaborations!</p>
              </div>
            </a>
          </div>

          {/* Call to Action */}
          <div className="mb-16">
            <Link 
              to="/games" 
              className="inline-block px-12 py-6 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 rounded-full text-white font-bold text-2xl shadow-2xl hover:shadow-pink-500/50 transform hover:scale-110 transition-all duration-300 animate-pulse"
            >
              🚀 Start Playing Epic Games! 🎮
            </Link>
          </div>
        </div>

        {/* Enhanced Footer */}
        <footer className="text-center text-gray-300 py-12 relative">
          <div className="max-w-3xl mx-auto">
            <div className="mb-6">
              <div className="text-3xl mb-4 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent font-bold animate-pulse">
                🎯⚡🚀
              </div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Alex Guo - Code Educator & Innovation Leader
              </h3>
            </div>
            <div className="space-y-2">
              <p className="text-gray-300">&copy; 2025 Alex Guo. All rights reserved.</p>
              <p className="text-sm text-gray-400">
                <a href="https://codecub.org/" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors">CodeCub.org</a> | 
                <a href="https://occachildcare.ca/" target="_blank" rel="noopener noreferrer" className="hover:text-purple-400 transition-colors"> OCCA Childcare Center</a>
              </p>
              <p className="text-xs text-gray-500 mt-4">Innovative Programming Education for the Next Generation</p>
            </div>
          </div>
        </footer>
      </div>

      <style jsx>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          100% { transform: translateY(-20px); }
        }
      `}</style>
    </div>
  )
}

export default Home