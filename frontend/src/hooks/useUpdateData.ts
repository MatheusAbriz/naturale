import axios, { AxiosError, type AxiosResponse } from 'axios'
import { useMutation, useQueryClient } from 'react-query';

const useUpdateData = () =>{
    const queryClient = useQueryClient()

    return useMutation<AxiosResponse, AxiosError, string>(
        (urlParams: string) => axios.patch(urlParams),
        {
            onSuccess: () => {
                //Forçando atualizacao
                queryClient.invalidateQueries('posts')
                queryClient.invalidateQueries('likes')
            },
            onError: (err: AxiosError) =>{
                console.error(`Erro na mutate: ${err}`)
            }
        }
    )
}

export default useUpdateData;