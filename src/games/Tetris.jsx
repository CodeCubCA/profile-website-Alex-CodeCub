import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'

const SHAPES = [
  [[1,1,1,1]], // I
  [[1,1],[1,1]], // O
  [[1,1,1],[0,1,0]], // T
  [[1,1,0],[0,1,1]], // S
  [[0,1,1],[1,1,0]], // Z
  [[1,1,1],[1,0,0]], // L
  [[1,1,1],[0,0,1]], // J
]

const COLORS = ['#00F0F0', '#F0F000', '#A000F0', '#00F000', '#F00000', '#F0A000', '#0000F0']

function Tetris() {
  const [showIntro, setShowIntro] = useState(true)
  const [gameStarted, setGameStarted] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [paused, setPaused] = useState(false)
  const [score, setScore] = useState(0)
  const [level, setLevel] = useState(1)
  const [lines, setLines] = useState(0)
  const [board, setBoard] = useState(Array(20).fill(null).map(() => Array(10).fill(0)))
  const [currentPiece, setCurrentPiece] = useState(null)
  const [nextPiece, setNextPiece] = useState(null)
  const [position, setPosition] = useState({ x: 4, y: 0 })

  const createNewPiece = useCallback(() => {
    const shapeIndex = Math.floor(Math.random() * SHAPES.length)
    return {
      shape: SHAPES[shapeIndex],
      color: COLORS[shapeIndex]
    }
  }, [])

  const startGame = () => {
    setShowIntro(false)
    setBoard(Array(20).fill(null).map(() => Array(10).fill(0)))
    const piece = createNewPiece()
    const next = createNewPiece()
    setCurrentPiece(piece)
    setNextPiece(next)
    setPosition({ x: 4, y: 0 })
    setScore(0)
    setLevel(1)
    setLines(0)
    setGameOver(false)
    setGameStarted(true)
    setPaused(false)
  }

  const checkCollision = useCallback((piece, pos, boardState) => {
    if (!piece) return true
    for (let y = 0; y < piece.shape.length; y++) {
      for (let x = 0; x < piece.shape[y].length; x++) {
        if (piece.shape[y][x]) {
          const newX = pos.x + x
          const newY = pos.y + y
          if (newX < 0 || newX >= 10 || newY >= 20) return true
          if (newY >= 0 && boardState[newY][newX]) return true
        }
      }
    }
    return false
  }, [])

  const rotatePiece = (piece) => {
    const rotated = piece.shape[0].map((_, i) =>
      piece.shape.map(row => row[i]).reverse()
    )
    return { ...piece, shape: rotated }
  }

  const mergePiece = useCallback(() => {
    const newBoard = board.map(row => [...row])
    currentPiece.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value) {
          const boardY = position.y + y
          const boardX = position.x + x
          if (boardY >= 0 && boardY < 20 && boardX >= 0 && boardX < 10) {
            newBoard[boardY][boardX] = currentPiece.color
          }
        }
      })
    })

    let linesCleared = 0
    const clearedBoard = newBoard.filter(row => {
      if (row.every(cell => cell !== 0)) {
        linesCleared++
        return false
      }
      return true
    })

    while (clearedBoard.length < 20) {
      clearedBoard.unshift(Array(10).fill(0))
    }

    setBoard(clearedBoard)
    setLines(prev => prev + linesCleared)
    setScore(prev => prev + linesCleared * 100 * level)

    const newPiece = nextPiece
    const newNext = createNewPiece()
    setCurrentPiece(newPiece)
    setNextPiece(newNext)
    setPosition({ x: 4, y: 0 })

    if (checkCollision(newPiece, { x: 4, y: 0 }, clearedBoard)) {
      setGameOver(true)
      setGameStarted(false)
    }
  }, [board, currentPiece, position, nextPiece, level, checkCollision, createNewPiece])

  useEffect(() => {
    if (!gameStarted || paused || gameOver) return

    const handleKeyPress = (e) => {
      if (e.key === 'ArrowLeft') {
        const newPos = { ...position, x: position.x - 1 }
        if (!checkCollision(currentPiece, newPos, board)) {
          setPosition(newPos)
        }
      } else if (e.key === 'ArrowRight') {
        const newPos = { ...position, x: position.x + 1 }
        if (!checkCollision(currentPiece, newPos, board)) {
          setPosition(newPos)
        }
      } else if (e.key === 'ArrowDown') {
        const newPos = { ...position, y: position.y + 1 }
        if (!checkCollision(currentPiece, newPos, board)) {
          setPosition(newPos)
        } else {
          mergePiece()
        }
      } else if (e.key === 'ArrowUp') {
        const rotated = rotatePiece(currentPiece)
        if (!checkCollision(rotated, position, board)) {
          setCurrentPiece(rotated)
        }
      } else if (e.key === ' ') {
        e.preventDefault()
        let dropPos = { ...position }
        while (!checkCollision(currentPiece, { ...dropPos, y: dropPos.y + 1 }, board)) {
          dropPos.y++
        }
        setPosition(dropPos)
        setTimeout(mergePiece, 50)
      } else if (e.key === 'p' || e.key === 'P') {
        setPaused(prev => !prev)
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [gameStarted, paused, gameOver, currentPiece, position, board, checkCollision, mergePiece])

  useEffect(() => {
    if (!gameStarted || paused || gameOver) return

    const interval = setInterval(() => {
      const newPos = { ...position, y: position.y + 1 }
      if (!checkCollision(currentPiece, newPos, board)) {
        setPosition(newPos)
      } else {
        mergePiece()
      }
    }, Math.max(100, 1000 - level * 100))

    return () => clearInterval(interval)
  }, [gameStarted, paused, gameOver, currentPiece, position, board, level, checkCollision, mergePiece])

  if (showIntro) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 py-12 px-6 flex items-center justify-center">
        <div className="max-w-lg w-full">
          <div className="text-center mb-8">
            <div className="text-8xl mb-6">🧩</div>
            <h1 className="text-6xl font-bold text-purple-200 mb-4">TETRIS</h1>
            <p className="text-xl text-purple-100">The legendary block-falling puzzle game!</p>
          </div>

          <div className="bg-black/60 backdrop-blur-md rounded-2xl p-8 border border-purple-500/30 mb-8">
            <h2 className="text-2xl font-bold text-purple-300 mb-6 flex items-center gap-3">
              <span>🎮</span> How to Play:
            </h2>
            <div className="space-y-3 text-purple-100">
              <div className="flex items-start gap-3">
                <span className="text-cyan-400 text-xl">⬆️</span>
                <span><strong>↑</strong> - Rotate</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-cyan-400 text-xl">⬅️➡️</span>
                <span><strong>←→</strong> - Move</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-cyan-400 text-xl">⬇️</span>
                <span><strong>↓</strong> - Soft Drop</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-yellow-400 text-xl">⚡</span>
                <span><strong>Space</strong> - Hard Drop</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-purple-400 text-xl">⏸️</span>
                <span><strong>P</strong> - Pause</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-green-400 text-xl">✨</span>
                <span>Clear lines to score points!</span>
              </div>
            </div>
          </div>

          <button
            onClick={startGame}
            className="w-full bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-400 hover:to-blue-500 text-white px-12 py-5 rounded-2xl font-bold text-2xl transition-all shadow-2xl hover:scale-105 flex items-center justify-center gap-3"
          >
            <span>🚀</span> START GAME
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 py-12 px-6">
      <div className="container mx-auto max-w-7xl">
        <div className="grid lg:grid-cols-[1fr,320px] gap-8">
          <div className="flex flex-col items-center">
            <h1 className="text-5xl font-bold text-purple-200 mb-6 flex items-center gap-3">
              <span>🧩</span>
              TETRIS
            </h1>

            <div className="relative">
              <div className="relative bg-gray-900 p-4 rounded-2xl border-4 border-purple-500 shadow-2xl">
                {board.map((row, y) => (
                  <div key={y} className="flex">
                    {row.map((cell, x) => {
                      let isCurrentPiece = false
                      let pieceColor = null

                      if (currentPiece) {
                        currentPiece.shape.forEach((shapeRow, sy) => {
                          shapeRow.forEach((value, sx) => {
                            if (value && position.y + sy === y && position.x + sx === x) {
                              isCurrentPiece = true
                              pieceColor = currentPiece.color
                            }
                          })
                        })
                      }

                      return (
                        <div
                          key={x}
                          className="w-6 h-6 border border-gray-700"
                          style={{
                            backgroundColor: isCurrentPiece ? pieceColor : (cell || '#1a1a2e')
                          }}
                        />
                      )
                    })}
                  </div>
                ))}

                {(paused || gameOver) && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm rounded-xl">
                    <div className="text-center">
                      {paused ? (
                        <>
                          <div className="text-6xl mb-4">⏸️</div>
                          <h3 className="text-4xl font-bold text-purple-300">PAUSED</h3>
                          <p className="text-purple-200 mt-4">Press P to resume</p>
                        </>
                      ) : (
                        <>
                          <div className="text-6xl mb-6">💀</div>
                          <h2 className="text-5xl font-bold text-red-400 mb-4">GAME OVER</h2>
                          <p className="text-2xl text-purple-200 mb-2">Score: {score}</p>
                          <p className="text-xl text-purple-300 mb-8">Lines: {lines}</p>
                          <button
                            onClick={startGame}
                            className="px-10 py-3 bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-400 hover:to-blue-500 text-white rounded-full font-bold text-xl transition-all"
                          >
                            🔄 PLAY AGAIN
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-black/40 backdrop-blur-md rounded-lg p-6 border border-purple-500/30">
              <h3 className="text-xl font-bold text-purple-300 mb-4 flex items-center gap-2">
                <span>📊</span> Game Stats
              </h3>
              <div className="space-y-2 text-sm text-white">
                <div className="flex justify-between">
                  <span>Score:</span>
                  <span className="font-bold text-yellow-400">{score.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Level:</span>
                  <span className="font-bold text-green-400">{level}</span>
                </div>
                <div className="flex justify-between">
                  <span>Lines:</span>
                  <span className="font-bold text-blue-400">{lines}</span>
                </div>
              </div>
            </div>

            <div className="bg-black/40 backdrop-blur-md rounded-lg p-6 border border-purple-500/30">
              <h3 className="text-lg font-bold text-purple-300 mb-3">⏭️ Next Piece</h3>
              <div className="flex justify-center bg-gray-800 p-4 rounded">
                {nextPiece && nextPiece.shape.map((row, y) => (
                  <div key={y}>
                    {row.map((cell, x) => (
                      <div
                        key={x}
                        className="w-5 h-5 inline-block border border-gray-700"
                        style={{ backgroundColor: cell ? nextPiece.color : 'transparent' }}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-black/40 backdrop-blur-md rounded-lg p-6 border border-purple-500/30">
              <h3 className="text-lg font-bold text-purple-300 mb-3 flex items-center gap-2">
                <span>🎮</span> Controls
              </h3>
              <div className="text-xs space-y-1 text-white">
                <div>↑ Rotate</div>
                <div>←→ Move</div>
                <div>↓ Soft Drop</div>
                <div>Space: Hard Drop</div>
                <div>P: Pause</div>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => setPaused(!paused)}
                className="w-full bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded-lg font-bold text-white"
                disabled={gameOver}
              >
                {paused ? '▶️ Resume' : '⏸️ Pause'}
              </button>
              <button
                onClick={startGame}
                className="w-full bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg font-bold text-white"
              >
                🔄 New Game
              </button>
              <Link
                to="/games"
                className="block w-full bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg font-bold text-white text-center"
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

export default Tetris
