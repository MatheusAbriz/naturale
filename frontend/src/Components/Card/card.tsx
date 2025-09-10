import cardImg from '../../assets/img/card-img.png'
import usuarioDemo from '../../assets/img/usuario-demo.jpg'
import { HeartIcon } from '@heroicons/react/24/outline'
import Avatar from '../Avatar/avatar'
import { useState } from 'react'
import type { CardProps, OptionsPost as Options } from '../../types/types'
import LoadingImages from '../Loading/loadingImages'
import { ChatBubbleOvalLeftIcon } from '@heroicons/react/24/outline'
import { BookmarkIcon } from 'lucide-react'
import { StyledButton } from '../../globals/buttons'
import { StyledContainerCard } from './'

const Card = ({ titulo, autor, post, isLiked, qtdLikes, handleClick } : CardProps) =>{
    const [ loaded, setLoaded ] = useState(false);
    const onImageLoaded = () => {
        setLoaded(true)
    };

    const [ options, setOptions ] = useState<Options>({
        label: autor,
        post: post,
        qtdLikes: qtdLikes,
        item: [{id: 1, texto: "Perfil"}, {id: 2, texto: "Postagens"}] 
    })

    return(
            <StyledContainerCard className="flex flex-col">
                <div className="flex items-center gap-x-2 mb-2">
                    <Avatar img={usuarioDemo} options={options}/>
                    <h1 className="text-md">{autor}</h1>
                </div>
                <img 
                     src={ cardImg } 
                     alt="imagem comida"
                     onLoad={onImageLoaded}
                     className={`flex ${!loaded ? 'hidden' : ''}`}
                    />

                {!loaded && <LoadingImages />}

                <div className="flex justify-between mt-2 mb-1">
                    <div className="flex gap-x-2 items-center">
                        <StyledButton hasBackground={false} className="cursor-pointer" onClick={handleClick}>
                            <HeartIcon className={`size-6 ${isLiked ? "fill-[#518C81]" : "fill-white" } text-[#518C81] `}/>
                        </StyledButton>
                        <button>
                            <ChatBubbleOvalLeftIcon className="size-6 text-[#518C81]"/>
                        </button>
                    </div>

                    <div className="align-self-end">
                        <button>
                            <BookmarkIcon className="size-6 text-[#518C81]"/>
                        </button>
                    </div>
                </div>
                    
                <div className="container-curtidas">
                    <span>{qtdLikes} curtidas</span>

                    <div className="flex gap-x-2 items-center justify-start">
                        <span>{ autor }</span>
                        <h1 className="text-md">{ titulo }</h1>
                    </div>
                </div>
            </StyledContainerCard>
    )
}

export default Card;