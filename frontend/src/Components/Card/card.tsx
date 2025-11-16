import usuarioDemo from '../../assets/img/usuario-demo.jpg'
import { HeartIcon } from '@heroicons/react/24/outline'
import Avatar from '../Avatar/avatar'
import { useState } from 'react'
import type { CardProps, OptionsPost as Options } from '../../types/types'
import LoadingImages from '../Loading/loadingImages'
import { ChatBubbleOvalLeftIcon } from '@heroicons/react/24/outline'
import { BookmarkIcon } from 'lucide-react'
import { StyledButton } from '../../globals/buttons'
import { ImagePreview, StyledContainerCard } from './'
import { TextNormal, TextSmall } from '../../globals/texts'
import updateData from '../../services/updateData'
import { ModalPost } from '../Modals/modal-post'
import { useNavigate } from 'react-router-dom'

const Card = ({ titulo, autor, avatar, post, img, isLiked, isFavorited, qtdLikes, handleClick, handleInsertOrRemoveFavorite } : CardProps) =>{
    const [ loaded, setLoaded ] = useState(false);
    const navigate = useNavigate();
    const onImageLoaded = () => {
        setLoaded(true)
    };

    const { mutate: insertFavorite } = updateData();

    const [ options, setOptions ] = useState<Options>({
        label: autor ?? "",
        post: post,
        qtdLikes: qtdLikes,
        item: [{id: 1, texto: "Perfil"}, {id: 2, texto: "Postagens"}] 
    })

    return(
            <StyledContainerCard className="flex flex-col">
                <div className="flex items-center gap-x-2 mb-2">
                    <Avatar img={avatar ?? usuarioDemo} options={options}/>
                    <h1 className="text-md">{autor}</h1>
                </div>
                <ImagePreview 
                     src={ img } 
                     alt="imagem comida"
                     onLoad={onImageLoaded}
                     className={`flex ${!loaded ? 'hidden' : ''}`}
                     onClick={() => navigate(`/post/${post}`)}
                    />

                {!loaded && <LoadingImages />}

                <div className="flex justify-between mt-2 mb-1">
                    <div className="flex gap-x-2 items-center">
                        <StyledButton hasBackground={false} className="cursor-pointer" onClick={handleClick}>
                            <HeartIcon className={`size-6 ${isLiked ? "fill-[#518C81]" : "fill-white" } text-[#518C81] `}/>
                        </StyledButton>
                        <ModalPost
                            idPost={post}
                            modalTrigger={
                                <ChatBubbleOvalLeftIcon className="size-6 text-[#518C81] cursor-pointer"/>
                            }
                        />                            
                    </div>

                    <div className="align-self-end">
                        <button onClick={handleInsertOrRemoveFavorite}>
                            <BookmarkIcon className={`size-6 text-[#518C81] ${isFavorited ? "fill-[#518C81]" : "fill-white"} cursor-pointer`}/>
                        </button>
                    </div>
                </div>
                    
                <div className="container-curtidas">
                    <TextSmall>{qtdLikes} curtidas</TextSmall>

                    <div className="flex gap-x-2 items-center justify-start">
                        <TextSmall>{ autor }</TextSmall>
                        <TextNormal className="text-sm">{ titulo }</TextNormal>
                    </div>
                </div>
            </StyledContainerCard>
    )
}

export default Card;