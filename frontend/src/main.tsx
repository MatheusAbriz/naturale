import { createRoot } from 'react-dom/client';
import './assets/css/reset.css';
import './assets/css/variaveis.scss';
import { QueryClientProvider, QueryClient } from 'react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home/home';
import { Login } from './pages/Login/login';
import PrivateRoute from './utils/PrivateRoute';
import { AuthContextProvider } from './contexts/AuthContext';

//Criando um cliente para o React Query
const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthContextProvider>
        <Routes>
          <Route path="/" element={<PrivateRoute><Home/></PrivateRoute>}></Route>
          <Route path="login" element={ <Login/> }/>
        </Routes>
      </AuthContextProvider>
    </BrowserRouter>
  </QueryClientProvider>
)
