import { useEffect, useState } from "react";
import Header from "../../Components/Header/header";
import Card from "../../Components/Card/card";
import Loading from "../../Components/Loading/loading";
import AlertaTemporario from "../../Components/AlertaTemporario/alertaTemporario";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import fetchData from "../../services/fetchData";
import updateData from "../../services/updateData";
import { useAuth } from "../../hooks/useAuth";
import { toast } from "react-hot-toast";
import type { Posts, Likes } from "../../types/types";

const Favoritos = () => {
    const { user } = useAuth();
    const [postsFavoritados, setPostsFavoritados] = useState<Posts[]>([]);
    const [isFavorited, setIsFavorited] = useState<boolean[]>([]);

    const { data: dataLikes } = fetchData({
        queryKey: "likes",
        urlParams: "likes/lerTodosLikes"
    });

    const { data: favorites, isLoading: isLoadingFavorites, isError: isErrorFavorites, refetch } = fetchData({
        queryKey: "postFavorites",
        urlParams: `favoritos/lerFavoritos/${user?.id}`,
        enabled: !!user?.id
    });

    const { mutate: updateLikes, isError: isErrorLikes } = updateData();
    const { mutate: insertFavorite } = updateData();

    const handleLikeClick = async(usuario: number, post: number) => {
        try {
            updateLikes(`${import.meta.env.VITE_APP_BASE_URL}/post/atualizarPostCurtida/${usuario}/${post}`);
        } catch (err) {
            console.error(err);
        }
    };

    const handleInsertOrRemoveFavorite = async (idUsuario: number, idPost: number) => {
        try {
            insertFavorite(`${import.meta.env.VITE_APP_BASE_URL}/favoritos/inserirFavorito/${idUsuario}/${idPost}`);
            await refetch();

            setIsFavorited(prev =>
                postsFavoritados.map((post, index) =>
                    post.id_post === idPost ? !prev[index] : prev[index]
                )
            );
            refetch();


            toast.success("Status de favorito alterado com sucesso");
        } catch (err) {
            console.error(err);
            toast.error("Não é possível fazer isso no momento");
        }
    };

    useEffect(() => {
        if (favorites) {
            setPostsFavoritados(favorites);
            const favoriteArray = favorites.map(() => true);
            setIsFavorited(favoriteArray);
        }
    }, [favorites]);

    const Paginacao = () => (
        <Pagination>
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious/>
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink>1</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink>2</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink>3</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                    <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                    <PaginationNext size={undefined} />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );

    return (
        <>
            <Header />
            <section className="flex justify-center items-center flex-wrap gap-x-20 gap-y-10 px-4 py-6">
                {isLoadingFavorites && <Loading />}
                {isErrorFavorites && <div>Erro ao carregar favoritos.</div>}

                {!isLoadingFavorites && postsFavoritados.length === 0 && (
                    <p className="text-center text-gray-500">Você ainda não favoritou nenhuma receita.</p>
                )}

                {postsFavoritados.map((item, index) => {
                    const isLiked = dataLikes?.some(
                        (like: Likes) =>
                            like.id_post === item.id_post && like.id_usuario === user?.id
                    );

                    return (
                        <Card
                            key={item.id_post}
                            titulo={item.titulo_post}
                            autor={item.apelido_usuario}
                            post={item.id_post}
                            img={item.img_post}
                            avatar={item.avatar_usuario}
                            isLiked={isLiked}
                            isFavorited={isFavorited[index]}
                            qtdLikes={item.qtd_curtidas}
                            handleClick={() => handleLikeClick(user?.id!, item.id_post)}
                            handleInsertOrRemoveFavorite={() => handleInsertOrRemoveFavorite(user?.id!, item.id_post)}
                        />
                    );
                })}

                {postsFavoritados.length > 0 && <Paginacao />}
                {isErrorLikes && <AlertaTemporario texto="Erro ao curtir/descurtir post." />}
            </section>
        </>
    );
};

export default Favoritos;