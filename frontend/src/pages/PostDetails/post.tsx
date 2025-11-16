import { useParams } from "react-router-dom";
import {
  StyledPostContainer,
  StyledPostCard,
  StyledPostHeader,
  StyledUserInfo,
  StyledUserAvatar,
  StyledUserDetails,
  StyledPostImage,
  StyledPostBody,
  StyledPostMeta,
  StyledCommentsSection,
  StyledCommentList,
  StyledComment,
  StyledCommentAvatar,
  StyledCommentContent,
  StyledCommentAuthor,
  StyledCommentText,
  StyledCommentDate,
  StyledReplies,
} from "./";
import GlobalLoading from "../../Components/Loading/globalLoading";
import Header from "../../Components/Header/header";
import fetchData from "../../services/fetchData";
import { useEffect } from "react";

interface Comment {
  id_comentario: number;
  texto_comentario: string;
  data_comentario: string;
  editado: boolean;
  id_usuario: number;
  nome_usuario: string;
  apelido_usuario: string;
  avatar_usuario: string;
  respostas: Comment[];
}

export const PostDetails = () => {
  const { id } = useParams<{ id: string }>();

  const { data: post, isLoading } = fetchData({
    queryKey: ["postById", id],
    urlParams: `post/lerPostPorId/${id}`,
    enabled: !!id,
  });

  const { data: comments, isLoading: isLoadingComments } = fetchData({
      queryKey: ["commentsByPostId", id],
      urlParams: `comentarios/lerPorPost/${id}`,
      enabled: !!id
  });


  if (!post) return <div>Post não encontrado</div>;

  const renderComments = (commentList: Comment[], isReply = false) => {
    if(!comments) return;
    return commentList.map((comment) => (
      <StyledComment key={comment.id_comentario} isReply={isReply}>
        <StyledCommentAvatar src={comment.avatar_usuario} alt={comment.apelido_usuario} />
        <StyledCommentContent>
          <StyledCommentAuthor>
            <strong>{comment.nome_usuario}</strong>
            <span>@{comment.apelido_usuario}</span>
          </StyledCommentAuthor>
          <StyledCommentText>{comment.texto_comentario}</StyledCommentText>
          <StyledCommentDate>
            {new Date(comment.data_comentario).toLocaleDateString("pt-BR")}
            {comment.editado && " (editado)"}
          </StyledCommentDate>
          {comment.respostas.length > 0 && (
            <StyledReplies>{renderComments(comment.respostas, true)}</StyledReplies>
          )}
        </StyledCommentContent>
      </StyledComment>
    ));
  };

  return (
    <>
      <Header />
      {(isLoading && isLoadingComments) ? <GlobalLoading /> : 
          (<>
            <StyledPostContainer>
                <StyledPostCard>
                <StyledPostHeader>
                    <StyledUserInfo>
                    <StyledUserAvatar src={post[0].avatar_usuario} alt={post[0].apelido_usuario} />
                    <StyledUserDetails>
                        <h3>{post[0].nome_usuario}</h3>
                        <span>@{post[0].apelido_usuario}</span>
                    </StyledUserDetails>
                    </StyledUserInfo>
                </StyledPostHeader>
        
                <StyledPostImage src={post[0].img_post} alt={post[0].titulo_post} />
        
                <StyledPostBody>
                    <h2>{post[0].titulo_post}</h2>
                    <p>{post[0].texto_post}</p>
        
                    {post[0].ingredientes_post && (
                    <div className="ingredientes">
                        <h4>Ingredientes:</h4>
                        <p>{post[0].ingredientes_post}</p>
                    </div>
                    )}
        
                    {post[0].tempo_post && (
                    <StyledPostMeta>
                        <span>⏱️ {post[0].tempo_post}</span>
                    </StyledPostMeta>
                    )}
                    
                </StyledPostBody>
    
                </StyledPostCard>
        
                <StyledCommentsSection>
                <h3>Comentários ({comments?.length})</h3>
                <StyledCommentList>
                    {comments?.length > 0 ? renderComments(comments) : <p>Nenhum comentário ainda</p>}
                </StyledCommentList>
                </StyledCommentsSection>
            </StyledPostContainer>
        </>)
      }
    </>
  );
};
