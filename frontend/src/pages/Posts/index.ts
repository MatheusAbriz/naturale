import styled from "styled-components";
import { theme } from "../../assets/css/variaveis";

export const StyledSectionCard = styled.section`
    display: flex;
    flex-wrap: wrap;
    gap: ${theme.espacamentoPadrao};
    padding: ${theme.espacamentoPadrao};
    justify-content: flex-start;

    & > * {
        flex: 1 1 352px;
        max-width: 352px;
    }
`