import logo from '../../assets/img/logo-branco.svg'
import imgPerfil from '../../assets/img/usuario-demo.jpg'
import Search from '../Search/search.tsx'
import Avatar from '../Avatar/avatar.tsx'
import { Link } from 'react-router-dom'
import { useState } from 'react'

//Tipagem options
type Options = {
    label: string;
    item: {
        id: number;
        texto: string;
    }[]
}
const Header = () =>{

    //Opcoes
    const [ options, setOptions ] = useState<Options>({
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