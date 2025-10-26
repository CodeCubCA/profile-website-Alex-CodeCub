import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

function BeeShooter() {
  const [gameStarted, setGameStarted] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [level, setLevel] = useState(1)
  const [lives, setLives] = useState(3)
  const [paused, setPaused] = useState(false)
  const [playerX, setPlayerX] = useState(300)
  const [bees, setBees] = useState([])
  const [bullets, setBullets] = useState([])

  const gameWidth = 600
  const gameHeight = 400

  const startGame = () => {
    setPlayerX(300)
    setBees([])
    setBullets([])
    setScore(0)
    setLevel(1)
    setLives(3)
    setGameOver(false)
    setGameStarted(true)
    setPaused(false)
  }

  useEffect(() => {
    if (!gameStarted || gameOver) return

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        setPlayerX(prev => Math.max(0, prev - 20))
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        setPlayerX(prev => Math.min(gameWidth - 40, prev + 20))
      } else if (e.key === ' ' || e.key === 'Spacebar' || e.key === 'w' || e.key === 'W') {
        e.preventDefault()
        setBullets(prev => [...prev, {
          x: playerX + 15,
          y: 350,
          id: Date.now()
        }])
      } else if (e.key === 'p' || e.key === 'P') {
        setPaused(prev => !prev)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [gameStarted, gameOver, playerX])

  useEffect(() => {
    if (!gameStarted || paused || gameOver) return

    const gameLoop = setInterval(() => {
      // Spawn bees
      if (Math.random() < 0.05) {
        setBees(prev => [...prev, {
          x: Math.random() * (gameWidth - 40),
          y: 0,
          id: Date.now()
        }])
      }

      // Move bees
      setBees(prev => {
        const newBees = prev.map(bee => ({ ...bee, y: bee.y + 3 }))

        // Check if any bee reached bottom
        newBees.forEach(bee => {
          if (bee.y > gameHeight - 40) {
            setLives(l => {
              const newLives = l - 1
              if (newLives <= 0) {
                setGameOver(true)
                setHighScore(prev => Math.max(prev, score))
              }
              return newLives
            })
          }
        })

        return newBees.filter(bee => bee.y < gameHeight)
      })

      // Move bullets
      setBullets(prev => prev
        .map(bullet => ({ ...bullet, y: bullet.y - 10 }))
        .filter(bullet => bullet.y > 0)
      )

      // Check collisions
      setBees(prevBees => {
        let hitBeeIds = []
        let hitBulletIds = []

        setBullets(prevBullets => {
          prevBullets.forEach(bullet => {
            prevBees.forEach(bee => {
              if (Math.abs(bullet.x - bee.x - 20) < 20 &&
                  Math.abs(bullet.y - bee.y - 20) < 20) {
                if (!hitBeeIds.includes(bee.id)) hitBeeIds.push(bee.id)
                if (!hitBulletIds.includes(bullet.id)) hitBulletIds.push(bullet.id)
                setScore(s => {
                  const newScore = s + 10
                  if (newScore % 100 === 0) {
                    setLevel(prev => prev + 1)
                  }
                  return newScore
                })
              }
            })
          })

          return prevBullets.filter(b => !hitBulletIds.includes(b.id))
        })

        return prevBees.filter(b => !hitBeeIds.includes(b.id))
      })
    }, 50)

    return () => clearInterval(gameLoop)
  }, [gameStarted, paused, gameOver, score])

  if (!gameStarted) {
    // Intro Page
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-400 via-orange-500 to-yellow-600 py-12 px-6 flex items-center justify-center">
        <div className="max-w-lg w-full">
          <div className="text-center mb-8">
            <div className="text-8xl mb-6">🐝</div>
            <h1 className="text-6xl font-bold text-yellow-100 mb-4">BEE SHOOTER</h1>
            <p className="text-xl text-yellow-50">Protect the garden from bees!</p>
          </div>

          <div className="bg-black/60 backdrop-blur-md rounded-2xl p-8 border border-yellow-500/30 mb-8">
            <h2 className="text-2xl font-bold text-yellow-300 mb-6 flex items-center gap-3">
              <span>🎮</span> How to Play:
            </h2>
            <div className="space-y-3 text-yellow-100">
              <div className="flex items-start gap-3">
                <span className="text-blue-400 text-xl">⬅️➡️</span>
                <span><strong>←→/A/D</strong> - Move left/right</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-red-400 text-xl">⭐</span>
                <span><strong>Space/W</strong> - Shoot</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-purple-400 text-xl">⏸️</span>
                <span><strong>P</strong> - Pause game</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-green-500 text-xl">🎯</span>
                <span>Shoot down all the bees!</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-orange-500 text-xl">⚠️</span>
                <span>Don't let bees reach the bottom!</span>
              </div>
            </div>
          </div>

          <button
            onClick={startGame}
            className="w-full bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-400 hover:to-orange-500 text-white px-12 py-5 rounded-2xl font-bold text-2xl transition-all shadow-2xl hover:scale-105 flex items-center justify-center gap-3"
          >
            <span>🚀</span> START GAME
          </button>

          <Link
            to="/games"
            className="block text-center mt-6 text-yellow-100 hover:text-yellow-50 transition-colors text-lg"
          >
            ← Back to Games
          </Link>
        </div>
      </div>
    )
  }

  // Game Page
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-400 via-orange-500 to-yellow-600 py-12 px-6">
      <div className="container mx-auto max-w-7xl">
        <div className="grid lg:grid-cols-[1fr,320px] gap-8">
          {/* Game Area */}
          <div className="flex flex-col items-center">
            <h1 className="text-5xl font-bold text-yellow-100 mb-6 flex items-center gap-3">
              <span>🐝</span>
              Bee Shooter
            </h1>

            {/* Game Canvas */}
            <div
              className="relative bg-sky-200 border-4 border-yellow-500 shadow-2xl overflow-hidden rounded-2xl"
              style={{ width: gameWidth, height: gameHeight }}
            >
              {/* Player */}
              <div
                className="absolute text-4xl transition-all duration-100"
                style={{
                  left: playerX,
                  bottom: 20,
                  width: 40,
                  height: 40
                }}
              >
                🏹
              </div>

              {/* Bees */}
              {bees.map(bee => (
                <div
                  key={bee.id}
                  className="absolute text-3xl"
                  style={{
                    left: bee.x,
                    top: bee.y,
                    width: 40,
                    height: 40
                  }}
                >
                  🐝
                </div>
              ))}

              {/* Bullets */}
              {bullets.map(bullet => (
                <div
                  key={bullet.id}
                  className="absolute bg-red-500 rounded-full shadow-lg"
                  style={{
                    left: bullet.x,
                    top: bullet.y,
                    width: 6,
                    height: 12
                  }}
                />
              ))}

              {paused && (
                <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-4">⏸️</div>
                    <h3 className="text-4xl font-bold text-yellow-300">PAUSED</h3>
                    <p className="text-yellow-200 mt-4">Press P to resume</p>
                  </div>
                </div>
              )}

              {gameOver && (
                <div className="absolute inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-6">💥</div>
                    <h2 className="text-5xl font-bold text-red-400 mb-4">GAME OVER</h2>
                    <p className="text-2xl text-yellow-200 mb-2">Final Score: {score}</p>
                    <p className="text-xl text-orange-400 mb-8">High Score: {highScore}</p>
                    <button
                      onClick={startGame}
                      className="px-10 py-3 bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-400 hover:to-orange-500 text-white rounded-full font-bold text-xl transition-all"
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
            <div className="bg-black/40 backdrop-blur-md rounded-lg p-6 border border-yellow-500/30">
              <h3 className="text-xl font-bold text-yellow-300 mb-4 flex items-center gap-2">
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
                  <span>Lives:</span>
                  <span className="font-bold text-red-400">
                    {'❤️'.repeat(lives)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Bees:</span>
                  <span className="font-bold text-orange-400">{bees.length}</span>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="bg-black/40 backdrop-blur-md rounded-lg p-6 border border-yellow-500/30">
              <h3 className="text-xl font-bold text-yellow-300 mb-4 flex items-center gap-2">
                <span>🎮</span> Controls
              </h3>
              <div className="text-sm space-y-2 text-white">
                <div>A/D or ←→: Move</div>
                <div>W or Space: Shoot</div>
                <div>P: Pause</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => setPaused(!paused)}
                className="w-full bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg font-bold text-white transition-all flex items-center justify-center gap-2"
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

export default BeeShooter
