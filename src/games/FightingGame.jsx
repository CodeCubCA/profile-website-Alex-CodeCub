import { useState, useEffect } from 'react'

export default function FightingGame() {
  const [gameStarted, setGameStarted] = useState(false)
  const [player, setPlayer] = useState({ hp: 100, x: 100, y: 200, attacking: false })
  const [enemy, setEnemy] = useState({ hp: 100, x: 500, y: 200, attacking: false })
  const [winner, setWinner] = useState(null)

  const startGame = () => {
    setPlayer({ hp: 100, x: 100, y: 200, attacking: false })
    setEnemy({ hp: 100, x: 500, y: 200, attacking: false })
    setWinner(null)
    setGameStarted(true)
  }

  const playerAttack = () => {
    if (winner) return
    setPlayer(prev => ({ ...prev, attacking: true }))
    setTimeout(() => setPlayer(prev => ({ ...prev, attacking: false })), 300)

    const damage = Math.floor(Math.random() * 15) + 10
    setEnemy(prev => {
      const newHp = Math.max(0, prev.hp - damage)
      if (newHp === 0) setWinner('Player')
      return { ...prev, hp: newHp }
    })

    // Enemy counter attack
    setTimeout(() => {
      if (Math.random() > 0.3) {
        enemyAttack()
      }
    }, 1000)
  }

  const enemyAttack = () => {
    if (winner) return
    setEnemy(prev => ({ ...prev, attacking: true }))
    setTimeout(() => setEnemy(prev => ({ ...prev, attacking: false })), 300)

    const damage = Math.floor(Math.random() * 15) + 10
    setPlayer(prev => {
      const newHp = Math.max(0, prev.hp - damage)
      if (newHp === 0) setWinner('Enemy')
      return { ...prev, hp: newHp }
    })
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-red-900 to-orange-900 p-8">
      <h1 className="text-4xl font-bold text-white mb-8">🥊 Fighting Game</h1>

      <div className="bg-gray-900 rounded-lg shadow-2xl p-8 w-full max-w-4xl">
        {/* Health Bars */}
        <div className="flex justify-between mb-8">
          <div className="w-1/3">
            <h3 className="text-white text-xl mb-2">Player</h3>
            <div className="bg-gray-700 h-8 rounded-full overflow-hidden">
              <div
                className="bg-green-500 h-full transition-all duration-300"
                style={{ width: `${player.hp}%` }}
              ></div>
            </div>
            <p className="text-white text-center mt-1">{player.hp} HP</p>
          </div>

          <div className="w-1/3">
            <h3 className="text-white text-xl mb-2 text-right">Enemy</h3>
            <div className="bg-gray-700 h-8 rounded-full overflow-hidden">
              <div
                className="bg-red-500 h-full transition-all duration-300"
                style={{ width: `${enemy.hp}%` }}
              ></div>
            </div>
            <p className="text-white text-center mt-1">{enemy.hp} HP</p>
          </div>
        </div>

        {/* Battle Arena */}
        <div className="relative bg-yellow-900 h-64 rounded-lg mb-8 flex items-end justify-between p-8">
          {/* Player */}
          <div className={`text-6xl transition-transform ${player.attacking ? 'scale-125' : 'scale-100'}`}>
            🥊
          </div>

          {/* Enemy */}
          <div className={`text-6xl transition-transform ${enemy.attacking ? 'scale-125' : 'scale-100'}`}>
            👹
          </div>

          {/* Winner Overlay */}
          {winner && (
            <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center rounded-lg">
              <div className="text-center">
                <h2 className="text-4xl font-bold text-white mb-4">
                  {winner} Wins!
                </h2>
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        {!gameStarted ? (
          <button
            onClick={startGame}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg transition"
          >
            Start Fight
          </button>
        ) : winner ? (
          <button
            onClick={startGame}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg transition"
          >
            Fight Again
          </button>
        ) : (
          <button
            onClick={playerAttack}
            disabled={player.attacking}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-500 text-white font-bold py-3 px-6 rounded-lg transition"
          >
            Attack! (Click or Press SPACE)
          </button>
        )}
      </div>
    </div>
  )
}
