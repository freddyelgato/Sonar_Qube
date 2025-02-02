const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors({
  origin: 'http://localhost:3000', // Frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

app.use(bodyParser.json());

// Ruta del archivo JSON donde se guardan los productos
const filePath = path.join(__dirname, 'products.json');

// Función para leer los productos del archivo JSON
const getProducts = () => {
  if (!fs.existsSync(filePath)) {
    return [];
  }
  const data = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(data);
};

// Ruta para obtener todos los productos
app.get('/api/products', (req, res) => {
  const products = getProducts();
  res.status(200).json(products);
});

// Ruta para crear un nuevo producto
app.post('/api/products', (req, res) => {
  const { name, price, category } = req.body;
  if (!name || !price || !category) {
    return res.status(400).json({ message: 'Name, price, and category are required' });
  }

  const products = getProducts();
  const newProduct = { id: Date.now().toString(), name, price, category };
  products.push(newProduct);

  fs.writeFileSync(filePath, JSON.stringify(products, null, 2));
  res.status(201).json(newProduct);
});

// Ruta para actualizar un producto
app.put('/api/products/:id', (req, res) => {
  const { id } = req.params;
  const { name, price, category } = req.body;
  if (!name || !price || !category) {
    return res.status(400).json({ message: 'Name, price, and category are required' });
  }

  const products = getProducts();
  const productIndex = products.findIndex(product => product.id === id);

  if (productIndex === -1) {
    return res.status(404).json({ message: 'Product not found' });
  }

  products[productIndex] = { id, name, price, category };
  fs.writeFileSync(filePath, JSON.stringify(products, null, 2));
  res.status(200).json(products[productIndex]);
});

// Ruta para eliminar un producto
app.delete('/api/products/:id', (req, res) => {
  const { id } = req.params;
  const products = getProducts();
  const updatedProducts = products.filter(product => product.id !== id);

  if (updatedProducts.length === products.length) {
    return res.status(404).json({ message: 'Product not found' });
  }

  fs.writeFileSync(filePath, JSON.stringify(updatedProducts, null, 2));
  res.status(200).json({ message: 'Product deleted' });
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
