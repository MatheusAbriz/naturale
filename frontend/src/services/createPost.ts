import axios from "axios";
import { createClient } from "@supabase/supabase-js";

export type PostCreateDTO = {
  idUsuario: number;
  tituloPost: string;
  textoPost: string;
  ingredientesPost: string;
  tempoPost: string;
  imgFile: File;             
  statusPost?: boolean;
};


const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_KEY
);

async function uploadImageToSupabase(file: File, bucket = "posts") {
  const fileExt = file.name.split(".").pop();
  const fileName = `${crypto.randomUUID()}.${fileExt}`;
  const filePath = `${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(filePath, file);

  if (uploadError) {
    throw uploadError;
  }

  const { data: publicUrlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath);

  return publicUrlData.publicUrl;
}

const createPost = async (postCreateDTO: PostCreateDTO) => {
  try {
    const imgUrl = await uploadImageToSupabase(postCreateDTO.imgFile);

    let user = JSON.parse(localStorage.getItem("user") ?? "{}");

    const payload = {
      idUsuario: postCreateDTO.idUsuario,
      tituloPost: postCreateDTO.tituloPost,
      textoPost: postCreateDTO.textoPost,
      ingredientesPost: postCreateDTO.ingredientesPost,
      tempoPost: postCreateDTO.tempoPost,
      imgPost: imgUrl,
      statusPost: postCreateDTO.statusPost ?? true,
    };

    const response = await axios.post(
      `${import.meta.env.VITE_APP_BASE_URL}/post/adicionarPost`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
    );

    if (response.status === 400) {
      throw new Error("Erro ao criar o post");
    }

    return response.data;
  } catch (error) {
    console.error("Erro em createPost:", error);
    throw error;
  }
};

export default createPost;