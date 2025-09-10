import styled from "styled-components";
import { Button } from "../Components/ui/button";
import { theme } from "../assets/css/variaveis";

//input de form submit
export const StyledButton = styled(Button)<{ $disabled?: boolean, hasBackground?: boolean }>`
    color: ${theme.corBranco};
    background: ${({ hasBackground = true }) => hasBackground ? theme.corFundo : 'transparent'};
    border-radius: .5rem;
    transition: ${theme.animacaoBotao};

    &:hover{
        opacity: .8;
    }

    opacity: ${props => props.$disabled ? '.5' : '1'};
    pointer-events: ${props => props.$disabled ? 'none' : 'auto'};
`