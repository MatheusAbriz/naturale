import logo from '../../assets/img/logo.svg'
import imgPerfil from '../../assets/img/usuario-demo.jpg'
import Search from '../Search/search.jsx'
import Avatar from '../Avatar/avatar.jsx'
import { Link } from 'react-router-dom'
import { useState } from 'react'
 


const Header = () =>{

    //Opcoes
    const [ options, setOptions ] = useState({
        label: "Nome_Perfil",
        item: [{id: 1, texto: "Configurações"}, {id: 2, texto: "Favoritos"}, {id: 3, texto: "Sair"}]
    })

    return(
        <header className="bg-(--cor-fundo) p-(--espacamento-padrao)">
            <nav className="flex  items-center justify-between">
                <ul className="flex space-between items-center">
                    <li>
                        <Link to="/"><img src={ logo } alt="imagem logo svg"/></Link>
                    </li>
                </ul>
 
                <ul className="flex space-between items-center">
                    <li className="links flex text-(--cor-branco) gap-x-8">
                        <Link to="/">Início</Link>
                        <Link to="/">Receitas</Link>
                        <Link to="/">Favoritas</Link>
                    </li>
                </ul>
 
                <ul className="flex space-between items-center">
                    <li className="links flex gap-x-8">
                        <Search texto="Pesquisar..."/>
                        <Avatar img={imgPerfil} options={options}/>
                    </li>
                </ul>
            </nav>
        </header>
    )
}
 
export default Header;