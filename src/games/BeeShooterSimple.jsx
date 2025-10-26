import { useState } from 'react'
import { Link } from 'react-router-dom'

function BeeShooterSimple() {
  const [gameStarted, setGameStarted] = useState(false)

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-yellow-400 p-12">
        <h1 className="text-6xl text-center">BEE SHOOTER SIMPLE</h1>
        <button
          onClick={() => setGameStarted(true)}
          className="bg-red-500 text-white px-8 py-4 rounded mt-8 block mx-auto"
        >
          START
        </button>
        <Link to="/games" className="block text-center mt-4">Back</Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-blue-400 p-12">
      <h1 className="text-6xl text-center">GAME STARTED</h1>
      <button
        onClick={() => setGameStarted(false)}
        className="bg-red-500 text-white px-8 py-4 rounded mt-8 block mx-auto"
      >
        BACK TO INTRO
      </button>
    </div>
  )
}

export default BeeShooterSimple
