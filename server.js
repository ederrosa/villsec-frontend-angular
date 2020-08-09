const express = require('express');
const app = express();
const path = require('path');
const PORT = process.env.PORT || 8082;

app.use(express.static(_dirname + '/dist/villsec'));

app.get('/*', (request, response) => {
    response.sendFile(path.join(_dirname + '/dist/villsec/index.html'));
});

app.listen(PORT, () => {
    console.log('Servidor iniciado na porta: ' + PORT);
});