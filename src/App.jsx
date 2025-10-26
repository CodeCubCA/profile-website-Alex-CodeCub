import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Games from './pages/Games'

// Import All Games
import Tetris from './games/Tetris'
import SnakeGame from './games/SnakeGame'
import TankBattle from './games/TankBattle'
import AirplaneShooter from './games/AirplaneShooter'
import BeeShooter from './games/BeeShooter'
import BeeShooterSimple from './games/BeeShooterSimple'
import WhackMole from './games/WhackMole'
import RealFighter from './games/RealFighter'
import LaserMaze from './games/LaserMaze'
import CityParkour from './games/CityParkour'
import SpaceInvaders from './games/SpaceInvaders'
import Racing from './games/Racing'
import SpaceExplorer from './games/SpaceExplorer'
import TestGame from './games/TestGame'

function App() {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <Header />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/games" element={<Games />} />

          {/* All Interactive Games */}
          <Route path="/games/tetris" element={<Tetris />} />
          <Route path="/games/snake-game" element={<SnakeGame />} />
          <Route path="/games/tank-battle" element={<TankBattle />} />
          <Route path="/games/airplane-shooter" element={<AirplaneShooter />} />
          <Route path="/games/bee-shooter" element={<BeeShooter />} />
          <Route path="/games/bee-simple" element={<BeeShooterSimple />} />
          <Route path="/games/whack-mole" element={<WhackMole />} />
          <Route path="/games/real-fighter" element={<RealFighter />} />
          <Route path="/games/laser-maze" element={<LaserMaze />} />
          <Route path="/games/city-parkour" element={<CityParkour />} />
          <Route path="/games/space-invaders" element={<SpaceInvaders />} />
          <Route path="/games/racing" element={<Racing />} />
          <Route path="/games/space-explorer" element={<SpaceExplorer />} />
          <Route path="/games/test" element={<TestGame />} />

          {/* Fallback for any undefined routes */}
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App