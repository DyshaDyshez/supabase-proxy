const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const SUPABASE_URL = 'https://yyohojhvayfcwiqrdiqf.supabase.co';

app.use('/', createProxyMiddleware({
    target: SUPABASE_URL,
    changeOrigin: true,
    on: {
        proxyRes: (proxyRes) => {
            proxyRes.headers['access-control-allow-origin'] = '*';
            proxyRes.headers['access-control-allow-methods'] = 'GET,POST,PUT,DELETE,PATCH,OPTIONS';
            proxyRes.headers['access-control-allow-headers'] = '*';
        }
    }
}));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Прокси запущен на порту', PORT));
