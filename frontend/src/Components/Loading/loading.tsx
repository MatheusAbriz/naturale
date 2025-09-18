import { StyledLoading } from ".";

const Loading = () =>{
  return(
    <StyledLoading className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-(--cor-fundo)"></div>
    </StyledLoading>
  )
}

export default Loading;