import { useState, useEffect } from 'react'

export default function MarioAdventure() {
  const [gameStarted, setGameStarted] = useState(false)
  const [playerY, setPlayerY] = useState(300)
  const [playerX, setPlayerX] = useState(100)
  const [isJumping, setIsJumping] = useState(false)
  const [score, setScore] = useState(0)
  const [obstacles, setObstacles] = useState([])
  const [gameOver, setGameOver] = useState(false)

  const startGame = () => {
    setPlayerY(300)
    setPlayerX(100)
    setIsJumping(false)
    setScore(0)
    setObstacles([])
    setGameOver(false)
    setGameStarted(true)
  }

  const jump = () => {
    if (!isJumping && !gameOver) {
      setIsJumping(true)
      let jumpHeight = 0
      const jumpInterval = setInterval(() => {
        if (jumpHeight >= 100) {
          clearInterval(jumpInterval)
          const fallInterval = setInterval(() => {
            setPlayerY(prev => {
              if (prev >= 300) {
                clearInterval(fallInterval)
                setIsJumping(false)
                return 300
              }
              return prev + 5
            })
          }, 20)
        } else {
          setPlayerY(prev => prev - 5)
          jumpHeight += 5
        }
      }, 20)
    }
  }

  useEffect(() => {
    if (!gameStarted || gameOver) return

    const handleKeyPress = (e) => {
      if (e.key === ' ' || e.key === 'ArrowUp') {
        e.preventDefault()
        jump()
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [gameStarted, gameOver, isJumping])

  useEffect(() => {
    if (!gameStarted || gameOver) return

    const gameLoop = setInterval(() => {
      // Spawn obstacles
      if (Math.random() < 0.02) {
        setObstacles(prev => [...prev, { x: 600, id: Date.now() }])
      }

      // Move obstacles
      setObstacles(prev => {
        const newObstacles = prev
          .map(obs => ({ ...obs, x: obs.x - 5 }))
          .filter(obs => obs.x > -40)

        // Check collision
        newObstacles.forEach(obs => {
          if (obs.x < playerX + 40 && obs.x + 40 > playerX &&
              playerY > 260) {
            setGameOver(true)
          }
        })

        // Score for passing obstacles
        newObstacles.forEach(obs => {
          if (obs.x === playerX - 5) {
            setScore(s => s + 10)
          }
        })

        return newObstacles
      })
    }, 30)

    return () => clearInterval(gameLoop)
  }, [gameStarted, gameOver, playerX, playerY])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-400 to-green-400 p-8">
      <h1 className="text-4xl font-bold text-white mb-4">🍄 Mario Adventure</h1>

      <div className="bg-white rounded-lg shadow-2xl p-6">
        <div className="text-2xl font-bold text-gray-800 mb-4">Score: {score}</div>

        <div className="relative bg-blue-300 overflow-hidden" style={{ width: 600, height: 400 }}>
          {/* Ground */}
          <div className="absolute bottom-0 w-full h-20 bg-green-600"></div>

          {/* Player */}
          <div
            className="absolute text-4xl transition-all"
            style={{
              left: playerX,
              bottom: 400 - playerY - 40,
              width: 40,
              height: 40
            }}
          >
            🏃
          </div>

          {/* Obstacles */}
          {obstacles.map(obs => (
            <div
              key={obs.id}
              className="absolute text-4xl"
              style={{
                left: obs.x,
                bottom: 80,
                width: 40,
                height: 40
              }}
            >
              🌵
            </div>
          ))}

          {/* Game Over */}
          {gameOver && (
            <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center">
              <div className="text-center">
                <h2 className="text-4xl font-bold text-white mb-4">Game Over!</h2>
                <p className="text-2xl text-white">Score: {score}</p>
              </div>
            </div>
          )}
        </div>

        {!gameStarted && (
          <button onClick={startGame} className="mt-4 w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition">
            Start Adventure
          </button>
        )}

        {gameOver && (
          <button onClick={startGame} className="mt-4 w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition">
            Try Again
          </button>
        )}

        <div className="mt-4 text-sm text-gray-600 text-center">
          Press SPACE or ↑ to jump
        </div>
      </div>
    </div>
  )
}
