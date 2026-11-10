import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Crown, Sparkles } from "lucide-react";
import { askChatbot } from "@/services/ChatbotService";
import { Input } from "@/styles/inputs";
import { Button } from "@/styles/buttons";
import { Loader } from "@/Components/common/loader";
import { PlanBadge } from "@/Components/subscription/plan-badge";
import { hasPlan, useSubscription } from "@/stores/subscription-store";
import { track } from "@/lib/analytics";
import {
  Page,
  HeaderRow,
  TitleRow,
  Title,
  Subtitle,
  ExpandedBadge,
  LimitBadge,
  MessageList,
  Welcome,
  WelcomeTitle,
  WelcomeText,
  MessageRow,
  Bubble,
  ComposerForm,
} from "./styles";

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
      track("chatbot_limit_reached", { plan });
      toast.error("Você atingiu suas 5 perguntas de hoje. Conheça o plano Extra para continuar.");
      return;
    }

    setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: "user", content: trimmed }]);
    setText("");
    setIsSending(true);
    track("chatbot_question_submitted", { plan, has_expanded_access: hasExpandedChat });

    try {
      const reply = await askChatbot(trimmed);
      setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: "bot", content: reply }]);
      if (!hasExpandedChat) consumeChatbotQuestion();
      track("chatbot_response_received", { plan, has_expanded_access: hasExpandedChat });
    } catch (e) {
      console.error(e);
      track("chatbot_response_failed", { plan });
      toast.error("Erro ao falar com o chatbot. Tente novamente.");
    } finally {
      setIsSending(false);
    }
  }

  return (
    <Page>
      <HeaderRow>
        <div>
          <TitleRow>
            <Title>Assistente Naturale</Title>
            <PlanBadge plan={plan} />
          </TitleRow>
          <Subtitle>Ideias, substituições e orientações para a sua cozinha.</Subtitle>
        </div>
        {hasExpandedChat ? (
          <ExpandedBadge><Crown size={14} /> Uso ampliado</ExpandedBadge>
        ) : (
          <LimitBadge>{remaining}/5 hoje</LimitBadge>
        )}
      </HeaderRow>

      <MessageList>
        {messages.length === 0 && (
          <Welcome>
            <Sparkles size={32} color="#2f6b54" />
            <WelcomeTitle>Olá! Sou seu assistente culinário</WelcomeTitle>
            <WelcomeText>Pergunte sobre receitas, ingredientes, técnicas de preparo ou substituições.</WelcomeText>
          </Welcome>
        )}

        {messages.map((message) => (
          <MessageRow key={message.id} $own={message.role === "user"}>
            <Bubble $own={message.role === "user"}>{message.content}</Bubble>
          </MessageRow>
        ))}

        {isSending && <Loader size="sm" />}
        <div ref={bottomRef} />
      </MessageList>

      <ComposerForm onSubmit={handleSubmit}>
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Pergunte algo sobre receitas..."
          disabled={isSending || (!hasExpandedChat && remaining === 0)}
        />
        <Button type="submit" disabled={isSending || (!hasExpandedChat && remaining === 0)}>
          {isSending ? "Enviando..." : "Enviar"}
        </Button>
      </ComposerForm>
    </Page>
  );
}
