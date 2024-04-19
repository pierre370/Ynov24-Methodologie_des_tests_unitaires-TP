import swaggerAutogen from 'swagger-autogen';

const doc = {
    info: {
        title: 'Labo lens',
        description: ' Application de port de lentille'
    },
    host: 'localhost:3000'
};

const outputFile = './swagger-output.json';
const routes = ['./index.js'];

swaggerAutogen()(outputFile, routes, doc).then(async () => {
    await import('./index.js'); // Your project's root file
});
