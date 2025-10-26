import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

function CityParkour() {
  const [gameStarted, setGameStarted] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [level, setLevel] = useState(1)
  const [paused, setPaused] = useState(false)
  const [playerY, setPlayerY] = useState(300)
  const [isJumping, setIsJumping] = useState(false)
  const [buildings, setBuildings] = useState([])

  const startGame = () => {
    setPlayerY(300)
    setIsJumping(false)
    setBuildings([])
    setScore(0)
    setLevel(1)
    setGameOver(false)
    setGameStarted(true)
    setPaused(false)
  }

  const jump = () => {
    if (!isJumping && !gameOver && !paused) {
      setIsJumping(true)
      let jumpHeight = 0
      const jumpInterval = setInterval(() => {
        if (jumpHeight >= 120) {
          clearInterval(jumpInterval)
          const fallInterval = setInterval(() => {
            setPlayerY(prev => {
              if (prev >= 300) {
                clearInterval(fallInterval)
                setIsJumping(false)
                return 300
              }
              return prev + 6
            })
          }, 20)
        } else {
          setPlayerY(prev => prev - 6)
          jumpHeight += 6
        }
      }, 20)
    }
  }

  useEffect(() => {
    if (!gameStarted || gameOver) return

    const handleKeyPress = (e) => {
      if (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        e.preventDefault()
        jump()
      } else if (e.key === 'p' || e.key === 'P') {
        setPaused(prev => !prev)
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [gameStarted, gameOver, isJumping, paused])

  useEffect(() => {
    if (!gameStarted || paused || gameOver) return

    const gameLoop = setInterval(() => {
      if (Math.random() < 0.02) {
        const height = 60 + Math.random() * 80
        setBuildings(prev => [...prev, { x: 600, height, id: Date.now() }])
      }

      setBuildings(prev => {
        const newBuildings = prev
          .map(b => ({ ...b, x: b.x - 6 }))
          .filter(b => b.x > -60)

        newBuildings.forEach(building => {
          if (building.x < 150 && building.x > 90) {
            if (playerY + 40 > 400 - building.height) {
              setGameOver(true)
              setHighScore(prev => Math.max(prev, score))
            }
          }
          if (building.x === 90 - 6) {
            setScore(s => {
              const newScore = s + 10
              if (newScore % 100 === 0) {
                setLevel(prev => prev + 1)
              }
              return newScore
            })
          }
        })

        return newBuildings
      })
    }, 30)

    return () => clearInterval(gameLoop)
  }, [gameStarted, paused, gameOver, playerY, score])

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-blue-600 py-12 px-6 flex items-center justify-center">
        <div className="max-w-lg w-full">
          <div className="text-center mb-8">
            <div className="text-8xl mb-6">🏙️</div>
            <h1 className="text-6xl font-bold text-blue-100 mb-4">CITY PARKOUR</h1>
            <p className="text-xl text-blue-50">Run and jump through the city!</p>
          </div>

          <div className="bg-black/60 backdrop-blur-md rounded-2xl p-8 border border-blue-500/30 mb-8">
            <h2 className="text-2xl font-bold text-blue-300 mb-6 flex items-center gap-3">
              <span>🎮</span> How to Play:
            </h2>
            <div className="space-y-3 text-blue-100">
              <div className="flex items-start gap-3">
                <span className="text-yellow-400 text-xl">⬆️</span>
                <span><strong>Space/W/↑</strong> - Jump</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-purple-400 text-xl">⏸️</span>
                <span><strong>P</strong> - Pause</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-green-500 text-xl">🏃</span>
                <span>Jump over buildings to score!</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-red-500 text-xl">⚠️</span>
                <span>Don't crash into buildings!</span>
              </div>
            </div>
          </div>

          <button
            onClick={startGame}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500 text-white px-12 py-5 rounded-2xl font-bold text-2xl transition-all shadow-2xl hover:scale-105 flex items-center justify-center gap-3"
          >
            <span>🚀</span> START PARKOUR
          </button>

          <Link
            to="/games"
            className="block text-center mt-6 text-blue-100 hover:text-blue-50 transition-colors text-lg"
          >
            ← Back to Games
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-blue-600 py-12 px-6">
      <div className="container mx-auto max-w-7xl">
        <div className="grid lg:grid-cols-[1fr,320px] gap-8">
          <div className="flex flex-col items-center">
            <h1 className="text-5xl font-bold text-blue-100 mb-6 flex items-center gap-3">
              <span>🏙️</span>
              City Parkour
            </h1>

            <div className="relative bg-gradient-to-b from-blue-300 to-blue-500 overflow-hidden rounded-2xl border-4 border-blue-500 shadow-2xl" style={{ width: 600, height: 400 }}>
              <div
                className="absolute text-4xl transition-all"
                style={{ left: 100, bottom: 400 - playerY - 40, width: 40, height: 40 }}
              >
                🏃
              </div>

              {buildings.map(building => (
                <div
                  key={building.id}
                  className="absolute bg-gray-700 bottom-0"
                  style={{
                    left: building.x,
                    width: 60,
                    height: building.height
                  }}
                >
                  <div className="text-yellow-300 text-xs p-1">🏢</div>
                </div>
              ))}

              {paused && (
                <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-4">⏸️</div>
                    <h3 className="text-4xl font-bold text-blue-300">PAUSED</h3>
                    <p className="text-blue-200 mt-4">Press P to resume</p>
                  </div>
                </div>
              )}

              {gameOver && (
                <div className="absolute inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-6">💥</div>
                    <h2 className="text-5xl font-bold text-red-400 mb-4">CRASHED!</h2>
                    <p className="text-2xl text-blue-200 mb-2">Score: {score}</p>
                    <p className="text-xl text-yellow-400 mb-8">High Score: {highScore}</p>
                    <button
                      onClick={startGame}
                      className="px-10 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500 text-white rounded-full font-bold text-xl transition-all"
                    >
                      🔄 TRY AGAIN
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-black/40 backdrop-blur-md rounded-lg p-6 border border-blue-500/30">
              <h3 className="text-xl font-bold text-blue-300 mb-4 flex items-center gap-2">
                <span>📊</span> Run Stats
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

            <div className="bg-black/40 backdrop-blur-md rounded-lg p-6 border border-blue-500/30">
              <h3 className="text-xl font-bold text-blue-300 mb-4 flex items-center gap-2">
                <span>🎮</span> Controls
              </h3>
              <div className="text-sm space-y-2 text-white">
                <div>Space/W/↑: Jump</div>
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
                <span>🔄</span> New Run
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

export default CityParkour
