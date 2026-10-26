import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
});

export const RegisterSchema = z.object({
  name: z.string().min(3, "Nome muito curto"),

  username: z.string().optional(),

  phone: z.string().min(8, "Telefone inválido"),

  cpf: z.string().min(11, "CPF inválido"),

  email: z.string().email("Email inválido"),

  password: z.string().min(
    6,
    "Senha deve ter pelo menos 6 caracteres"
  ),

  type: z.string(),

  avatar: z.string()
});