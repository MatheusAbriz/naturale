import axios from "axios";

const deleteCommentary = async (id: number | string) => {
    let user = JSON.parse(localStorage.getItem("user")  ?? '');
    const response = await axios.delete(
      `${import.meta.env.VITE_APP_BASE_URL}/comentarios/excluir/${id}`, {
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

export default deleteCommentary;