import swaggerAutoGen from 'swagger-autogen';
const doc = {
  info: {
    title: 'API Naturale',
    description: 'Documentação da API do projeto Naturale'
  },
  host: 'localhost:3000',
  schemes: ['http']
};

const outputFile = './swagger-output.json';
const routes = ['../app.js'];


swaggerAutoGen()(outputFile, routes, doc);