import { styled } from "styled-components";

export const StyledMensagemErro = styled.p`
    color: #FF0000;
    font-size: .7rem;
    font-weight: 600;
    margin-top: .2rem;
`

export const StyledSeparator = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    
    &::before{
    content: '';
    flex: 1;
        height: 1px;
        background: #d1d5dc;
        margin-right: 3px;
    }

    &::after{
        content: '';
        flex: 1;
        height: 1px;
        background: #d1d5dc;
        margin-left: 3px;
    }

    p{
        font-weight: 500;
    }
`