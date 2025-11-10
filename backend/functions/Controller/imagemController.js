import express from 'express';
import { inserirImagem } from '../Service/imagemService.js';
import multer from 'multer';

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
router.post("/imagens/inserirImagem", upload.single('file'), async(req, res) => {
    const { bucket, filePath } = req.body;
    
    const fileBuffer = req.file.buffer;
    const contentType = req.file.mimetype;
    inserirImagem(bucket, filePath, fileBuffer, contentType).then(resultado => {
        if (resultado.status) {
            return res.status(200).send(`${JSON.stringify(resultado.msg)}`);
        }
        return res.status(400).send(`${JSON.stringify(resultado.msg)}`);
    });
});

export default router;