const express = require('express')
const router = express.Router()
const Cart = require('./Cart')
const User = require('../users/User')
const Product = require('../products/Product')
const slugify = require('slugify')
const { render } = require('ejs')
const adminAuth = require('../middlewares/adminAuth')


router.get('/cart', (req, res)=>{
  Product.findAll().then((products) => {
    res.render('cart', {
      products: products
    });
  });
})

module.exports = router