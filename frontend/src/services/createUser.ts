import axios from "axios";
import type { UserCreateDTO } from "../types/types";

const createUser = async (user: UserCreateDTO) => {
    const response = await axios.post(
      `${import.meta.env.VITE_APP_BASE_URL}/usuario/adicionarUsuario`, user
    );

    if(response.status === 400) {
        throw new Error("Erro ao criar o usuário");
    }

    return response.data;
};

export default createUser;