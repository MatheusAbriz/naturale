import { useState } from 'react';
import type { SearchProps } from '../../types/types';
import { StyledInputPesquisar } from '../../globals/inputs';
import { StyledContainerPesquisar } from './';

const Search = ({ texto } : SearchProps) =>{
    const [ pesquisa, setPesquisa ] = useState<string>('')

    const pesquisar = () =>{
        console.log(pesquisa)
    }

    return(
        <StyledContainerPesquisar className="relative">
            <StyledInputPesquisar
             type="text" 
             name="pesquisar" 
             id="pesquisar" 
             placeholder={ texto } 
             onChange={e => setPesquisa(e.target.value)} 
             className="rounded-2xl input-pesquisar"
            />
            <span 
             className="bg-cover bg-no-repeat absolute" 
             onClick={ pesquisar }/>
        </StyledContainerPesquisar>
    )
}

export default Search;