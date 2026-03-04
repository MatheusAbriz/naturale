import Header from "../../Components/Header/header";
import { useForm, type FieldValues } from "react-hook-form";
import { Link } from "react-router-dom";
import { StyledInputForm } from "../../globals/inputs";
import { StyledSectionRegister } from "./";
import { StyledButton } from "../../globals/buttons";
import { TextNormal, TextSmall, TextTitle } from "../../globals/texts";

const Register = () =>{
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = (data: FieldValues) =>{
        console.log(data)
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

                <StyledButton
                    type="submit"
                    className="mt-2"
                >
                    Cadastrar
                </StyledButton>
                
                <p>Já tem conta ou quer se logar pelo Google? <Link to="/login">Clique aqui</Link></p>
            </form>

        </aside>

    </StyledSectionRegister>
    </>)
};

export default Register;