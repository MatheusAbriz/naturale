import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { ArrowUpIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import Header from '../../Components/Header/header';
import botIcon from '../../assets/img/bot.svg';
import { callGroq } from '../../services/callGroq';
import { StyledTextArea } from '../../globals/inputs';
import { StyledButton } from '../../globals/buttons';
import { ChatBotContainer, ChatHistory, InputArea, FormularioChat, UserMessage, BotMessage, WelcomeMessage, BotIcon, TypingIndicator, CharCount } from './';

interface ChatMessage {
  role: 'user' | 'bot';
  content: string;
}

const ChatBot = () => {
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, reset, watch } = useForm();
  const caracteres = watch('textarea');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, loading]);

  const handleSend = async (data: { textarea: string }) => {
    const userMessageContent = data.textarea;
    const userMessage: ChatMessage = { 
      role: 'user', 
      content: userMessageContent 
    };
    setChatHistory(prev => [...prev, userMessage]);
    reset();
    setLoading(true);

    try {
      const reply = await callGroq(userMessageContent);
      const botMessage: ChatMessage = { 
        role: 'bot', 
        content: reply 
      };
      setChatHistory(prev => [...prev, botMessage]);
    } catch (e) {
      toast.error("Erro interno com o servidor. Tente novamente mais tarde");
      const errorMessage: ChatMessage = {
        role: 'bot',
        content: 'Desculpe, não consegui processar sua solicitação. Tente novamente.'
      };
      setChatHistory(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const charLength = caracteres?.length || 0;
  const isCharLimitReached = charLength >= 255;
  const isSubmitDisabled = loading || charLength < 10 || isCharLimitReached;

  return (
    <>
      <Header />
      <ChatBotContainer>
        <ChatHistory>
          {chatHistory.length === 0 ? (
            <WelcomeMessage>
              <img src={botIcon} alt="Bot" />
              <p>Posso ajudar hoje?</p>
            </WelcomeMessage>
          ) : (
            chatHistory.map((msg, index) =>
              msg.role === 'user' ? (
                <UserMessage key={index}>{msg.content}</UserMessage>
              ) : (
                <BotMessage key={index}>
                  <BotIcon src={botIcon} alt="bot" />
                  {msg.content}
                </BotMessage>
              )
            )
          )}

          {loading && (
            <BotMessage $isTyping>
              <BotIcon src={botIcon} alt="bot" />
              <TypingIndicator>
                <span></span><span></span><span></span>
              </TypingIndicator>
            </BotMessage>
          )}

          <div ref={chatEndRef} />
        </ChatHistory>

        <InputArea>
          {/*@ts-ignore*/}
          <FormularioChat onSubmit={handleSubmit(handleSend)}>
            <StyledTextArea
              name="textarea"
              placeholder="Digite sua pergunta..."
              register={register}
              minLength={10}
              maxLength={255}
              isRequired
            />
            <StyledButton
              variant="outline"
              type="submit"
              disabled={isSubmitDisabled}
            >
              <ArrowUpIcon />
            </StyledButton>
          </FormularioChat>
          
          <CharCount $error={isCharLimitReached}>
            {charLength}/255
          </CharCount>
        </InputArea>
      </ChatBotContainer>
    </>
  );
};

export default ChatBot;