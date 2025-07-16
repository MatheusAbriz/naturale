import Header from "../../components/Header/header";
import Card from '../../components/Card/card';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import useFetch from "../../hooks/useFetch";
import useUpdate from "../../hooks/useUpdate";
import { useEffect, useState } from "react";
import AlertaTemporario from "../../components/AlertaTemporario/alertaTemporario";
import { usePosts } from '../../stores/posts';

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

    //Acessando para depois armazenar na zustand
    const { data, loading, error } = useFetch({ url: `${import.meta.env.VITE_APP_BASE_URL}/post/lerTodosPosts` })

    //Posts - variavel final
    const [ posts, setPosts ] = useState<any>([])
    
    const [ url, setUrl ] = useState<string>("http://localhost:5173")

    //Dados de atualizar a curtida do POST
    const { errorUpdate } = useUpdate({ url })

    //Retornando o nome do usuario com base em seu ID
    const [ nomeUsuario, setNomeUsuario ] = useState<string | null>(null)

    //Função que irá adicionar um like à postagem
    const handleClick = async(post:number) =>{
        //Atualizando no BD e também no zustand
        updateLikePosts(post)
        setUrl(`${import.meta.env.VITE_APP_BASE_URL}/post/atualizarPostCurtida/${post}`)
        
        //Recarregando os posts
        const updatedPosts = getAllPosts()
        setPosts(updatedPosts)
    }

    useEffect(() =>{
        const dataPosts = getAllPosts()

        //Verificando que caso já tenha sido registrado, pula essa etapa
        if(dataPosts.length > 0){
            setPosts(dataPosts)
            return;
        }

        //Se a data for diferente de nula e maior que 0...
        if(data !== null && data.length > 0){
            addPosts(data)
            setPosts(data)
        }

    }, [data, getAllPosts, addPosts])

    return(<>
        <Header/>

        <section 
         className="section-cards flex justify-center items-center flex-wrap gap-x-20 p-(--espacamento-padrao)"
         >

           {loading && <div>Carregando...</div>}
           {error && <div>Erro! Site fora do ar no momento.</div>}
           {posts && (
                posts.map((item: any) => 
                    <Card 
                     key={item?.id_post}
                     titulo={item?.titulo_post}
                     autor={item?.id_usuario}
                     post={item?.id_post}
                     qtdLikes={item?.qtd_curtidas}
                     handleClick={() => handleClick(item?.id_post)}
                    />)
            )}

            <Paginacao/>
            {errorUpdate ? (<AlertaTemporario texto="Opa! Algo deu errado, tente novamente depois."/>) : (<></>)}
        </section>
        
        </>
    )
}

export default Home;