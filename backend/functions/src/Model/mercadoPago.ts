import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN;

if (!MP_ACCESS_TOKEN) {
  throw new Error("ERRO CRÍTICO DE CONFIGURAÇÃO: A variável de ambiente MP_ACCESS_TOKEN não foi definida!");
}

const mercadoPago = axios.create({
  baseURL: 'https://api.mercadopago.com',
  headers: {
    Authorization: `Bearer ${MP_ACCESS_TOKEN}`,
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

export default mercadoPago;
