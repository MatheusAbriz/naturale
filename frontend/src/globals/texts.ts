import { styled } from "styled-components";
import type { TitleProps } from "../types/types";

export const TextTitle = styled.p<TitleProps>`
    font-size: 2rem;
    font-weight: 600;
`

export const TextNormal = styled.p<TitleProps>`
    font-size: 1rem;
    color: ${props => props.$color};
`

export const TextSmall = styled.p<TitleProps>`
    font-size: .8rem;
    color: ${props => props.$color};
`