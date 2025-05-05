import '../../assets/css/card.css'
import cardImg from '../../assets/img/card-img.png'

const Card = ({ titulo }) =>{
    return(
            <div className="container-card flex flex-col">
                <img src={ cardImg } alt="imagem comida" />
                <h1>{ titulo }</h1>
            </div>
    )
}

export default Card;