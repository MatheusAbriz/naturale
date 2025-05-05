import '../../assets/css/search.css'
import { useState } from 'react';

const Search = ({ texto }) =>{
    const [ pesquisa, setPesquisa ] = useState("")

    const pesquisar = () =>{
        console.log(pesquisa)
    }

    return(
        <div className="container-pesquisar">
            <input type="text" name="pesquisar" id="pesquisar" placeholder={ texto } onChange={(e) => setPesquisa(e.target.value)}/>
            <span className="cursor-pointer" onClick={ pesquisar }/>
        </div>
    )
}

export default Search;