import React from 'react'
import { Link } from 'react-router-dom'

function Header() {
  return (
    <header className="bg-gradient-to-r from-indigo-800 via-purple-700 to-purple-900 shadow-xl">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left side - Profile */}
          <Link
            to="/"
            className="flex items-center space-x-3 hover:opacity-80 transition-opacity duration-300 group"
          >
            {/* Avatar Circle */}
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:scale-110 transition-transform">
              AG
            </div>
            {/* Name and Title */}
            <div className="flex flex-col">
              <span className="text-white text-xl font-bold">Alex Guo</span>
              <span className="text-yellow-300 text-sm">CodeCub Founder</span>
            </div>
          </Link>

          {/* Right side - Navigation */}
          <div className="flex items-center space-x-6">
            <Link
              to="/"
              className="flex items-center space-x-2 text-yellow-300 hover:text-yellow-200 text-lg font-semibold transition-all duration-300 hover:scale-110"
            >
              <span>🏠</span>
              <span>Home</span>
            </Link>
            <Link
              to="/games"
              className="flex items-center space-x-2 text-white hover:text-pink-300 text-lg font-semibold transition-all duration-300 hover:scale-110"
            >
              <span>🎮</span>
              <span>Games</span>
            </Link>
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Header
