import swaggerJsdoc from 'swagger-jsdoc';

export const swaggerOptions: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Tekna Tasks API',
      version: '1.0.0',
      description: 'Documentação da API de gerenciamento de tarefas para o desafio técnico da Tekna.',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
    apis: ['./src/routes/*.ts', './src/docs/*.ts'],
};
