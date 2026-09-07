import {setGlobalOptions} from 'firebase-functions';
import { onRequest } from 'firebase-functions/https';

import admin from 'firebase-admin';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet'; // 1. Importar as bibliotecas de proteção
import rateLimit from 'express-rate-limit';

import usuario from './Controller/users.js';
import likes from './Controller/likes.js';
import post from './Controller/posts.js';
import favoritos from './Controller/favorites.js';
import comentarios from './Controller/comments.js';
import imagens from './Controller/images.js';
import chatbot from './Controller/chatbot.js';

admin.initializeApp();
const app = express();

// HARDENING: Necessário para o rate-limit ler o IP real do cliente no Firebase
app.set('trust proxy', 1); 

// HARDENING: Adiciona cabeçalhos HTTP seguros para mitigar ataques comuns
app.use(helmet()); 

app.use(cors({ origin: "*" }));
app.use(express.json()); // Garante o parse de JSON de forma explícita

// HARDENING: Limitador global para evitar ataques DoS/Força Bruta (máx 100 requisições a cada 15 min)
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 100, 
    message: { message: 'Muitas requisições vindas deste IP, tente novamente mais tarde.' },
    standardHeaders: true,
    legacyHeaders: false,
});
app.use(globalLimiter);

// Rotas da Aplicação
app.use(usuario);
app.use(likes);
app.use(post);
app.use(favoritos);
app.use(comentarios);
app.use(imagens);
app.use(chatbot);

setGlobalOptions({maxInstances: 10});

export const api = onRequest(app);
