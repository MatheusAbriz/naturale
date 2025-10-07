import { createContext, useEffect, useState} from "react";
import type { User, AuthContextType, AuthContextProviderProps } from '../types/types';


export const AuthContext = createContext({} as AuthContextType);

export const AuthContextProvider = (props: AuthContextProviderProps) =>{
    const [ user, setUser ] = useState<User>();
    const [ loading, setLoading ] = useState<boolean>(true);

    useEffect(() => {
        const userLocalStorage : User = JSON.parse(localStorage.getItem('user') || '{}');

        //Verificando se é undefined ou nao
        if(userLocalStorage.id !== undefined && userLocalStorage.nome !== undefined && userLocalStorage.email !== undefined){
            setUser(userLocalStorage);
        }
        setLoading(false);
    }, [])

    const signInWithEmailAndPassword = async(user: User) =>{
        if(user.id === undefined || user.nome === undefined || user.email === undefined || user.token === undefined) {
            throw new Error("Erro ao logar o usuário")
        }
        localStorage.setItem('user', JSON.stringify(user));
        return setUser(user);
    }

   return(
        <AuthContext.Provider value={{ user, loading, signInWithEmailAndPassword }} >
            {props.children}
        </AuthContext.Provider>
   );
}