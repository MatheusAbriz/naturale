import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import fetchCommentsData from "../../../services/fetchCommentsData";
import { 
  ApelidoUsuario, 
  AvatarComentario, 
  ComentarioConteudo, 
  ComentarioItemContainer, 
  ComentarioWrapper, 
  EditadoTag, 
  ListaComentarios, 
  RespostasContainer, 
  StyledFooter,
  AcoesComentario,
  BotaoAcao,
  FormResposta,
  TextoComentario
} from './styles'
import type { Comentario, CommentaryCreateDTO } from "../../../types/types";
import { useForm, type FieldValues } from "react-hook-form";
import { Button } from "../../ui/button";
import { StyledInputForm } from "../../../globals/inputs";
import toast from "react-hot-toast";
import { useState } from "react";
import GlobalLoading from "../../Loading/globalLoading";
import { StyledMensagemErro } from "../../../globals/utils";
import { useAuth } from "../../../hooks/useAuth";
import createCommentary from "../../../services/createCommentary";
import { TrashIcon } from "lucide-react";
import deleteCommentary from "../../../services/deleteCommentary";
import createReply from "../../../services/createReply";

type ReplyCreateDTO = CommentaryCreateDTO & {
  id_comentario_pai: number;
};

type ModalPostProps = {
  modalTrigger: React.ReactNode;
  children?: React.ReactNode;
  idPost: number;
}

export const ModalPost = ({ modalTrigger, children, idPost }: ModalPostProps) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  
  const { 
    register: registerResposta, 
    handleSubmit: handleSubmitResposta, 
    reset: resetResposta 
  } = useForm();

  const [idComentarioRespondendo, setIdComentarioRespondendo] = useState<number | null>(null);
  const [ loading, setLoading ] = useState(false);
  const { data: comentarios, isLoading, refetch } = fetchCommentsData({
    queryKey: ["comentarios", idPost],
    urlParams: `comentarios/lerPorPost/${idPost}`,
    enabled: !!idPost,
  });
  const { user } = useAuth();

  const onSubmit = async(data: FieldValues) => {
    try{
      setLoading(true);
      const commentaryCreateDTO: CommentaryCreateDTO = {
        id_usuario: user!.id,
        id_post: idPost,
        texto_comentario: data.comentario,
        token: user!.token
      };
      
      await createCommentary(commentaryCreateDTO);
      toast.success("Comentário adicionado com sucesso!");
    }catch(err){
      toast.error("Erro! Tente novamente mais tarde");
      console.error(err);
    }finally{
      setLoading(false);
      refetch();
      reset();
    }
  };

  const onSubmitResposta = async(data: FieldValues) => {
    if (!idComentarioRespondendo) return;
    
    try {
      setLoading(true);
      const replyCreateDTO: ReplyCreateDTO = {
        id_usuario: user!.id,
        id_post: idPost,
        texto_comentario: data.resposta,
        token: user!.token,
        id_comentario_pai: idComentarioRespondendo
      };

      await createReply(replyCreateDTO);
      toast.success("Resposta adicionada com sucesso!");
    } catch(err) {
      toast.error("Erro ao adicionar resposta!");
      console.error(err);
    } finally {
      setLoading(false);
      refetch();
      resetResposta();
      setIdComentarioRespondendo(null);
    }
  };

  const handleDelete = async(idComentario: string | number) => {
    try{
      setLoading(true);
      await deleteCommentary(idComentario);
      toast.success("Comentário deletado com sucesso!");
    }catch(err){
      toast.error("Erro! Tente novamente mais tarde");
      console.error(err);
    }finally{
      setLoading(false);
      refetch();
    }
  }

  const renderComentario = (comentario: Comentario) => {
    const isRespondendo = idComentarioRespondendo === comentario.id_comentario;

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

            <AcoesComentario>
              <BotaoAcao onClick={() => setIdComentarioRespondendo(comentario.id_comentario)}>
                Responder
              </BotaoAcao>
            </AcoesComentario>

            {isRespondendo && (
              <FormResposta onSubmit={handleSubmitResposta(onSubmitResposta)}>
                <StyledInputForm
                  name="resposta"
                  type="text"
                  placeholder={`Respondendo a ${comentario.apelido_usuario}...`}
                  register={registerResposta}
                  minLength={8}
                  isRequired
                  autoFocus
                  className="w-full h-8 text-sm"
                />
                <Button type="submit" size="sm">Enviar</Button>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setIdComentarioRespondendo(null)}
                >
                  Cancelar
                </Button>
              </FormResposta>
            )}
          </ComentarioConteudo>
          {user?.id === comentario.id_usuario ? (
            <TrashIcon className="size-6 text-[#FF0000] cursor-pointer self-center" onClick={() => handleDelete(comentario.id_comentario)}/>
          ) : null}
        </ComentarioItemContainer>

        {comentario.respostas && comentario.respostas.length > 0 && (
          <RespostasContainer>
            {comentario.respostas.map(renderComentario)}
          </RespostasContainer>
        )}
      </ComentarioWrapper>
    );
  };

  return (<>
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

        <StyledFooter>
          <form onSubmit={handleSubmit(onSubmit)}>
            <StyledInputForm
              name="comentario"
              type="text"
              placeholder="Digite aqui um comentário..."
              register={register}
              minLength={8}
              isRequired
              className="w-full h-10"
            />
            <Button type="submit">Enviar</Button>
          </form>

          {errors.comentario && <StyledMensagemErro className="self-start">{errors.comentario.message?.toString()}</StyledMensagemErro>}
        </StyledFooter>
      </DialogContent>
    </Dialog>
    {loading && <GlobalLoading/>}
  </>);
};