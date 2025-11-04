import express from 'express';
import {
    lerComentariosPorPost,
    adicionarComentario,
    editarComentario,
    excluirComentario,
    adicionarResposta,
    lerRespostasPorComentario,
    editarResposta,
    excluirResposta
} from '../Service/comentariosService.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();
router.use(express.json());

// Ler todos os comentários de um post
router.get('/comentarios/lerPorPost/:idPost', verifyToken, (req, res) => {
    lerComentariosPorPost(req.params.idPost).then(resultado => {
        if (resultado.status) {
            return res.status(200).send(JSON.stringify(resultado.msg));
        } else {
            return res.status(400).send(resultado.msg);
        }
    });
});

// Adicionar comentário
router.post('/comentarios/adicionar', verifyToken, (req, res) => {
    const { id_usuario, id_post, texto_comentario } = req.body;

    if (!id_usuario || !id_post || !texto_comentario) {
        return res.status(400).send("Campos obrigatórios não preenchidos");
    }

    adicionarComentario(id_usuario, id_post, texto_comentario).then(resultado => {
        if (resultado.status) {
            return res.status(201).send(JSON.stringify(resultado.msg));
        } else {
            return res.status(400).send(resultado.msg);
        }
    });
});

// Editar comentário
router.patch('/comentarios/editar/:idComentario', verifyToken, (req, res) => {
    const { texto_comentario } = req.body;

    if (!texto_comentario) {
        return res.status(400).send("Texto do comentário é obrigatório");
    }

    editarComentario(req.params.idComentario, texto_comentario).then(resultado => {
        if (resultado.status) {
            return res.status(200).send(JSON.stringify(resultado.msg));
        } else {
            return res.status(400).send(resultado.msg);
        }
    });
});

// Excluir comentário
router.delete('/comentarios/excluir/:idComentario', verifyToken, (req, res) => {
    excluirComentario(req.params.idComentario).then(resultado => {
        if (resultado.status) {
            return res.status(200).send(resultado.msg);
        } else {
            return res.status(400).send(resultado.msg);
        }
    });
});

// Adicionar resposta
router.post('/comentarios/responder', verifyToken, (req, res) => {
    const { id_post, id_usuario, texto_comentario, id_comentario_pai } = req.body;

    if (!id_post || !id_usuario || !texto_comentario || !id_comentario_pai) {
        return res.status(400).send("Campos obrigatórios não preenchidos");
    }

    adicionarResposta(id_post, id_usuario, texto_comentario, id_comentario_pai).then(resultado => {
        if (resultado.status) {
            return res.status(201).send(JSON.stringify(resultado.msg));
        } else {
            return res.status(400).send(resultado.msg);
        }
    });
});

// Listar respostas de um comentário
router.get('/comentarios/respostas/:idComentarioPai', verifyToken, (req, res) => {
    lerRespostasPorComentario(req.params.idComentarioPai).then(resultado => {
        if (resultado.status) {
            return res.status(200).send(JSON.stringify(resultado.msg));
        } else {
            return res.status(400).send(resultado.msg);
        }
    });
});

// Editar resposta
router.patch('/comentarios/editarResposta/:idComentario', verifyToken, (req, res) => {
    const { texto_comentario } = req.body;

    if (!texto_comentario) {
        return res.status(400).send("Texto da resposta é obrigatório");
    }

    editarResposta(req.params.idComentario, texto_comentario).then(resultado => {
        if (resultado.status) {
            return res.status(200).send(JSON.stringify(resultado.msg));
        } else {
            return res.status(400).send(resultado.msg);
        }
    });
});

// Excluir resposta
router.delete('/comentarios/excluirResposta/:idComentario', verifyToken, (req, res) => {
    excluirResposta(req.params.idComentario).then(resultado => {
        if (resultado.status) {
            return res.status(200).send(resultado.msg);
        } else {
            return res.status(400).send(resultado.msg);
        }
    });
});

export default router;