import { useState } from 'react';
import type { SearchProps } from '../../types/types';
import { StyledInputPesquisar } from '../../globals/inputs';
import { StyledContainerPesquisar } from './';
import searchLogo from '../../assets/img/pesquisar.svg';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

const Search = ({ texto } : SearchProps) =>{
    const [ pesquisa, setPesquisa ] = useState<string>('')
    const { register, handleSubmit } = useForm();
    const navigate = useNavigate()

    const pesquisar = async() =>{
        await navigate(`/posts/${pesquisa}`);
    }

    return(
        <StyledContainerPesquisar className="relative">
            <form onSubmit={handleSubmit(pesquisar)}>
                <StyledInputPesquisar
                    register={register}
                    type="text" 
                    name="pesquisar" 
                    id="pesquisar" 
                    placeholder={ texto } 
                    onChange={e => setPesquisa(e.target.value)} 
                    className="rounded-2xl input-pesquisar"
                    required
                />
                <img src={searchLogo} alt="icone pesquisa" className="absolute" onClick={pesquisar}/>
            </form>
        </StyledContainerPesquisar>
    )
}

export default Search;