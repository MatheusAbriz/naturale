import axios from "axios";
import type { UserLoginDTO } from "../types/types";

const loginUser = async (user: UserLoginDTO) => {
  const response = await axios.post(
    `${import.meta.env.VITE_APP_BASE_URL}/usuario/logarUsuario`, user
  );

  if (response.status === 400) {
    throw new Error("Erro ao logar o usuário");
  }

  return response.data;
};

export default loginUser;