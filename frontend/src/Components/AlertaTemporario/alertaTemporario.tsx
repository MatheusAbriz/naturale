import { Toaster, toast } from "sonner"
import { useEffect } from "react";
import type{ AlertaProps } from "../../types/types";
 

const AlertaTemporario = ({ texto } : AlertaProps) =>{
    useEffect(() =>{
        toast.error(texto)
    }, [])

    return(<Toaster theme="system"/>)
}

export default AlertaTemporario;