import logo from '../../assets/img/logo.svg'
import imgPerfil from '../../assets/img/usuario-demo.jpg'
import '../../assets/css/header.css'
import Search from '../Search/search.jsx'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu"
import { Link } from 'react-router-dom'
 
//Componente de Avatar com Dropdown
const Avatar = () =>{
    return(
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <img src={ imgPerfil } alt="imagem usuario" className="w-100 h-auto max-w-8 rounded-full cursor-pointer"/>  
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                <DropdownMenuLabel className="avatar-item cursor-pointer">Nome_Perfil</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                <DropdownMenuItem className="avatar-item cursor-pointer">Configurações</DropdownMenuItem>
                <DropdownMenuItem className="avatar-item cursor-pointer">Favoritos</DropdownMenuItem>
                <DropdownMenuItem className="avatar-item cursor-pointer">Sair</DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
 
const Header = () =>{
    return(
        <header>
            <nav className="flex  items-center justify-between">
                <ul>
                    <li>
                        <Link to="/"><img src={ logo } alt="imagem logo svg"/></Link>
                    </li>
                </ul>
 
                <ul>
                    <li className="links">
                        <Link to="/">Início</Link>
                        <Link to="/">Receitas</Link>
                        <Link to="/">Favoritas</Link>
                    </li>
                </ul>
 
                <ul>
                    <li className="links">
                        <Search texto="Pesquisar..."/>
                        <Avatar/>
                    </li>
                </ul>
            </nav>
        </header>
    )
}
 
export default Header;