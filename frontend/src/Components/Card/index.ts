import styled from "styled-components";
import { theme } from "../../assets/css/variaveis";

export const StyledContainerCard = styled.div`

    button{
        padding: 0;
    }
    svg{
        transition: ${theme.animacaoBotao};
    }

    .container-curtidas{
        span{
            font-size: .8rem;
        }
    }
`