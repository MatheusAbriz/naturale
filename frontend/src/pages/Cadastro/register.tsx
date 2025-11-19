import Header from "../../Components/Header/header";
import { useForm, type FieldValues } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { StyledInputForm } from "../../globals/inputs";
import { StyledSectionRegister } from "./";
import { StyledButton } from "../../globals/buttons";
import { TextNormal, TextTitle } from "../../globals/texts";
import { StyledMensagemErro } from "../../globals/utils";
import toast from "react-hot-toast";
import type { User, UserCreateDTO } from "../../types/types";
import { UserEnums } from "../../enums/userEnums";
import GlobalLoading from "../../Components/Loading/globalLoading";
import { useState } from "react";
import createUser from "../../services/createUser";
import { useAuth } from "../../hooks/useAuth";
import { FileInput, ImagePreview, ImagePreviewContainer, StyledUploadIcon, UploadPlaceholder, UploadPlaceholderText } from "../CadastroPost";
import { isValidCPF } from "../../utils/regexMasks";

const Register = () => {
  const { signInWithEmailAndPassword } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const navigate = useNavigate();

  const onSubmit = async (data: FieldValues) => {
    if (data.password !== data.confirmarSenha) {
      toast.error("As senhas não coincidem");
      return;
    }
    
    if(!isValidCPF(data.cpf)){
      toast.error("CPF inválido");
      return;
    };

    const avatarFile = data.avatar?.[0] ?? null;
    const user: UserCreateDTO = {
      nome: data.nome,
      apelido: data.apelido,
      telefone: data.telefone,
      cpf: data.cpf,
      email: data.email,
      senha: data.password,
      avatar: avatarFile,
      tipo: UserEnums.USER
    };

    try {
      setLoading(true);

      const res = await createUser(user);

      const userDTO: User = {
        id: res[0].id_usuario,
        email: res[0].email_usuario,
        apelido: res[0].apelido_usuario,
        tipo_usuario: res[0].tipo_usuario,
        avatar: res[0].avatar_usuario,
        token: res.token
      };

      await signInWithEmailAndPassword(userDTO);

      toast.success("Usuário criado com sucesso!");
      navigate("/");

    } catch (e) {
      toast.error(`Erro ao cadastrar usuário: ${e}`);
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <>
      <Header />
      <StyledSectionRegister className="flex justify-center items-center">
        <aside className="flex flex-col justify-center items-center">
          <TextTitle>Criar conta</TextTitle>
          <TextNormal $color="#9e9b9b">
            Preencha os dados para criar sua conta
          </TextNormal>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-4 mt-4 w-180">

            {/* Nome */}
            <div>
              <label htmlFor="nome" className="flex flex-col">Nome</label>
              <StyledInputForm
                placeholder="Digite seu nome completo..."
                name="nome"
                className="input-form h-10 w-full"
                minLength={6}
                register={register}
                isRequired
              />
              {errors.nome && <StyledMensagemErro>{errors.nome.message?.toString()}</StyledMensagemErro>}
            </div>

            {/* Apelido */}
            <div>
              <label className="flex flex-col">Username</label>
              <StyledInputForm
                placeholder="mathekkjk"
                name="apelido"
                className="input-form h-10 w-full"
                minLength={6}
                maxLength={16}
                register={register}
                isRequired
              />
              {errors.apelido && <StyledMensagemErro>{errors.apelido.message?.toString()}</StyledMensagemErro>}
            </div>

            {/* Telefone */}
            <div>
              <label className="flex flex-col">Telefone</label>
              <StyledInputForm
                placeholder="(xx) xxxxx-xxxx"
                name="telefone"
                maskType="phone"
                className="input-form h-10 w-full"
                minLength={15}
                maxLength={15}
                register={register}
                isRequired
              />
              {errors.telefone && <StyledMensagemErro>{errors.telefone.message?.toString()}</StyledMensagemErro>}
            </div>

            {/* CPF */}
            <div>
              <label className="flex flex-col">CPF</label>
              <StyledInputForm
                placeholder="xxx.xxx.xxx-xx"
                name="cpf"
                maskType="cpf"
                minLength={14}
                maxLength={14}
                className="input-form h-10 w-full"
                register={register}
                isRequired
              />
              {errors.cpf && <StyledMensagemErro>{errors.cpf.message?.toString()}</StyledMensagemErro>}
            </div>

            {/* Email */}
            <div>
              <label className="flex flex-col">Email</label>
              <StyledInputForm
                placeholder="email@gmail.com"
                minLength={8}
                name="email"
                type="email"
                register={register}
                isRequired
                className="w-full h-10"
              />
              {errors.email && <StyledMensagemErro>{errors.email.message?.toString()}</StyledMensagemErro>}
            </div>

            {/* Senha */}
            <div>
              <label className="flex flex-col">Senha</label>
              <StyledInputForm
                placeholder="******"
                minLength={6}
                name="password"
                type="password"
                register={register}
                isRequired
                className="w-full h-10"
              />
            </div>

            {/* Confirmar senha */}
            <div>
              <label className="flex flex-col">Confirmar Senha</label>
              <StyledInputForm
                placeholder="******"
                minLength={6}
                name="confirmarSenha"
                type="password"
                register={register}
                isRequired
                className="w-full h-10"
              />
            </div>

            {/* Avatar */}
            <div>
              <label className="flex flex-col">Avatar</label>
              <FileInput
                id="imagem"
                accept="image/*"
                {...register("avatar")}
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
                      </div>

            <StyledButton type="submit" className="mt-2">
              Cadastrar
            </StyledButton>

            <p className="text-center mt-1">
              Já tem conta? <Link to="/login">Clique aqui</Link>
            </p>
          </form>
        </aside>

        {loading && <GlobalLoading />}
      </StyledSectionRegister>
    </>
  );
};

export default Register;
