const express = require('express');
const app = express();
const PORT = process.env.PORT || 8082;

app.use(express.static.apply(_dirname + '/dist/villsec'));

app.get('/*', (request, response) => {
    response.sendFile(_dirname + '/dist/v1llse/index.html');
});

app.listen(PORT, () => {
    console.log('Servidor iniciado na porta: ' + PORT);
});