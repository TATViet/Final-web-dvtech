const express = require("express");
const router = express.Router();
const Product = require("../models/Payment");

// Giả lập dữ liệu của cart (menu)
let cart = [
  { id: 1, name: 'IPHONE 14 (Light Blue)', price: '18000000', Image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRoY4f4CH7WZLG_3z7lGaManU8zi3tBuTEjYg&s' },
  { id: 2, name: 'Samsung Galaxy S24 Ultra', price: '27990000', Image: 'https://samcenter.vn/images/thumbs/0006347_samsung-galaxy-s24-ultra.jpeg' },
  { id: 3, name: 'Galaxy Z Fold 6', price: '41990000', Image: 'https://samcenter.vn/images/thumbs/0007191_xam_550.png' },
  { id: 4, name: 'Galaxy Z Flip 6', price: '26990000', Image: 'https://samcenter.vn/images/thumbs/0007200_xanh-blue_550.png' },
  { id: 5, name: 'Galaxy Watch7 (Bluetooth)', price: '7990000', Image: 'https://samcenter.vn/images/thumbs/0007230_kem_550.png' },
];

// Showing cart page
router.get("/cart", function (req, res) {
  Product.find().then((products) => {
    let totalPrice = products.reduce((acc, item) => {
      return acc + (item.Product_price * item.Product_quantity);
    }, 0);
    res.render("cart", { Products: products, totalPrice: totalPrice });
  });
});

// Showing productDetails form
router.get("/productDetails", function (req, res) {
  Product.find().then((products) => {
    res.render("productDetails", { cart: cart, Product: products });
  });
});
// ad page
router.get("/verysecret", function (req, res) {
    Product.find().then((Product) => {
      res.render("verysecret", { cart: cart, Product: Product });
    });
  });

// Add new items to cart
router.post('/cart', (req, res) => {
  const newitems = req.body;
  newitems.id = cart.length + 1;
  cart.push(newitems);
  res.redirect('/verysecret');
});

// Delete items from cart
router.get('/cart/:id', (req, res) => {
  const itemId = parseInt(req.params.id);
  cart = cart.filter(cart => cart.id !== itemId);
  res.redirect('/verysecret');
});
// Add items to customer's cart
router.get('/cart_customer/:id', async (req, res) => {
    const itemId = parseInt(req.params.id);
    const item = cart.find(product => product.id === itemId);
  
    if (item) {
      try {
        let existingProduct = await Product.findOne({ Product_name: item.name });
  
        if (existingProduct) {
          await Product.updateOne(
            { _id: existingProduct._id },
            { $inc: { Product_quantity: 1 } }
          );
        } else {
          const newProduct = new Product({
            Product_name: item.name,
            Product_price: item.price,
            Product_quantity: 1
          });
          await newProduct.save();
        }
        res.redirect('/productDetails');
      } catch (error) {
        res.status(500).send('Error adding product: ' + item.name + ' ' + error.message);
      }
    } else {
      res.status(404).send('Product not found in cart ' + itemId);
    }
  });
  
  // Delete all items from customer's cart
  router.get('/cart_customer_deletall', async (req, res) => {
    try {
      await Product.deleteMany({});
      console.log('All data in the product collection has been deleted.');
      res.redirect('/cart');
    } catch (error) {
      console.error('Error deleting data:', error);
    }
  });
  
  // Delete specific item from customer's cart
  router.get('/cart_customer_delet/:Product_name', async (req, res) => {
    try {
      const product = await Product.findOne({ Product_name: req.params.Product_name });
      if (product.Product_quantity > 1) {
        await Product.updateOne({ Product_name: req.params.Product_name }, { $inc: { Product_quantity: -1 } });
      } else {
        await Product.deleteOne({ Product_name: req.params.Product_name });
      }
      res.redirect('/cart');
    } catch (error) {
      console.error('Error deleting data:', error);
      res.status(500).send({ message: 'Internal Server Error' });
    }
  });
  
  module.exports = router;