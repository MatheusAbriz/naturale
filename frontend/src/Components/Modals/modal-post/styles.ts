import { styled } from "styled-components";

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

export const RespostasContainer = styled.div`
  margin-left: 42px;
  padding-left: 10px;
  border-left: 2px solid #e2e8f0;
  margin-top: 10px;
`;