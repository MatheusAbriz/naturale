import { styled } from "styled-components";
import { theme } from "../../assets/css/variaveis";

export const StyledSectionLogin = styled.section`
    aside{
        img{
            height: 100dvh;
        }
    }

    .main-content{

        .google-button{
            background: #EA4335;
            animation: ${theme.animacaoBotao};

            &:hover{
                opacity: .8;
            }
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
        }
    }

    @media screen and (max-width: 1100px){
        aside{
            img{
                display: none;
                height: 0;
            }
            width: 0;
        }
        main{
            width: 100%;
            margin-top: 3rem;
        }
    }

`