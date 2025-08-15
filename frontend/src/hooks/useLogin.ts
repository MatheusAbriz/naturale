import { useMutation } from "react-query";
import loginUser from "../services/loginUser";

const useLogin = () => {
  return useMutation(
    async ({ email, senha }: { email: string; senha: string }) => {
      return await loginUser(email, senha);
    }
  );
};

export default useLogin;