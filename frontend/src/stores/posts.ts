import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

//Criando a interface para armazenar os posts
interface Posts{
    //Variaveis/estados
    id_post: number;
    id_usuario: number;
    titulo_post: string;
    texto_post: string;
    ingredientes_post: string;
    qtd_curtidas: number;
    status_post: boolean;
}

//Criando a tipagem para a interface
interface PostsState{
    posts: Posts[]

    //functions
    addPosts: (data: Posts[]) => void;
    getAllPosts: () => Posts[];

    //false = retirar, true = adicionar
    updateLikePosts: (idUsuario:number, idPost: number, tipoOperacao: boolean) => void;
}

//Criando o custom hook/posts store e usando persist com localStorage
export const usePosts = create<PostsState>()(
    persist(
        (set, get) => ({
            posts: [],
            addPosts: (data: Posts[]) =>{
                set((state) => {
                    //Adiciona apenas novos posts
                    const oldPosts = state.posts.map(post => post.id_post)
                    const newPosts = data.filter(post => !oldPosts.includes(post.id_post))
                    
                    return {
                        posts: [...state.posts, ...newPosts]
                    }
                })
            },
            getAllPosts: () =>{
                const state = get()
                return state.posts
            },
            updateLikePosts: (idUsuario:number, idPost: number, tipoOperacao: boolean) =>{
                set((state) => {
                    //Dando update apenas naqueles posts com esse id
                    //state.posts.filter((post) => post.id_post === id)
                    const updatedPost = state.posts.map((post) =>
                        post.id_post === idPost && post.id_usuario === idUsuario ? tipoOperacao === true ? {...post, qtd_curtidas: post.qtd_curtidas + 1 } : {...post, qtd_curtidas: post.qtd_curtidas - 1 } : post
                    )
                    return {
                        posts: updatedPost
                    }
                })
            }
        }),
        {
            name: 'posts',
            storage: createJSONStorage(() => localStorage),
        }
    )
)
