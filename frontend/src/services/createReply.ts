import axios from "axios";
import type { ReplyCreateDTO } from "../types/types";

const createCommentary = async (replyCreateDTO: ReplyCreateDTO) => {
    let user = JSON.parse(localStorage.getItem("user")  ?? '');
    const response = await axios.post(
      `${import.meta.env.VITE_APP_BASE_URL}/comentarios/responder`, replyCreateDTO, {
        headers: {
            'Authorization': `Bearer ${user.token}`
        }
      }
    );

    if(response.status === 400) {
        throw new Error("Erro ao criar o usuário");
    }

    return response.data;
};

export default createCommentary;