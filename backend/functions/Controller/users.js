import express from 'express';
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
  deleteUser
} from '../Service/users.js';

const router = express.Router();

router.use(express.json());

// Teste de rota
router.get('/user/', (req, res) =>{
    res.send("Olá, deu tudo certo!");
});

// CRUD - Criar usuário
router.post('/user', (req, res) => {
    console.warn(req.body);
    create(req.body).then(result =>{
        result.status
            ? res.status(200).json(result.msg)
            : res.status(400).send(result.msg);
    });
});

// CRUD - Ler usuário
router.get('/user/:id', (req, res) => {
    getById(req.params.id).then(user =>{
        if(user){
            res.status(200).json(user);
        } else {
            res.status(400).send("Erro! Não foi possível achar usuário");
        }
    });
});

// CRUD - Ler nome_usuario pelo ID
router.get('/user/:id/name', (req, res) =>{
    getNameById(req.params.id).then(user =>{
        if(user) return res.status(200).json(user);
        return res.status(400).send("Erro! Não foi possível achar o usuário");
    });
});

// CRUD - Login usuário (POST seguro)
router.post('/user/login', (req, res) => {
    const { email, password } = req.body;

    login(email, password).then(user =>{
        if(user.status) return res.status(200).json(user.usuario);
        return res.status(400).json({ msg: user.msg });
    });
});

// Rota protegida - perfil do usuário
router.get('/user/profile/:id', verifyToken, (req, res) => {
    getById(req.params.id).then(user => {
        if(!user) return res.status(404).json({ message: "Usuário não encontrado" });
        res.status(200).json(user);
    });
});

// CRUD - Atualizar nome
router.put('/user/:id/name', verifyToken, (req, res) =>{
    updateName(req.params.id, req.body).then(result =>{
        result
            ? res.status(200).send("Usuário atualizado com sucesso!")
            : res.status(400).send("Erro! Não foi possível atualizar o usuário");
    });
});

// CRUD - Atualizar apelido
router.put('/user/:id/username', verifyToken, (req, res) =>{
    updateUsername(req.params.id, req.body).then(result =>{
        result
            ? res.status(200).send("Usuário atualizado com sucesso!")
            : res.status(400).send("Erro! Não foi possível atualizar o usuário");
    });
});

// CRUD - Atualizar telefone
router.put('/user/:id/phone', verifyToken, (req, res) =>{
    updatePhone(req.params.id, req.body).then(result =>{
        result
            ? res.status(200).send("Usuário atualizado com sucesso!")
            : res.status(400).send("Erro! Não foi possível atualizar o usuário");
    });
});

// CRUD - Atualizar email
router.put('/user/:id/email', verifyToken, (req, res) =>{
    updateEmail(req.params.id, req.body).then(result =>{
        result
            ? res.status(200).send("Usuário atualizado com sucesso!")
            : res.status(400).send("Erro! Não foi possível atualizar o usuário");
    });
});

// CRUD - Atualizar senha
router.put('/user/:id/password', verifyToken, (req, res) =>{
    updatePassword(req.params.id, req.body).then(result =>{
        result
            ? res.status(200).send("Usuário atualizado com sucesso!")
            : res.status(400).send("Erro! Não foi possível atualizar o usuário");
    });
});

// CRUD - Deletar usuário
router.delete('/user/:id', verifyToken, (req, res) =>{
    deleteUser(req.params.id).then(result =>{
        result
            ? res.status(200).send("Usuario deletado com sucesso!")
            : res.status(400).send("Erro! Não foi possível deletar o usuário com esse ID");
    });
});

export default router;