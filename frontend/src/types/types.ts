import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";
import type { UseFormRegister } from "react-hook-form";
import { UserEnums } from '../enums/userEnums';
import type { QueryKey } from "react-query";

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
    autor: string | null,
    post: number,
    img?: any,
    avatar?: string | null,
    isLiked: boolean;
    isFavorited: boolean;
    qtdLikes: number,
    handleClick: () => void
    handleInsertOrRemoveFavorite: () => void;
}

export type PostCreateDTO = {
  idUsuario: number;
  tituloPost: string;
  textoPost: string;
  ingredientesPost: string;
  imgPost: string;
  tempoPost: string;
  statusPost?: boolean;
};

//Tipagem opcoes
export type OptionsPost = {
    label: string;
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

export type InputPropsSearch = InputHTMLAttributes<HTMLInputElement> & {
    register: UseFormRegister<any>;
};

export type SearchProps = {
    texto: string;
}

//Tipagem de contextos

//Tipagem usuario, serve tanto para logar com google como login com email/senha
export type User = {
    email?: string;
    id: number;
    token: string; //Token teoricamente guardará o email/senha/etc
    nome?: string;
    apelido?: string;
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
    avatar: string | null,
    tipo: UserEnums
}

export type UserLoginDTO = {
    email: string,
    senha: string
}

export type CommentaryCreateDTO = {
    id_usuario: number | string,
    id_post: number | string,
    texto_comentario: string,
    token: string
}

export type ReplyCreateDTO = {
    id_post: number | string,
    id_usuario: number | string,
    texto_comentario: string,
    id_comentario_pai: number | string
}

//Tipando o contexto de autenticacao
export type AuthContextType = {
    user: User | undefined;
    loading: boolean;
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
  img_post: string;
  tempo_post: string;
  qtd_curtidas: number;
  status_post: boolean;

  nome_usuario: string;
  apelido_usuario: string | null;
  avatar_usuario: string | null;
  tipo_usuario: UserEnums;
};


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
    queryKey: QueryKey;
    urlParams: string;
    enabled?: boolean;
    onSuccess?: (data: any) => void;
    onError?: (error: any) => void;
}

export type FetchCommentsProps = {
    queryKey: QueryKey;
    urlParams: string;
    enabled?: boolean;
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

//Tipagem de Props
export type TitleProps = {
    $color?: string
}

export type Comentario = {
  id_comentario: number;
  texto_comentario: string;
  data_comentario: string;
  editado: boolean;
  id_comentario_pai: number | null;
  id_usuario: number;
  nome_usuario: string;
  apelido_usuario: string;
  avatar_usuario: string;
  respostas: Comentario[];
}