import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

function AirplaneShooter() {
  const [gameStarted, setGameStarted] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [level, setLevel] = useState(1)
  const [lives, setLives] = useState(3)
  const [paused, setPaused] = useState(false)
  const [playerX, setPlayerX] = useState(300)
  const [enemies, setEnemies] = useState([])
  const [bullets, setBullets] = useState([])

  const gameWidth = 600
  const gameHeight = 400

  const startGame = () => {
    setPlayerX(300)
    setEnemies([])
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
      // Spawn enemies
      if (Math.random() < 0.03) {
        setEnemies(prev => [...prev, {
          x: Math.random() * (gameWidth - 40),
          y: 0,
          id: Date.now()
        }])
      }

      // Move enemies
      setEnemies(prev => {
        const newEnemies = prev.map(enemy => ({ ...enemy, y: enemy.y + 2 }))

        // Check if any enemy hit player
        newEnemies.forEach(enemy => {
          if (enemy.y > gameHeight - 80 && enemy.y < gameHeight - 40 &&
              Math.abs(enemy.x - playerX) < 40) {
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

        return newEnemies.filter(enemy => enemy.y < gameHeight)
      })

      // Move bullets
      setBullets(prev => prev
        .map(bullet => ({ ...bullet, y: bullet.y - 10 }))
        .filter(bullet => bullet.y > 0)
      )

      // Check collisions
      setEnemies(prevEnemies => {
        let hitEnemyIds = []
        let hitBulletIds = []

        setBullets(prevBullets => {
          prevBullets.forEach(bullet => {
            prevEnemies.forEach(enemy => {
              if (Math.abs(bullet.x - enemy.x - 20) < 20 &&
                  Math.abs(bullet.y - enemy.y - 20) < 20) {
                if (!hitEnemyIds.includes(enemy.id)) hitEnemyIds.push(enemy.id)
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

        return prevEnemies.filter(e => !hitEnemyIds.includes(e.id))
      })
    }, 50)

    return () => clearInterval(gameLoop)
  }, [gameStarted, paused, gameOver, playerX, score])

  if (!gameStarted) {
    // Intro Page
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 py-12 px-6 flex items-center justify-center">
        <div className="max-w-lg w-full">
          <div className="text-center mb-8">
            <div className="text-8xl mb-6">✈️</div>
            <h1 className="text-6xl font-bold text-blue-200 mb-4">AIRPLANE SHOOTER</h1>
            <p className="text-xl text-blue-100">Defend the skies!</p>
          </div>

          <div className="bg-black/60 backdrop-blur-md rounded-2xl p-8 border border-blue-500/30 mb-8">
            <h2 className="text-2xl font-bold text-blue-300 mb-6 flex items-center gap-3">
              <span>🎮</span> How to Play:
            </h2>
            <div className="space-y-3 text-blue-100">
              <div className="flex items-start gap-3">
                <span className="text-cyan-400 text-xl">⬅️➡️</span>
                <span><strong>←→/A/D</strong> - Move left/right</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-yellow-400 text-xl">⭐</span>
                <span><strong>Space/W</strong> - Shoot</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-purple-400 text-xl">⏸️</span>
                <span><strong>P</strong> - Pause game</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-red-500 text-xl">🎯</span>
                <span>Shoot down enemy planes!</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-orange-500 text-xl">⚠️</span>
                <span>Avoid collisions - you have 3 lives!</span>
              </div>
            </div>
          </div>

          <button
            onClick={startGame}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500 text-white px-12 py-5 rounded-2xl font-bold text-2xl transition-all shadow-2xl hover:scale-105 flex items-center justify-center gap-3"
          >
            <span>🚀</span> TAKE OFF
          </button>

          <Link
            to="/games"
            className="block text-center mt-6 text-blue-200 hover:text-blue-100 transition-colors text-lg"
          >
            ← Back to Games
          </Link>
        </div>
      </div>
    )
  }

  // Game Page
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 py-12 px-6">
      <div className="container mx-auto max-w-7xl">
        <div className="grid lg:grid-cols-[1fr,320px] gap-8">
          {/* Game Area */}
          <div className="flex flex-col items-center">
            <h1 className="text-5xl font-bold text-blue-200 mb-6 flex items-center gap-3">
              <span>✈️</span>
              Airplane Shooter
            </h1>

            {/* Game Canvas */}
            <div
              className="relative bg-gradient-to-b from-blue-400 to-blue-600 border-4 border-blue-500 shadow-2xl overflow-hidden rounded-2xl"
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
                ✈️
              </div>

              {/* Enemies */}
              {enemies.map(enemy => (
                <div
                  key={enemy.id}
                  className="absolute text-3xl"
                  style={{
                    left: enemy.x,
                    top: enemy.y,
                    width: 40,
                    height: 40,
                    transform: 'rotate(180deg)'
                  }}
                >
                  ✈️
                </div>
              ))}

              {/* Bullets */}
              {bullets.map(bullet => (
                <div
                  key={bullet.id}
                  className="absolute bg-yellow-400 rounded-full shadow-lg"
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
                    <h3 className="text-4xl font-bold text-blue-300">PAUSED</h3>
                    <p className="text-blue-200 mt-4">Press P to resume</p>
                  </div>
                </div>
              )}

              {gameOver && (
                <div className="absolute inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-6">💥</div>
                    <h2 className="text-5xl font-bold text-red-400 mb-4">GAME OVER</h2>
                    <p className="text-2xl text-blue-200 mb-2">Final Score: {score}</p>
                    <p className="text-xl text-yellow-400 mb-8">High Score: {highScore}</p>
                    <button
                      onClick={startGame}
                      className="px-10 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500 text-white rounded-full font-bold text-xl transition-all"
                    >
                      🔄 FLY AGAIN
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            {/* Game Stats */}
            <div className="bg-black/40 backdrop-blur-md rounded-lg p-6 border border-blue-500/30">
              <h3 className="text-xl font-bold text-blue-300 mb-4 flex items-center gap-2">
                <span>📊</span> Flight Stats
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
                  <span>Enemies:</span>
                  <span className="font-bold text-purple-400">{enemies.length}</span>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="bg-black/40 backdrop-blur-md rounded-lg p-6 border border-blue-500/30">
              <h3 className="text-xl font-bold text-blue-300 mb-4 flex items-center gap-2">
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
                className="w-full bg-yellow-600 hover:bg-yellow-700 px-6 py-3 rounded-lg font-bold text-white transition-all flex items-center justify-center gap-2"
                disabled={gameOver}
              >
                <span>⏸️</span> {paused ? 'Resume' : 'Pause'}
              </button>
              <button
                onClick={startGame}
                className="w-full bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg font-bold text-white transition-all flex items-center justify-center gap-2"
              >
                <span>🔄</span> New Flight
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

export default AirplaneShooter
