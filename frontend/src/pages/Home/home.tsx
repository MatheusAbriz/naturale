import Header from "../../components/Header/header";
import Card from '../../components/Card/card';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import useFetchPostsData from "../../hooks/useFetchPostsData";
import useFetchData from '../../hooks/useFetchData';
import useUpdate from "../../hooks/useUpdate";
import { useEffect, useState } from "react";
import AlertaTemporario from "../../components/AlertaTemporario/alertaTemporario";
import { usePosts } from '../../stores/posts';
import axios from "axios";

const Home = () =>{

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

    //Armazenando em uma zustand store os posts
    const { addPosts, getAllPosts, updateLikePosts } = usePosts()

    //AREA DE FETCHES E CUSTOM HOOKS - React Query

    //Criando um onSuccess que irá adicionar os posts na zustand store
    const onSuccessPosts = (data: any) =>{
        const posts = data

        //AddPosts - Zustand Store, setPosts - useState local
        setPosts(posts)
    }

    const onSuccessLikes = (data: any) => {
        const likes = data;

        //Armazenando os likes em um useState local
        setLikes(likes);
    }

    //Criando um onError que irá imprimir o erro no console para debug
    const onError = (error: any) =>{
        console.error("Erro ao buscar os posts:", error);
    }

    //Posts - Acessando para depois armazenar na zustand(dentro da funcao onSuccess)
    const { isLoading: isLoadingPosts, data: dataPosts, isError: isErrorPosts } =
     useFetchData({ queryKey: 'posts', urlParams: 'post/lerTodosPosts', onSuccess: onSuccessPosts, onError })

    //Likes - Acessando para depois armazenar na zustand(dentro da funcao onSuccess)
    const { data: dataLikes } = 
     useFetchData({ queryKey: 'likes', urlParams: 'likes/lerTodosLikes', onSuccess: onSuccessLikes, onError })

    //Posts - variavel final
    const [ posts, setPosts ] = useState<any>([])

    //Likes - armazena o id do usuario e id do post
    const [ likes, setLikes ] = useState<any>([])
    
    const [ url, setUrl ] = useState<string>("http://localhost:5173")

    //Dados de atualizar a curtida do POST
    const { errorUpdate } = useUpdate({ url })

    //Retornando o nome do usuario com base em seu ID
    const [ nomeUsuario, setNomeUsuario ] = useState<string | null>(null)

    //Função que irá adicionar um like à postagem
    const handleClick = async(usuario:number, post:number) =>{
        //Atualizando no BD e também no zustand
        //TODO: dando problema aqui, precisa colocar no updateLikePost o idUsuario/idPost, e também ver um jeito de imprimir o erro
        try{
            const res = await axios.get(`${import.meta.env.VITE_APP_BASE_URL}/likes/lerLike/${usuario}/${post}`)
            //remove like
            if(res.data.length > 0){
                setLikes(likes.filter((like: any) => !(like.id_post === post && like.id_usuario === usuario)))
                setUrl(`${import.meta.env.VITE_APP_BASE_URL}/post/atualizarPostCurtida/${usuario}/${post}`)

                // Atualizando o número de likes no post
                setPosts((prevPosts: any) =>
                    prevPosts.map((item: any) =>
                        item.id_post === post ? { ...item, qtd_curtidas: item.qtd_curtidas - 1 } : item
                    )
                );
            }else{
                setUrl(`${import.meta.env.VITE_APP_BASE_URL}/post/atualizarPostCurtida/${usuario}/${post}`)
                //Adiciona like
                setLikes([...likes, { id_post: post, id_usuario: usuario }]);

                // Atualizando o número de likes no post
                setPosts((prevPosts: any) =>
                    prevPosts.map((item: any) =>
                        item.id_post === post ? { ...item, qtd_curtidas: item.qtd_curtidas + 1 } : item
                    )
                );
            }

            //Atualiza no zustand
            updateLikePosts(usuario, post, false)
        }catch(err){
            console.log("Erroooo")
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
                posts.map((item: any) =>{
                    const isLiked = likes.some((like: any) => like.id_post === item?.id_post && like.id_usuario === item?.id_usuario);
                    return (
                        <Card 
                        key={item?.id_post}
                        titulo={item?.titulo_post}
                        autor={item?.id_usuario} //TODO: Criar um store para o usuário para que assim seja possível puxar o id do usuario, usando o do autor por teste apenas
                        post={item?.id_post} 
                        isLiked={isLiked}
                        qtdLikes={item?.qtd_curtidas}
                        handleClick={() => handleClick(item?.id_usuario, item?.id_post)}
                        />
                    )
                })
            )}

            <Paginacao/>
            {errorUpdate ? (<AlertaTemporario texto="Opa! Algo deu errado, tente novamente depois."/>) : (<></>)}
        </section>
        
        </>
    )
}

export default Home;