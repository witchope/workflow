const { createProxyMiddleware }  = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(
        '/approval',
        createProxyMiddleware({
            pathRewrite: {
              '^/approval/': '/'
            },
            target: 'http://10.244.1.76:8080',
            changeOrigin: true,
            secure: false,
        })
    );
};
