import { useState, useEffect } from 'react'

export default function FireHoopJump() {
  const [gameStarted, setGameStarted] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)
  const [playerY, setPlayerY] = useState(250)
  const [isJumping, setIsJumping] = useState(false)
  const [hoops, setHoops] = useState([])

  const startGame = () => {
    setPlayerY(250)
    setIsJumping(false)
    setHoops([])
    setScore(0)
    setGameOver(false)
    setGameStarted(true)
  }

  const jump = () => {
    if (!isJumping && !gameOver) {
      setIsJumping(true)
      let jumpUp = 0
      const jumpInterval = setInterval(() => {
        if (jumpUp >= 80) {
          clearInterval(jumpInterval)
          const fallInterval = setInterval(() => {
            setPlayerY(prev => {
              if (prev >= 250) {
                clearInterval(fallInterval)
                setIsJumping(false)
                return 250
              }
              return prev + 4
            })
          }, 20)
        } else {
          setPlayerY(prev => prev - 4)
          jumpUp += 4
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
      if (Math.random() < 0.02) {
        const height = 200 + Math.random() * 100
        setHoops(prev => [...prev, { x: 600, y: height, id: Date.now(), passed: false }])
      }

      setHoops(prev => {
        const newHoops = prev
          .map(hoop => ({ ...hoop, x: hoop.x - 5 }))
          .filter(hoop => hoop.x > -60)

        newHoops.forEach(hoop => {
          // Check if player passes through hoop
          if (hoop.x === 100 - 5 && !hoop.passed) {
            if (playerY >= hoop.y - 30 && playerY <= hoop.y + 30) {
              hoop.passed = true
              setScore(s => s + 10)
            } else {
              setGameOver(true)
            }
          }
        })

        return newHoops
      })
    }, 30)

    return () => clearInterval(gameLoop)
  }, [gameStarted, gameOver, playerY])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-orange-600 to-red-600 p-8">
      <h1 className="text-4xl font-bold text-white mb-4">🔥 Fire Hoop Jump</h1>

      <div className="bg-white rounded-lg shadow-2xl p-6">
        <div className="text-2xl font-bold text-gray-800 mb-4">Score: {score}</div>

        <div className="relative bg-blue-200 overflow-hidden" style={{ width: 600, height: 400 }}>
          {/* Player */}
          <div
            className="absolute text-4xl transition-all"
            style={{ left: 100, bottom: 400 - playerY - 40, width: 40, height: 40 }}
          >
            🏀
          </div>

          {/* Hoops */}
          {hoops.map(hoop => (
            <div key={hoop.id} className="absolute" style={{ left: hoop.x, bottom: 400 - hoop.y }}>
              <div className="text-6xl">
                🔥
              </div>
            </div>
          ))}

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
          <button onClick={startGame} className="mt-4 w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg transition">
            Start Game
          </button>
        )}

        {gameOver && (
          <button onClick={startGame} className="mt-4 w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg transition">
            Try Again
          </button>
        )}

        <div className="mt-4 text-sm text-gray-600 text-center">
          Press SPACE or ↑ to jump through hoops
        </div>
      </div>
    </div>
  )
}
