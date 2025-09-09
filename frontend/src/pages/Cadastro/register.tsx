import Header from "../../components/Header/header";
import logo from '../../assets/img/logo-preto.svg';
import Input from "../../components/Input/input";
import { useForm, type FieldValues } from "react-hook-form";
import './register.scss';
import { Link } from "react-router-dom";

const Register = () =>{
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = (data: FieldValues) =>{
        console.log(data)
    }

    return(<>
    <Header/>
    <section
        className="section-register flex justify-center items-center p-(--espacamento-padrao)"
    >
        <aside
            className="flex flex-col justify-center gap-y-4 w-80"
        >
            <img src={logo} alt="imagem cadastro" className="mb-4"/>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-4">
                <label htmlFor="nome" className="flex flex-col">
                    Nome
                    <Input
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
                    <Input
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
                    <Input
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
                    <Input 
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
                    <Input
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
                    <Input 
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
                    <Input
                        placeholder="Exemplo, vai virar um input de imagem depois"
                        className="input-form h-10"
                        register={register}
                        minLength={10}
                        name="avatar"
                        isRequired
                    />
                </label>
                
                <p>Já tem conta ou quer se logar pelo Google? <Link to="/login">Clique aqui</Link></p>
            </form>

        </aside>

    </section>
    </>)
};

export default Register;