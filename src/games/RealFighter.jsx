import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

function RealFighter() {
  const [gameStarted, setGameStarted] = useState(false)
  const [player1, setPlayer1] = useState({ hp: 100, stamina: 100 })
  const [player2, setPlayer2] = useState({ hp: 100, stamina: 100 })
  const [winner, setWinner] = useState(null)
  const [message, setMessage] = useState('')
  const [paused, setPaused] = useState(false)
  const [round, setRound] = useState(1)
  const [score, setScore] = useState({ p1: 0, p2: 0 })

  const startGame = () => {
    setPlayer1({ hp: 100, stamina: 100 })
    setPlayer2({ hp: 100, stamina: 100 })
    setWinner(null)
    setMessage('')
    setGameStarted(true)
    setPaused(false)
    setRound(1)
    setScore({ p1: 0, p2: 0 })
  }

  const attack = (player, type) => {
    if (winner || paused) return

    let damage = 0
    let staminaCost = 0

    switch(type) {
      case 'punch':
        damage = 10 + Math.floor(Math.random() * 5)
        staminaCost = 10
        setMessage(`${player === 1 ? 'P1' : 'P2'} Punch! 👊`)
        break
      case 'kick':
        damage = 15 + Math.floor(Math.random() * 10)
        staminaCost = 20
        setMessage(`${player === 1 ? 'P1' : 'P2'} Kick! 🦵`)
        break
      case 'special':
        damage = 25 + Math.floor(Math.random() * 15)
        staminaCost = 30
        setMessage(`${player === 1 ? 'P1' : 'P2'} Special! ⚡`)
        break
      default:
        return
    }

    if (player === 1) {
      if (player1.stamina < staminaCost) {
        setMessage('P1 - Not enough stamina!')
        return
      }
      setPlayer1(prev => ({ ...prev, stamina: Math.max(0, prev.stamina - staminaCost) }))
      setPlayer2(prev => {
        const newHp = Math.max(0, prev.hp - damage)
        if (newHp === 0) {
          setWinner('Player 1')
          setScore(s => ({ ...s, p1: s.p1 + 1 }))
        }
        return { ...prev, hp: newHp }
      })
    } else {
      if (player2.stamina < staminaCost) {
        setMessage('P2 - Not enough stamina!')
        return
      }
      setPlayer2(prev => ({ ...prev, stamina: Math.max(0, prev.stamina - staminaCost) }))
      setPlayer1(prev => {
        const newHp = Math.max(0, prev.hp - damage)
        if (newHp === 0) {
          setWinner('Player 2')
          setScore(s => ({ ...s, p2: s.p2 + 1 }))
        }
        return { ...prev, hp: newHp }
      })
    }
  }

  useEffect(() => {
    if (!gameStarted || winner) return

    const handleKeyPress = (e) => {
      if (e.key === 'q' || e.key === 'Q') attack(1, 'punch')
      if (e.key === 'w' || e.key === 'W') attack(1, 'kick')
      if (e.key === 'e' || e.key === 'E') attack(1, 'special')
      if (e.key === 'u' || e.key === 'U') attack(2, 'punch')
      if (e.key === 'i' || e.key === 'I') attack(2, 'kick')
      if (e.key === 'o' || e.key === 'O') attack(2, 'special')
      if (e.key === 'p' || e.key === 'P') setPaused(prev => !prev)
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [gameStarted, winner, player1, player2, paused])

  useEffect(() => {
    if (!gameStarted || paused || winner) return

    const staminaRegen = setInterval(() => {
      setPlayer1(prev => ({ ...prev, stamina: Math.min(100, prev.stamina + 2) }))
      setPlayer2(prev => ({ ...prev, stamina: Math.min(100, prev.stamina + 2) }))
    }, 1000)

    return () => clearInterval(staminaRegen)
  }, [gameStarted, paused, winner])

  if (!gameStarted) {
    // Intro Page
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-purple-900 to-red-800 py-12 px-6 flex items-center justify-center">
        <div className="max-w-lg w-full">
          <div className="text-center mb-8">
            <div className="text-8xl mb-6">🥋</div>
            <h1 className="text-6xl font-bold text-red-200 mb-4">REAL FIGHTER</h1>
            <p className="text-xl text-red-100">2-Player Fighting Game!</p>
          </div>

          <div className="bg-black/60 backdrop-blur-md rounded-2xl p-8 border border-red-500/30 mb-8">
            <h2 className="text-2xl font-bold text-red-300 mb-6 flex items-center gap-3">
              <span>🎮</span> How to Play:
            </h2>
            <div className="space-y-4 text-red-100">
              <div>
                <p className="font-bold text-blue-400 mb-2">Player 1 (Left):</p>
                <div className="space-y-1 ml-4">
                  <div><strong>Q</strong> - Punch (10 stamina)</div>
                  <div><strong>W</strong> - Kick (20 stamina)</div>
                  <div><strong>E</strong> - Special (30 stamina)</div>
                </div>
              </div>
              <div>
                <p className="font-bold text-purple-400 mb-2">Player 2 (Right):</p>
                <div className="space-y-1 ml-4">
                  <div><strong>U</strong> - Punch (10 stamina)</div>
                  <div><strong>I</strong> - Kick (20 stamina)</div>
                  <div><strong>O</strong> - Special (30 stamina)</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-yellow-400 text-xl">⏸️</span>
                <span><strong>P</strong> - Pause game</span>
              </div>
            </div>
          </div>

          <button
            onClick={startGame}
            className="w-full bg-gradient-to-r from-red-500 to-purple-600 hover:from-red-400 hover:to-purple-500 text-white px-12 py-5 rounded-2xl font-bold text-2xl transition-all shadow-2xl hover:scale-105 flex items-center justify-center gap-3"
          >
            <span>🚀</span> START FIGHT
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

  // Game Page
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-purple-900 to-red-800 py-12 px-6">
      <div className="container mx-auto max-w-7xl">
        <div className="grid lg:grid-cols-[1fr,320px] gap-8">
          {/* Game Area */}
          <div className="flex flex-col items-center">
            <h1 className="text-5xl font-bold text-red-200 mb-6 flex items-center gap-3">
              <span>🥋</span>
              Real Fighter
            </h1>

            {/* Health Bars */}
            <div className="w-full max-w-4xl mb-8 flex justify-between gap-8">
              <div className="w-1/2">
                <h3 className="text-white bg-blue-600 p-2 rounded text-center mb-2 font-bold">Player 1</h3>
                <div className="bg-gray-300 h-8 rounded-full overflow-hidden mb-2">
                  <div className="bg-green-500 h-full transition-all" style={{ width: `${player1.hp}%` }}></div>
                </div>
                <p className="text-center text-white font-bold">HP: {player1.hp}</p>
                <div className="bg-gray-300 h-4 rounded-full overflow-hidden mb-2 mt-2">
                  <div className="bg-yellow-500 h-full transition-all" style={{ width: `${player1.stamina}%` }}></div>
                </div>
                <p className="text-center text-sm text-white">Stamina: {player1.stamina}</p>
              </div>

              <div className="w-1/2">
                <h3 className="text-white bg-purple-600 p-2 rounded text-center mb-2 font-bold">Player 2</h3>
                <div className="bg-gray-300 h-8 rounded-full overflow-hidden mb-2">
                  <div className="bg-red-500 h-full transition-all" style={{ width: `${player2.hp}%` }}></div>
                </div>
                <p className="text-center text-white font-bold">HP: {player2.hp}</p>
                <div className="bg-gray-300 h-4 rounded-full overflow-hidden mb-2 mt-2">
                  <div className="bg-yellow-500 h-full transition-all" style={{ width: `${player2.stamina}%` }}></div>
                </div>
                <p className="text-center text-sm text-white">Stamina: {player2.stamina}</p>
              </div>
            </div>

            {/* Message */}
            <div className="text-center text-3xl font-bold text-yellow-400 mb-6 h-10">
              {message}
            </div>

            {/* Battle Arena */}
            <div className="relative bg-gray-800 h-64 w-full max-w-4xl rounded-2xl mb-4 flex items-end justify-between p-8 border-4 border-red-500 shadow-2xl">
              <div className="text-7xl">🥊</div>
              <div className="text-7xl">👹</div>

              {paused && (
                <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center rounded-2xl">
                  <div className="text-center">
                    <div className="text-6xl mb-4">⏸️</div>
                    <h3 className="text-4xl font-bold text-red-300">PAUSED</h3>
                    <p className="text-red-200 mt-4">Press P to resume</p>
                  </div>
                </div>
              )}

              {winner && (
                <div className="absolute inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center rounded-2xl">
                  <div className="text-center">
                    <div className="text-6xl mb-6">🏆</div>
                    <h2 className="text-5xl font-bold text-yellow-400 mb-4">{winner} WINS!</h2>
                    <p className="text-2xl text-red-200 mb-8">Round {round}</p>
                    <button
                      onClick={startGame}
                      className="px-10 py-3 bg-gradient-to-r from-red-500 to-purple-600 hover:from-red-400 hover:to-purple-500 text-white rounded-full font-bold text-xl transition-all"
                    >
                      🔄 NEXT ROUND
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            {/* Game Stats */}
            <div className="bg-black/40 backdrop-blur-md rounded-lg p-6 border border-red-500/30">
              <h3 className="text-xl font-bold text-red-300 mb-4 flex items-center gap-2">
                <span>📊</span> Fight Stats
              </h3>
              <div className="space-y-3 text-sm text-white">
                <div className="flex justify-between">
                  <span>Round:</span>
                  <span className="font-bold text-yellow-400">{round}</span>
                </div>
                <div className="flex justify-between">
                  <span>P1 Wins:</span>
                  <span className="font-bold text-blue-400">{score.p1}</span>
                </div>
                <div className="flex justify-between">
                  <span>P2 Wins:</span>
                  <span className="font-bold text-purple-400">{score.p2}</span>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="bg-black/40 backdrop-blur-md rounded-lg p-6 border border-red-500/30">
              <h3 className="text-xl font-bold text-red-300 mb-4 flex items-center gap-2">
                <span>🎮</span> Controls
              </h3>
              <div className="text-sm space-y-3 text-white">
                <div>
                  <p className="font-bold text-blue-400">P1:</p>
                  <div className="ml-2">Q/W/E: Punch/Kick/Special</div>
                </div>
                <div>
                  <p className="font-bold text-purple-400">P2:</p>
                  <div className="ml-2">U/I/O: Punch/Kick/Special</div>
                </div>
                <div>P: Pause</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => setPaused(!paused)}
                className="w-full bg-yellow-600 hover:bg-yellow-700 px-6 py-3 rounded-lg font-bold text-white transition-all flex items-center justify-center gap-2"
                disabled={!!winner}
              >
                <span>⏸️</span> {paused ? 'Resume' : 'Pause'}
              </button>
              <button
                onClick={startGame}
                className="w-full bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg font-bold text-white transition-all flex items-center justify-center gap-2"
              >
                <span>🔄</span> New Fight
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

export default RealFighter
