import styled from "styled-components"
import { theme } from "../../assets/css/variaveis"

export const StyledSectionRegister = styled.section`
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