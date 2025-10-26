import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

function WhackMole() {
  const [gameStarted, setGameStarted] = useState(false)
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [level, setLevel] = useState(1)
  const [timeLeft, setTimeLeft] = useState(30)
  const [moles, setMoles] = useState(Array(9).fill(false))
  const [gameOver, setGameOver] = useState(false)
  const [paused, setPaused] = useState(false)

  const startGame = () => {
    setScore(0)
    setLevel(1)
    setTimeLeft(30)
    setMoles(Array(9).fill(false))
    setGameOver(false)
    setGameStarted(true)
    setPaused(false)
  }

  const whackMole = (index) => {
    if (moles[index] && !paused) {
      setScore(s => {
        const newScore = s + 10
        if (newScore % 100 === 0) {
          setLevel(prev => prev + 1)
        }
        return newScore
      })
      setMoles(prev => {
        const newMoles = [...prev]
        newMoles[index] = false
        return newMoles
      })
    }
  }

  useEffect(() => {
    if (!gameStarted || gameOver) return

    const handleKeyPress = (e) => {
      if (e.key === 'p' || e.key === 'P') {
        setPaused(prev => !prev)
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [gameStarted, gameOver])

  useEffect(() => {
    if (!gameStarted || paused || gameOver) return

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setGameOver(true)
          setHighScore(prev => Math.max(prev, score))
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [gameStarted, paused, gameOver, score])

  useEffect(() => {
    if (!gameStarted || paused || gameOver) return

    const moleInterval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * 9)
      setMoles(prev => {
        const newMoles = [...prev]
        newMoles[randomIndex] = true
        return newMoles
      })

      setTimeout(() => {
        setMoles(prev => {
          const newMoles = [...prev]
          newMoles[randomIndex] = false
          return newMoles
        })
      }, 800)
    }, 1000)

    return () => clearInterval(moleInterval)
  }, [gameStarted, paused, gameOver])

  if (!gameStarted) {
    // Intro Page
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-600 via-green-700 to-green-800 py-12 px-6 flex items-center justify-center">
        <div className="max-w-lg w-full">
          <div className="text-center mb-8">
            <div className="text-8xl mb-6">🔨</div>
            <h1 className="text-6xl font-bold text-green-100 mb-4">WHACK-A-MOLE</h1>
            <p className="text-xl text-green-50">Whack those moles!</p>
          </div>

          <div className="bg-black/60 backdrop-blur-md rounded-2xl p-8 border border-green-500/30 mb-8">
            <h2 className="text-2xl font-bold text-green-300 mb-6 flex items-center gap-3">
              <span>🎮</span> How to Play:
            </h2>
            <div className="space-y-3 text-green-100">
              <div className="flex items-start gap-3">
                <span className="text-yellow-400 text-xl">🖱️</span>
                <span><strong>Click</strong> - Whack the moles</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-purple-400 text-xl">⏸️</span>
                <span><strong>P</strong> - Pause game</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-red-500 text-xl">🐹</span>
                <span>Click the moles when they pop up!</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-orange-500 text-xl">⏱️</span>
                <span>You have 30 seconds - whack as many as you can!</span>
              </div>
            </div>
          </div>

          <button
            onClick={startGame}
            className="w-full bg-gradient-to-r from-green-500 to-green-700 hover:from-green-400 hover:to-green-600 text-white px-12 py-5 rounded-2xl font-bold text-2xl transition-all shadow-2xl hover:scale-105 flex items-center justify-center gap-3"
          >
            <span>🚀</span> START GAME
          </button>

          <Link
            to="/games"
            className="block text-center mt-6 text-green-100 hover:text-green-50 transition-colors text-lg"
          >
            ← Back to Games
          </Link>
        </div>
      </div>
    )
  }

  // Game Page
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-600 via-green-700 to-green-800 py-12 px-6">
      <div className="container mx-auto max-w-7xl">
        <div className="grid lg:grid-cols-[1fr,320px] gap-8">
          {/* Game Area */}
          <div className="flex flex-col items-center">
            <h1 className="text-5xl font-bold text-green-100 mb-6 flex items-center gap-3">
              <span>🔨</span>
              Whack-A-Mole
            </h1>

            {/* Game Canvas */}
            <div className="relative bg-brown-500 p-8 rounded-2xl border-4 border-green-500 shadow-2xl">
              <div className="grid grid-cols-3 gap-4">
                {moles.map((active, index) => (
                  <button
                    key={index}
                    onClick={() => whackMole(index)}
                    className="w-32 h-32 bg-brown-700 rounded-full flex items-center justify-center text-6xl hover:bg-brown-600 transition transform hover:scale-105 border-4 border-brown-900"
                    disabled={paused || gameOver}
                  >
                    {active ? '🐹' : '🕳️'}
                  </button>
                ))}
              </div>

              {paused && (
                <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center rounded-2xl">
                  <div className="text-center">
                    <div className="text-6xl mb-4">⏸️</div>
                    <h3 className="text-4xl font-bold text-green-300">PAUSED</h3>
                    <p className="text-green-200 mt-4">Press P to resume</p>
                  </div>
                </div>
              )}

              {gameOver && (
                <div className="absolute inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center rounded-2xl">
                  <div className="text-center">
                    <div className="text-6xl mb-6">🏁</div>
                    <h2 className="text-5xl font-bold text-yellow-400 mb-4">TIME'S UP!</h2>
                    <p className="text-2xl text-green-200 mb-2">Final Score: {score}</p>
                    <p className="text-xl text-orange-400 mb-8">High Score: {highScore}</p>
                    <button
                      onClick={startGame}
                      className="px-10 py-3 bg-gradient-to-r from-green-500 to-green-700 hover:from-green-400 hover:to-green-600 text-white rounded-full font-bold text-xl transition-all"
                    >
                      🔄 PLAY AGAIN
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            {/* Game Stats */}
            <div className="bg-black/40 backdrop-blur-md rounded-lg p-6 border border-green-500/30">
              <h3 className="text-xl font-bold text-green-300 mb-4 flex items-center gap-2">
                <span>📊</span> Game Stats
              </h3>
              <div className="space-y-3 text-sm text-white">
                <div className="flex justify-between">
                  <span>Score:</span>
                  <span className="font-bold text-yellow-400">{score}</span>
                </div>
                <div className="flex justify-between">
                  <span>High Score:</span>
                  <span className="font-bold text-yellow-400">{highScore}</span>
                </div>
                <div className="flex justify-between">
                  <span>Level:</span>
                  <span className="font-bold text-green-400">{level}</span>
                </div>
                <div className="flex justify-between">
                  <span>Time Left:</span>
                  <span className="font-bold text-red-400">{timeLeft}s</span>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="bg-black/40 backdrop-blur-md rounded-lg p-6 border border-green-500/30">
              <h3 className="text-xl font-bold text-green-300 mb-4 flex items-center gap-2">
                <span>🎮</span> Controls
              </h3>
              <div className="text-sm space-y-2 text-white">
                <div>Click: Whack moles</div>
                <div>P: Pause</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => setPaused(!paused)}
                className="w-full bg-yellow-600 hover:bg-yellow-700 px-6 py-3 rounded-lg font-bold text-white transition-all flex items-center justify-center gap-2"
                disabled={gameOver}
              >
                <span>⏸️</span> {paused ? 'Resume' : 'Pause'}
              </button>
              <button
                onClick={startGame}
                className="w-full bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg font-bold text-white transition-all flex items-center justify-center gap-2"
              >
                <span>🔄</span> New Game
              </button>
              <Link
                to="/games"
                className="block w-full bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-lg font-bold text-white text-center transition-all"
              >
                ← Back to Games
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WhackMole
