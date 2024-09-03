const express = require('express')
const router = express.Router()
const Category = require('./Category')
const slugify = require('slugify')
const { render } = require('ejs')
const adminAuth = require('../middlewares/adminAuth')

const upload = require('../middlewares/storage')
const multer = require('multer')//upload de imagens

//router main
router.get('/admin/categories', adminAuth, (req, res)=>{
  Category.findAll().then((categories)=>{
    res.render('admin/categories/index', {
      categories: categories
    })
  })
})

//router create new category
router.get('/admin/categories/new', adminAuth, (req, res)=>{
  res.render('admin/categories/new')
})

//Save database
router.post('/categories/save', upload.single('image'), adminAuth, (req, res)=>{
  let name = req.body.name;
  let icon = req.body.icon;
  let image = req.file ? req.file.filename : null;
  console.log(name, icon, image)

  if(name != undefined){
    Category.create({
      name: name,
      icon: icon,
      image: image,
      slug: slugify(name)
    }).then(()=>{
      res.redirect('/admin/categories')
    })
  }else{
    res.render('admin/categories/new')
  }
})


//Delete category in database
router.post('/categories/delete', adminAuth, (req, res)=>{
  let id = req.body.id;
  if(id != undefined){
    if(!isNaN(id)){//Verifica se id é um numero
      Category.destroy({
        where:{
          id:id
        }
      }).then(()=>{
        res.redirect('/admin/categories')
      })
    }else{
      res.redirect('/admin/categories')
    }
  }else{
    res.redirect('/admin/categories')
  }
})

//router edit category
router.get('/admin/categories/edit/:id', adminAuth, (req, res)=>{
  let id = req.params.id
  console.log(id)
  if(!isNaN(id)){
    Category.findByPk(id).then(category=>{
      if(category != undefined){
        res.render('admin/categories/edit', {
          category: category
        })
      }else{
        res.redirect('/admin/categories')
      }
    }).catch((err)=>{
      res.redirect('/admin/categories')
      console.log(err)
    })
  }else{
    res.redirect('/admin/categories')
  }
})

//Update category in database
router.post('/categories/update', upload.single('image'), adminAuth, (req, res)=>{
  let id = req.body.id;
  let name = req.body.name;
  let icon = req.body.icon;
  let image1 = req.file ? req.file.filename : null;
  let image2 = req.body.image

  let image;
  if(image1 != null){
    image = image1
  }else{
    image = image2
  }


  Category.update({
    name: name,
    icon: icon,
    image: image,
    slug: slugify(name)
  }, { 
    where:{ 
    id: id
    }
  }).then(()=>{
    res.redirect('/admin/categories')
  }).catch(err=>{
    res.redirect('/admin/categories')
    console.log(err)
  })
})



module.exports = router