import { useState } from 'react';
import { callGroq } from '../../services/callGroq';
import { useForm } from 'react-hook-form';
import { ArrowUpIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import Loading from '../../Components/Loading/loading';
import Header from '../../Components/Header/header';
import botIcon from '../../assets/img/bot.svg';
import { StyledTextArea } from '../../globals/inputs';
import { StyledButton } from '../../globals/buttons';
import { StyledSectionChat } from './';
const ChatBot = () => {
  const [ perguntas, setPerguntas ] = useState<string[]>([]);
  const [ loading, setLoading ] = useState(false);
  const [ response, setResponse ] = useState('');
  const { register, handleSubmit, reset, watch, formState:  { errors } } = useForm();
  const caracteres = watch('textarea');

  //Remover o any tipando corretamente dps
  const handleSend = async () => {
    try{
      setLoading(true);
      const reply = await callGroq(caracteres);
      setResponse(reply);
      setPerguntas([
        ...perguntas, caracteres
      ]);
      reset();
    }catch(e){
      toast.error("Erro interno com o servidor. Tente novamente mais tarde");
    }
    finally{
      setLoading(false);
    }
  };

  return (<>
    <Header/>
    <StyledSectionChat 
     className="section-chat py-4 pt-24 px-16 flex items-center flex-col-reverse"
    >
      
      <form 
        className="flex gap-x-8 w-full justify-center items-center absolute bottom-0" 
        onSubmit={handleSubmit(handleSend)}
       >
        <span 
          className={`${caracteres?.length >= 255 ? '!text-red-500' : ''}`}
        >
          {caracteres?.length}/255
        </span>
        <StyledTextArea
         name="textarea"
         placeholder="Digite sua pergunta..."
         register={register}
         minLength={10}
         maxLength={255}
         isRequired
         className="rounded-lg w-80 p-2"
        />
        <StyledButton 
         variant="outline" 
         type="submit" 
         className={`h-10 cursor-pointer ${loading || errors.textarea ? 'disabled' : ''} rounded-full`}
        >
            <ArrowUpIcon className="size-4"/>
        </StyledButton>
      </form>

      <div className="container-chat">
        {perguntas.length <= 0 && (
            <aside className="container-bot flex flex-col justify-center items-center">
              <img src={botIcon}/>
              <p>Posso ajudar hoje?</p>
            </aside>
          )
        }
        {loading ? (
          <Loading/>
        ) : (<>

            { perguntas?.map(pergunta => (
              <div key={pergunta}>
                <div className="container-resposta">
                  <p>{response}</p>
                </div>

                <div className="container-pergunta">
                  <p>{pergunta}</p>
                </div>
              </div>
            )) }
        </>)}
      </div>
    </StyledSectionChat>
  </>);
};

export default ChatBot;