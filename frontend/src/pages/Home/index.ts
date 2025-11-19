import styled from "styled-components"
import { theme } from "../../assets/css/variaveis"

export const StyledSectionCard = styled.section`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(352px, max-content));
  gap: ${theme.espacamentoPadrao};
  padding: ${theme.espacamentoPadrao};
  justify-content: center;
  justify-items: flex-start;

  & > * {
    max-width: 352px;
    width: 100%;
  }

  @media screen  and (max-width: 400px) {
    grid-template-columns: repeat(auto-fit, minmax(100%, 1fr));
  }
`