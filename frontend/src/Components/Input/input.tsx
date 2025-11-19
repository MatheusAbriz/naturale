import { formatMaskCellphone, formatMaskCPF, maskEmail, maskPassword } from "../../utils/regexMasks";
import type { InputProps } from "../../types/types";
import React from "react";

const emailRegex = maskEmail();
const passwordRegex = maskPassword();

const Input = ({ name, maskType, minLength, maxLength = 255, register, isRequired, ...rest }: InputProps) => {
  // Define pattern somente para email e password
  const pattern =
    maskType === "email"
      ? { value: emailRegex, message: "Email inválido" }
      : maskType === "password"
      ? {
          value: passwordRegex,
          message:
            "Senha inválida. Inclua ao menos 1 letra minúscula, uma maiúscula e um caractere especial",
        }
      : undefined;

  // Define type automaticamente, exceto se vier via rest
  const inferredType =
    rest.type ??
    (maskType === "password"
      ? "password"
      : maskType === "phone"
      ? "tel"
      : "text");

  // Funções de máscara
  const applyCellphoneMask = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.target.value = formatMaskCellphone(e.target.value);
  };

  const applyCPFMask = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.target.value = formatMaskCPF(e.target.value);
  };

  // Configurações do register
  const registerOptions: Parameters<typeof register>[1] = {
    required: isRequired ? "Campo obrigatorio" : "",
    minLength: minLength
      ? { value: minLength, message: `Mínimo de ${minLength} caracteres` }
      : undefined,
    maxLength: { value: maxLength, message: `Máximo de ${maxLength} caracteres` },
    pattern,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      // Aplica a máscara correspondente
      if (maskType === "phone") applyCellphoneMask(e);
      if (maskType === "cpf") applyCPFMask(e);

      // Reexecuta o onChange externo caso tenha sido passado
      const externalOnChange = (rest as any).onChange;
      if (typeof externalOnChange === "function") {
        externalOnChange(e);
      }
    },
  };

  return (
    <input
      {...register(name, registerOptions)}
      {...rest}
      type={inferredType}
    />
  );
};

export default Input;
