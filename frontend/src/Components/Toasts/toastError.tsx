import { Toaster } from 'react-hot-toast';

const ToastError = () =>{
    return(
        <Toaster
          position='top-right'
          toastOptions={{
            style:{
                background: '#333',
                color: '#FFF'
            }
          }}
        />
    )
}

export default ToastError;