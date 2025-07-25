import { createRoot } from 'react-dom/client'
import './assets/css/reset.css'
import './assets/css/variaveis.css'
import { QueryClientProvider, QueryClient } from 'react-query'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home/home'

//Criando um cliente para o React Query
const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={ <Home/> }/>
      </Routes>
    </BrowserRouter>
  </QueryClientProvider>
)
