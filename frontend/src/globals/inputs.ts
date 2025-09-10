import styled from 'styled-components';
import Input from '../Components/Input/input';
import TextArea from '../Components/Input/textArea';
import InputSearch from '../Components/Input/inputSearch';
import { theme } from '../assets/css/variaveis';
//Input de formularios
export const StyledInputForm = styled(Input)`
    padding: 0 .8rem;
    border: 1px solid #CCC;
    border-radius: .3rem;
    transition: ${theme.animacaoOutlineInput};

    //Input de focus
    &:focus{
        outline: 2px solid ${theme.corFundo};
    }
`

//Input de pesquisar(header)
export const StyledInputPesquisar = styled(InputSearch)`
    padding: .3rem .5rem .3rem .8rem;
    background: ${theme.corFundoBotao};
    color: ${theme.corPreto};
`

export const StyledTextArea = styled(TextArea)`
    height: 2rem;
    background-color: ${theme.corFundoBotao};
    resize: none;
    overflow-y: none;
    -ms-overflow-style: none;
    scrollbar-width: none;
        
    *::-webkit-scrollbar{
        display: none;
    }

    &, &::placeholder{
        font-size: .8rem;
    }
`