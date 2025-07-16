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
    //TODO: Atualizar o updatePosts para que caso já tenha sido curtido, não curtir dnv(possivelmente vai mexer com o BD com um novo campo isLiked ou algo assim)
    updateLikePosts: (id: number) => void;
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
            updateLikePosts: (id: number) =>{
                set((state) => {
                    //Dando update apenas naqueles posts com esse id
                    //state.posts.filter((post) => post.id_post === id)
                    const updatedPost = state.posts.map((post) => 
                        post.id_post === id ? {...post, qtd_curtidas: post.qtd_curtidas + 1 } : post
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
