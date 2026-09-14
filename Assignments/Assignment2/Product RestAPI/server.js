const express = require('express');
const app = express();

const PORT = 5000;

app.use(express.json());

const products = [
    { id: 1, name: 'Laptop', price: 50000 },
    { id: 2, name: 'Phone', price: 20000 },
    { id: 3, name: 'Headphones', price: 2000 }
];

app.get('/', (req, res) => {
    res.send('Product REST API Service');
});

app.get('/api/products', (req, res) => {
    res.json(products);
});

app.get('/api/products/:id', (req, res) => {
    const product = products.find(p => p.id === parseInt(req.params.id));
    if (!product) return res.status(404).send('Product not found');
    res.json(product);
});

app.listen(PORT, () => {
    console.log(`Product RestAPI Server running on port ${PORT}`);
});