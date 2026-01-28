import express from 'express';
import { add } from '../Service/images.js';
import multer from 'multer';

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Upload image
router.post('/images', upload.single('file'), (req, res) => {
    const { bucket, filePath } = req.body;

    const fileBuffer = req.file.buffer;
    const contentType = req.file.mimetype;

    add(bucket, filePath, fileBuffer, contentType).then(result => {
        if (result.status) {
            return res.status(200).json(result.msg);
        }
        return res.status(400).json(result.msg);
    });
});

export default router;