import {setGlobalOptions} from 'firebase-functions';
import { onRequest } from 'firebase-functions/https';

import admin from 'firebase-admin';
import cors from 'cors';
import express from 'express';
import usuario from './Controller/users.js';
import likes from './Controller/likes.js';
import post from './Controller/posts.js';
import favoritos from './Controller/favorites.js';
import comentarios from './Controller/comments.js';
import imagens from './Controller/images.js';
import chatbot from './Controller/chatbot.js';

admin.initializeApp();
const app = express();
app.use(cors({ origin: "*" }));

app.use(usuario);
app.use(likes);
app.use(post);
app.use(favoritos);
app.use(comentarios);
app.use(imagens);
app.use(chatbot);

setGlobalOptions({maxInstances: 10});

export const api = onRequest(app);