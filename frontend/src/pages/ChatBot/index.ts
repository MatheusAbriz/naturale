import styled, { css, keyframes } from "styled-components";
import { theme } from "../../assets/css/variaveis"; 

export const ChatBotContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100vh - 60px); 
  background-color: #f9f9f9;
`;

export const ChatHistory = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;

  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

export const InputArea = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row-reverse;
  flex-shrink: 0;
  padding: 16px 24px;
  background-color: #ffffff;
  border-top: 1px solid #e0e0e0;
  box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.05);
`;

export const FormularioChat = styled.form`
  display: flex;
  align-items: flex-start;
  width: 100%;
  gap: 12px;

  textarea {
    flex: 1;
    background-color: ${theme.corFundoBotao};
    border: 1px solid #ddd;
    border-radius: 20px;
    padding: 10px 16px;
    font-size: 1rem;
    min-height: 44px;
    max-height: 150px;
    resize: none;
    line-height: 1.5;
    overflow-y: auto;

    &::placeholder {
      color: #999;
    }
  }

  button {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    
    svg {
      width: 20px;
      height: 20px;
    }

    &:disabled {
      cursor: not-allowed;
      opacity: 0.6;
    }
  }
`;

const MessageBubble = styled.div`
  padding: 12px 18px;
  border-radius: 20px;
  max-width: 75%;
  line-height: 1.6;
  font-size: 0.95rem;
  word-wrap: break-word;
`;

export const UserMessage = styled(MessageBubble)`
  align-self: flex-end;
  background-color: ${theme.corFundoBotao};
  color: #fff;
  border-top-right-radius: 8px;
`;

export const BotMessage = styled(MessageBubble)<{ $isTyping?: boolean }>`
  align-self: flex-start;
  background-color: #e9e9eb;
  color: #000;
  border-top-left-radius: 8px;
  display: flex;
  align-items: center;
  gap: 10px;

  ${props => props.$isTyping && css`
    background-color: transparent;
    padding: 0;
  `}
`;

export const BotIcon = styled.img`
  width: 28px;
  height: 28px;
  flex-shrink: 0;
  align-self: flex-start;
`;

export const WelcomeMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  gap: 16px;
  text-align: center;
  
  img {
    width: 100%;
    max-width: 100px;
    height: auto;
  }
  
  p {
    font-size: 1.1rem;
    color: #cecece;
  }
`;

export const CharCount = styled.span<{ $error?: boolean }>`
  font-size: 0.75rem;
  color: ${props => props.$error ? '#FF0000' : '#CCC'};
  text-align: right;
  margin-top: 4px;
  padding-right: 12px;
`;

const typingAnimation = keyframes`
  0%, 60%, 100% { opacity: 0.5; transform: scale(0.7); }
  30% { opacity: 1; transform: scale(1); }
`;

export const TypingIndicator = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 18px;
  background-color: #e9e9eb;
  border-radius: 20px;
  border-top-left-radius: 8px;

  span {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: #999;
    margin: 0 2px;
    animation: ${typingAnimation} 1.2s infinite ease-in-out;

    &:nth-child(1) { animation-delay: 0s; }
    &:nth-child(2) { animation-delay: 0.2s; }
    &:nth-child(3) { animation-delay: 0.4s; }
  }
`;
