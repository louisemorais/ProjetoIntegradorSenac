import {Routes, Route} from 'react-router-dom'
import Home from './pages/Home'
import NavBar from './components/navbar/NavBar'
import Calendario from './components/calendar/Calendario'
import './App.css'

function App() {
  return (
    <>
      <NavBar/>
      <Routes>
        <Route path="/" element={<Home/>} />
      </Routes>
      <Calendario />
    </>
  )
}

export default App