import Header from "../../Components/Header/header";
import Card from '../../Components/Card/card';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import useFetch from "../../hooks/useFetch";
import useUpdate from "../../hooks/useUpdate";
import { useState } from "react";
import AlertaTemporario from "../../Components/AlertaTemporario/alertaTemporario";

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

    const { data, loading, error } = useFetch('http://localhost:3000/post/lerTodosPosts')
    if(error){
        console.log(error);
    }

    
    const [ url, setUrl ] = useState("http://localhost:5173")
    const { dataUpdate, errorUpdate, loadingUpdate} = useUpdate(url)

    const atualizarPost = async() =>{
        const res = await fetch(url)
    }

    //Função que irá adicionar um like à postagem
    const handleClick = async(post) =>{
        setUrl(`http://localhost:3000/post/atualizarPostCurtida/${post}`)
        return console.log(errorUpdate)
    }
    
    return(<>
        <Header/>

        <section className="section-cards flex justify-center items-center flex-wrap gap-x-20 p-(--espacamento-padrao)">
           {loading && <div>Carregando...</div>}
           {data && data.map(item => <Card key={item.id_post} titulo={item.titulo_post} autor={item.id_usuario} post={item.id_post} qtdLikes={item.qtd_curtidas} handleClick={() => handleClick(item.id_post)}/>)}

            <Paginacao/>
            {errorUpdate ? (<AlertaTemporario texto="Opa! Algo deu errado, tente novamente depois."/>) : (<></>)}
        </section>
        
        </>
    )
}

export default Home;