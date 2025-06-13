import { Toaster, toast } from "sonner"
import { useEffect } from "react";
 
const AlertaTemporario = ({texto}) =>{
    useEffect(() =>{
        toast.error(texto)
    }, [])

    return(<Toaster theme="system"/>)
}

export default AlertaTemporario;