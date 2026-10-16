import { API } from "./api";

export async function askChatbot(message: string) {
  const res = await API.post<{ reply: string }>("/chatbot", { message });
  return res.data.reply;
}
