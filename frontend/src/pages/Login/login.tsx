import Header from "../../components/Header/header";

import logo from '../../assets/img/logo-preto.svg';
import login from '../../assets/img/login.jpg';
import gooogle from '../../assets/img/google.svg';
import { Button } from "../../components/ui/button";
import Input from "../../components/Input/input";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export const Login = () =>{
    const { user, signInWithGoogle } = useAuth();
    const navigate = useNavigate();
    
    const handleLoginGoogle = async() =>{

        if(!user){
            return await signInWithGoogle();
        }
        navigate('/');

    }
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) =>{
        event.preventDefault();
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
         className="flex flex-col justify-center items-center w-1/2"
        >
            <div className="flex flex-col gap-y-4 w-80">
                <img src={logo} alt="imagem logo"/>

                <Button 
                 className="text-(--cor-branco) bg-[#EA4335] hover:bg-[#EA4335]/80 transition-all duration-200 ease-out cursor-pointer h-10"
                 onClick={handleLoginGoogle}
                 >
                    <img src={gooogle} alt="imagem google"/>
                    <p>Entrar com o Google</p>
                </Button>

                <div 
                 className="w-full flex items-center before:content[''] before:flex-1 before:h-px before:bg-gray-300 before:mr-3 after:content[''] after:flex-1 after:h-px after:bg-gray-300 after:ml-3">
                    <p>Ou entre com o seu login</p>
                </div>

                <form
                 className="flex flex-col gap-y-4"
                 onSubmit={(e) => handleSubmit(e)}
                >
                    <Input 
                     type="email"
                     placeholder="Digite seu email"
                     className=""
                    />

                    <Input
                     type="password"
                     placeholder="Digite sua senha"
                    />

                    <Input
                     type="submit"
                     value="Logar"
                    />
                </form>
            </div>
        </main>
    </section>

    </>)
};
