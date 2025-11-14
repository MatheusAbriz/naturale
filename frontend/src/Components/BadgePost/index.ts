import styled from "styled-components";
import { theme } from "../../assets/css/variaveis";

export const PostBadge = styled.div`
    width: fit-content;
    height: fit-content;
    padding: 8px;
    background-color: ${theme.corFundo};
    position: absolute;
    right: 2rem;
    bottom: 0;
    z-index: 1;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;

    &:hover span{
        opacity: 1;
        transform: translateY(-8px);
    }
`;

export const Tooltip = styled.span`
    position: absolute;
    bottom: 110%;
    background: #000000c9;
    color: #fff;
    padding: 6px 10px;
    font-size: 0.75rem;
    border-radius: 6px;
    white-space: nowrap;
    opacity: 0;
    pointer-events: none;
    transition: all 0.2s ease;
    transform: translateY(0);
`;