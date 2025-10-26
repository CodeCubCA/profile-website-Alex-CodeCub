import { useState, useEffect } from 'react'

export default function DungeonQuest() {
  const [gameStarted, setGameStarted] = useState(false)
  const [player, setPlayer] = useState({ x: 1, y: 1, hp: 100, gold: 0 })
  const [gameOver, setGameOver] = useState(false)
  const [won, setWon] = useState(false)

  const maze = [
    ['#', '#', '#', '#', '#', '#', '#', '#', '#', '#'],
    ['#', 'P', '.', '.', '#', '.', '.', '.', 'M', '#'],
    ['#', '#', '#', '.', '#', '.', '#', '#', '#', '#'],
    ['#', '.', '.', '.', '.', '.', '.', '.', '.', '#'],
    ['#', '.', '#', '#', '#', '#', '#', '.', 'M', '#'],
    ['#', '.', '.', '.', 'M', '.', '#', '.', '#', '#'],
    ['#', '#', '#', '.', '#', '.', '#', '.', '.', '#'],
    ['#', 'G', '.', '.', '#', '.', '.', '.', 'T', '#'],
    ['#', '#', '#', '#', '#', '#', '#', '#', '#', '#'],
  ]

  const startGame = () => {
    setPlayer({ x: 1, y: 1, hp: 100, gold: 0 })
    setGameOver(false)
    setWon(false)
    setGameStarted(true)
  }

  const movePlayer = (dx, dy) => {
    const newX = player.x + dx
    const newY = player.y + dy

    if (maze[newY] && maze[newY][newX]) {
      const cell = maze[newY][newX]

      if (cell === '#') return

      let newPlayer = { ...player, x: newX, y: newY }

      if (cell === 'M') {
        newPlayer.hp -= 20
        if (newPlayer.hp <= 0) {
          setGameOver(true)
        }
      } else if (cell === 'G') {
        newPlayer.gold += 10
      } else if (cell === 'T') {
        setWon(true)
      }

      setPlayer(newPlayer)
    }
  }

  useEffect(() => {
    if (!gameStarted || gameOver || won) return

    const handleKeyPress = (e) => {
      switch(e.key) {
        case 'ArrowUp': movePlayer(0, -1); break
        case 'ArrowDown': movePlayer(0, 1); break
        case 'ArrowLeft': movePlayer(-1, 0); break
        case 'ArrowRight': movePlayer(1, 0); break
        default: break
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [gameStarted, gameOver, won, player])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-900 to-gray-900 p-8">
      <h1 className="text-4xl font-bold text-white mb-4">⚔️ Dungeon Quest</h1>

      <div className="bg-white rounded-lg shadow-2xl p-6">
        <div className="flex justify-between text-lg font-bold text-gray-800 mb-4">
          <div>HP: {player.hp}</div>
          <div>Gold: {player.gold}</div>
        </div>

        <div className="bg-gray-900 p-4 rounded-lg">
          {maze.map((row, y) => (
            <div key={y} className="flex">
              {row.map((cell, x) => (
                <div
                  key={`${x}-${y}`}
                  className="w-10 h-10 flex items-center justify-center text-2xl"
                >
                  {x === player.x && y === player.y ? '🧙' :
                   cell === '#' ? '⬛' :
                   cell === 'M' ? '👹' :
                   cell === 'G' ? '💰' :
                   cell === 'T' ? '🏆' :
                   '⬜'}
                </div>
              ))}
            </div>
          ))}
        </div>

        {(gameOver || won) && (
          <div className="mt-4 p-4 bg-gray-100 rounded-lg text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              {won ? 'Victory!' : 'Game Over!'}
            </h2>
            <p className="text-xl text-gray-600">Gold Collected: {player.gold}</p>
          </div>
        )}

        {!gameStarted && (
          <button onClick={startGame} className="mt-4 w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-6 rounded-lg transition">
            Start Quest
          </button>
        )}

        {(gameOver || won) && (
          <button onClick={startGame} className="mt-4 w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-6 rounded-lg transition">
            Quest Again
          </button>
        )}

        <div className="mt-4 text-sm text-gray-600 text-center">
          Use arrow keys. Avoid 👹, collect 💰, reach 🏆
        </div>
      </div>
    </div>
  )
}
