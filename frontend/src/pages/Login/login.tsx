import Header from "../../components/Header/header";
import toast from "react-hot-toast";

import logo from '../../assets/img/logo-preto.svg';
import login from '../../assets/img/login.jpg';
import gooogle from '../../assets/img/google.svg';
import { Button } from "../../components/ui/button";
import Input from "../../components/Input/input";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import './login.scss';
import loginImg from '../../assets/img/login.svg';
import { useForm, type FieldValues } from 'react-hook-form';
import useLogin from "../../hooks/useLogin";

export const Login = () =>{
    const { user, signInWithGoogle, signInWithEmailAndPassword } = useAuth();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const { mutateAsync: loginUser, isLoading } = useLogin();
    const handleLoginGoogle = async() =>{

        if(!user){
            return await signInWithGoogle();
        }
        navigate('/');
    }


    const handleLoginWithEmail = async(data: FieldValues) =>{
        const { email, password } = data
        //Simulando um try catch
        try{
            const res = await loginUser({ email, senha: password });
            
            //Formatando o res
            const user = {
                id: res[0].id_usuario,
                nome: res[0].nome_usuario,
                email: res[0].email_usuario, 
            }

            await signInWithEmailAndPassword(user);
            toast.success("Usuário logado com sucesso");
            navigate('/');
        }catch(e){
            toast.error("Erro ao logar");
        }
        
    }

    return(<>
    <Header/>
    <section
     className="section-login p-(--espacamento-padrao) flex justify-center items-center gap-x-8"
    >
        <aside
         className="flex flex-col justify-center gap-y-4 w-1/2 p-4"
        >
            <img src={login} alt="login imagem"/>
        </aside>

        <main
         className="main-content flex flex-col justify-center items-center w-1/2"
        >
            <div className="flex flex-col gap-y-4 w-80">
                <img src={logo} alt="imagem logo" className="mb-4"/>

                <Button 
                 className="text-(--cor-branco) cursor-pointer h-10 google-button"
                 onClick={handleLoginGoogle}
                 >
                    <img src={gooogle} alt="imagem google"/>
                    <p>Entrar com o Google</p>
                </Button>

                <div 
                 className="separator">
                    <p>Ou entre com o seu login</p>
                </div>

                <form
                 className="flex flex-col gap-y-4"
                 onSubmit={handleSubmit(handleLoginWithEmail)}
                >

                    <div className="flex flex-col">
                        <Input 
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
                        <Input
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
                        <Button
                         type="submit"
                         className="input-submit h-10 cursor-pointer w-full"
                        >
                            <img src={loginImg} alt="logar"/>
                            <p>Logar</p>

                        </Button>
                    </div>

                    <p>Não tem conta? <span className="cursor-pointer">Clique aqui</span> e crie uma</p>
                    
                </form>
            </div>
            {isLoading && <div>Carregando...</div>}
        </main>
    </section>

    </>)
};
