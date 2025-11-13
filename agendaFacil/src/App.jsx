import {Routes, Route} from 'react-router-dom'
import Home from './pages/Home'
import Servicos from './pages/Servicos'
import NavBar from './components/navbar/NavBar'
import './App.css'

function App() {
  return (
    <>
      <NavBar/>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/servicos/:categoria" element={<Servicos />} />
      </Routes>
    </>
  )
}

export default App