import './loadingImages.scss';

const LoadingImages = () =>{
  return(
    <div className="loading-images flex justify-center items-center">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-(--cor-fundo)"></div>
    </div>
  )
}

export default LoadingImages;