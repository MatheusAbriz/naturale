import axios from 'axios'
import { useMutation, useQueryClient } from 'react-query'

//Tipando as props
export type updateFetch = {
    urlParams: string;
}


//Criando minha funcao para a requisição HTTP
const mutateData = (urlParams: string) => {
    return axios.patch(urlParams)
}

const useUpdateData = () =>{
    return useMutation((urlParams: string) => mutateData(urlParams))
}

export default useUpdateData;