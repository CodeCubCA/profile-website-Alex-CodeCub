import { Link } from 'react-router-dom'

function Games() {
  const games = [
    {
      name: 'TETRIS',
      path: '/games/tetris',
      emoji: '🧩',
      badge: 'Epic Classic',
      badgeColor: 'bg-green-500',
      bgGradient: 'from-purple-400 to-purple-600',
      description: 'The legendary block-falling puzzle game! Arrange falling tetrominoes to clear lines and achieve high scores.',
      difficulty: 'Hard',
      difficultyColor: 'bg-red-500',
      features: ['Real Tetris Physics', 'Multiple Levels', 'Score System', 'Keyboard Controls']
    },
    {
      name: 'SNAKE GAME',
      path: '/games/snake-game',
      emoji: '🐍',
      badge: 'Arcade Legend',
      badgeColor: 'bg-green-500',
      bgGradient: 'from-green-400 to-green-600',
      description: 'Control the snake, eat food, grow longer, and avoid hitting walls or yourself in this timeless arcade game!',
      difficulty: 'Medium',
      difficultyColor: 'bg-yellow-500',
      features: ['Classic Snake Mechanics', 'Growing Snake', 'High Score', 'Smooth Controls']
    },
    {
      name: 'TANK BATTLE',
      path: '/games/tank-battle',
      emoji: '🚗',
      badge: 'Action Packed',
      badgeColor: 'bg-red-500',
      bgGradient: 'from-orange-500 to-red-600',
      description: 'Command your tank in intense battles! Destroy enemy tanks, avoid bullets, and survive the battlefield.',
      difficulty: 'Hard',
      difficultyColor: 'bg-red-500',
      features: ['Real Combat', 'Enemy AI', 'Destructible Walls', 'Multiple Levels']
    },
    {
      name: 'AIR BATTLE',
      path: '/games/airplane-shooter',
      emoji: '✈️',
      badge: 'Sky Combat',
      badgeColor: 'bg-blue-500',
      bgGradient: 'from-blue-400 to-blue-600',
      description: 'Pilot your fighter jet through enemy territory! Shoot down enemy aircraft and collect power-ups.',
      difficulty: 'Hard',
      difficultyColor: 'bg-red-500',
      features: ['Flying Combat', 'Enemy Patterns', 'Health System', 'Power-ups']
    },
    {
      name: 'BEE INVASION',
      path: '/games/bee-shooter',
      emoji: '🐝',
      badge: 'Epic Adventure',
      badgeColor: 'bg-cyan-500',
      bgGradient: 'from-yellow-500 to-orange-600',
      description: 'Defend your garden from angry bees! Quick reflexes and precise aiming are key to survival.',
      difficulty: 'Medium',
      difficultyColor: 'bg-yellow-500',
      features: ['Fast Action', 'Multiple Enemies', 'Combo System', 'Garden Defense']
    },
    {
      name: 'WHACK-A-MOLE',
      path: '/games/whack-mole',
      emoji: '🔨',
      badge: 'Reflex Master',
      badgeColor: 'bg-green-500',
      bgGradient: 'from-green-500 to-teal-600',
      description: 'Test your reflexes! Hit the moles as they pop up, but watch out for the bombs!',
      difficulty: 'Easy',
      difficultyColor: 'bg-green-500',
      features: ['Reflex Training', 'Score Combos', 'Increasing Speed', 'Power-ups']
    },
    {
      name: 'REAL FIGHTER',
      path: '/games/real-fighter',
      emoji: '🥊',
      badge: 'Combat Master',
      badgeColor: 'bg-green-500',
      bgGradient: 'from-red-500 to-pink-600',
      description: 'True 2-player fighting game! Use hands and legs to battle with realistic combat mechanics and energy system.',
      difficulty: 'Hard',
      difficultyColor: 'bg-red-500',
      features: ['2-Player Combat', 'Punch & Kick', 'Combo System', 'Energy Management']
    },
    {
      name: 'LASER MAZE',
      path: '/games/laser-maze',
      emoji: '🔥',
      badge: 'Stealth Master',
      badgeColor: 'bg-cyan-500',
      bgGradient: 'from-orange-500 to-red-600',
      description: 'Navigate through deadly rotating lasers in this stealth-puzzle challenge! Use invisibility and perfect timing.',
      difficulty: 'Hard',
      difficultyColor: 'bg-red-500',
      features: ['Stealth Mechanics', 'Rotating Lasers', 'Power-ups', 'Strategic Gameplay']
    },
    {
      name: 'CITY PARKOUR',
      path: '/games/city-parkour',
      emoji: '🍄',
      badge: 'Parkour Master',
      badgeColor: 'bg-green-500',
      bgGradient: 'from-teal-400 to-cyan-600',
      description: 'Advanced parkour platformer! Wall run, air-dash, and perform epic combos in this urban adventure.',
      difficulty: 'Hard',
      difficultyColor: 'bg-red-500',
      features: ['Wall Running', 'Air Dashing', 'Combo System', 'Advanced Physics']
    },
    {
      name: 'SPACE INVADERS',
      path: '/games/space-invaders',
      emoji: '👾',
      badge: 'Retro Classic',
      badgeColor: 'bg-green-500',
      bgGradient: 'from-purple-500 to-indigo-600',
      description: 'The ultimate retro shooter! Defend Earth from waves of descending alien invaders.',
      difficulty: 'Medium',
      difficultyColor: 'bg-yellow-500',
      features: ['Wave System', 'Alien Formation', 'Power-ups', 'Retro Style']
    },
    {
      name: 'SPEED RACER',
      path: '/games/racing',
      emoji: '🚙',
      badge: 'Speed Demon',
      badgeColor: 'bg-red-500',
      bgGradient: 'from-yellow-500 to-orange-600',
      description: 'High-speed racing action! Navigate through traffic and obstacles at breakneck speeds.',
      difficulty: 'Hard',
      difficultyColor: 'bg-red-500',
      features: ['High Speed', 'Traffic System', 'Multiple Tracks', 'Upgrade System']
    },
    {
      name: 'SPACE EXPLORER',
      path: '/games/space-explorer',
      emoji: '🚀',
      badge: 'Space Warrior',
      badgeColor: 'bg-green-500',
      bgGradient: 'from-purple-600 to-blue-700',
      description: 'Epic space combat adventure! Battle AI enemies, collect resources, upgrade your ship in endless waves.',
      difficulty: 'Hard',
      difficultyColor: 'bg-red-500',
      features: ['Space Combat', 'AI Enemies', 'Upgrade System', 'Wave Survival']
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-purple-800 py-16 px-6">
      <div className="container mx-auto max-w-7xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="text-8xl mb-6">🎮</div>
          <h1 className="text-7xl md:text-8xl font-bold text-purple-100 mb-6 tracking-wider">
            EPIC GAMES
          </h1>
          <p className="text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            12 Advanced Interactive Games with Real Controls and Epic Challenges!
            <br />
            <span className="text-cyan-400">Tetris • Snake • Tank Battle • Air Combat & More!</span>
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
          <div className="bg-black/40 backdrop-blur-md rounded-2xl p-4 border border-cyan-500/30">
            <div className="text-5xl mb-3">⚡</div>
            <h3 className="text-xl font-bold text-cyan-400 mb-2">Real Controls</h3>
            <p className="text-gray-300 text-sm">Keyboard & mouse controls for authentic gaming</p>
          </div>
          <div className="bg-black/40 backdrop-blur-md rounded-2xl p-4 border border-purple-500/30">
            <div className="text-5xl mb-3">🚀</div>
            <h3 className="text-xl font-bold text-purple-400 mb-2">Advanced Physics</h3>
            <p className="text-gray-300 text-sm">Real game physics and mechanics</p>
          </div>
          <div className="bg-black/40 backdrop-blur-md rounded-2xl p-4 border border-yellow-500/30">
            <div className="text-5xl mb-3">🏆</div>
            <h3 className="text-xl font-bold text-yellow-400 mb-2">Epic Challenges</h3>
            <p className="text-gray-300 text-sm">Multiple levels and increasing difficulty</p>
          </div>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {games.map((game, index) => (
            <div
              key={index}
              className="rounded-2xl overflow-hidden shadow-2xl hover:shadow-cyan-500/40 transition-all duration-300 transform hover:scale-105 border border-cyan-500/20"
            >
              {/* Game Icon Area */}
              <div className={`bg-gradient-to-br ${game.bgGradient} h-52 flex items-center justify-center relative`}>
                <div className={`absolute top-4 right-4 ${game.badgeColor} text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-lg`}>
                  {game.badge}
                </div>
                <div className="text-9xl drop-shadow-2xl">{game.emoji}</div>
              </div>

              {/* Game Info Area */}
              <div className="bg-gray-900 p-6">
                <h3 className="text-2xl font-bold text-cyan-400 mb-3 flex items-center gap-2">
                  <span className="text-cyan-500">🎮</span>
                  {game.name}
                </h3>

                <p className="text-gray-300 text-sm mb-4 leading-relaxed h-20">
                  {game.description}
                </p>

                {/* Features */}
                <div className="mb-5">
                  <h4 className="text-yellow-400 text-sm font-bold mb-3 flex items-center gap-2">
                    <span>⚡</span> Features:
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {game.features.map((feature, idx) => (
                      <div key={idx} className="text-gray-400 text-xs flex items-start gap-1.5">
                        <span className="text-cyan-400 font-bold">•</span>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Difficulty and Play Button */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                  <span className={`${game.difficultyColor} text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-lg`}>
                    {game.difficulty}
                  </span>
                  <Link
                    to={game.path}
                    className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white px-6 py-2.5 rounded-full font-bold text-sm transition-all duration-300 flex items-center gap-2 shadow-xl hover:shadow-cyan-500/50"
                  >
                    PLAY NOW <span>🎮</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action Section */}
        <div className="bg-black/40 backdrop-blur-md rounded-3xl p-12 text-center border border-purple-500/30 shadow-2xl">
          <div className="text-7xl mb-6">🎯⚡🚀</div>
          <h2 className="text-5xl font-bold text-cyan-400 mb-6">Ready for Epic Gaming?</h2>
          <p className="text-gray-200 text-lg mb-8 max-w-3xl mx-auto leading-relaxed">
            These aren't simple games - they're full-featured interactive experiences with real controls,
            physics engines, AI enemies, and progressive difficulty systems. Choose your challenge
            and test your skills!
          </p>
          <div className="flex flex-wrap gap-6 justify-center mb-8">
            <Link
              to="/games/tetris"
              className="bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-400 hover:to-purple-600 text-white px-10 py-4 rounded-full font-bold text-lg transition-all duration-300 shadow-xl hover:shadow-purple-500/50 flex items-center gap-3"
            >
              <span className="text-2xl">🧩</span>
              Play Tetris First!
            </Link>
            <Link
              to="/games/snake-game"
              className="bg-gradient-to-r from-green-500 to-green-700 hover:from-green-400 hover:to-green-600 text-white px-10 py-4 rounded-full font-bold text-lg transition-all duration-300 shadow-xl hover:shadow-green-500/50 flex items-center gap-3"
            >
              <span className="text-2xl">🐍</span>
              Try Snake Game!
            </Link>
          </div>
          <Link
            to="/"
            className="text-cyan-400 hover:text-cyan-300 transition-colors font-semibold text-lg inline-flex items-center gap-2"
          >
            ← Back to Alex Guo's Profile
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Games
