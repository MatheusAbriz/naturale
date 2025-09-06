import {setGlobalOptions} from 'firebase-functions';
import { onRequest } from 'firebase-functions/https';
import admin from 'firebase-admin';
import cors from 'cors';
import express from 'express';
import usuario from './Controller/usuarioController.js';
import likes from './Controller/likesController.js';
import post from './Controller/postController.js';

admin.initializeApp();
const app = express();
app.use(cors({ origin: "*" }));

app.use(usuario);
app.use(likes);
app.use(post);

setGlobalOptions({maxInstances: 10});

export const api = onRequest(app);