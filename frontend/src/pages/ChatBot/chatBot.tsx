import { useEffect, useState } from 'react';
import { callGroq } from '../../services/callGroq';
import './chatBot.scss';
import { Button } from '../../components/ui/button';
import TextArea from '../../components/Input/textArea';
import { useForm } from 'react-hook-form';
import { ArrowUpIcon } from '@heroicons/react/24/outline';

const ChatBot = () => {
  const [input, setInput] = useState('');
  //const [ caracteres, setCaracteres ] = useState(0);
  const [ loading, setLoading ] = useState(false);
  const [response, setResponse] = useState('');
  const { register, handleSubmit, watch, formState:  { errors } } = useForm();
  const caracteres = watch('textarea');

  //Remover o any tipando corretamente dps
  const handleSend = async (data: any) => {
    //const reply = await callGroq(input);
    //setResponse(reply);
    console.log("Clicked", data)
  };

  return (
    <section 
     className="section-chat py-4 px-16 flex justify-start items-center flex-col-reverse"
    >
      
      <form 
        className="flex gap-x-8 w-full justify-center items-center" 
        onSubmit={handleSubmit(handleSend)}
       >
        <span 
          className={`${caracteres?.length >= 255 ? '!text-red-500' : ''}`}
        >
          {caracteres?.length}/255
        </span>
        <TextArea
         name="textarea"
         placeholder="Digite sua pergunta..."
         onChange={(e) => setInput(e.target.value)}
         register={register}
         minLength={10}
         maxLength={255}
         isRequired
         className="rounded-lg w-80 p-2"
        />
        {errors.textarea && <span>{errors.textarea.message?.toString()}</span>}
        <Button 
         variant="outline" 
         type="submit" 
         className={`h-10 cursor-pointer ${loading ? 'disabled' : ''} rounded-full`}
        >
            <ArrowUpIcon className="size-4"/>
        </Button>
      </form>

      <div className="container-resposta">
        <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Assumenda, magni, architecto labore odio inventore rem, explicabo exercitationem aut similique harum laborum modi ipsam minima! Adipisci consequuntur libero fugiat mollitia saepe?</p>
        <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Rem quae reiciendis ipsam nihil animi expedita, beatae sapiente ea ipsa, dicta laudantium odio laboriosam facilis aspernatur, dolorum optio officia? Dolor, expedita.</p>
        <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Placeat vel omnis soluta, qui ab cum libero excepturi officia modi veniam doloremque quidem aperiam debitis voluptates similique architecto minus est totam.</p>
      </div>
      
      {/*
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Digite os ingredientes..."
      />
      <button onClick={handleSend}>Enviar</button>
      <div>
        <h3>Resposta:</h3>
        <p>{response}</p>
      </div>
      */}
    </section>
  );
};

export default ChatBot;