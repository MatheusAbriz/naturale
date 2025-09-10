import { createGlobalStyle } from "styled-components"


export const GlobalStyles = createGlobalStyle`
    *{
        box-sizing: border-box;
        font-family: "Poppins", 'Roboto', Arial, Helvetica, sans-serif;
    }

    body{
        background-color: var(--cor-branco);
    }
`

export const theme = {
    //Cores
    corFundo: '#518C81',
    corSuporte: '#BF895A',
    corBranco: '#F2F2F2',
    corPreto: '#2F4F4F',
    corFundoBotao: '#D9D9D9',

    //Espacamentos
    espacamentoPadrao: '2rem',
    espacamentoBotao: '.3rem .5rem .3rem 1rem',

    //Animacoes
    animacaoBotao: 'all .5s ease-in-out',
    animacaoOutlineInput: 'all .1s linear',
}