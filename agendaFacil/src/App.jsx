import {Routes, Route} from 'react-router-dom'
import Home from './pages/Home'
import NavBar from './components/navbar/NavBar'
import './App.css'

function App() {
  return (
    <>
      <NavBar/>
      <Routes>
        <Route path="/" element={<Home/>} />
      </Routes>
    </>
  )
}

export default App