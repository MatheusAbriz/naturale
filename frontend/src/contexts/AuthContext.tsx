import { createContext, useEffect, useState, type ReactNode } from "react";
import { auth, signInWithPopup, provider } from "../services/firebase";

//Tipagem usuario
type User = {
    nome: string;
    email: string;
    avatar: string | null;
}

//Tipando o contexto de autenticacao
type AuthContextType = {
    user: User | undefined;
    signInWithGoogle: () => Promise<void>;
}

//Tipando o provider do contexto
type AuthContextProviderProps = {
    children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextType);

export const AuthContextProvider = (props: AuthContextProviderProps) =>{
    const [ user, setUser ] = useState<User>();

    useEffect(() =>{
        //Criando um useEffect pra verificar se o usuario esta logado e depois o unsubscribe pra evitar memory leak
        const unsubscribe = auth.onAuthStateChanged(user => {
            if(user){
                const { displayName, photoURL, email } = user;

                if(!displayName || !email){
                    throw new Error("Informações cruciais da conta não foram encontradas, tente novamente");
                }

                setUser({
                    nome: displayName,
                    email: email,
                    avatar: photoURL
                })
            }
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

            setUser({
                nome: displayName,
                email: email,
                avatar: photoURL
            })
        }
    }

   return(
        <AuthContext.Provider value={{ user, signInWithGoogle }} >
            {props.children}
        </AuthContext.Provider>
   );
}