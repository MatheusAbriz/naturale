import styled from "styled-components"
import { theme } from "../../assets/css/variaveis"

export const StyledSectionRegister = styled.section`
    padding: ${theme.espacamentoPadrao};

    aside{
        border-radius: .5rem;
        padding: ${theme.espacamentoPadrao};
        box-shadow: 0 0 16px 0 rgba(0, 0, 0, 0.15);
    }

    form{
        p{
            a{
                color: ${theme.corSuporte};
                    font-weight: 600;
                    text-decoration: underline;
                    animation: ${theme.animacaoBotao};

                    &:hover{
                        opacity: .8;
            }
        }
    }
`