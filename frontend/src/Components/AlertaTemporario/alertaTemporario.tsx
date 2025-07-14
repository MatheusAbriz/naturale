import { Toaster, toast } from "sonner"
import { useEffect } from "react";
 
export type AlertaProps = {
    texto: string
}
const AlertaTemporario = ({ texto } : AlertaProps) =>{
    useEffect(() =>{
        toast.error(texto)
    }, [])

    return(<Toaster theme="system"/>)
}

export default AlertaTemporario;