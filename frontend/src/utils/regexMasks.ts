//Mascaras REGEX 
export const maskEmail = () => {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|org|net|edu|gov|co|io|br|us|ca|uk|de|fr)$/;
}

export const maskPassword = () =>{
    return /^(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
}

export const formatTimeAgo = (dateString: string) => {
    if(!dateString) return "";
  const date = new Date(dateString);
  const diff = Date.now() - date.getTime();

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d atrás`;
  if (hours > 0) return `${hours}h atrás`;
  if (minutes > 0) return `${minutes}m atrás`;
  return `${seconds}s atrás`;
};

export function formatMaskCellphone(value: string): string {
  if (!value) return "";

  // Mantém só números
  const digits = value.replace(/\D/g, "").slice(0, 11); // limita a 11 dígitos

  // (DD) 9XXXX-XXXX
  if (digits.length <= 2) {
    return `(${digits}`;
  }
  if (digits.length <= 7) {
    return `(${digits.substring(0, 2)}) ${digits.substring(2)}`;
  }
  if (digits.length <= 11) {
    return `(${digits.substring(0, 2)}) ${digits.substring(2, 7)}-${digits.substring(7)}`;
  }

  return value;
};

export function formatMaskCPF(value: string): string {
  if (!value) return "";

  const digits = value.replace(/\D/g, "").slice(0, 11);

  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
}

export function isValidCPF(cpf: string): boolean {
  if (!cpf) return false;

  const digits = cpf.replace(/\D/g, "");

  if (digits.length !== 11) return false;

  const invalids = [
    "00000000000",
    "11111111111",
    "22222222222",
    "33333333333",
    "44444444444",
    "55555555555",
    "66666666666",
    "77777777777",
    "88888888888",
    "99999999999"
  ];
  if (invalids.includes(digits)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(digits[i]) * (10 - i);
  }

  let firstCheckDigit = sum % 11;
  firstCheckDigit = firstCheckDigit < 2 ? 0 : 11 - firstCheckDigit;

  if (firstCheckDigit !== parseInt(digits[9])) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(digits[i]) * (11 - i);
  }

  let secondCheckDigit = sum % 11;
  secondCheckDigit = secondCheckDigit < 2 ? 0 : 11 - secondCheckDigit;

  if (secondCheckDigit !== parseInt(digits[10])) return false;

  return true;
}