import { useMutation } from "react-query";
import loginUser from "../services/loginUser";
import type { UserLoginDTO } from "../types/types";

const useLogin = () => {
  return useMutation(
    async (userLoginDTO: UserLoginDTO) => {
      return await loginUser(userLoginDTO);
    }
  );
};

export default useLogin;