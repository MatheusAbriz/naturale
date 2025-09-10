import styled from "styled-components";
import pesquisar from "../../assets/img/pesquisar.svg";

export const StyledContainerPesquisar = styled.div`
    span{
        background: url(${pesquisar});
        width: 1.5rem;
        height: 1.5rem;
        right: 12px;
        top: 4px;
    };

    span:hover{
        cursor: pointer;
    }


`