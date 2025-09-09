import type { ForwardedRef, InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";
import type { UseFormRegister } from "react-hook-form";
import { UserEnums } from '../enums/userEnums';

//Tipagem de componentes
export type AlertaProps = {
    texto: string
}

export type AvatarProps = {
    img: string;
    options: any;
}

//Por enquanto autor está vindo como number, mas mudar para string(nome do autor) assim que possível
export type CardProps = {
    titulo: string,
    autor: number,
    post: number,
    img?: any,
    isLiked: boolean;
    qtdLikes: number,
    handleClick: () => void
}

//Tipagem opcoes
export type OptionsPost = {
    label: number;
    post: number;
    qtdLikes: number;
    item: {
        id: number;
        texto: string;
    }[]
}

//Tipagem options
export type OptionsHeader = {
    label: string;
    item: {
        id: number;
        texto: string;
    }[]
}

export type TextAreaProps = {
    name: string;
    register: UseFormRegister<any>;
    minLength: number;
    maxLength: number;
    isRequired: boolean;
} & TextareaHTMLAttributes<HTMLTextAreaElement>;

export type InputProps = {
    name: string;
    register: UseFormRegister<any>;
    minLength: number;
    maxLength?: number;
    isRequired?: boolean;
    maskType?: 'email' | 'password';
} & InputHTMLAttributes<HTMLInputElement>;

export type InputPropsSearch = InputHTMLAttributes<HTMLInputElement>;

export type SearchProps = {
    texto: string;
}

//Tipagem de contextos

//Tipagem usuario, serve tanto para logar com google como login com email/senha
export type User = {
    id?: number;
    token?: string; //Token teoricamente guardará o email/senha/etc
    nome: string;
    email: string;
    tipo_usuario: UserEnums;
    avatar: string | null; //Caso haja algum erro no banco, vai trazer null
}

export type UserCreateDTO = {
    nome: string,
    apelido: string,
    telefone: string,
    cpf: string,
    email: string,
    senha: string,
    avatar: string,
    tipo: UserEnums 
}

export type UserLoginDTO = {
    email: string,
    senha: string
}

//Tipando o contexto de autenticacao
export type AuthContextType = {
    user: User | undefined;
    loading: boolean;
    signInWithGoogle: () => Promise<void>;
    signInWithEmailAndPassword: (user: User) => Promise<void>;
}

//Tipando o provider do contexto
export type AuthContextProviderProps = {
    children: ReactNode;
}

//Tipagem de páginas

//Tipagem correta para posts e likes
export type Posts = {
    id_post: number;
    id_usuario: number;
    titulo_post: string;
    texto_post: string;
    ingredientes_post: string;
    qtd_curtidas: number;
    status_post: boolean;
}

export type Likes = {
    id_like: number;
    id_post: number;
    id_usuario: number;
}

//Tipage Utils
export interface PrivateRouteProps {
  children: ReactNode;
}

//Tipagem de services
export type FetchProps = {
    queryKey: string;
    urlParams: string;
    onSuccess?: (data: any) => void;
    onError?: (error: any) => void;
}  

export type SkeletonImageProps = {
    src: string;
    alt: string; 
    width?: number;
    height?: number;
    className?: string;
}