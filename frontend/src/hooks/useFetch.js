import { useEffect, useState } from "react";
import axios from 'axios'

const useFetch = (url) =>{
    const [ data, setData ] = useState(null)
    const [ error, setError ] = useState(null)
    const [ loading, setIsLoading ] = useState(false)

    useEffect(() =>{
        (
            async function(){
                try{
                    setIsLoading(true)
                    const res = await axios.get(url)
                    setData(res.data)
                }catch(err){
                    setError(err)
                }finally{
                    setIsLoading(false)
                }
            }
        )()
    }, [url])

    return { data, error, loading }
}

export default useFetch;