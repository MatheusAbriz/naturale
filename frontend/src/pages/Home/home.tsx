import Header from "../../Components/Header/header";
import Card from "../../Components/Card/card";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { useEffect, useState } from "react";
import AlertaTemporario from "../../Components/AlertaTemporario/alertaTemporario";
import { StyledSectionCard } from "./";
import Loading from "../../Components/Loading/loading";

import fetchData  from "../../services/fetchData";
import updateData from '../../services/updateData';

import type { Posts, Likes } from "../../types/types";
import { useAuth } from "../../hooks/useAuth";
import { toast } from "react-hot-toast";

export const Home = () =>{
    const { user } = useAuth();
    const [ isFavorited, setIsFavorited ] = useState<Array<boolean>>([]);

    const Paginacao = () =>{
        return(
            <Pagination>
                <PaginationContent>
                    <PaginationItem>
                    <PaginationPrevious/>
                    </PaginationItem>
                    <PaginationItem>
                    <PaginationLink>1</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                    <PaginationLink>
                        2
                    </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                    <PaginationLink>3</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                    <PaginationEllipsis />
                    </PaginationItem>
                    <PaginationItem>
                    <PaginationNext/>
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        )
    }

    //AREA DE FETCHES E SERVICES - React Query

    //Criando um onSuccess que irá adicionar os posts na zustand store
    const onSuccessPosts = (data: Posts[]) =>{
        const posts = data;

        setPosts(posts);
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
    
    const {  data: favorites, refetch } = fetchData({
        queryKey: 'favorites',
        urlParams: `favoritos/lerFavoritos/${user?.id!}`,
    });

    //Likes - Responsável pela mutação de atualizar(adicionar/remover) likes do BD
    const { mutate: updateLikes, isError } = updateData()

    const { mutate: insertFavorite } = updateData();

    //Posts - variavel final
    const [ posts, setPosts ] = useState<Array<Posts>>([])


    //Função que irá adicionar um like à postagem
    const handleClick = async(usuario:number, post:number) =>{
        try{
            updateLikes(`${import.meta.env.VITE_APP_BASE_URL}/post/atualizarPostCurtida/${usuario}/${post}`)
        }catch(err){
            console.error(err)
        }
    }

    const handleInsertOrRemoveFavorite = async(idUsuario: number, idPost: number) => {
        try{
            //TODO: Transformar atualizacao do favorite reativo na UI
            insertFavorite(`${import.meta.env.VITE_APP_BASE_URL}/favoritos/inserirFavorito/${idUsuario}/${idPost}`);
            await refetch();

            setIsFavorited(prev => posts.map((post, index) => 
                post.id_post === idPost ? !prev[index] : prev[index]
            ))
            toast.success("Status de favorito alterado com sucesso");
        }catch(err){
            console.error(err);
            toast.error("Não é possível fazer isso no momento");
        }
    }

    useEffect(() =>{
        if (posts.length > 0 && favorites) {
            const favoriteStatusArray = posts.map(post => 
                favorites.some((fav: Likes) => fav.id_post === post.id_post)
            );
        setIsFavorited(favoriteStatusArray);
    }
    }, [posts, favorites])

    return(<>
        <Header/>

        <StyledSectionCard
         className="flex justify-center items-center flex-wrap gap-x-20 gap-y-10"
         >

           {isLoadingPosts && <Loading/>}
           {isErrorPosts && <div>Erro! Site fora do ar no momento.</div>}
           {posts && (
                posts.map((item: Posts, index) =>{
                    {/* Filtro que checa os likes (do BD, pelo id_post e id_usuario) com o id_post e id_usuario da entidade post no BD*/}
                    const isLiked = dataLikes?.some((like: Likes) => like.id_post === item?.id_post && like.id_usuario === user?.id);
                    return (
                        <Card 
                         key={item?.id_post}
                         titulo={item?.titulo_post}
                         autor={item?.apelido_usuario} 
                         post={item?.id_post}
                         avatar={item?.avatar_usuario} 
                         isLiked={isLiked}
                         isFavorited={isFavorited[index]}
                         qtdLikes={item?.qtd_curtidas}
                         handleClick={() => handleClick(user?.id!, item?.id_post)}
                         handleInsertOrRemoveFavorite={() => handleInsertOrRemoveFavorite(user?.id!, item?.id_post)}
                        />
                    )
                })
            )}

            <Paginacao/>
            {isError ? (<AlertaTemporario texto="Opa! Algo deu errado, tente novamente depois."/>) : (<></>)}
        </StyledSectionCard>
        
        </>
    )
}
