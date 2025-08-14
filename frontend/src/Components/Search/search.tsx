import { useState } from 'react';
import './search.scss';
import InputSearch from '../Input/inputSearch';
import type { SearchProps } from '../../types/types';

const Search = ({ texto } : SearchProps) =>{
    const [ pesquisa, setPesquisa ] = useState<string>('')

    const pesquisar = () =>{
        console.log(pesquisa)
    }

    return(
        <div className="container-pesquisar relative">
            <InputSearch
             type="text" 
             name="pesquisar" 
             id="pesquisar" 
             placeholder={ texto } 
             onChange={e => setPesquisa(e.target.value)} 
             className="bg-(--cor-fundo-botao) rounded-2xl text-(--cor-preto) input-pesquisar"
            />
            <span 
             className="cursor-pointer bg-cover bg-no-repeat absolute" 
             onClick={ pesquisar }/>
        </div>
    )
}

export default Search;