const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

// Giả lập dữ liệu của cart (menu)
let cart = [
  { id: 1, name: 'IPHONE 14', price: '18000000', Image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRoY4f4CH7WZLG_3z7lGaManU8zi3tBuTEjYg&s' },
  { id: 2, name: 'Samsung Galaxy S24 Ultra', price: '27990000', Image: 'https://samcenter.vn/images/thumbs/0006347_samsung-galaxy-s24-ultra.jpeg' },
  { id: 3, name: 'Galaxy Z Fold 6', price: '41990000', Image: 'https://samcenter.vn/images/thumbs/0007191_xam_550.png' },
  { id: 4, name: 'Galaxy Z Flip 6', price: '26990000', Image: 'https://samcenter.vn/images/thumbs/0007200_xanh-blue_550.png' },
  { id: 5, name: 'Galaxy Watch7 (Bluetooth)', price: '7990000', Image: 'https://samcenter.vn/images/thumbs/0007230_kem_550.png' },
  { id: 6, name: 'Tecno Pova 6 Neo', price: '4100000', Image: 'https://cdn.kalvo.com/uploads/img/large/60203-tecno-pova-6-neo.jpg' },
  { id: 7, name: 'Xiaomi Redmi 13', price: '4290000', Image: 'https://cdn.tgdd.vn/Products/Images/42/325800/redmi-13-pink-1.jpg' },
  { id: 8, name: 'Xiaomi 14', price: '21490000', Image: 'https://cdn.tgdd.vn/Products/Images/42/298538/xiaomi-14-xanh-1.jpg' },
  { id: 9, name: 'Xiaomi POCO M6', price: '21490000', Image: 'https://cdn.tgdd.vn/Products/Images/42/327343/xiaomi-poco-m6-purple-1-1.jpg' },
  { id: 10, name: 'Vsmart Star 5', price: '1890000', Image: 'https://dienthoaihay.vn/images/products/2021/09/12/large/vsmart-star-5-den_1631431476.jpg.jpg' },
  { id: 11, name: 'Nokia 220 4G', price: '990000', Image: 'https://cdn.tgdd.vn/Products/Images/42/207956/nokia-220-4g-cam-1.jpg' },
  { id: 12, name: 'Nokia 110 4G Pro ', price: '720000', Image: 'https://cdn.tgdd.vn/Products/Images/42/311034/nokia-110-4g-pro-tim-1.jpg' },
  { id: 13, name: 'Baseus Encok S12', price: '549000', Image: 'https://product.hstatic.net/1000152881/product/baseus_encok_s12_01_8240138f98b345c69ade9d1b6cfc33bf.jpg' },
  { id: 14, name: 'AJAZZ AK40 Black Brown/Blue switch', price: '600000', Image: 'https://maytinhbinhduong.com/wp-content/uploads/2022/04/40386_ajazz_ak40_black__2_.jpg' },
  { id: 15, name: 'iPad Gen 10', price: '8,800,000', Image: 'https://bizweb.dktcdn.net/thumb/1024x1024/100/471/129/products/1-64bb0a10-af3d-4366-ac0e-165c82f39ca6.png?v=1704515792673' },
  { id: 16, name: 'aptop gaming Lenovo LOQ', price: '20690000', Image: 'https://product.hstatic.net/200000722513/product/loq_15irx9_ct1_03_e060c7219ed745ce83017d95799d960e_1024x1024.png' },
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
