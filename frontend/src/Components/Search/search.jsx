import { useState } from 'react';

const Search = ({ texto }) =>{
    const [ pesquisa, setPesquisa ] = useState("")

    const pesquisar = () =>{
        console.log(pesquisa)
    }

    return(
        <div className="container-pesquisar relative">
            <input type="text" name="pesquisar" id="pesquisar" placeholder={ texto } onChange={(e) => setPesquisa(e.target.value)} className="bg-(--cor-fundo-botao) p-[.3rem_.5rem_.3rem_.8rem] rounded-2xl text-(--cor-preto)"/>
            <span className="cursor-pointer bg-[url(../../assets/img/pesquisar.svg)] w-[1.5rem] h-[1.5rem] bg-cover bg-no-repeat absolute right-[12px] top-[4px]" onClick={ pesquisar }/>
        </div>
    )
}

export default Search;