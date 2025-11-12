import axios from "axios";
import type { CommentaryCreateDTO } from "../types/types";

const createCommentary = async (comment: CommentaryCreateDTO) => {
    const response = await axios.post(
      `${import.meta.env.VITE_APP_BASE_URL}/comentarios/adicionar`, comment, {
        headers: {
            'Authorization': `Bearer ${comment.token}`
        }
      }
    );

    if(response.status === 400) {
        throw new Error("Erro ao criar o usuário");
    }

    return response.data;
};

export default createCommentary;