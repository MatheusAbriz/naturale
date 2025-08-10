import cardImg from '../../assets/img/card-img.png'
import usuarioDemo from '../../assets/img/usuario-demo.jpg'
import { HeartIcon } from '@heroicons/react/24/outline'
import Avatar from '../Avatar/avatar'
import { useState } from 'react'

//Por enquanto autor está vindo como number, mas mudar para string(nome do autor) assim que possível
export type CardProps = {
    titulo: string,
    autor: number,
    post: number,
    isLiked: boolean;
    qtdLikes: number,
    handleClick: () => void
}

const Card = ({ titulo, autor, post, isLiked, qtdLikes, handleClick } : CardProps) =>{
    const [ options, setOptions ] = useState<any | null>({
        label: autor,
        post: post,
        qtdLikes: qtdLikes,
        item: [{id: 1, texto: "Perfil"}, {id: 2, texto: "Postagens"}] 
    })

    return(
            <div className="container-card flex flex-col">
                <div className="flex items-center gap-x-2">
                    <Avatar img={usuarioDemo} options={options}/>
                    <h1 className="text-md">{autor}</h1>
                </div>
                <img src={ cardImg } alt="imagem comida" />

                <div className="flex justify-between mt-2">
                    <h1 className="text-md">{ titulo }</h1>

                    <div className="flex gap-x-2">
                        <button className="cursor-pointer" onClick={handleClick}>
                            <HeartIcon className={`size-6 ${isLiked ? "fill-(--cor-fundo)" : "fill-white" } text-(--cor-preto) transition-all duration-500 ease-out`}/>
                        </button>
                        <h6>{qtdLikes}</h6>
                    </div>
                </div>
            </div>
    )
}

export default Card;