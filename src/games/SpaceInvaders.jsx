import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

function SpaceInvaders() {
  const [gameStarted, setGameStarted] = useState(false)
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [lives, setLives] = useState(3)
  const [level, setLevel] = useState(1)
  const [invaders, setInvaders] = useState(50)
  const [paused, setPaused] = useState(false)
  const [gameOver, setGameOver] = useState(false)

  const [playerPos, setPlayerPos] = useState(400)
  const [bullets, setBullets] = useState([])
  const [aliens, setAliens] = useState([])
  const [alienBullets, setAlienBullets] = useState([])

  // Initialize aliens in formation
  useEffect(() => {
    if (gameStarted && !paused) {
      const initialAliens = []
      for (let row = 0; row < 5; row++) {
        for (let col = 0; col < 10; col++) {
          initialAliens.push({
            id: `${row}-${col}`,
            x: 50 + col * 70,
            y: 50 + row * 50,
            type: row === 0 ? 'purple' : row < 3 ? 'green' : 'blue',
            alive: true
          })
        }
      }
      setAliens(initialAliens)
    }
  }, [gameStarted, level])

  // Player movement
  useEffect(() => {
    if (!gameStarted || paused || gameOver) return

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        setPlayerPos(prev => Math.max(20, prev - 20))
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        setPlayerPos(prev => Math.min(760, prev + 20))
      } else if (e.key === ' ' || e.key === 'Spacebar' || e.key === '1' || e.key === 'w' || e.key === 'W') {
        e.preventDefault()
        shoot()
      } else if (e.key === 'p' || e.key === 'P') {
        setPaused(prev => !prev)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [gameStarted, paused, gameOver, playerPos])

  const shoot = () => {
    setBullets(prev => [...prev, { x: playerPos, y: 550, id: Date.now() }])
  }

  // Game loop
  useEffect(() => {
    if (!gameStarted || paused || gameOver) return

    const interval = setInterval(() => {
      // Move bullets
      setBullets(prev => prev
        .map(b => ({ ...b, y: b.y - 10 }))
        .filter(b => b.y > 0)
      )

      // Move alien bullets
      setAlienBullets(prev => prev
        .map(b => ({ ...b, y: b.y + 5 }))
        .filter(b => b.y < 600)
      )

      // Move aliens
      setAliens(prev => {
        const newAliens = prev.map(a => ({
          ...a,
          y: a.y + 0.5,
          x: a.x + Math.sin(Date.now() / 500) * 0.5
        }))
        return newAliens
      })

      // Random alien shooting
      if (Math.random() < 0.02 && aliens.length > 0) {
        const aliveAliens = aliens.filter(a => a.alive)
        if (aliveAliens.length > 0) {
          const shooter = aliveAliens[Math.floor(Math.random() * aliveAliens.length)]
          setAlienBullets(prev => [...prev, { x: shooter.x + 20, y: shooter.y + 30, id: Date.now() }])
        }
      }

      // Check collisions
      setBullets(prevBullets => {
        const remainingBullets = [...prevBullets]
        setAliens(prevAliens => {
          const updatedAliens = prevAliens.map(alien => {
            if (!alien.alive) return alien

            const hitBullet = remainingBullets.findIndex(bullet =>
              Math.abs(bullet.x - alien.x - 20) < 30 &&
              Math.abs(bullet.y - alien.y - 20) < 30
            )

            if (hitBullet !== -1) {
              remainingBullets.splice(hitBullet, 1)
              const points = alien.type === 'purple' ? 30 : alien.type === 'blue' ? 20 : 10
              setScore(prev => {
                const newScore = prev + points
                setHighScore(hs => Math.max(hs, newScore))
                return newScore
              })
              setInvaders(prev => prev - 1)
              return { ...alien, alive: false }
            }
            return alien
          })

          // Check if level complete
          const aliveCount = updatedAliens.filter(a => a.alive).length
          if (aliveCount === 0) {
            setLevel(prev => prev + 1)
            setScore(prev => prev + 1000)
          }

          return updatedAliens
        })
        return remainingBullets
      })

      // Check alien bullet hits on player
      setAlienBullets(prevBullets => {
        const hit = prevBullets.some(bullet =>
          Math.abs(bullet.x - playerPos) < 30 &&
          bullet.y > 540 && bullet.y < 580
        )
        if (hit) {
          setLives(prev => {
            const newLives = prev - 1
            if (newLives <= 0) {
              setGameOver(true)
            }
            return newLives
          })
          return prevBullets.filter(bullet =>
            !(Math.abs(bullet.x - playerPos) < 30 && bullet.y > 540 && bullet.y < 580)
          )
        }
        return prevBullets
      })

      // Check if aliens reached bottom
      const reachedBottom = aliens.some(a => a.alive && a.y > 520)
      if (reachedBottom) {
        setGameOver(true)
      }

    }, 50)

    return () => clearInterval(interval)
  }, [gameStarted, paused, gameOver, aliens, bullets, alienBullets, playerPos])

  const startGame = () => {
    setGameStarted(true)
    setGameOver(false)
    setScore(0)
    setLives(3)
    setLevel(1)
    setInvaders(50)
    setPaused(false)
    setPlayerPos(400)
    setBullets([])
    setAlienBullets([])
  }

  if (!gameStarted) {
    // Intro Page
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-black py-12 px-6 flex items-center justify-center">
        <div className="max-w-lg w-full">
          <div className="text-center mb-8">
            <div className="text-8xl mb-6">👾</div>
            <h1 className="text-6xl font-bold text-purple-200 mb-4">SPACE INVADERS</h1>
            <p className="text-xl text-purple-100">Defend Earth from the alien invasion!</p>
          </div>

          <div className="bg-black/60 backdrop-blur-md rounded-2xl p-8 border border-purple-500/30 mb-8">
            <h2 className="text-2xl font-bold text-purple-300 mb-6 flex items-center gap-3">
              <span>🎮</span> How to Play:
            </h2>
            <div className="space-y-3 text-purple-100">
              <div className="flex items-start gap-3">
                <span className="text-cyan-400 text-xl">⬅️➡️</span>
                <span><strong>←→/A/D</strong> - Move ship</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-yellow-400 text-xl">🔫</span>
                <span><strong>Space/W</strong> - Shoot</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-green-400 text-xl">⏸️</span>
                <span><strong>P</strong> - Pause game</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-purple-400 text-xl">👾</span>
                <span>Destroy all aliens before they reach you!</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-red-500 text-xl">⚠️</span>
                <span>Avoid alien bullets - you have 3 lives!</span>
              </div>
            </div>
          </div>

          <button
            onClick={startGame}
            className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white px-12 py-5 rounded-2xl font-bold text-2xl transition-all shadow-2xl hover:scale-105 flex items-center justify-center gap-3"
          >
            <span>🚀</span> START INVASION
          </button>

          <Link
            to="/games"
            className="block text-center mt-6 text-purple-200 hover:text-purple-100 transition-colors text-lg"
          >
            ← Back to Games
          </Link>
        </div>
      </div>
    )
  }

  // Game Page
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-black py-12 px-6">
      <div className="container mx-auto max-w-7xl">
        <div className="grid lg:grid-cols-[1fr,320px] gap-8">
          {/* Game Area */}
          <div className="flex flex-col items-center">
            <h1 className="text-5xl font-bold text-purple-200 mb-6 flex items-center gap-3">
              <span>👾</span>
              SPACE INVADERS
              <span>👾</span>
            </h1>

            {/* Game Canvas */}
            <div className="relative w-full max-w-[820px] h-[620px] bg-black rounded-2xl border-4 border-cyan-500 shadow-2xl shadow-cyan-500/30 overflow-hidden">
              {/* Stars background */}
              <div className="absolute inset-0">
                {Array.from({ length: 50 }).map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 2}s`
                    }}
                  />
                ))}
              </div>

              {!gameStarted ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm">
                  <div className="text-8xl mb-8 animate-bounce">👾</div>
                  <h2 className="text-4xl font-bold text-cyan-400 mb-4">SPACE INVADERS</h2>
                  <p className="text-gray-300 mb-8 text-center max-w-md">
                    Defend Earth from alien invaders! Use arrow keys or A/D to move, Space/W/1 to shoot.
                  </p>
                  <button
                    onClick={startGame}
                    className="px-12 py-4 bg-gradient-to-r from-green-500 to-green-700 hover:from-green-400 hover:to-green-600 text-white rounded-full font-bold text-2xl transition-all shadow-xl hover:scale-110"
                  >
                    🎮 START GAME
                  </button>
                </div>
              ) : gameOver ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 backdrop-blur-sm">
                  <div className="text-6xl mb-6">💀</div>
                  <h2 className="text-5xl font-bold text-red-400 mb-4">GAME OVER</h2>
                  <p className="text-2xl text-gray-300 mb-2">Final Score: {score}</p>
                  <p className="text-xl text-yellow-400 mb-8">High Score: {highScore}</p>
                  <button
                    onClick={startGame}
                    className="px-10 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-full font-bold text-xl transition-all"
                  >
                    🔄 PLAY AGAIN
                  </button>
                </div>
              ) : (
                <>
                  {/* Aliens */}
                  {aliens.filter(a => a.alive).map(alien => (
                    <div
                      key={alien.id}
                      className="absolute text-4xl transition-all duration-100"
                      style={{
                        left: `${alien.x}px`,
                        top: `${alien.y}px`,
                        transform: 'translate(-50%, -50%)'
                      }}
                    >
                      {alien.type === 'purple' ? '👾' : alien.type === 'green' ? '👽' : '🛸'}
                    </div>
                  ))}

                  {/* Player */}
                  <div
                    className="absolute text-4xl transition-all duration-100"
                    style={{
                      left: `${playerPos}px`,
                      bottom: '30px',
                      transform: 'translateX(-50%)'
                    }}
                  >
                    🚀
                  </div>

                  {/* Player Bullets */}
                  {bullets.map(bullet => (
                    <div
                      key={bullet.id}
                      className="absolute w-2 h-4 bg-cyan-400 rounded-full shadow-lg shadow-cyan-400/50"
                      style={{
                        left: `${bullet.x}px`,
                        top: `${bullet.y}px`,
                        transform: 'translateX(-50%)'
                      }}
                    />
                  ))}

                  {/* Alien Bullets */}
                  {alienBullets.map(bullet => (
                    <div
                      key={bullet.id}
                      className="absolute w-2 h-4 bg-red-500 rounded-full shadow-lg shadow-red-500/50"
                      style={{
                        left: `${bullet.x}px`,
                        top: `${bullet.y}px`,
                        transform: 'translateX(-50%)'
                      }}
                    />
                  ))}

                  {paused && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm">
                      <div className="text-center">
                        <div className="text-6xl mb-4">⏸️</div>
                        <h3 className="text-4xl font-bold text-cyan-400">PAUSED</h3>
                        <p className="text-gray-300 mt-4">Press P to resume</p>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            {/* Game Stats */}
            <div className="bg-black/40 backdrop-blur-md rounded-lg p-6 border border-purple-500/30">
              <h3 className="text-xl font-bold text-purple-300 mb-4 flex items-center gap-2">
                <span>📊</span> Game Stats
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Score:</span>
                  <span className="font-bold text-yellow-400">{score}</span>
                </div>
                <div className="flex justify-between">
                  <span>High Score:</span>
                  <span className="font-bold text-yellow-400">{highScore}</span>
                </div>
                <div className="flex justify-between">
                  <span>Lives:</span>
                  <span className="font-bold text-red-400">
                    {'❤️'.repeat(lives)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Level:</span>
                  <span className="font-bold text-green-400">{level}</span>
                </div>
                <div className="flex justify-between">
                  <span>Invaders:</span>
                  <span className="font-bold text-cyan-400">{invaders}</span>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="bg-black/40 backdrop-blur-md rounded-lg p-6 border border-purple-500/30">
              <h3 className="text-xl font-bold text-purple-300 mb-4 flex items-center gap-2">
                <span>🎮</span> Controls
              </h3>
              <div className="text-sm space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-cyan-400">🏹</span>
                  <span>Move: ← → or A/D</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-red-400">⭐</span>
                  <span>Shoot: Space, 1, or W</span>
                </div>
              </div>
            </div>

            {/* Scoring */}
            <div className="bg-black/40 backdrop-blur-md rounded-lg p-6 border border-purple-500/30">
              <h3 className="text-xl font-bold text-purple-300 mb-4 flex items-center gap-2">
                <span>🎯</span> Scoring
              </h3>
              <div className="text-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <span>👽</span> Green Invader
                  </span>
                  <span className="text-yellow-400 font-bold">10 pts</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <span>🛸</span> Blue Invader
                  </span>
                  <span className="text-yellow-400 font-bold">20 pts</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <span>👾</span> Red Invader
                  </span>
                  <span className="text-yellow-400 font-bold">30 pts</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <span>⚡</span> Power-up
                  </span>
                  <span className="text-yellow-400 font-bold">100 pts</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <span>⭐</span> Level Clear
                  </span>
                  <span className="text-yellow-400 font-bold">1000 pts</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              {gameStarted && !gameOver && (
                <button
                  onClick={() => setPaused(!paused)}
                  className="w-full bg-yellow-600 hover:bg-yellow-700 px-6 py-3 rounded-lg font-bold text-white transition-all flex items-center justify-center gap-2"
                >
                  <span>⏸️</span> {paused ? 'Resume' : 'Pause'}
                </button>
              )}
              <button
                onClick={startGame}
                className="w-full bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg font-bold text-white transition-all flex items-center justify-center gap-2"
                disabled={!gameStarted || gameOver}
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

export default SpaceInvaders
