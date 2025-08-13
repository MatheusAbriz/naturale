import type{ InputHTMLAttributes } from "react";
import type{ UseFormRegister } from 'react-hook-form';
import { maskEmail, maskPassword } from "../../utils/regexMasks";

type InputProps = {
    name: string;
    register: UseFormRegister<any>;
    minLength: number;
    maxLength?: number;
    isRequired?: boolean;
    maskType?: 'email' | 'password';
} & InputHTMLAttributes<HTMLInputElement>;

const emailRegex = maskEmail();
const passwordRegex = maskPassword();

const Input = ({name, maskType, minLength, maxLength=255, register, isRequired,...props }: InputProps) =>{
    return(
        <input 
         {...props}
         {...register(name, { required: isRequired ? 'Campo obrigatorio' : '', minLength: {
            value: minLength,
            message: `Mínimo de ${minLength} caracteres`
         }, maxLength: {
            value: maxLength,
            message: `Máximo de ${maxLength} caracteres`
         }, pattern: {
            value: maskType === 'email' ? emailRegex : passwordRegex,
            message: maskType === 'email' ? 'Email inválido' : 'Senha inválida. Inclua ao menos 1 letra minúscula, uma maiúscula e um caractere especial'
         }
        })} 
        />
    )
}

export default Input;