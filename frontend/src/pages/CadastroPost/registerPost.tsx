import { useState } from "react";
import { useForm, type FieldValues } from "react-hook-form";
import toast from "react-hot-toast";
import createPost from "../../services/createPost";

import {
  StyledCard,
  StyledCardHeader,
  StyledCardTitle,
  StyledCardContent,
  StyledForm,
  FormGroup,
  StyledLabel,
  LabelWithIcon,
  StyledInput,
  StyledTextarea,
  ErrorMessage,
  StyledButton,
  FileInput,
  ImagePreviewContainer,
  ImagePreview,
  UploadPlaceholder,
  UploadPlaceholderText,
  StyledChefHat,
  StyledClock,
  StyledUploadIcon,
} from "./";

import Header from "../../Components/Header/header";
import GlobalLoading from "../../Components/Loading/globalLoading";
import { useNavigate } from "react-router-dom";

export const RegisterPost = () => {
  const [imagePreview, setImagePreview] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setImageFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };

    reader.readAsDataURL(file);
  };

  const onSubmit = async (data: FieldValues) => {
    try {
      setLoading(true);
      if (!imageFile) {
        toast.error("Selecione uma imagem para continuar!");
        return;
      }

      let user = JSON.parse(localStorage.getItem("user") ?? "{}");

      await createPost({
        idUsuario: user.id,
        tituloPost: data.titulo,
        textoPost: data.texto,
        ingredientesPost: data.ingredientes,
        tempoPost: data.tempo,
        imgFile: imageFile, // <-- FILE real enviado
        statusPost: true,
      });

      toast.success("Receita publicada com sucesso!");

      reset();
      setImagePreview("");
      setImageFile(null);

      navigate("/");
    } catch (err) {
      console.error(err);
      toast.error("Erro ao publicar a receita");
    }finally{
      setLoading(false);
    }
  };

  return (
    <>
      <Header />

      <StyledCard>
        <StyledCardHeader>
          <StyledCardTitle>
            <StyledChefHat />
            Nova Receita
          </StyledCardTitle>
        </StyledCardHeader>

        <StyledCardContent>
          <StyledForm onSubmit={handleSubmit(onSubmit)}>
            <FormGroup>
              <StyledLabel htmlFor="titulo">Título da Receita *</StyledLabel>
              <StyledInput
                id="titulo"
                {...register("titulo")}
                placeholder="Ex: Strogonoff de Carne"
              />
              {errors.titulo && (
                <ErrorMessage>{errors.titulo.message?.toString()}</ErrorMessage>
              )}
            </FormGroup>

            <FormGroup>
              <StyledLabel htmlFor="ingredientes">Ingredientes *</StyledLabel>
              <StyledTextarea
                id="ingredientes"
                {...register("ingredientes")}
                placeholder="1kg de carne, 450g de arroz, 2 dentes de alho..."
                rows={4}
              />
              {errors.ingredientes && (
                <ErrorMessage>
                  {errors.ingredientes.message?.toString()}
                </ErrorMessage>
              )}
            </FormGroup>

            <FormGroup>
              <StyledLabel htmlFor="texto">Modo de Preparo *</StyledLabel>
              <StyledTextarea
                id="texto"
                {...register("texto")}
                placeholder="Passo a passo da sua receita..."
                rows={6}
              />
              {errors.texto && (
                <ErrorMessage>{errors.texto.message?.toString()}</ErrorMessage>
              )}
            </FormGroup>

            <FormGroup>
              <LabelWithIcon htmlFor="tempo">
                <StyledClock />
                Tempo de Preparo *
              </LabelWithIcon>
              <StyledInput
                id="tempo"
                {...register("tempo")}
                placeholder="Ex: 1h 30min"
              />
              {errors.tempo && (
                <ErrorMessage>{errors.tempo.message?.toString()}</ErrorMessage>
              )}
            </FormGroup>

            <FormGroup>
              <StyledLabel htmlFor="imagem">Foto da Receita</StyledLabel>
              <FileInput
                id="imagem"
                accept="image/*"
                {...register("imagem")}
                onChange={handleImageChange}
              />

              {imagePreview ? (
                <ImagePreviewContainer>
                  <ImagePreview src={imagePreview} alt="Preview" />
                </ImagePreviewContainer>
              ) : (
                <UploadPlaceholder>
                  <div>
                    <StyledUploadIcon />
                    <UploadPlaceholderText>
                      Clique acima para adicionar uma foto
                    </UploadPlaceholderText>
                  </div>
                </UploadPlaceholder>
              )}
            </FormGroup>

            <StyledButton type="submit">Publicar Receita</StyledButton>
          </StyledForm>
        </StyledCardContent>
      </StyledCard>

      {loading && <GlobalLoading />}
    </>
  );
};
