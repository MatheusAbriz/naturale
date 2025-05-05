create database naturale;

create table usuario(
    id_usuario int not null AUTO_INCREMENT PRIMARY KEY,
    nome_usuario varchar(200) not null,
    telefone_usuario varchar(200) not null,
    cpf_usuario varchar(200) not null,
    email_usuario varchar(200) not null,
    senha_usuario varchar(200) not null
)

insert into usuario(nome_usuario, telefone_usuario, cpf_usuario, email_usuario, senha_usuario) values('Matheus', '988257303', '53826433858', 'math@gmail.com', '123456')