import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

function TankBattle() {
  const [gameStarted, setGameStarted] = useState(false)
  const [score, setScore] = useState(0)
  const [level, setLevel] = useState(1)
  const [lives, setLives] = useState(3)
  const [health, setHealth] = useState(100)
  const [enemies, setEnemies] = useState(8)
  const [paused, setPaused] = useState(false)
  const [gameOver, setGameOver] = useState(false)

  const [playerPos, setPlayerPos] = useState({ x: 200, y: 350 })
  const [playerDir, setPlayerDir] = useState('up')
  const [bullets, setBullets] = useState([])
  const [enemyTanks, setEnemyTanks] = useState([])
  const [walls, setWalls] = useState([])

  // Initialize game elements
  useEffect(() => {
    if (gameStarted) {
      // Create walls
      const newWalls = []
      for (let i = 0; i < 15; i++) {
        const x = Math.floor(Math.random() * 15) * 26
        const y = Math.floor(Math.random() * 15) * 26
        const type = Math.random() > 0.3 ? 'yellow' : 'gray'
        newWalls.push({ x, y, type, id: i })
      }
      setWalls(newWalls)

      // Create enemy tanks
      const newEnemies = []
      for (let i = 0; i < 8; i++) {
        newEnemies.push({
          id: i,
          x: 50 + (i % 4) * 100,
          y: 50 + Math.floor(i / 4) * 100,
          dir: 'down',
          alive: true
        })
      }
      setEnemyTanks(newEnemies)
    }
  }, [gameStarted, level])

  // Player movement
  useEffect(() => {
    if (!gameStarted || paused || gameOver) return

    const handleKeyDown = (e) => {
      const speed = 15
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        setPlayerDir('up')
        setPlayerPos(prev => ({ ...prev, y: Math.max(10, prev.y - speed) }))
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        setPlayerDir('down')
        setPlayerPos(prev => ({ ...prev, y: Math.min(390, prev.y + speed) }))
      } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        setPlayerDir('left')
        setPlayerPos(prev => ({ ...prev, x: Math.max(10, prev.x - speed) }))
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        setPlayerDir('right')
        setPlayerPos(prev => ({ ...prev, x: Math.min(390, prev.x + speed) }))
      } else if (e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault()
        shoot()
      } else if (e.key === 'p' || e.key === 'P') {
        setPaused(prev => !prev)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [gameStarted, paused, gameOver, playerPos, playerDir])

  const shoot = () => {
    const bulletSpeed = 10
    let dx = 0, dy = 0
    if (playerDir === 'up') dy = -bulletSpeed
    else if (playerDir === 'down') dy = bulletSpeed
    else if (playerDir === 'left') dx = -bulletSpeed
    else if (playerDir === 'right') dx = bulletSpeed

    setBullets(prev => [...prev, {
      x: playerPos.x,
      y: playerPos.y,
      dx,
      dy,
      id: Date.now()
    }])
  }

  // Game loop
  useEffect(() => {
    if (!gameStarted || paused || gameOver) return

    const interval = setInterval(() => {
      // Move bullets
      setBullets(prev => prev
        .map(b => ({ ...b, x: b.x + b.dx, y: b.y + b.dy }))
        .filter(b => b.x > 0 && b.x < 400 && b.y > 0 && b.y < 400)
      )

      // Move enemy tanks
      setEnemyTanks(prev => prev.map(tank => {
        if (!tank.alive) return tank
        const move = Math.random() > 0.95
        if (move) {
          const dirs = ['up', 'down', 'left', 'right']
          const newDir = dirs[Math.floor(Math.random() * dirs.length)]
          let newX = tank.x, newY = tank.y
          if (newDir === 'up') newY = Math.max(10, tank.y - 10)
          else if (newDir === 'down') newY = Math.min(390, tank.y + 10)
          else if (newDir === 'left') newX = Math.max(10, tank.x - 10)
          else if (newDir === 'right') newX = Math.min(390, tank.x + 10)
          return { ...tank, x: newX, y: newY, dir: newDir }
        }
        return tank
      }))

      // Check bullet collisions with enemies
      setBullets(prevBullets => {
        const remainingBullets = [...prevBullets]
        setEnemyTanks(prevTanks => {
          return prevTanks.map(tank => {
            if (!tank.alive) return tank
            const hitIndex = remainingBullets.findIndex(b =>
              Math.abs(b.x - tank.x) < 25 && Math.abs(b.y - tank.y) < 25
            )
            if (hitIndex !== -1) {
              remainingBullets.splice(hitIndex, 1)
              setScore(prev => prev + 100)
              setEnemies(prev => prev - 1)
              return { ...tank, alive: false }
            }
            return tank
          })
        })
        return remainingBullets
      })

      // Check if level complete
      const aliveEnemies = enemyTanks.filter(t => t.alive).length
      if (aliveEnemies === 0 && enemyTanks.length > 0) {
        setLevel(prev => prev + 1)
        setScore(prev => prev + 1000)
      }

    }, 100)

    return () => clearInterval(interval)
  }, [gameStarted, paused, gameOver, enemyTanks])

  const startGame = () => {
    setGameStarted(true)
    setGameOver(false)
    setScore(0)
    setLevel(1)
    setLives(3)
    setHealth(100)
    setEnemies(8)
    setPaused(false)
    setPlayerPos({ x: 200, y: 350 })
    setBullets([])
  }

  if (!gameStarted) {
    // Intro Page
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-orange-900 to-red-800 py-12 px-6 flex items-center justify-center">
        <div className="max-w-lg w-full">
          <div className="text-center mb-8">
            <div className="text-8xl mb-6">🚗</div>
            <h1 className="text-6xl font-bold text-orange-200 mb-4">TANK BATTLE</h1>
            <p className="text-xl text-orange-100">Destroy enemy tanks and survive!</p>
          </div>

          <div className="bg-black/60 backdrop-blur-md rounded-2xl p-8 border border-orange-500/30 mb-8">
            <h2 className="text-2xl font-bold text-orange-300 mb-6 flex items-center gap-3">
              <span>🎮</span> How to Play:
            </h2>
            <div className="space-y-3 text-orange-100">
              <div className="flex items-start gap-3">
                <span className="text-blue-400 text-xl">⬆️</span>
                <span><strong>↑/W</strong> - Move up</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-blue-400 text-xl">⬇️</span>
                <span><strong>↓/S</strong> - Move down</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-blue-400 text-xl">⬅️</span>
                <span><strong>←/A</strong> - Move left</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-blue-400 text-xl">➡️</span>
                <span><strong>→/D</strong> - Move right</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-red-400 text-xl">⭐</span>
                <span><strong>Space</strong> - Shoot</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-yellow-400 text-xl">⏸️</span>
                <span><strong>P</strong> - Pause game</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-red-500 text-xl">💣</span>
                <span>Destroy enemy tanks to earn points!</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-yellow-500 text-xl">🧱</span>
                <span>Yellow walls can be destroyed, gray walls cannot!</span>
              </div>
            </div>
          </div>

          <button
            onClick={startGame}
            className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 text-white px-12 py-5 rounded-2xl font-bold text-2xl transition-all shadow-2xl hover:scale-105 flex items-center justify-center gap-3"
          >
            <span>🚀</span> START BATTLE
          </button>

          <Link
            to="/games"
            className="block text-center mt-6 text-orange-200 hover:text-orange-100 transition-colors text-lg"
          >
            ← Back to Games
          </Link>
        </div>
      </div>
    )
  }

  // Game Page
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-orange-900 to-red-800 py-12 px-6">
      <div className="container mx-auto max-w-7xl">
        <div className="grid lg:grid-cols-[1fr,320px] gap-8">
          {/* Game Area */}
          <div className="flex flex-col items-center">
            <h1 className="text-5xl font-bold text-orange-200 mb-6 flex items-center gap-3">
              <span>🎖️</span>
              Tank Battle
            </h1>

            {/* Game Canvas */}
            <div className="relative w-full max-w-[420px] h-[420px] bg-green-700 rounded-2xl border-4 border-green-500 shadow-2xl overflow-hidden">
              {/* Grid pattern */}
              <div className="absolute inset-0" style={{
                backgroundImage: 'linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)',
                backgroundSize: '26px 26px'
              }} />

              {/* Walls */}
              {walls.map(wall => (
                <div
                  key={wall.id}
                  className={`absolute w-6 h-6 ${wall.type === 'yellow' ? 'bg-yellow-600' : 'bg-gray-600'} border border-black/30`}
                  style={{ left: `${wall.x}px`, top: `${wall.y}px` }}
                />
              ))}

              {/* Enemy Tanks */}
              {enemyTanks.filter(t => t.alive).map(tank => (
                <div
                  key={tank.id}
                  className="absolute text-3xl transition-all duration-100"
                  style={{
                    left: `${tank.x}px`,
                    top: `${tank.y}px`,
                    transform: 'translate(-50%, -50%)'
                  }}
                >
                  🟧
                </div>
              ))}

              {/* Player Tank */}
              <div
                className="absolute text-3xl transition-all duration-100"
                style={{
                  left: `${playerPos.x}px`,
                  top: `${playerPos.y}px`,
                  transform: `translate(-50%, -50%) rotate(${
                    playerDir === 'up' ? 0 : playerDir === 'right' ? 90 : playerDir === 'down' ? 180 : 270
                  }deg)`
                }}
              >
                🟦
              </div>

              {/* Bullets */}
              {bullets.map(bullet => (
                <div
                  key={bullet.id}
                  className="absolute w-2 h-2 bg-yellow-400 rounded-full shadow-lg"
                  style={{
                    left: `${bullet.x}px`,
                    top: `${bullet.y}px`,
                    transform: 'translate(-50%, -50%)'
                  }}
                />
              ))}

              {paused && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm">
                  <div className="text-center">
                    <div className="text-6xl mb-4">⏸️</div>
                    <h3 className="text-4xl font-bold text-orange-300">PAUSED</h3>
                    <p className="text-orange-200 mt-4">Press P to resume</p>
                  </div>
                </div>
              )}

              {gameOver && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/90 backdrop-blur-sm">
                  <div className="text-center">
                    <div className="text-6xl mb-6">💥</div>
                    <h2 className="text-5xl font-bold text-red-400 mb-4">GAME OVER</h2>
                    <p className="text-2xl text-orange-200 mb-8">Final Score: {score}</p>
                    <button
                      onClick={startGame}
                      className="px-10 py-3 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 text-white rounded-full font-bold text-xl transition-all"
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
            {/* Battle Stats */}
            <div className="bg-black/40 backdrop-blur-md rounded-lg p-6 border border-orange-500/30">
              <h3 className="text-xl font-bold text-orange-300 mb-4 flex items-center gap-2">
                <span>📊</span> Battle Stats
              </h3>
              <div className="space-y-3 text-sm text-white">
                <div className="flex justify-between">
                  <span>Score:</span>
                  <span className="font-bold text-yellow-400">{score}</span>
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
                <div className="flex justify-between items-center">
                  <span>Health:</span>
                  <div className="w-24 bg-gray-600 rounded-full h-3">
                    <div
                      className="bg-green-500 h-3 rounded-full transition-all"
                      style={{ width: `${health}%` }}
                    />
                  </div>
                </div>
                <div className="flex justify-between">
                  <span>Enemies:</span>
                  <span className="font-bold text-red-400">{enemies}</span>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="bg-black/40 backdrop-blur-md rounded-lg p-6 border border-orange-500/30">
              <h3 className="text-xl font-bold text-orange-300 mb-4 flex items-center gap-2">
                <span>🎮</span> Controls
              </h3>
              <div className="text-sm space-y-2 text-white">
                <div>WASD/Arrows: Move</div>
                <div>Space: Shoot</div>
                <div>P: Pause</div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2">
                <div className="col-start-2">
                  <button className="w-full bg-orange-600 hover:bg-orange-500 text-white px-4 py-2 rounded font-bold">
                    ↑
                  </button>
                </div>
                <div className="col-start-1">
                  <button className="w-full bg-orange-600 hover:bg-orange-500 text-white px-4 py-2 rounded font-bold">
                    ←
                  </button>
                </div>
                <div className="col-start-2">
                  <button className="w-full bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded font-bold">
                    ●
                  </button>
                </div>
                <div className="col-start-3">
                  <button className="w-full bg-orange-600 hover:bg-orange-500 text-white px-4 py-2 rounded font-bold">
                    →
                  </button>
                </div>
                <div className="col-start-2">
                  <button className="w-full bg-orange-600 hover:bg-orange-500 text-white px-4 py-2 rounded font-bold">
                    ↓
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => setPaused(!paused)}
                className="w-full bg-yellow-600 hover:bg-yellow-700 px-6 py-3 rounded-lg font-bold text-white transition-all flex items-center justify-center gap-2"
              >
                <span>⏸️</span> Pause
              </button>
              <button
                onClick={startGame}
                className="w-full bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg font-bold text-white transition-all flex items-center justify-center gap-2"
              >
                <span>🔄</span> New Battle
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

export default TankBattle
