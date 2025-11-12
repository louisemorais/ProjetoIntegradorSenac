import {Routes, Route} from 'react-router-dom'
import Home from './pages/Home'
import Servicos from './pages/Servicos'
import NavBar from './components/navbar/NavBar'
import Calendario from './components/calendar/Calendario'
import './App.css'

function App() {
  return (
    <>
      <NavBar/>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/servicos/:categoria" element={<Servicos />} />
      </Routes>
      <Calendario />
    </>
  )
}

export default App