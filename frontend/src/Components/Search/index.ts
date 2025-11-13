import styled from "styled-components";

export const StyledContainerPesquisar = styled.div`
    img{
        width: 1.5rem;
        height: 1.5rem;
        right: 12px;
        top: 4px;
    
        &:hover{
            cursor: pointer;
        }
    };

    @media screen and (max-width: 450px) {
        form{
            width: fit-content;
            justify-content: center;
            margin: 0 auto;
        }
    }
`