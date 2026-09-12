import express, { Request, Response, NextFunction } from 'express';
import { verifyToken } from "../middlewares/authMiddleware.js";
import {
  create,
  getById,
  getNameById,
  login,
  updateName,
  updateUsername,
  updatePhone,
  updateEmail,
  updatePassword,
  updateAvatar,
  forgotPassword,
  resetPassword,
  deleteUser
} from '../Service/users.js';

const router = express.Router();

router.use(express.json());

// Teste de rota
router.get('/user/', (req: Request, res: Response) => {
    return res.status(200).send("Olá, deu tudo certo!");
});

// CRUD - Criar usuário (Hardening: Removido console.warn de senhas)
router.post('/user', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await create(req.body);
        if (result.status) { 
            return res.status(201).json(result.msg);
        }
        return res.status(400).send(result.msg);
    } catch (error) {
        return next(error);
    }
});

// CRUD - Ler usuário público (Apenas dados não sensíveis devem ser retornados pelo Service)
router.get('/user/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await getById(req.params.id);
        if (user) return res.status(200).json(user);
        return res.status(404).send("Erro! Não foi possível achar o usuário");
    } catch (error) {
        return next(error);
    }
});

// CRUD - Ler nome_usuario pelo ID
router.get('/user/:id/name', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await getNameById(req.params.id);
        if (user) return res.status(200).json(user);
        return res.status(404).send("Erro! Não foi possível achar o usuário");
    } catch (error) {
        return next(error);
    }
});

// CRUD - Login usuário (POST seguro)
router.post('/user/login', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;
        const user = await login(email, password);
        if (user.status) return res.status(200).json(user.usuario);
        return res.status(401).json({ msg: user.msg });
    } catch (error) {
        return next(error);
    }
});

// Solicitar código de redefinição de senha por e-mail
router.post('/user/forgot-password', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: "E-mail é obrigatório" });
        }

        const result = await forgotPassword(email);
        return res.status(200).json({ message: result.msg });
    } catch (error) {
        return next(error);
    }
});

// Confirmar código e definir nova senha
router.post('/user/reset-password', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, code, newPassword } = req.body;
        if (!email || !code || !newPassword) {
            return res.status(400).json({ message: "Campos obrigatórios não preenchidos" });
        }

        const result = await resetPassword(email, code, newPassword);
        if (result.status) return res.status(200).json({ message: result.msg });
        return res.status(400).json({ message: result.msg });
    } catch (error) {
        return next(error);
    }
});

// Rota protegida - Perfil do próprio usuário (Hardening contra IDOR/BOLA)
router.get('/user/profile/:id', verifyToken, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authenticatedUserId = req.user?.id;
        const targetUserId = Number(req.params.id);

        // Bloqueia se o usuário tentar ver detalhes privados de outro perfil
        if (authenticatedUserId !== targetUserId) {
            return res.status(403).json({ message: "Acesso negado: Você não pode visualizar o perfil de outro usuário" });
        }

        const user = await getById(req.params.id);
        if (!user) return res.status(404).json({ message: "Usuário não encontrado" });
        return res.status(200).json(user);
    } catch (error) {
        return next(error);
    }
});

// CRUD - Atualizar nome (Hardening contra IDOR/BOLA)
router.put('/user/:id/name', verifyToken, async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (req.user?.id !== Number(req.params.id)) {
            return res.status(403).send("Acesso negado: Operação não autorizada para este usuário");
        }

        const result = await updateName(req.params.id, req.body);
        if (result.status) return res.status(200).send("Usuário atualizado com sucesso!");
        return res.status(400).send("Erro! Não foi possível atualizar o usuário");
    } catch (error) {
        return next(error);
    }
});

// CRUD - Atualizar apelido (Hardening contra IDOR/BOLA)
router.put('/user/:id/username', verifyToken, async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (req.user?.id !== Number(req.params.id)) {
            return res.status(403).send("Acesso negado: Operação não autorizada para este usuário");
        }

        const result = await updateUsername(req.params.id, req.body);
        if (result.status) return res.status(200).send("Usuário atualizado com sucesso!");
        return res.status(400).send("Erro! Não foi possível atualizar o usuário");
    } catch (error) {
        return next(error);
    }
});

// CRUD - Atualizar telefone (Hardening contra IDOR/BOLA)
router.put('/user/:id/phone', verifyToken, async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (req.user?.id !== Number(req.params.id)) {
            return res.status(403).send("Acesso negado: Operação não autorizada para este usuário");
        }

        const result = await updatePhone(req.params.id, req.body);
        if (result.status) return res.status(200).send("Usuário atualizado com sucesso!");
        return res.status(400).send("Erro! Não foi possível atualizar o usuário");
    } catch (error) {
        return next(error);
    }
});

// CRUD - Atualizar email (Hardening contra IDOR/BOLA)
router.put('/user/:id/email', verifyToken, async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (req.user?.id !== Number(req.params.id)) {
            return res.status(403).send("Acesso negado: Operação não autorizada para este usuário");
        }

        const result = await updateEmail(req.params.id, req.body);
        if (result.status) return res.status(200).send("Usuário atualizado com sucesso!");
        return res.status(400).send("Erro! Não foi possível atualizar o usuário");
    } catch (error) {
        return next(error);
    }
});

// CRUD - Atualizar senha (Hardening contra IDOR/BOLA)
router.put('/user/:id/password', verifyToken, async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (req.user?.id !== Number(req.params.id)) {
            return res.status(403).send("Acesso negado: Operação não autorizada para este usuário");
        }

        const result = await updatePassword(req.params.id, req.body);
        if (result.status) return res.status(200).send("Usuário atualizado com sucesso!");
        return res.status(400).send("Erro! Não foi possível atualizar o usuário");
    } catch (error) {
        return next(error);
    }
});

// CRUD - Atualizar avatar (Hardening contra IDOR/BOLA)
router.put('/user/:id/avatar', verifyToken, async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (req.user?.id !== Number(req.params.id)) {
            return res.status(403).send("Acesso negado: Operação não autorizada para este usuário");
        }

        const { avatar } = req.body;
        if (!avatar) {
            return res.status(400).send("Campo 'avatar' é obrigatório");
        }

        const result = await updateAvatar(req.params.id, avatar);
        if (result.status) return res.status(200).send("Usuário atualizado com sucesso!");
        return res.status(400).send("Erro! Não foi possível atualizar o usuário");
    } catch (error) {
        return next(error);
    }
});

// CRUD - Deletar usuário (Hardening contra IDOR/BOLA)
router.delete('/user/:id', verifyToken, async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (req.user?.id !== Number(req.params.id)) {
            return res.status(403).send("Acesso negado: Você não pode deletar a conta de outro usuário");
        }

        const result = await deleteUser(req.params.id);
        if (result.status) return res.status(200).send("Usuario deletado com sucesso!");
        return res.status(400).send("Erro! Não foi possível deletar o usuário com esse ID");
    } catch (error) {
        return next(error);
    }
});

export default router;
