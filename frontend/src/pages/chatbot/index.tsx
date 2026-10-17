import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Crown, Sparkles } from "lucide-react";
import { askChatbot } from "@/services/ChatbotService";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import { Loader } from "@/Components/common/loader";
import { PlanBadge } from "@/Components/subscription/plan-badge";
import { hasPlan, useSubscription } from "@/stores/subscription-store";

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
  const { plan, chatbotQuestionsUsed, usageDay, consumeChatbotQuestion } = useSubscription();
  const usedToday = usageDay === new Date().toISOString().slice(0, 10) ? chatbotQuestionsUsed : 0;
  const hasExpandedChat = hasPlan(plan, "extra");
  const remaining = Math.max(0, 5 - usedToday);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isSending]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || isSending) return;
    if (!hasExpandedChat && remaining === 0) {
      toast.error("Você atingiu suas 5 perguntas de hoje. Conheça o plano Extra para continuar.");
      return;
    }

    setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: "user", content: trimmed }]);
    setText("");
    setIsSending(true);

    try {
      const reply = await askChatbot(trimmed);
      setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: "bot", content: reply }]);
      if (!hasExpandedChat) consumeChatbotQuestion();
    } catch (e) {
      console.error(e);
      toast.error("Erro ao falar com o chatbot. Tente novamente.");
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div><div className="flex items-center gap-2"><h1 className="text-xl font-extrabold tracking-tight">Assistente Naturale</h1><PlanBadge plan={plan} /></div><p className="mt-1 text-sm text-muted-foreground">Ideias, substituições e orientações para a sua cozinha.</p></div>
        {hasExpandedChat ? <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-xs font-bold text-primary"><Crown className="h-3.5 w-3.5" /> Uso ampliado</span> : <span className="shrink-0 rounded-full bg-muted px-2.5 py-1 text-xs font-bold text-muted-foreground">{remaining}/5 hoje</span>}
      </div>

      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-2 py-10 text-center text-muted-foreground">
            <Sparkles className="h-8 w-8 text-primary" />
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
          disabled={isSending || (!hasExpandedChat && remaining === 0)}
        />
        <Button type="submit" disabled={isSending || (!hasExpandedChat && remaining === 0)}>
          {isSending ? "Enviando..." : "Enviar"}
        </Button>
      </form>
    </div>
  );
}
