import axios, { AxiosError, type AxiosResponse } from 'axios'
import { useMutation, useQueryClient } from 'react-query';

const updateData = () =>{
    const queryClient = useQueryClient()
    let user = JSON.parse(localStorage.getItem('user') ?? '')

    return useMutation<AxiosResponse, AxiosError, string>(
        (urlParams: string) => axios.patch(
            urlParams,
            {},
            {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }
        ),
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

export default updateData;