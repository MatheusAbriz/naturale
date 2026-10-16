import { API } from "./api";

type UploadImageResponse = {
  path: string;
  publicUrl: string;
};

// Importante: a instância `API` define Content-Type: application/json por padrão,
// e esse header persiste mesmo em requests com FormData. Precisamos removê-lo
// explicitamente aqui para que o próprio navegador gere o boundary correto do
// multipart — do contrário o backend recebe "application/json" sem boundary e
// o parser (busboy) quebra a requisição.
export async function uploadImage(file: File, bucket: "posts" | "usuarios") {
  const formData = new FormData();
  formData.append("bucket", bucket);
  formData.append("file", file);

  try {
    const res = await API.post<UploadImageResponse>("/images", formData, {
      headers: { "Content-Type": undefined },
    });
    return res.data.publicUrl;
  } catch (e: any) {
    console.error("Falha no upload de imagem:", e?.response?.status, e?.response?.data ?? e?.message);
    throw e;
  }
}
