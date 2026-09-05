import express from 'express';
import crypto from 'crypto';
import Busboy from 'busboy';
import { add } from '../Service/images.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

const ALLOWED_BUCKETS = ['posts', 'usuarios'];
const EXTENSION_BY_MIME_TYPE: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
};
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

// Upload image
router.post('/images', verifyToken, (req, res) => {
    const busboy = Busboy({
        headers: req.headers,
        limits: { fileSize: MAX_FILE_SIZE_BYTES },
    });

    let bucket: string | undefined;
    let mimeType: string | undefined;
    let fileTooLarge = false;
    const chunks: Buffer[] = [];

    busboy.on('field', (name, value) => {
        if (name === 'bucket') bucket = value;
    });

    busboy.on('file', (_name, stream, info) => {
        mimeType = info.mimeType;
        stream.on('data', (chunk) => chunks.push(chunk));
        stream.on('limit', () => { fileTooLarge = true; });
    });

    busboy.on('finish', async () => {
        if (!bucket || !ALLOWED_BUCKETS.includes(bucket)) {
            return res.status(400).json({ message: 'Bucket inválido' });
        }

        if (fileTooLarge) {
            return res.status(400).json({ message: 'Arquivo muito grande (máx. 5MB)' });
        }

        if (!mimeType || !EXTENSION_BY_MIME_TYPE[mimeType] || chunks.length === 0) {
            return res.status(400).json({ message: chunks.length === 0 ? 'Nenhum arquivo enviado' : 'Tipo de arquivo não permitido' });
        }

        const extension = EXTENSION_BY_MIME_TYPE[mimeType];
        const filePath = `${crypto.randomUUID()}.${extension}`;
        const fileBuffer = Buffer.concat(chunks);

        const result = await add(bucket, filePath, fileBuffer, mimeType);

        if (result.status) {
            return res.status(200).json(result.msg);
        }
        return res.status(400).json(result.msg);
    });

    busboy.end(req.rawBody);
});

export default router;
