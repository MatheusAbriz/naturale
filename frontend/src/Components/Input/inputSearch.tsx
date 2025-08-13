import type{ InputHTMLAttributes } from "react";
import type{ UseFormRegister } from 'react-hook-form';
import { maskEmail, maskCpf } from "../../utils/regexMasks";

type InputProps = InputHTMLAttributes<HTMLInputElement>;


const InputSearch = ({...props }: InputProps) =>{
    return(
        <input 
         {...props}
        />
    )
}

export default InputSearch;