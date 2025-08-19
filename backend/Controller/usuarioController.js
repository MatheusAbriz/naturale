import express from 'express';
import { 
  adicionarUsuario, 
  atualizarEmailUsuario, 
  atualizarNomeUsuario, 
  atualizarSenhaUsuario, 
  atualizarTelefoneUsuario, 
  deletarUsuario, 
  logarUsuario, 
  selecionarNomeUsuario, 
  selecionarUsuario 
} from '../service/usuarioService.js';
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(express.json());

// Teste de rota
router.get('/usuario/', (req, res) =>{
    res.send("Olá, deu tudo certo!");
});

// CRUD - Criar usuário
router.post('/usuario/adicionarUsuario', (req, res) => {
    adicionarUsuario(req.body).then(resultado =>{
        resultado ? res.status(200).send() : res.status(400).send("Erro! Verifique as informações corretamente");
    });
});

// CRUD - Ler usuário
router.get('/usuario/lerUsuario/:id', (req, res) => {
    selecionarUsuario(req.params.id).then(usuario =>{
        if(usuario){
            res.status(200).json(usuario);
        } else {
            res.status(400).send("Erro! Não foi possível achar usuário");
        }
    });
});

// CRUD - Ler nome_usuario pelo ID
router.get('/usuario/lerNomeUsuario/:id', (req, res) =>{
    selecionarNomeUsuario(req.params.id).then(usuario =>{
        if(usuario) return res.status(200).json(usuario);
        return res.status(400).send("Erro! Não foi possível achar o usuário");
    });
});

// CRUD - Login usuário (POST seguro)
router.post('/usuario/logarUsuario', (req, res) => {
    const { email, senha } = req.body;

    logarUsuario(email, senha).then(usuario =>{
        if(usuario.status) return res.status(200).json(usuario.usuario);
        return res.status(400).json({ msg: usuario.msg });
    });
});

// Rota protegida - perfil do usuário
router.get('/usuario/perfil/:id', verifyToken, (req, res) => {
    selecionarUsuario(req.params.id).then(usuario => {
        if(!usuario) return res.status(404).json({ message: "Usuário não encontrado" });
        res.status(200).json(usuario);
    });
});

// CRUD - Atualizar nome
router.put('/usuario/atualizarNomeUsuario/:id', (req, res) =>{
    atualizarNomeUsuario(req.params.id, req.body).then(resultado =>{
        resultado ? res.status(200).send("Usuário atualizado com sucesso!") : res.status(400).send("Erro! Não foi possível atualizar o usuário");
    });
});

// CRUD - Atualizar telefone
router.put('/usuario/atualizarTelefoneUsuario/:id', (req, res) =>{
    atualizarTelefoneUsuario(req.params.id, req.body).then(resultado =>{
        resultado ? res.status(200).send("Usuário atualizado com sucesso!") : res.status(400).send("Erro! Não foi possível atualizar o usuário");
    });
});

// CRUD - Atualizar email
router.put('/usuario/atualizarEmailUsuario/:id', (req, res) =>{
    atualizarEmailUsuario(req.params.id, req.body).then(resultado =>{
        resultado ? res.status(200).send("Usuário atualizado com sucesso!") : res.status(400).send("Erro! Não foi possível atualizar o usuário");
    });
});

// CRUD - Atualizar senha
router.put('/usuario/atualizarSenhaUsuario/:id', (req, res) =>{
    atualizarSenhaUsuario(req.params.id, req.body).then(resultado =>{
        resultado ? res.status(200).send("Usuário atualizado com sucesso!") : res.status(400).send("Erro! Não foi possível atualizar o usuário");
    });
});

// CRUD - Deletar usuário
router.delete('/usuario/deletarUsuario/:id', (req, res) =>{
    deletarUsuario(req.params.id).then(resultado =>{
        resultado ? res.status(200).send() : res.status(400).send("Erro! Não foi possível deletar o usuário com esse ID");
    });
});

export default router;
