const proxy = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(
        '/',
        proxy({
            target: 'http://192.168.2.200:8080',
            changeOrigin: true,
            secure: false,
        })
    );
};
