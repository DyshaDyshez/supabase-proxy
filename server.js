const http = require('http');
const https = require('https');

const SUPABASE_HOST = 'yyohojhvayfcwiqrdiqf.supabase.co';

const server = http.createServer((req, res) => {
    // Проксируем запрос к Supabase
    const options = {
        hostname: SUPABASE_HOST,
        path: req.url,
        method: req.method,
        headers: {
            ...req.headers,
            host: SUPABASE_HOST
        }
    };

    const proxyReq = https.request(options, (proxyRes) => {
        // CORS заголовки
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', '*');
        
        res.writeHead(proxyRes.statusCode, proxyRes.headers);
        proxyRes.pipe(res);
    });

    proxyReq.on('error', (err) => {
        console.error('Ошибка прокси:', err);
        res.writeHead(500);
        res.end('Proxy error');
    });

    if (req.method !== 'GET' && req.method !== 'HEAD') {
        req.pipe(proxyReq);
    } else {
        proxyReq.end();
    }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log('Прокси на порту', PORT));
