import axios from "axios";
import { createClient } from "@supabase/supabase-js";
import type { UserCreateDTO } from "../types/types";

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_KEY);

const createUser = async (user: UserCreateDTO) => {
  try {
    let avatarUrl = null;
    //@ts-ignore
    if (user.avatar instanceof File) {
      const file = user.avatar;
      const ext = file.name.split(".").pop();
      const fileName = `${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("usuarios")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        console.error(uploadError);
        throw new Error("Erro ao enviar avatar");
      }

      const { data } = supabase.storage
        .from("usuarios")
        .getPublicUrl(fileName);

      avatarUrl = data.publicUrl;
    }

    const payload: UserCreateDTO = {
      ...user,
      avatar: avatarUrl || null, 
    };

    const response = await axios.post(
      `${import.meta.env.VITE_APP_BASE_URL}/usuario/adicionarUsuario`,
      payload
    );

    if (response.status === 400) {
      throw new Error("Erro ao criar o usuário");
    }

    return response.data;
  } catch (error) {
    console.error("Erro no createUser:", error);
    throw error;
  }
};

export default createUser;