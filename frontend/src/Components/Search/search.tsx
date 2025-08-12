import { useState } from 'react';
import Input from '../Input/input';

export type SearchProps = {
    texto: string;
}

const Search = ({ texto } : SearchProps) =>{
    const [ pesquisa, setPesquisa ] = useState<string>('')

    const pesquisar = () =>{
        console.log(pesquisa)
    }

    return(
        <div className="container-pesquisar relative">
            <Input 
             type="text" 
             name="pesquisar" 
             id="pesquisar" 
             placeholder={ texto } 
             onChange={(e) => setPesquisa(e.target.value)} 
             className="bg-(--cor-fundo-botao) p-[.3rem_.5rem_.3rem_.8rem] rounded-2xl text-(--cor-preto)"
            />
            <span 
             className="cursor-pointer bg-[url(../../assets/img/pesquisar.svg)] w-[1.5rem] h-[1.5rem] bg-cover bg-no-repeat absolute right-[12px] top-[4px]" 
             onClick={ pesquisar }/>
        </div>
    )
}

export default Search;