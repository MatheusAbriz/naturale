import Header from "../../components/Header/header";
import Card from '../../components/Card/card';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { useState } from "react";
import AlertaTemporario from "../../components/AlertaTemporario/alertaTemporario";

import fetchData  from "../../services/fetchData";
import updateData from '../../services/updateData';

import type { Posts, Likes } from "../../types/types";

export const Home = () =>{

    const Paginacao = () =>{
        return(
            <Pagination>
                <PaginationContent>
                    <PaginationItem>
                    <PaginationPrevious href="#" />
                    </PaginationItem>
                    <PaginationItem>
                    <PaginationLink href="#" isActive>1</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                    <PaginationLink href="#">
                        2
                    </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                    <PaginationLink href="#">3</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                    <PaginationEllipsis />
                    </PaginationItem>
                    <PaginationItem>
                    <PaginationNext href="#" />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        )
    }

    //AREA DE FETCHES E SERVICES - React Query

    //Criando um onSuccess que irá adicionar os posts na zustand store
    const onSuccessPosts = (data: Posts[]) =>{
        const posts = data;

        //AddPosts - Zustand Store, setPosts - useState local
        setPosts(posts);
        //addPosts(posts) -> Por enquanto Zustand não está sendo utilizado, pois o proprio React Query faz a mágica de revalidar dados
    }

    const onSuccessLikes = (data: Likes) => {
        return;
    }

    //Criando um onError que irá imprimir o erro no console para debug
    const onError = (error: Error) =>{
        console.error("Erro ao buscar os posts:", error);
    }

    //Posts - Acessando para depois armazenar na zustand(dentro da funcao onSuccess)
    const { isLoading: isLoadingPosts, data: dataPosts, isError: isErrorPosts } =
     fetchData(
        { 
            queryKey: 'posts', 
            urlParams: 'post/lerTodosPosts', 
            onSuccess: onSuccessPosts, 
            onError 
        }
    )


    const { data: dataLikes } = 
     fetchData(
        { 
            queryKey: 'likes', 
            urlParams: 'likes/lerTodosLikes', 
            onSuccess: onSuccessLikes, 
            onError 
        }
    )

    //Likes - Responsável pela mutação de atualizar(adicionar/remover) likes do BD
    const { mutate: updateLikes, isError } = updateData()

    //Posts - variavel final
    const [ posts, setPosts ] = useState<Array<Posts>>([])

    //Retornando o nome do usuario com base em seu ID
    //const [ nomeUsuario, setNomeUsuario ] = useState<string | null>(null)
    

    //Função que irá adicionar um like à postagem
    const handleClick = async(usuario:number, post:number) =>{
        try{
            updateLikes(`${import.meta.env.VITE_APP_BASE_URL}/post/atualizarPostCurtida/${usuario}/${post}`)
        }catch(err){
            console.error(err)
        }
    }

    return(<>
        <Header/>

        <section 
         className="section-cards flex justify-center items-center flex-wrap gap-x-20 p-(--espacamento-padrao)"
         >

           {isLoadingPosts && <div>Carregando...</div>}
           {isErrorPosts && <div>Erro! Site fora do ar no momento.</div>}
           {posts && (
                posts.map((item: Posts) =>{
                    {/* Filtro que checa os likes (do BD, pelo id_post e id_usuario) com o id_post e id_usuario da entidade post no BD*/}
                    const isLiked = dataLikes?.some((like: Likes) => like.id_post === item?.id_post && like.id_usuario === item?.id_usuario);
                    return (
                        <Card 
                         key={item?.id_post}
                         titulo={item?.titulo_post}
                         autor={item?.id_usuario} 
                         post={item?.id_post} 
                         isLiked={isLiked}
                         qtdLikes={item?.qtd_curtidas}
                         handleClick={() => handleClick(item?.id_usuario, item?.id_post)} //TODO: Criar um store para o usuário para manter o usuário logado, e no handleClick, puxar o ID do usuario logado. Usando o do autor apenas para teste
                        />
                    )
                })
            )}

            <Paginacao/>
            {isError ? (<AlertaTemporario texto="Opa! Algo deu errado, tente novamente depois."/>) : (<></>)}
        </section>
        
        </>
    )
}
