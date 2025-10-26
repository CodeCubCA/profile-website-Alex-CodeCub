import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

function LaserMaze() {
  const [gameStarted, setGameStarted] = useState(false)
  const [player, setPlayer] = useState({ x: 1, y: 1 })
  const [gameOver, setGameOver] = useState(false)
  const [won, setWon] = useState(false)
  const [paused, setPaused] = useState(false)
  const [level, setLevel] = useState(1)
  const [moves, setMoves] = useState(0)

  const maze = [
    ['#', '#', '#', '#', '#', '#', '#', '#', '#', '#'],
    ['#', 'P', '.', '.', '#', '.', '.', '.', '.', '#'],
    ['#', '#', '#', 'L', '#', '.', '#', '#', 'L', '#'],
    ['#', '.', '.', '.', '.', '.', '.', '#', '.', '#'],
    ['#', 'L', '#', '#', '#', '#', '.', '#', '.', '#'],
    ['#', '.', '.', '.', 'L', '.', '.', '.', '.', '#'],
    ['#', '#', '#', '.', '#', 'L', '#', '#', '.', '#'],
    ['#', '.', '.', '.', '#', '.', '.', '.', 'E', '#'],
    ['#', '#', '#', '#', '#', '#', '#', '#', '#', '#'],
  ]

  const startGame = () => {
    setPlayer({ x: 1, y: 1 })
    setGameOver(false)
    setWon(false)
    setGameStarted(true)
    setPaused(false)
    setMoves(0)
  }

  const movePlayer = (dx, dy) => {
    if (paused || gameOver || won) return

    const newX = player.x + dx
    const newY = player.y + dy

    if (maze[newY] && maze[newY][newX]) {
      const cell = maze[newY][newX]

      if (cell === '#' || cell === 'L') {
        setGameOver(true)
        return
      }

      if (cell === 'E') {
        setWon(true)
      }

      setPlayer({ x: newX, y: newY })
      setMoves(prev => prev + 1)
    }
  }

  useEffect(() => {
    if (!gameStarted || gameOver || won) return

    const handleKeyPress = (e) => {
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        e.preventDefault()
        movePlayer(0, -1)
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        e.preventDefault()
        movePlayer(0, 1)
      } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        e.preventDefault()
        movePlayer(-1, 0)
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        e.preventDefault()
        movePlayer(1, 0)
      } else if (e.key === 'p' || e.key === 'P') {
        setPaused(prev => !prev)
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [gameStarted, gameOver, won, player, paused])

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-black to-red-800 py-12 px-6 flex items-center justify-center">
        <div className="max-w-lg w-full">
          <div className="text-center mb-8">
            <div className="text-8xl mb-6">🔴</div>
            <h1 className="text-6xl font-bold text-red-200 mb-4">LASER MAZE</h1>
            <p className="text-xl text-red-100">Navigate the dangerous laser field!</p>
          </div>

          <div className="bg-black/60 backdrop-blur-md rounded-2xl p-8 border border-red-500/30 mb-8">
            <h2 className="text-2xl font-bold text-red-300 mb-6 flex items-center gap-3">
              <span>🎮</span> How to Play:
            </h2>
            <div className="space-y-3 text-red-100">
              <div className="flex items-start gap-3">
                <span className="text-blue-400 text-xl">⬆️⬇️⬅️➡️</span>
                <span><strong>WASD/Arrows</strong> - Move</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-yellow-400 text-xl">⏸️</span>
                <span><strong>P</strong> - Pause</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-green-500 text-xl">🚪</span>
                <span>Reach the exit to win!</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-red-500 text-xl">🔴</span>
                <span>Avoid red lasers - they're deadly!</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-gray-400 text-xl">⬛</span>
                <span>Walls block your path</span>
              </div>
            </div>
          </div>

          <button
            onClick={startGame}
            className="w-full bg-gradient-to-r from-red-500 to-red-700 hover:from-red-400 hover:to-red-600 text-white px-12 py-5 rounded-2xl font-bold text-2xl transition-all shadow-2xl hover:scale-105 flex items-center justify-center gap-3"
          >
            <span>🚀</span> START MISSION
          </button>

          <Link
            to="/games"
            className="block text-center mt-6 text-red-200 hover:text-red-100 transition-colors text-lg"
          >
            ← Back to Games
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-black to-red-800 py-12 px-6">
      <div className="container mx-auto max-w-7xl">
        <div className="grid lg:grid-cols-[1fr,320px] gap-8">
          <div className="flex flex-col items-center">
            <h1 className="text-5xl font-bold text-red-200 mb-6 flex items-center gap-3">
              <span>🔴</span>
              Laser Maze
            </h1>

            <div className="relative bg-gray-900 p-4 rounded-2xl border-4 border-red-500 shadow-2xl">
              {maze.map((row, y) => (
                <div key={y} className="flex">
                  {row.map((cell, x) => (
                    <div
                      key={`${x}-${y}`}
                      className="w-12 h-12 flex items-center justify-center text-3xl border border-gray-800"
                    >
                      {x === player.x && y === player.y ? '🤖' :
                       cell === '#' ? '⬛' :
                       cell === 'L' ? '🔴' :
                       cell === 'E' ? '🚪' :
                       '⬜'}
                    </div>
                  ))}
                </div>
              ))}

              {paused && (
                <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center rounded-2xl">
                  <div className="text-center">
                    <div className="text-6xl mb-4">⏸️</div>
                    <h3 className="text-4xl font-bold text-red-300">PAUSED</h3>
                    <p className="text-red-200 mt-4">Press P to resume</p>
                  </div>
                </div>
              )}

              {(gameOver || won) && (
                <div className="absolute inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center rounded-2xl">
                  <div className="text-center">
                    <div className="text-6xl mb-6">{won ? '🏆' : '💥'}</div>
                    <h2 className="text-5xl font-bold mb-4">{won ? 'ESCAPED!' : 'HIT LASER!'}</h2>
                    <p className="text-2xl text-red-200 mb-8">Moves: {moves}</p>
                    <button
                      onClick={startGame}
                      className="px-10 py-3 bg-gradient-to-r from-red-500 to-red-700 hover:from-red-400 hover:to-red-600 text-white rounded-full font-bold text-xl transition-all"
                    >
                      🔄 TRY AGAIN
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-black/40 backdrop-blur-md rounded-lg p-6 border border-red-500/30">
              <h3 className="text-xl font-bold text-red-300 mb-4 flex items-center gap-2">
                <span>📊</span> Mission Stats
              </h3>
              <div className="space-y-3 text-sm text-white">
                <div className="flex justify-between">
                  <span>Level:</span>
                  <span className="font-bold text-yellow-400">{level}</span>
                </div>
                <div className="flex justify-between">
                  <span>Moves:</span>
                  <span className="font-bold text-cyan-400">{moves}</span>
                </div>
              </div>
            </div>

            <div className="bg-black/40 backdrop-blur-md rounded-lg p-6 border border-red-500/30">
              <h3 className="text-xl font-bold text-red-300 mb-4 flex items-center gap-2">
                <span>🎮</span> Controls
              </h3>
              <div className="text-sm space-y-2 text-white">
                <div>WASD/Arrows: Move</div>
                <div>P: Pause</div>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => setPaused(!paused)}
                className="w-full bg-yellow-600 hover:bg-yellow-700 px-6 py-3 rounded-lg font-bold text-white transition-all flex items-center justify-center gap-2"
                disabled={gameOver || won}
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

export default LaserMaze
