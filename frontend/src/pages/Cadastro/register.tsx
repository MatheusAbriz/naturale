import Header from "../../Components/Header/header";
import { set, useForm, type FieldValues } from "react-hook-form";
import { Link, useNavigate, useNavigation } from "react-router-dom";
import { StyledInputForm } from "../../globals/inputs";
import { StyledSectionRegister } from "./";
import { StyledButton } from "../../globals/buttons";
import { TextNormal, TextSmall, TextTitle } from "../../globals/texts";
import { StyledMensagemErro } from "../../globals/utils";
import toast from "react-hot-toast";
import type { User, UserCreateDTO } from "../../types/types";
import { UserEnums } from "../../enums/userEnums";
import GlobalLoading from "../../Components/Loading/globalLoading";
import { useState } from "react";
import createUser from "../../services/createUser";
import { useAuth } from "../../hooks/useAuth";

const Register = () =>{
    const { signInWithEmailAndPassword } = useAuth();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [ loading, setLoading ] = useState(false);
    const navigate = useNavigate()

    const onSubmit = async(data: FieldValues) =>{
        if(data.password !== data.confirmarSenha){
            toast.error("As senhas não coincidem");
            return;
        }

        let user: UserCreateDTO = {
            nome: data.nome,
            apelido: data.apelido,
            telefone: data.telefone,
            cpf: data.cpf,
            email: data.email,
            senha: data.password,
            avatar: data.avatar,
            tipo: UserEnums.USER
        }
        
        try{
            setLoading(true);
            const res = await createUser(user);

            const userDTO: User = {
                id: res[0].id_usuario as number,
                email: res[0].email_usuario as string,
                apelido: res[0].apelido_usuario as string,
                tipo_usuario: res[0].tipo_usuario as UserEnums,
                avatar: res[0].avatar as string || null,
                token: res.token as string
            } 
            console.log(userDTO)

            await signInWithEmailAndPassword(userDTO);
            toast.success("Usuário criado com sucesso!");
            navigate('/')

        }catch(e){
            toast.error(`Erro ao cadastrar usuário ${e}`);
        }finally{
            setLoading(false);
        }

    }

    return(<>
    <Header/>
    <StyledSectionRegister
        className="flex justify-center items-center"
    >
        <aside
            className="flex flex-col justify-center items-center"
        >
            <TextTitle>Criar conta</TextTitle>
            <TextNormal $color="#9e9b9b">Preencha os dados para criar sua conta</TextNormal>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-4 mt-4">
                <div>
                    <label htmlFor="nome" className="flex flex-col">
                        Nome
                        <StyledInputForm
                            placeholder="Digite seu nome completo..."
                            name="nome"
                            className="input-form h-10"
                            minLength={6}
                            register={register}
                            isRequired
                        />
                    </label>
                    {errors.nome && <StyledMensagemErro>{errors.nome.message?.toString()}</StyledMensagemErro>}
                </div>

                <div>
                    <label htmlFor="apelido" className="flex flex-col">
                        Username
                        <StyledInputForm
                            placeholder="mathekkjk"
                            name="apelido"
                            className="input-form h-10"
                            minLength={6}
                            maxLength={16}
                            register={register}
                            isRequired
                        />
                    </label>
                    {errors.apelido && <StyledMensagemErro>{errors.apelido.message?.toString()}</StyledMensagemErro>}
                </div>
                
                <div>
                    <label htmlFor="telefone" className="flex flex-col">
                        Telefone
                        <StyledInputForm
                            placeholder="(xx) xxxxx-xxxx"
                            name="telefone"
                            className="input-form h-10"
                            minLength={15}
                            maxLength={15}
                            register={register}
                            isRequired
                        />
                    </label>
                    {errors.telefone && <StyledMensagemErro>{errors.telefone.message?.toString()}</StyledMensagemErro>}
                </div>

                <div>

                    <label htmlFor="cpf" className="flex flex-col">
                        CPF
                        <StyledInputForm 
                            placeholder="xxx.xxx.xxx-xx"
                            name="cpf"
                            className="input-form h-10"
                            minLength={11}
                            maxLength={11}
                            register={register}
                            isRequired
                        />
                    </label>
                    {errors.cpf && <StyledMensagemErro>{errors.cpf.message?.toString()}</StyledMensagemErro>}
                </div>

                <div>

                    <label htmlFor="email" className="flex flex-col">
                        Email
                        <StyledInputForm
                            placeholder="email@gmail.com"
                            name="email"
                            type="email"
                            minLength={10}
                            maskType="email"
                            className="input-form h-10"
                            register={register}
                            isRequired
                        />
                    </label>
                    {errors.email && <StyledMensagemErro>{errors.email.message?.toString()}</StyledMensagemErro>}
                </div>

                <div>
                    <label htmlFor="senha" className="flex flex-col">
                        Senha
                        <StyledInputForm 
                            placeholder="******"
                            className="input-form h-10"
                            register={register}
                            minLength={6}
                            name="password"
                            type="password"
                            maskType="password"
                            isRequired
                        />
                    </label>
                    {errors.password && <StyledMensagemErro>{errors.password.message?.toString()}</StyledMensagemErro>}
                </div>

                <div>
                    <label htmlFor="confirmarSenha" className="flex flex-col">
                        Confirmar Senha
                        <StyledInputForm
                            placeholder="******"
                            className="input-form h-10"
                            register={register}
                            minLength={6}
                            name="confirmarSenha"
                            type="password"
                            maskType="password"
                            isRequired
                        />
                    </label>
                    {errors.confirmarSenha && <StyledMensagemErro>{errors.confirmarSenha.message?.toString()}</StyledMensagemErro>}
                </div>

                <div>
                    <label htmlFor="avatar" className="flex flex-col">
                        Avatar
                        <StyledInputForm
                            placeholder="Exemplo, vai virar um input de imagem depois"
                            className="input-form h-10"
                            register={register}
                            minLength={10}
                            name="avatar"
                            isRequired
                        />
                    </label>
                    {errors.avatar && <StyledMensagemErro>{errors.avatar.message?.toString()}</StyledMensagemErro>}
                </div>

                <StyledButton
                    type="submit"
                    className="mt-2"
                >
                    Cadastrar
                </StyledButton>
                
                <p>Já tem conta ou quer se logar pelo Google? <Link to="/login">Clique aqui</Link></p>
            </form>
        </aside>

        {loading && <GlobalLoading/>}
    </StyledSectionRegister>
    </>)
};

export default Register;