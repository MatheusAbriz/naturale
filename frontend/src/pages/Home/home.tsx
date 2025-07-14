import Header from "../../components/Header/header";
import Card from '../../components/Card/card';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import useFetch from "../../hooks/useFetch";
import useUpdate from "../../hooks/useUpdate";
import { useState } from "react";
import AlertaTemporario from "../../components/AlertaTemporario/alertaTemporario";

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

    const { data, loading, error } = useFetch({ url: `${import.meta.env.VITE_APP_BASE_URL}/post/lerTodosPosts` })
    
    const [ url, setUrl ] = useState<string>("http://localhost:5173")

    //Dados de atualizar a curtida do POST
    const { errorUpdate, loadingUpdate } = useUpdate({ url })

    //Retornando o nome do usuario com base em seu ID
    const [ nomeUsuario, setNomeUsuario ] = useState<string | null>(null)

    const atualizarPost = async() =>{
        const res = await fetch(url)
    }

    //Função que irá adicionar um like à postagem
    const handleClick = async(post:number) =>{
        setUrl(`${import.meta.env.VITE_APP_BASE_URL}/post/atualizarPostCurtida/${post}`)
    }

    return(<>
        <Header/>

        <section className="section-cards flex justify-center items-center flex-wrap gap-x-20 p-(--espacamento-padrao)">
           {loading && <div>Carregando...</div>}
           {error && <div>Erro! Site fora do ar no momento.</div>}
           {data && data.map((item:any) => <Card key={item.id_post} titulo={item.titulo_post} autor={item.id_usuario} post={item.id_post} qtdLikes={item.qtd_curtidas} handleClick={() => handleClick(item.id_post)}/>)}

            <Paginacao/>
            {errorUpdate ? (<AlertaTemporario texto="Opa! Algo deu errado, tente novamente depois."/>) : (<></>)}
        </section>
        
        </>
    )
}

export default Home;