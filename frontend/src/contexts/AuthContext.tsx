import { createContext, useEffect, useState} from "react";
import { auth, signInWithPopup, provider } from "../services/firebase";
import type { User, AuthContextType, AuthContextProviderProps } from '../types/types';
import { UserEnums } from "../enums/userEnums";


export const AuthContext = createContext({} as AuthContextType);

export const AuthContextProvider = (props: AuthContextProviderProps) =>{
    const [ user, setUser ] = useState<User>();
    const [ loading, setLoading ] = useState<boolean>(true);

    useEffect(() =>{
        //Criando um useEffect pra verificar se o usuario esta logado e depois o unsubscribe pra evitar memory leak
        const unsubscribe = auth.onAuthStateChanged(user => {
            if(user){
                const { displayName, photoURL, email } = user;

                if(!displayName || !email){
                    throw new Error("Informações cruciais da conta não foram encontradas, tente novamente");
                }

                //Um usuário que loga pelo Google, SEMPRE será um USER
                setUser({
                    nome: displayName,
                    email: email,
                    avatar: photoURL,
                    tipo_usuario: UserEnums.USER
                })   
            }
            
            //Agora, vamos verificar se o usuario é logado com email/senha manual
            const userLocalStorage : User = JSON.parse(localStorage.getItem('user') || '{}');

            //Verificando se é undefined ou nao
            if(userLocalStorage.id !== undefined && userLocalStorage.nome !== undefined && userLocalStorage.email !== undefined){
                setUser(userLocalStorage);
            }
            setLoading(false);

        })

        return () => {
            unsubscribe();
        }
    }, []);

    const signInWithGoogle = async() => {
        const result = await signInWithPopup(auth, provider)

        //Se um usuario for encontrado...
        if (result.user) {
            const { displayName, photoURL, email } = result.user;

            if (!displayName || !email) {
                throw new Error('Informações cruciais da conta não foram encontradas, tente novamente');
            }

            //Um usuário que loga pelo Google, SEMPRE será um USER
            return setUser({
                nome: displayName,
                email: email,
                avatar: photoURL,
                tipo_usuario: UserEnums.USER
            })
        }
    }

    const signInWithEmailAndPassword = async(user: User) =>{
        if(user.id === undefined || user.nome === undefined || user.email === undefined) {
            throw new Error("Erro ao logar o usuário")
        }
        localStorage.setItem('user', JSON.stringify(user));
        return setUser(user);
    }

   return(
        <AuthContext.Provider value={{ user, loading, signInWithGoogle, signInWithEmailAndPassword }} >
            {props.children}
        </AuthContext.Provider>
   );
}