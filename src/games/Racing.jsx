import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

function Racing() {
  const [gameStarted, setGameStarted] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [level, setLevel] = useState(1)
  const [paused, setPaused] = useState(false)
  const [carX, setCarX] = useState(200)
  const [obstacles, setObstacles] = useState([])

  const startGame = () => {
    setCarX(200)
    setObstacles([])
    setScore(0)
    setLevel(1)
    setGameOver(false)
    setGameStarted(true)
    setPaused(false)
  }

  useEffect(() => {
    if (!gameStarted || gameOver) return

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        setCarX(prev => Math.max(80, prev - 20))
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        setCarX(prev => Math.min(320, prev + 20))
      } else if (e.key === 'p' || e.key === 'P') {
        setPaused(prev => !prev)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [gameStarted, gameOver])

  useEffect(() => {
    if (!gameStarted || paused || gameOver) return

    const gameLoop = setInterval(() => {
      if (Math.random() < 0.03) {
        const lanes = [80, 200, 320]
        const lane = lanes[Math.floor(Math.random() * lanes.length)]
        setObstacles(prev => [...prev, { x: lane, y: 0, id: Date.now() }])
      }

      setObstacles(prev => {
        const newObstacles = prev
          .map(obs => ({ ...obs, y: obs.y + 8 }))
          .filter(obs => obs.y < 500)

        newObstacles.forEach(obs => {
          if (obs.y > 350 && obs.y < 430 && Math.abs(obs.x - carX) < 40) {
            setGameOver(true)
            setHighScore(prev => Math.max(prev, score))
          }
          if (obs.y === 500 - 8) {
            setScore(s => {
              const newScore = s + 10
              if (newScore % 100 === 0) {
                setLevel(prev => prev + 1)
              }
              return newScore
            })
          }
        })

        return newObstacles
      })
    }, 50)

    return () => clearInterval(gameLoop)
  }, [gameStarted, paused, gameOver, carX, score])

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-700 via-gray-900 to-gray-800 py-12 px-6 flex items-center justify-center">
        <div className="max-w-lg w-full">
          <div className="text-center mb-8">
            <div className="text-8xl mb-6">🏎️</div>
            <h1 className="text-6xl font-bold text-gray-100 mb-4">RACING GAME</h1>
            <p className="text-xl text-gray-200">Speed through the highway!</p>
          </div>

          <div className="bg-black/60 backdrop-blur-md rounded-2xl p-8 border border-gray-500/30 mb-8">
            <h2 className="text-2xl font-bold text-gray-300 mb-6 flex items-center gap-3">
              <span>🎮</span> How to Play:
            </h2>
            <div className="space-y-3 text-gray-100">
              <div className="flex items-start gap-3">
                <span className="text-blue-400 text-xl">⬅️➡️</span>
                <span><strong>←→/A/D</strong> - Change lanes</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-yellow-400 text-xl">⏸️</span>
                <span><strong>P</strong> - Pause</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-green-500 text-xl">🏁</span>
                <span>Avoid obstacles to score!</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-red-500 text-xl">⚠️</span>
                <span>Don't crash!</span>
              </div>
            </div>
          </div>

          <button
            onClick={startGame}
            className="w-full bg-gradient-to-r from-red-500 to-gray-700 hover:from-red-400 hover:to-gray-600 text-white px-12 py-5 rounded-2xl font-bold text-2xl transition-all shadow-2xl hover:scale-105 flex items-center justify-center gap-3"
          >
            <span>🚀</span> START RACE
          </button>

          <Link
            to="/games"
            className="block text-center mt-6 text-gray-200 hover:text-gray-100 transition-colors text-lg"
          >
            ← Back to Games
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-700 via-gray-900 to-gray-800 py-12 px-6">
      <div className="container mx-auto max-w-7xl">
        <div className="grid lg:grid-cols-[1fr,320px] gap-8">
          <div className="flex flex-col items-center">
            <h1 className="text-5xl font-bold text-gray-100 mb-6 flex items-center gap-3">
              <span>🏎️</span>
              Racing Game
            </h1>

            <div className="relative bg-gray-600 overflow-hidden rounded-2xl border-4 border-gray-500 shadow-2xl" style={{ width: 400, height: 500 }}>
              <div className="absolute left-1/3 top-0 bottom-0 w-px bg-white opacity-50"></div>
              <div className="absolute left-2/3 top-0 bottom-0 w-px bg-white opacity-50"></div>

              <div
                className="absolute text-4xl transition-all duration-100"
                style={{ left: carX - 20, bottom: 50, width: 40, height: 60, transform: 'rotate(90deg)' }}
              >
                🏎️
              </div>

              {obstacles.map(obs => (
                <div
                  key={obs.id}
                  className="absolute text-4xl"
                  style={{ left: obs.x - 20, top: obs.y, width: 40, height: 60, transform: 'rotate(-90deg)' }}
                >
                  🚗
                </div>
              ))}

              {paused && (
                <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-4">⏸️</div>
                    <h3 className="text-4xl font-bold text-gray-300">PAUSED</h3>
                    <p className="text-gray-200 mt-4">Press P to resume</p>
                  </div>
                </div>
              )}

              {gameOver && (
                <div className="absolute inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-6">💥</div>
                    <h2 className="text-5xl font-bold text-red-400 mb-4">CRASH!</h2>
                    <p className="text-2xl text-gray-200 mb-2">Score: {score}</p>
                    <p className="text-xl text-yellow-400 mb-8">High Score: {highScore}</p>
                    <button
                      onClick={startGame}
                      className="px-10 py-3 bg-gradient-to-r from-red-500 to-gray-700 hover:from-red-400 hover:to-gray-600 text-white rounded-full font-bold text-xl transition-all"
                    >
                      🔄 RACE AGAIN
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-black/40 backdrop-blur-md rounded-lg p-6 border border-gray-500/30">
              <h3 className="text-xl font-bold text-gray-300 mb-4 flex items-center gap-2">
                <span>📊</span> Race Stats
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
              </div>
            </div>

            <div className="bg-black/40 backdrop-blur-md rounded-lg p-6 border border-gray-500/30">
              <h3 className="text-xl font-bold text-gray-300 mb-4 flex items-center gap-2">
                <span>🎮</span> Controls
              </h3>
              <div className="text-sm space-y-2 text-white">
                <div>A/D or ←→: Change lanes</div>
                <div>P: Pause</div>
              </div>
            </div>

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
                <span>🔄</span> New Race
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

export default Racing
