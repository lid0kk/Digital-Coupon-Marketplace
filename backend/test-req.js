const http = require('http');

const data = JSON.stringify({
    name: "test",
    description: "test desc",
    image_url: "http://example.com",
    cost_price: 10,
    margin_percentage: 10,
    value: "test val"
});

const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/v1/admin/products',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

const req = http.request(options, res => {
    let body = '';
    res.on('data', d => body += d);
    res.on('end', () => console.log('Response:', res.statusCode, body));
});

req.on('error', error => console.error(error));
req.write(data);
req.end();
