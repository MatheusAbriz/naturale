import express from 'express';
import { lerFavoritos, inserirOuRemoverFavorito } from '../Service/favoritosService.js';

const router = express.Router();
router.use(express.json());

router.get("/favoritos/lerFavoritos/:id", (req, res) => {
    lerFavoritos(req.params.id).then(resultado => {
        if (resultado.status) {
            return res.status(200).send(`${JSON.stringify(resultado.msg)}`);
        }
        return res.status(400).send(`${JSON.stringify(resultado.msg)}`);
    });
});

router.patch("/favoritos/inserirFavorito/:idUsuario/:idPost", (req, res) => {
    inserirOuRemoverFavorito(req.params.idUsuario, req.params.idPost).then(resultado => {
        if (resultado.status) {
            return res.status(200).send(`${JSON.stringify(resultado.msg)}`);
        }
        return res.status(400).send(`${JSON.stringify(resultado.msg)}`);
    });
});

export default router;