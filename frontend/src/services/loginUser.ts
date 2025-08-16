import axios from "axios";

const loginUser = async (email: string, senha: string) => {
  const response = await axios.get(
    `${import.meta.env.VITE_APP_BASE_URL}/usuario/logarUsuario/${email}/${senha}`
  );

  if (response.status === 400) {
    throw new Error("Erro ao logar o usuário");
  }

  return response.data;
};

export default loginUser;