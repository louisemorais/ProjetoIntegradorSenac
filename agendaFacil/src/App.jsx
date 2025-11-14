import {Routes, Route} from 'react-router-dom'
import Home from './pages/Home'
import Servicos from './pages/Servicos'
import Login from './pages/Login'
import Registro from './pages/Registro'
import DetalhesPrestador from './pages/DetalhesPrestador'
import Agendamento from './pages/Agendamento'
import MeusAgendamentos from './pages/MeusAgendamentos'
import Perfil from './pages/Perfil'
import NavBar from './components/navbar/NavBar'
import './App.css'

function App() {
  return (
    <>
      <NavBar/>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/servicos" element={<Servicos />} />        
          <Route path="/servicos/:categoria" element={<Servicos />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/prestador/:id" element={<DetalhesPrestador />} />
          <Route path="/agendamento/:prestadorId/:servicoId" element={<Agendamento />} />
          <Route path="/meus-agendamentos" element={<MeusAgendamentos />} />
          <Route path="/perfil" element={<Perfil />} />
        </Routes>
    </>
  )
}

export default App