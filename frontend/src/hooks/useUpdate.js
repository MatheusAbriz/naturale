import axios from 'axios'
import { useEffect, useState } from 'react'

const useUpdate = (url) =>{
    const [ dataUpdate, setDataUpdate ] = useState(null)
    const [ errorUpdate, setErrorUpdate ] = useState(false)
    const [ loadingUpdate, setLoadingUpdate ] = useState(false)

    useEffect(() =>{
        (
            async function() {
                try{
                    setLoadingUpdate(true)
                    const res = await axios.patch(url)
                    setDataUpdate(res.data)
                    //Caso o request venha da propria home
                    if(res.request.responseURL == "http://localhost:5173/"){
                        return;
                    }else{
                        return;
                    }
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

    return { dataUpdate, errorUpdate, loadingUpdate }
}

export default useUpdate;