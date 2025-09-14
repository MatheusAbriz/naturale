import axios from "axios";

const loginUser = async (email: string, senha: string) => {
  const usuario = {
    email: email,
    senha: senha
  }
  const response = await axios.post(
    `${import.meta.env.VITE_APP_BASE_URL}/usuario/logarUsuario`,{
      usuario
    }
  );

  if (response.status === 400) {
    throw new Error("Erro ao logar o usuário");
  }

  return response.data;
};

export default loginUser;