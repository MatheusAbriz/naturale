import { styled } from "styled-components";
import { theme } from "../../assets/css/variaveis";

export const StyledHeader = styled.header`
    background: ${theme.corFundo};
    padding: ${theme.espacamentoPadrao};

    nav ul li{
        color: ${theme.corBranco}
    }
`