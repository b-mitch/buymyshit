const express = require('express');
const db = require('../db/index');
const bodyParser = require('body-parser');

const productsRouter = express.Router();

productsRouter.use(bodyParser.json());
productsRouter.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

productsRouter.get('/', (req, res) => {
  const category = req.query.category;
  if(category){
    res.redirect('/products/filter/' + category);
    return;
  }
  db.query('SELECT * FROM products', (error, results) => {
    if (error) {
      console.log('error')
      throw error
    }
    console.log(results.rows)
    res.status(200).json(results.rows)
  })
});

productsRouter.post('/', (req, res) => {
  const { name, category, price, inventory } = req.body;
  const text = 'INSERT INTO products (name, category, price, inventory)VALUES($1, $2, $3, $4) RETURNING *';
  const values = [name, category, price, inventory];
  db.query(text, values, (error, results) => {
    if (error) {
    console.log('error')
    throw error
    }
    res.status(200).json(results.rows[0])
  });
})

productsRouter.get('/filter/:category', (req, res) => {
  const category = req.params.category;
  db.query('SELECT * FROM products WHERE category = $1', [category], (error, results) => {
    if (error) {
    console.log('error')
    throw error
    }
    res.status(200).json(results.rows[0])
  })
})

productsRouter.get('/:id', (req, res) => {
  const id = req.params.id;
  db.query('SELECT * FROM products WHERE id = $1', [id], (error, results) => {
    if (error) {
    console.log('error')
    throw error
    }
    res.status(200).json(results.rows[0])
  })
})

productsRouter.put('/:id', (req, res) => {
  const productId = req.params.id;
  const cartId = 1;
  const amount = 40;

  db.query('INSERT INTO products_carts (product_id, cart_id, amount)VALUES($1, $2, $3) RETURNING *', [productId, cartId, amount], (error, results) => {
    if (error) {
    console.log('error')
    throw error
    }
    res.status(200).json(results.rows[0])
  })
})


module.exports = productsRouter;