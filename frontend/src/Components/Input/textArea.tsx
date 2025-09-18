import type { TextAreaProps } from "../../types/types";


const TextArea = ({name, minLength, maxLength=255, register, isRequired,...props }: TextAreaProps) =>{
    return(
        <textarea
        maxLength={maxLength}
         {...props}
         {...register(name, { required: isRequired ? 'Campo obrigatorio' : '', minLength: {
            value: minLength,
            message: `Mínimo de ${minLength} caracteres`
         }, maxLength: {
            value: maxLength,
            message: `Máximo de ${maxLength} caracteres`
         }
        })} 
        />
    )
}

export default TextArea;