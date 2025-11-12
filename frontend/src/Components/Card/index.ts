import styled from "styled-components";
import { theme } from "../../assets/css/variaveis";

export const StyledContainerCard = styled.div`

    button{
        padding: 0;
    }
    svg{
        transition: ${theme.animacaoBotao};
    }
`

export const ImagePreview = styled.img`
    width: 100%;
    max-width: 352px;
    
    height: 224px;
    max-height: 284px;
    object-fit: cover;
    border-radius: 4px;
`;