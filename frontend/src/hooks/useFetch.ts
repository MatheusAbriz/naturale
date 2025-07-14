import { useEffect, useState } from "react";
import axios from 'axios'

export type FetchProps = {
    url: string;
}

const useFetch = ({ url } : FetchProps)=>{
    const [ data, setData ] = useState<any | null>(null)
    const [ error, setError ] = useState<boolean>(false)
    const [ loading, setIsLoading ] = useState<boolean>(false)

    useEffect(() =>{
        (
            async function(){
                try{
                    setIsLoading(true)
                    const res = await axios.get(url)
                    setData(res.data)
                }catch(err){
                    setIsLoading(false)
                    setError(true)
                }finally{
                    setIsLoading(false)
                }
            }
        )()
    }, [url])

    return { data, error, loading }
}

export default useFetch;