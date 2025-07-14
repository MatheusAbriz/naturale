import axios from 'axios'
import { useEffect, useState } from 'react'

export type updateFetch = {
    url: string;
}

const useUpdate = ({url} : updateFetch) =>{
    const [ errorUpdate, setErrorUpdate ] = useState<boolean>(false)
    const [ loadingUpdate, setLoadingUpdate ] = useState<boolean>(false)

    useEffect(() =>{
        (
            async function() {
                try{
                    setLoadingUpdate(true)
                    await axios.patch(url)
                }catch(err){
                    if(url == "http://localhost:5173"){
                        return;
                    }
                    setErrorUpdate(true)
                }finally{
                    setLoadingUpdate(false)
                }
            }
        )()
    }, [url])

    return { errorUpdate, loadingUpdate }
}

export default useUpdate;