import styled from "styled-components";
import { theme } from "../../assets/css/variaveis";

export const StyledLoadingImages = styled.div`
    width: 22rem;
    height: 17.75rem;

    div{
        border-color: ${theme.corFundo};
    }
`

export const StyledLoading = styled.div`
    div{
        border-color: ${theme.corFundo};
    }
`

export const StyledGlobalLoading = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100dvh;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;  

    div{
        border-color: ${theme.corFundo};
    }
`