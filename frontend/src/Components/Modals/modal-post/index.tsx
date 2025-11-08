import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import fetchCommentsData from "../../../services/fetchCommentsData";
import { ApelidoUsuario, AvatarComentario, ComentarioConteudo, ComentarioItemContainer, ComentarioWrapper, EditadoTag, ListaComentarios, RespostasContainer, TextoComentario } from './styles'
import type { Comentario } from "../../../types/types";

type ModalPostProps = {
    modalTrigger: React.ReactNode;
    children?: React.ReactNode;
    idPost: number;
}


export const ModalPost = ({ modalTrigger, children, idPost }: ModalPostProps) => {
  const { data: comentarios, isLoading } = fetchCommentsData({
    queryKey: ["comentarios", idPost],
    urlParams: `comentarios/lerPorPost/${idPost}`,
    enabled: !!idPost,
  });

  const renderComentario = (comentario: Comentario) => {
    return (
      <ComentarioWrapper key={comentario.id_comentario}>
        <ComentarioItemContainer>
          <AvatarComentario
            src={comentario.avatar_usuario}
            alt={comentario.nome_usuario}
          />
          <ComentarioConteudo>
            <ApelidoUsuario>{comentario.apelido_usuario}</ApelidoUsuario>
            {comentario.editado && <EditadoTag>(editado)</EditadoTag>}
            <TextoComentario>{comentario.texto_comentario}</TextoComentario>
          </ComentarioConteudo>
        </ComentarioItemContainer>

        {comentario.respostas && comentario.respostas.length > 0 && (
          <RespostasContainer>
            {comentario.respostas.map(renderComentario)}
          </RespostasContainer>
        )}
      </ComentarioWrapper>
    );
  };

  return (
    <Dialog>
      <DialogTrigger>{modalTrigger}</DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Comentários</DialogTitle>
        </DialogHeader>

        {children}

        <hr />

        <ListaComentarios>
          {isLoading ? (
            <p>Carregando comentários...</p>
          ) : (
            comentarios?.map(renderComentario)
          )}
        </ListaComentarios>
      </DialogContent>
    </Dialog>
  );
};