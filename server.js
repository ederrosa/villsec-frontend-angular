const EXPRESS = require('express');
const { response } = require('express');
const APP = EXPRESS();
const PORT = process.env.PORT || 8081;

APP.use(EXPRESS.static.apply(_dirname + '/dist/villsec'));

APP.get('/*', (request, response) => {
    response.sendFile(_dirname + '/dist/v1llse/index.html');
});

APP.listen(PORT, () => {
    console.log('Servidor iniciado na porta: ' + PORT);
});