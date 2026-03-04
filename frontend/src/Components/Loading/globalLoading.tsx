import { StyledGlobalLoading } from "."

const GlobalLoading = () =>{
    return(
        <StyledGlobalLoading>
            <div className="animate-spin rounded-full h-16 w-16 border-t-4"></div>
        </StyledGlobalLoading>
    )
}

export default GlobalLoading;