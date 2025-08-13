//Mascaras REGEX 
export const maskEmail = () => {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|org|net|edu|gov|co|io|br|us|ca|uk|de|fr)$/;
}

export const maskPassword = () =>{
    return /^(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
}