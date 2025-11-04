import axios from 'axios';
import { useQuery } from 'react-query';
import type {  FetchCommentsProps } from '../types/types'; 

const data = (urlParams: string) => {
    let user = JSON.parse(localStorage.getItem("user")  ?? '');

    return axios.get(`${import.meta.env.VITE_APP_BASE_URL}/${urlParams}`, {
        headers: {
            'Authorization': `Bearer ${user.token}`
        }
    });
}

const fetchCommentsData = ({ queryKey, urlParams, enabled=true, onSuccess, onError }: FetchCommentsProps) => {
    return useQuery(queryKey, () => data(urlParams), {
        onSuccess,
        onError,
        refetchOnWindowFocus: false,
        enabled: enabled,
        // Dando fetch e retornando os dados
        //A tipagem aqui tem que ser feita a partir do BD, e como é um hook reutilizável, é dificil tipar. Mesma coisa com o item lá embaixo
        select: (data: any) => {
            
            if(!Array.isArray(data.data)){
                return null;
            }
            const result = data.data.map((item: any) => item);

            return result;
        }
    })
}

export default fetchCommentsData;