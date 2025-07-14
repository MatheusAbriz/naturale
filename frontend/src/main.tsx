import { createRoot } from 'react-dom/client'
import './assets/css/reset.css'
import './assets/css/variaveis.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home/home'

createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={ <Home/> }/>
      </Routes>
    </BrowserRouter>
)
