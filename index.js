const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const connection = require('./database/database')
const session = require('express-session')
const multer = require('multer')//upload de imagens

const { Op } = require('sequelize');// Para pesquisa de artigos

//Tables
const Product = require('./products/Product')
const Category = require('./categories/Category')
const User = require('./users/User')
const Cart = require('./cart/Cart')

//Controllers
const productsController = require('./products/ProductController')
const categoriesController = require('./categories/CategoryController')
const userController = require('./users/UserController')
const cartController = require('./cart/CartController')

//View engine
app.set('view engine', 'ejs')

//Static
app.use(express.static('public'))
app.use(express.static('upload'));

//Body-parser
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

//Database
connection.authenticate().then(()=>{
  console.log("Conexão realizada com sucesso!")
}).catch((err)=>{
  console.log(err)
})

//Session ( Falta o Redis )
app.use(session({
  secret: 'seuSegredoAqui',
  resave: false,  // Define explicitamente se a sessão deve ser regravada no store mesmo sem modificações
  saveUninitialized: false,  // Define se novas sessões não modificadas devem ser salvas
  cookie: { secure: false }  // Em produção, deve ser `true` se estiver usando HTTPS
}));


//Use controllers
app.use('/', productsController)
app.use('/', categoriesController)
app.use('/', userController)
app.use('/', cartController)

//home
app.get('/', (req, res)=>{
  Product.findAll().then(products=>{
    Category.findAll({
      order:[
        ["id", 'DESC']
      ],
      limit: 10
    }).then(categories=>{
      res.render('index', {products: products, categories: categories})
    })
  })
})


// show info product
// app.get('/:slug', (req, res)=>{
//   let slug = req.params.slug
//   Product.findOne({
//     where:{
//       slug: slug
//     }
//   }).then(product=>{
//     if(product != undefined){
//       Category.findAll().then(categories=>{
//         res.render('product', {product: product , categories: categories})
//       })
//     }else{
//       res.redirect('/')
//     }
//   }).catch(error=>{
//     res.redirect('/')
//   })
// })


app.get('/category/:slug', (req, res)=>{
  let slug = req.params.slug

  Category.findOne({
    where:{
      slug: slug
    },
    include: [{model: Product}]
  }).then(category=>{
    if(category != undefined){

      Category.findAll().then(categories =>{
        res.render('index', {products: category.products, categories: categories})
      })
    }else{
      res.redirect('/')
    }
  }).catch(error=>{
    res.redirect('/')
  })
})


app.post('/search', (req, res) => {
  let name = req.body.name;
  Product.findAll({
    where: {
      name: {
        [Op.like]: `%${name}%`
      }
    }
  }).then(products => {
    if (products.length > 0) {
      Category.findAll().then(categories=>{
        res.render('productFound', { products: products, categories: categories });
      })
    } else {
      res.redirect('/');
    }
  }).catch(error => {
    res.redirect('/');
  });
});



app.listen(80, ()=>{
  console.log('O servidor está rodando!')
})