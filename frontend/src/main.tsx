import { createRoot } from 'react-dom/client';
import './assets/css/reset.css';
import { QueryClientProvider, QueryClient } from 'react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home/home';
import { Login } from './pages/Login/login';
import PrivateRoute from './utils/PrivateRoute';
import ToastSuccess from './Components/Toasts/toastSuccess';
import ToastError from './Components/Toasts/toastError';
import { AuthContextProvider } from './contexts/AuthContext';
import ChatBot from './pages/ChatBot/chatBot';
import Register from './pages/Cadastro/register';
import { GlobalStyles } from './assets/css/variaveis';
import Favorites from './pages/Favoritos/favorites';
import { Post } from './pages/Posts/post';
import { RegisterPost } from './pages/CadastroPost/registerPost';
import { BadgePost } from './Components/BadgePost/badgePost';
import { PostDetails } from './pages/PostDetails/post';

//Criando um cliente para o React Query
const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <GlobalStyles/>
    <BrowserRouter>
     <ToastSuccess/>
     <ToastError/>
      <AuthContextProvider>
        <Routes>
          <Route path="/" element={<PrivateRoute><Home/></PrivateRoute>}></Route>
          <Route path="/posts/:texto" element={<PrivateRoute><Post/></PrivateRoute>}/>
          <Route path="/post/:id" element={<PrivateRoute><PostDetails/></PrivateRoute>}/>
          <Route path="/register" element={<Register/>}/>
          <Route path="/registerPost" element={<PrivateRoute><RegisterPost/></PrivateRoute>}/>
          <Route path="/login" element={ <Login/> }/>
          <Route path="/favorites" element={<PrivateRoute><Favorites/></PrivateRoute> }/>
          <Route path="/chat" element={<PrivateRoute><ChatBot/></PrivateRoute>}/>
        </Routes>
        <BadgePost/>
      </AuthContextProvider>
    </BrowserRouter>
  </QueryClientProvider>
)
