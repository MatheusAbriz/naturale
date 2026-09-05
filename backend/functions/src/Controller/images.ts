import express from 'express';
import crypto from 'crypto';
import { add } from '../Service/images.js';
import multer from 'multer';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

const ALLOWED_BUCKETS = ['posts', 'usuarios'];
const EXTENSION_BY_MIME_TYPE: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
};
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: { fileSize: MAX_FILE_SIZE_BYTES },
    fileFilter: (_req, file, cb) => {
        if (!EXTENSION_BY_MIME_TYPE[file.mimetype]) {
            return cb(new Error('Tipo de arquivo não permitido'));
        }
        cb(null, true);
    },
});

// Upload image
router.post('/images', verifyToken, (req, res, next) => {
    upload.single('file')(req, res, (err) => {
        if (err) {
            return res.status(400).json({ message: err.message ?? 'Erro ao processar arquivo' });
        }
        next();
    });
}, (req, res) => {
    const { bucket } = req.body;

    if (!ALLOWED_BUCKETS.includes(bucket)) {
        return res.status(400).json({ message: 'Bucket inválido' });
    }

    if (!req.file) {
        return res.status(400).json({ message: 'Nenhum arquivo enviado' });
    }

    const fileBuffer = req.file.buffer;
    const contentType = req.file.mimetype;
    const extension = EXTENSION_BY_MIME_TYPE[contentType];
    const filePath = `${crypto.randomUUID()}.${extension}`;

    add(bucket, filePath, fileBuffer, contentType).then(result => {
        if (result.status) {
            return res.status(200).json(result.msg);
        }
        return res.status(400).json(result.msg);
    });
});

export default router;