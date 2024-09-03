const express = require('express')
const router = express.Router()
const Category = require('../categories/Category')
const Product = require('./Product')
const slugify = require('slugify')
const adminAuth = require('../middlewares/adminAuth')

const upload = require('../middlewares/storage')
const multer = require('multer')//upload de imagens


router.get('/admin/products', (req, res) => {
  res.redirect('/admin/products/page/1');
});


router.get('/admin/products/page/:pageNum', adminAuth, (req, res) => {
  const page = parseInt(req.params.pageNum) || 1;
  const limit = 10; // Número de produtos por página
  const offset = (page - 1) * limit;

  Product.findAndCountAll({
    limit: limit,
    offset: offset,
    include: [{
      model: Category
    }]
  }).then((result) => {
    const totalPages = Math.ceil(result.count / limit);

    res.render('admin/products/index', {
      products: result.rows,
      result: {
        page: page,
        next: page < totalPages
      }
    });
  });
});


//router create new product
router.get('/admin/products/new', adminAuth,  (req, res)=>{
  Category.findAll().then(categories=>{
    res.render('admin/products/new', {
      categories: categories
    })
  })

})

//Save product in database
router.post('/products/save', upload.single('image'),  adminAuth,  (req, res)=>{
  let name = req.body.name;
  let description = req.body.description
  let price = req.body.price
  let image = req.file ? req.file.filename : null;
  let stock = req.body.stock
  let shortDescription = req.body.shortDescription
  let status = req.body.status
  let category = req.body.category
  let additional = req.body.additional || []; // arrays de adicionais
  let flavor = req.body.flavor || []; // arrays de sabores

  if(name != undefined){
    Product.create({
      name: name,
      slug: slugify(name),
      description: description,
      price: price,
      image: image,
      stock: stock,
      shortDescription: shortDescription,
      status: status,
      categoryId: category,
      additional: additional, // Salva adicionais
      flavor: flavor // Salva sabores
    }).then(()=>{
      res.redirect('/admin/products')
    })
  }else{
    res.render('admin/products/new')
  }
})


//Delete product in database
router.post('/products/delete', adminAuth,  (req, res)=>{
  let id = req.body.id;
  if(id != undefined){
    if(!isNaN(id)){//Verifica se id é um numero
      Product.destroy({
        where:{
          id:id
        }
      }).then(()=>{
        res.redirect('/admin/products')
      })
    }else{
      res.redirect('/admin/products')
    }
  }else{
    res.redirect('/admin/products')
  }
})


//router edit product
router.get('/admin/products/edit/:id', adminAuth,  (req, res)=>{
  let id = req.params.id
  console.log(id)
  if(!isNaN(id)){
    Product.findByPk(id).then(product=>{
      if(product != undefined){
        Category.findAll().then(categories=>{
        res.render('admin/products/edit', {
          product: product,
          categories: categories
        })
      })
      }else{
        res.redirect('/admin/products')
      }
    }).catch((err)=>{
      res.redirect('/admin/products')
      console.log(err)
    })
  }else{
    res.redirect('/admin/products')
  }
})


//Update product in database
router.post('/products/update', upload.single('image'), adminAuth,  (req, res)=>{
  let id = req.body.id;
  let name = req.body.name;
  let description = req.body.description
  let price = req.body.price
  let image1 = req.file ? req.file.filename : null;
  let image2 = req.body.image
  let stock = req.body.stock
  let shortDescription = req.body.shortDescription
  let status = req.body.status
  let category = req.body.category
  let additional = req.body.additional || []; // arrays de adicionais
  let flavor = req.body.flavor || []; // arrays de sabores

  let image;
  if(image1 != null){
    image = image1
  }else{
    image = image2
  }


 Product.update({
  name: name,
  slug: slugify(name),
  description: description,
  price: price,
  image: image,
  stock: stock,
  shortDescription: shortDescription,
  status: status,
  categoryId: category,
  additional: additional, 
  flavor: flavor 
  }, { 
    where:{ 
    id: id
    }
  }).then(()=>{
    res.redirect('/admin/products')
  }).catch(err=>{
    res.redirect('/admin/products')
    console.log(err)
  })
})


router.post('/products/page/:num', async (req, res) => {
  try {
    let categoryPage = req.body.idCategory;
    let page = parseInt(req.params.num, 10); // Parse com base 10
    let limit = 10;
    let offset = 0;

    // Valida a página
    if (isNaN(page) || page <= 0) {
      page = 1; // Define a página padrão como 1 se a entrada for inválida
    }

    offset = (page - 1) * limit;

    // Condição do filtro para a categoria
    let whereClause = categoryPage ? { categoryId: categoryPage } : {};

    // Contar o total de produtos na categoria
    let count = await Product.count({ where: whereClause });

    // Buscar os produtos filtrados pela categoria
    let products = await Product.findAll({
      where: whereClause,
      limit: limit,
      offset: offset,
      order: [['id', 'DESC']]
    });

    let next = (offset + limit < count);

    let result = {
      page: page,
      next: next,
      products: products
    };

    // Buscar todas as categorias
    let categories = await Category.findAll();

    // Renderizar a página com os produtos e categorias
    res.render('page', {
      result: result,
      categories: categories,
      categoryPage: categoryPage
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching products");
  }
});





module.exports = router