import { styled } from "styled-components";
import { DialogFooter } from "../../ui/dialog";

export const ListaComentarios = styled.div``;

export const ComentarioWrapper = styled.div`
  margin-top: 15px;
`;

export const ComentarioItemContainer = styled.div`
  display: flex;
  gap: 10px;
`;

export const AvatarComentario = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
`;

export const ComentarioConteudo = styled.div`
  flex: 1;
`;

export const ApelidoUsuario = styled.strong`
  font-size: 14px;
`;

export const TextoComentario = styled.p`
  margin: 4px 0 0 0;
  font-size: 14px;
`;

export const EditadoTag = styled.span`
  font-size: 12px;
  color: #888;
  margin-left: 8px;
`;

export const LongTimeTag = styled.span`
  font-size: 10px;
  color: #555;
  margin-left: 8px;
  font-style: italic;
`;

export const RespostasContainer = styled.div`
  margin-left: 42px;
  padding-left: 10px;
  border-left: 2px solid #e2e8f0;
  margin-top: 10px;
`;

export const StyledFooter = styled(DialogFooter)`
  margin-top: 40px;
  flex-direction: column;

  &, form {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  form {
    gap: 20px;
  }
`;

export const AcoesComentario = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 8px;
`;

export const BotaoAcao = styled.button`
  background: none;
  border: none;
  padding: 0;
  font-size: 12px;
  font-weight: 600;
  color: #888;
  cursor: pointer;
  
  &:hover {
    color: #333;
  }
`;

export const FormResposta = styled.form`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 10px;
`;
