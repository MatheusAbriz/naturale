import type { InputPropsSearch as InputProps } from "../../types/types";

const InputSearch = ({register, ...props }: InputProps) =>{
    return(
        <input 
         {...props}
        />
    )
}

export default InputSearch;