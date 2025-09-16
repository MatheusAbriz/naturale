import Header from "../../Components/Header/header";
import toast from "react-hot-toast";

import logo from '../../assets/img/logo-preto.svg';
import login from '../../assets/img/formulario_login.png';
import { useAuth } from "../../hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";
import loginImg from '../../assets/img/login.svg';
import { useForm, type FieldValues } from 'react-hook-form';
import useLogin from "../../hooks/useLogin";
import type { UserLoginDTO } from "../../types/types";
import type { UserEnums } from "../../enums/userEnums";
import { StyledInputForm } from "../../globals/inputs";
import { StyledButton } from "../../globals/buttons";
import { StyledSectionLogin } from "@/pages/Login/index";
import Loading from "../../Components/Loading/loading";
import { useState } from "react";
import GlobalLoading from "../../Components/Loading/globalLoading";

export const Login = () =>{
    const { user, signInWithEmailAndPassword } = useAuth();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const { mutateAsync: loginUser, isLoading } = useLogin();
    const [ loading, setLoading ] = useState(false);

    const handleLoginWithEmail = async(data: FieldValues) =>{
        const { email, password } = data
        const userLogin : UserLoginDTO = {
            email: email,
            senha: password
        }
        //Simulando um try catch
        try{
            setLoading(true);
            const res = await loginUser(userLogin);
            
            //Formatando o res
            const user = {
                id: res[0].id_usuario as number,
                nome: res[0].nome_usuario as string,
                email: res[0].email_usuario as string,
                tipo_usuario: res[0].tipo_usuario as UserEnums,
                avatar: res[0].avatar as string || null
            }

            await signInWithEmailAndPassword(user);
            toast.success("Usuário logado com sucesso");
            navigate('/');
        }catch(e){
            toast.error("Erro ao logar");
        }finally{
            setLoading(false);
        }
        
    }

    return(<>
    <Header/>
    <StyledSectionLogin
     className="flex justify-center items-center gap-x-8"
    >
        <aside
         className="flex flex-col justify-center gap-y-4 w-1/2 "
        >
            <img src={login} alt="login imagem"/>
        </aside>

        <main
         className="main-content flex flex-col justify-center items-center w-1/2 p-(--espacamento-padrao)"
        >
            <div className="flex flex-col gap-y-4 w-80">
                <img src={logo} alt="imagem logo" className="mb-4"/>

                <form
                 className="flex flex-col gap-y-4"
                 onSubmit={handleSubmit(handleLoginWithEmail)}
                >

                    <div className="flex flex-col">
                        <StyledInputForm 
                         placeholder="nome@gmail.com"
                         className="input-form h-10"
                         register={register}
                         minLength={6}
                         maskType="email"
                         type="email"
                         name="email"
                         isRequired
                        />
                        {errors.email && <span className="mensagem-erro">{errors.email.message?.toString()}</span>}
                    </div>
                    
                    <div className="flex flex-col">
                        <StyledInputForm
                         placeholder="digite sua senha"
                         className="input-form h-10"
                         register={register}
                         minLength={6}
                         name="password"
                         type="password"
                         maskType="password"
                         isRequired
                        />
                        {errors.password && <span className="mensagem-erro">{errors.password.message?.toString()}</span>}
                    </div>
                   

                    <div className="flex items-center justify-center">
                        <StyledButton
                         type="submit"
                         className={`input-submit h-10 cursor-pointer w-full ${isLoading ? 'disabled' : ''}`}
                         disabled={isLoading}
                        >
                            <img src={loginImg} alt="logar"/>
                            <p>Logar</p>

                        </StyledButton>
                    </div>

                    <p>Não tem conta? <Link to="/register" className="cursor-pointer">Clique aqui</Link> e crie uma</p>
                    
                    {loading && <GlobalLoading/>}
                </form>
            </div>
        </main>
    </StyledSectionLogin>

    </>)
};
