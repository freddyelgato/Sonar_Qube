
const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

const filePath = path.join(__dirname, '../products.json');

const getProducts = () => {
  if (!fs.existsSync(filePath)) {
    return [];
  }
  const data = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(data);
};

// Ruta para obtener todos los productos
router.get('/', (req, res) => {
  const products = getProducts();
  res.status(200).json(products);
});

// Ruta para agregar un producto
router.post('/', (req, res) => {
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

module.exports = router;
