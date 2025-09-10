import { StyledLoadingImages } from './';

const LoadingImages = () =>{
  return(
    <StyledLoadingImages className="flex justify-center items-center">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4"></div>
    </StyledLoadingImages>
  )
}

export default LoadingImages;