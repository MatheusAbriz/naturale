import axios from 'axios';
import { useQuery } from 'react-query';

export type FetchProps = {
    queryKey: string;
    urlParams: string;
    onSuccess?: (data: any) => void;
    onError?: (error: any) => void;
}   

const fetchData = (urlParams: string) => {
    return axios.get(`${import.meta.env.VITE_APP_BASE_URL}/${urlParams}`);
}

const useFetchData = ({ queryKey, urlParams, onSuccess, onError }: FetchProps) => {

    return useQuery(queryKey, () => fetchData(urlParams), {
        onSuccess,
        onError,
        refetchOnWindowFocus: false,
        // Dando fetch e retornando os dados
        select: (data) => {
            const result = data.data.map((item: any) => item);

            return result;
        }
    })
}

export default useFetchData;