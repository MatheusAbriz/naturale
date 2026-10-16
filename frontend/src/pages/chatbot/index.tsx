import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";
import { askChatbot } from "@/services/ChatbotService";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import { Loader } from "@/Components/common/loader";

type ChatMessage = {
  id: string;
  role: "user" | "bot";
  content: string;
};

export default function Chatbot() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isSending]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || isSending) return;

    setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: "user", content: trimmed }]);
    setText("");
    setIsSending(true);

    try {
      const reply = await askChatbot(trimmed);
      setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: "bot", content: reply }]);
    } catch (e) {
      console.error(e);
      toast.error("Erro ao falar com o chatbot. Tente novamente.");
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col">
      <h1 className="mb-4 text-xl font-bold">Chatbot</h1>

      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-2 py-10 text-center text-muted-foreground">
            <Sparkles className="h-8 w-8 text-emerald-600" />
            <p className="font-semibold text-foreground">Olá! Sou seu assistente culinário</p>
            <p className="text-sm">Pergunte sobre receitas, ingredientes, técnicas de preparo ou substituições.</p>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`mb-3 flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[75%] rounded-lg px-3 py-2 text-sm ${
                message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}

        {isSending && <Loader size="sm" />}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2 border-t pt-3">
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Pergunte algo sobre receitas..."
          disabled={isSending}
        />
        <Button type="submit" disabled={isSending}>
          {isSending ? "Enviando..." : "Enviar"}
        </Button>
      </form>
    </div>
  );
}
