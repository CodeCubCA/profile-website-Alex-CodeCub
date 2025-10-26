import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'

function SnakeGame() {
  const [gameStarted, setGameStarted] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [level, setLevel] = useState(1)
  const [paused, setPaused] = useState(false)
  const [snake, setSnake] = useState([{ x: 10, y: 10 }])
  const [food, setFood] = useState({ x: 15, y: 15 })
  const [direction, setDirection] = useState({ x: 1, y: 0 })
  const [nextDirection, setNextDirection] = useState({ x: 1, y: 0 })
  const [speed, setSpeed] = useState(150)

  const gridSize = 20
  const cellSize = 30

  const generateFood = useCallback((snakeBody) => {
    let newFood
    do {
      newFood = {
        x: Math.floor(Math.random() * gridSize),
        y: Math.floor(Math.random() * gridSize)
      }
    } while (snakeBody.some(segment => segment.x === newFood.x && segment.y === newFood.y))
    return newFood
  }, [])

  const startGame = () => {
    const initialSnake = [{ x: 10, y: 10 }]
    setSnake(initialSnake)
    setFood(generateFood(initialSnake))
    setDirection({ x: 1, y: 0 })
    setNextDirection({ x: 1, y: 0 })
    setScore(0)
    setLevel(1)
    setSpeed(150)
    setGameOver(false)
    setGameStarted(true)
    setPaused(false)
  }

  useEffect(() => {
    if (!gameStarted || gameOver) return

    const handleKeyPress = (e) => {
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        if (direction.y === 0) setNextDirection({ x: 0, y: -1 })
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        if (direction.y === 0) setNextDirection({ x: 0, y: 1 })
      } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        if (direction.x === 0) setNextDirection({ x: -1, y: 0 })
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        if (direction.x === 0) setNextDirection({ x: 1, y: 0 })
      } else if (e.key === 'p' || e.key === 'P') {
        setPaused(prev => !prev)
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [gameStarted, gameOver, direction])

  useEffect(() => {
    if (!gameStarted || paused || gameOver) return

    const gameLoop = setInterval(() => {
      setDirection(nextDirection)

      setSnake(prevSnake => {
        const newHead = {
          x: prevSnake[0].x + nextDirection.x,
          y: prevSnake[0].y + nextDirection.y
        }

        // Check wall collision
        if (newHead.x < 0 || newHead.x >= gridSize || newHead.y < 0 || newHead.y >= gridSize) {
          setGameOver(true)
          setHighScore(prev => Math.max(prev, score))
          return prevSnake
        }

        // Check self collision
        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true)
          setHighScore(prev => Math.max(prev, score))
          return prevSnake
        }

        const newSnake = [newHead, ...prevSnake]

        // Check food collision
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(prev => prev + 10)
          setFood(generateFood(newSnake))

          // Level up every 50 points
          if ((score + 10) % 50 === 0) {
            setLevel(prev => prev + 1)
            setSpeed(prev => Math.max(50, prev - 10))
          }
        } else {
          newSnake.pop()
        }

        return newSnake
      })
    }, speed)

    return () => clearInterval(gameLoop)
  }, [gameStarted, paused, gameOver, nextDirection, food, score, speed, generateFood])

  if (!gameStarted) {
    // Intro Page
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-900 via-emerald-900 to-green-800 py-12 px-6 flex items-center justify-center">
        <div className="max-w-lg w-full">
          <div className="text-center mb-8">
            <div className="text-8xl mb-6">🐍</div>
            <h1 className="text-6xl font-bold text-green-200 mb-4">SNAKE GAME</h1>
            <p className="text-xl text-green-100">Eat food and grow longer!</p>
          </div>

          <div className="bg-black/60 backdrop-blur-md rounded-2xl p-8 border border-green-500/30 mb-8">
            <h2 className="text-2xl font-bold text-green-300 mb-6 flex items-center gap-3">
              <span>🎮</span> How to Play:
            </h2>
            <div className="space-y-3 text-green-100">
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
                <span className="text-yellow-400 text-xl">⏸️</span>
                <span><strong>P</strong> - Pause game</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-red-500 text-xl">🍎</span>
                <span>Eat red food to grow and score points!</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-orange-500 text-xl">⚠️</span>
                <span>Don't hit walls or yourself!</span>
              </div>
            </div>
          </div>

          <button
            onClick={startGame}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white px-12 py-5 rounded-2xl font-bold text-2xl transition-all shadow-2xl hover:scale-105 flex items-center justify-center gap-3"
          >
            <span>🚀</span> START GAME
          </button>

          <Link
            to="/games"
            className="block text-center mt-6 text-green-200 hover:text-green-100 transition-colors text-lg"
          >
            ← Back to Games
          </Link>
        </div>
      </div>
    )
  }

  // Game Page
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-emerald-900 to-green-800 py-12 px-6">
      <div className="container mx-auto max-w-7xl">
        <div className="grid lg:grid-cols-[1fr,320px] gap-8">
          {/* Game Area */}
          <div className="flex flex-col items-center">
            <h1 className="text-5xl font-bold text-green-200 mb-6 flex items-center gap-3">
              <span>🐍</span>
              Snake Game
            </h1>

            {/* Game Canvas */}
            <div className="relative w-full max-w-[600px] h-[600px] bg-gray-900 rounded-2xl border-4 border-green-500 shadow-2xl overflow-hidden">
              {/* Grid */}
              <div className="absolute inset-0" style={{
                backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
                backgroundSize: '30px 30px'
              }} />

              {/* Snake */}
              {snake.map((segment, index) => (
                <div
                  key={index}
                  className={`absolute transition-all duration-100 ${
                    index === 0 ? 'bg-green-400 border-2 border-green-300' : 'bg-green-600'
                  } rounded-sm`}
                  style={{
                    left: `${segment.x * cellSize}px`,
                    top: `${segment.y * cellSize}px`,
                    width: `${cellSize}px`,
                    height: `${cellSize}px`
                  }}
                />
              ))}

              {/* Food */}
              <div
                className="absolute bg-red-500 rounded-full shadow-lg animate-pulse"
                style={{
                  left: `${food.x * cellSize + 5}px`,
                  top: `${food.y * cellSize + 5}px`,
                  width: '20px',
                  height: '20px'
                }}
              />

              {paused && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm">
                  <div className="text-center">
                    <div className="text-6xl mb-4">⏸️</div>
                    <h3 className="text-4xl font-bold text-green-300">PAUSED</h3>
                    <p className="text-green-200 mt-4">Press P to resume</p>
                  </div>
                </div>
              )}

              {gameOver && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/90 backdrop-blur-sm">
                  <div className="text-center">
                    <div className="text-6xl mb-6">💀</div>
                    <h2 className="text-5xl font-bold text-red-400 mb-4">GAME OVER</h2>
                    <p className="text-2xl text-green-200 mb-2">Final Score: {score}</p>
                    <p className="text-xl text-yellow-400 mb-8">High Score: {highScore}</p>
                    <button
                      onClick={startGame}
                      className="px-10 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white rounded-full font-bold text-xl transition-all"
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
                  <span>Length:</span>
                  <span className="font-bold text-cyan-400">{snake.length}</span>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="bg-black/40 backdrop-blur-md rounded-lg p-6 border border-green-500/30">
              <h3 className="text-xl font-bold text-green-300 mb-4 flex items-center gap-2">
                <span>🎮</span> Controls
              </h3>
              <div className="text-sm space-y-2 text-white">
                <div>WASD/Arrows: Move</div>
                <div>P: Pause</div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2">
                <div className="col-start-2">
                  <button className="w-full bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded font-bold">
                    ↑
                  </button>
                </div>
                <div className="col-start-1">
                  <button className="w-full bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded font-bold">
                    ←
                  </button>
                </div>
                <div className="col-start-2">
                  <button className="w-full bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded font-bold">
                    ↓
                  </button>
                </div>
                <div className="col-start-3">
                  <button className="w-full bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded font-bold">
                    →
                  </button>
                </div>
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

export default SnakeGame
