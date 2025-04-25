import logo from '../../assets/img/logo.svg'
import '../../assets/css/header.css'
import { Link } from 'react-router-dom'

const Header = () =>{
    return(
        <header>
            <nav>
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
            </nav>
        </header>
    )
}

export default Header;