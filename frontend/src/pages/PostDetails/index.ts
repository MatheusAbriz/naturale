import styled from "styled-components";
import { theme } from "../../assets/css/variaveis";

export const StyledPostContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: ${theme.espacamentoPadrao};
  gap: ${theme.espacamentoPadrao};
  display: flex;
  flex-direction: column;

  @media screen and (max-width: 768px) {
    padding: 1rem;
  }
`;

export const StyledPostCard = styled.article`
  background-color: ${theme.corBranco};
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

export const StyledPostHeader = styled.div`
  display: flex;
  align-items: center;
  padding: ${theme.espacamentoPadrao};
  border-bottom: 1px solid #e0e0e0;
`;

export const StyledUserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

export const StyledUserAvatar = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: contain;
  border: 2px solid ${theme.corFundo};
`;

export const StyledUserDetails = styled.div`
  display: flex;
  flex-direction: column;

  h3 {
    margin: 0;
    color: ${theme.corPreto};
    font-size: 1rem;
    font-weight: 600;
  }

  span {
    color: #999;
    font-size: 0.85rem;

    &.tipo {
      display: inline-block;
      background-color: ${theme.corFundo};
      color: ${theme.corBranco};
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      margin-top: 0.25rem;
      width: fit-content;
      font-size: 0.75rem;
      font-weight: 600;
    }
  }
`;

export const StyledPostImage = styled.img`
  width: 100%;
  max-height: 500px;
  object-fit: cover;
`;

export const StyledPostBody = styled.div`
  padding: ${theme.espacamentoPadrao};

  h2 {
    margin: 0 0 1rem 0;
    color: ${theme.corPreto};
    font-size: 1.5rem;
  }

  p {
    margin: 0 0 1rem 0;
    color: ${theme.corPreto};
    line-height: 1.6;
  }

  .ingredientes {
    background-color: #f9f9f9;
    padding: 1rem;
    border-left: 4px solid ${theme.corSuporte};
    border-radius: 4px;
    margin: 1rem 0;

    h4 {
      margin: 0 0 0.5rem 0;
      color: ${theme.corSuporte};
      font-size: 0.95rem;
    }

    p {
      margin: 0;
      color: ${theme.corPreto};
    }
  }
`;

export const StyledPostMeta = styled.div`
  display: flex;
  gap: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid #e0e0e0;
  color: #999;
  font-size: 0.9rem;
`;

export const StyledPostActions = styled.div`
  display: flex;
  gap: 1rem;
  padding: 1rem ${theme.espacamentoPadrao};
  border-top: 1px solid #e0e0e0;
  background-color: #fafafa;
`;

export const StyledActionButton = styled.button<{ isActive?: boolean }>`
  background-color: ${(props) =>
    props.isActive ? theme.corFundo : theme.corFundoBotao};
  color: ${(props) => (props.isActive ? theme.corBranco : theme.corPreto)};
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: ${theme.animacaoBotao};
  flex: 1;

  &:hover {
    background-color: ${(props) =>
      props.isActive ? theme.corFundo : "#c9c9c9"};
    transform: scale(1.02);
  }

  &:active {
    transform: scale(0.98);
  }
`;

export const StyledCommentsSection = styled.section`
  background-color: ${theme.corBranco};
  border-radius: 8px;
  padding: ${theme.espacamentoPadrao};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  h3 {
    margin: 0 0 ${theme.espacamentoPadrao} 0;
    color: ${theme.corPreto};
    font-size: 1.25rem;
  }
`;

export const StyledCommentList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  p {
    color: #999;
  }
`;

export const StyledComment = styled.div<{ isReply?: boolean }>`
  display: flex;
  gap: 1rem;
  padding: ${(props) => (props.isReply ? "1rem 0 1rem 2rem" : "0")};
  border-left: ${(props) =>
    props.isReply ? `2px solid ${theme.corFundoBotao}` : "none"};
`;

export const StyledCommentAvatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
  border: 2px solid ${theme.corFundo};
`;

export const StyledCommentContent = styled.div`
  flex: 1;
`;

export const StyledCommentAuthor = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  align-items: center;

  strong {
    color: ${theme.corPreto};
    font-size: 0.95rem;
  }

  span {
    color: #999;
    font-size: 0.85rem;
  }
`;

export const StyledCommentText = styled.p`
  margin: 0.5rem 0;
  color: ${theme.corPreto};
  line-height: 1.5;
`;

export const StyledCommentDate = styled.small`
  color: #999;
  font-size: 0.8rem;
  display: block;
  margin-top: 0.5rem;
`;

export const StyledReplies = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1.5rem;
`;
