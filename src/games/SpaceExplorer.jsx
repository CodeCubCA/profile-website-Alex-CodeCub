import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

function SpaceExplorer() {
  const [gameStarted, setGameStarted] = useState(false)
  const [player, setPlayer] = useState({ x: 300, y: 350 })
  const [fuel, setFuel] = useState(100)
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [level, setLevel] = useState(1)
  const [paused, setPaused] = useState(false)
  const [stars, setStars] = useState([])
  const [asteroids, setAsteroids] = useState([])
  const [gameOver, setGameOver] = useState(false)
  const [keys, setKeys] = useState({})

  const startGame = () => {
    setPlayer({ x: 300, y: 350 })
    setFuel(100)
    setScore(0)
    setLevel(1)
    setStars([])
    setAsteroids([])
    setGameOver(false)
    setGameStarted(true)
    setPaused(false)
  }

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'p' || e.key === 'P') {
        setPaused(prev => !prev)
      } else {
        setKeys(prev => ({ ...prev, [e.key]: true }))
      }
    }
    const handleKeyUp = (e) => setKeys(prev => ({ ...prev, [e.key]: false }))

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  useEffect(() => {
    if (!gameStarted || paused || gameOver) return

    const gameLoop = setInterval(() => {
      if (Math.random() < 0.05) {
        setStars(prev => [...prev, {
          x: Math.random() * 560,
          y: 0,
          id: Date.now() + Math.random()
        }])
      }

      if (Math.random() < 0.02) {
        setAsteroids(prev => [...prev, {
          x: Math.random() * 560,
          y: 0,
          id: Date.now() + Math.random()
        }])
      }

      setPlayer(prev => {
        let newX = prev.x
        let newY = prev.y

        if (keys['ArrowLeft'] || keys['a'] || keys['A']) newX = Math.max(0, prev.x - 5)
        if (keys['ArrowRight'] || keys['d'] || keys['D']) newX = Math.min(560, prev.x + 5)
        if (keys['ArrowUp'] || keys['w'] || keys['W']) {
          newY = Math.max(0, prev.y - 5)
          setFuel(f => Math.max(0, f - 0.5))
        }
        if (keys['ArrowDown'] || keys['s'] || keys['S']) newY = Math.min(360, prev.y + 5)

        return { x: newX, y: newY }
      })

      setStars(prev => {
        const newStars = prev
          .map(s => ({ ...s, y: s.y + 3 }))
          .filter(s => s.y < 400)

        newStars.forEach(star => {
          if (Math.abs(star.x - player.x - 20) < 20 &&
              Math.abs(star.y - player.y - 20) < 20) {
            setScore(s => {
              const newScore = s + 10
              if (newScore % 100 === 0) {
                setLevel(prev => prev + 1)
              }
              return newScore
            })
            setFuel(f => Math.min(100, f + 10))
          }
        })

        return newStars.filter(s =>
          !(Math.abs(s.x - player.x - 20) < 20 && Math.abs(s.y - player.y - 20) < 20)
        )
      })

      setAsteroids(prev => {
        const newAsteroids = prev
          .map(a => ({ ...a, y: a.y + 4 }))
          .filter(a => a.y < 400)

        newAsteroids.forEach(asteroid => {
          if (Math.abs(asteroid.x - player.x - 20) < 25 &&
              Math.abs(asteroid.y - player.y - 20) < 25) {
            setGameOver(true)
            setHighScore(prev => Math.max(prev, score))
          }
        })

        return newAsteroids
      })

      if (fuel <= 0) {
        setGameOver(true)
        setHighScore(prev => Math.max(prev, score))
      }
    }, 30)

    return () => clearInterval(gameLoop)
  }, [gameStarted, paused, gameOver, keys, player, fuel, score])

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-blue-900 to-purple-900 py-12 px-6 flex items-center justify-center">
        <div className="max-w-lg w-full">
          <div className="text-center mb-8">
            <div className="text-8xl mb-6">🚀</div>
            <h1 className="text-6xl font-bold text-blue-200 mb-4">SPACE EXPLORER</h1>
            <p className="text-xl text-blue-100">Navigate the cosmos!</p>
          </div>

          <div className="bg-black/60 backdrop-blur-md rounded-2xl p-8 border border-blue-500/30 mb-8">
            <h2 className="text-2xl font-bold text-blue-300 mb-6 flex items-center gap-3">
              <span>🎮</span> How to Play:
            </h2>
            <div className="space-y-3 text-blue-100">
              <div className="flex items-start gap-3">
                <span className="text-cyan-400 text-xl">⬆️⬇️⬅️➡️</span>
                <span><strong>WASD/Arrows</strong> - Move ship</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-yellow-400 text-xl">⏸️</span>
                <span><strong>P</strong> - Pause</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-green-500 text-xl">⭐</span>
                <span>Collect stars for fuel and points!</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-red-500 text-xl">☄️</span>
                <span>Avoid asteroids!</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-orange-500 text-xl">⛽</span>
                <span>Moving up uses fuel - collect stars!</span>
              </div>
            </div>
          </div>

          <button
            onClick={startGame}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500 text-white px-12 py-5 rounded-2xl font-bold text-2xl transition-all shadow-2xl hover:scale-105 flex items-center justify-center gap-3"
          >
            <span>🚀</span> LAUNCH MISSION
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-blue-900 to-purple-900 py-12 px-6">
      <div className="container mx-auto max-w-7xl">
        <div className="grid lg:grid-cols-[1fr,320px] gap-8">
          <div className="flex flex-col items-center">
            <h1 className="text-5xl font-bold text-blue-200 mb-6 flex items-center gap-3">
              <span>🚀</span>
              Space Explorer
            </h1>

            <div className="relative bg-black overflow-hidden rounded-2xl border-4 border-blue-500 shadow-2xl" style={{ width: 600, height: 400 }}>
              <div
                className="absolute text-4xl"
                style={{ left: player.x, top: player.y, width: 40, height: 40 }}
              >
                🚀
              </div>

              {stars.map(star => (
                <div
                  key={star.id}
                  className="absolute text-2xl"
                  style={{ left: star.x, top: star.y }}
                >
                  ⭐
                </div>
              ))}

              {asteroids.map(asteroid => (
                <div
                  key={asteroid.id}
                  className="absolute text-3xl"
                  style={{ left: asteroid.x, top: asteroid.y }}
                >
                  ☄️
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
                    <h2 className="text-5xl font-bold text-red-400 mb-4">MISSION END!</h2>
                    <p className="text-2xl text-blue-200 mb-2">Score: {score}</p>
                    <p className="text-xl text-yellow-400 mb-8">High Score: {highScore}</p>
                    <button
                      onClick={startGame}
                      className="px-10 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500 text-white rounded-full font-bold text-xl transition-all"
                    >
                      🔄 NEW MISSION
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-black/40 backdrop-blur-md rounded-lg p-6 border border-blue-500/30">
              <h3 className="text-xl font-bold text-blue-300 mb-4 flex items-center gap-2">
                <span>📊</span> Mission Stats
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
                <div className="flex justify-between items-center">
                  <span>Fuel:</span>
                  <div className="w-24 bg-gray-600 rounded-full h-3">
                    <div
                      className="bg-green-500 h-3 rounded-full transition-all"
                      style={{ width: `${fuel}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-black/40 backdrop-blur-md rounded-lg p-6 border border-blue-500/30">
              <h3 className="text-xl font-bold text-blue-300 mb-4 flex items-center gap-2">
                <span>🎮</span> Controls
              </h3>
              <div className="text-sm space-y-2 text-white">
                <div>WASD/Arrows: Move</div>
                <div>↑: Uses fuel</div>
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
                <span>🔄</span> New Mission
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

export default SpaceExplorer
