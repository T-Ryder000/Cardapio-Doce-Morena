const express = require('express')
const router = express.Router()
const User = require('./User')
const bcrypt = require('bcrypt')
const adminAuth = require('../middlewares/adminAuth')

router.get('/admin/users', adminAuth, (req, res)=>{
  User.findAll().then(users=>{
    res.render('admin/users/index', {
      users: users
    })
  })
})

router.get('/user', adminAuth, (req, res)=>{
  User.findAll().then(users=>{
    res.render('userClient', {
      users: users
    })
  })
})

router.get('/admin/users/new', adminAuth, (req, res)=>{
  res.render('admin/users/new')
})

router.post('/users/new', (req, res)=>{
  let name = req.body.name
  let email = req.body.email
  let password = req.body.password

  User.findOne({where:{email:email}}).then(user=>{
    if(user == undefined){
      let salt = bcrypt.genSaltSync(10)
      let hash = bcrypt.hashSync(password, salt)

      User.create({
        name: name,
        email: email,
        password: hash
      }).then(()=>{
        res.redirect('/')
      }).catch(()=>{
        res.redirect('/')
      })
    }else{
      res.redirect('/admin/users/new')
    }
  })
})



//Delete product in database
router.post('/users/delete', adminAuth,  (req, res)=>{
  let id = req.body.id;
  if(id != undefined){
    if(!isNaN(id)){//Verifica se id é um numero
      User.destroy({
        where:{
          id:id
        }
      }).then(()=>{
        res.redirect('/admin/users')
      })
    }else{
      res.redirect('/admin/users')
    }
  }else{
    res.redirect('/admin/users')
  }
})


//router edit product
router.get('/admin/users/edit/:id', adminAuth,  (req, res)=>{
  let id = req.params.id
  console.log(id)
  if(!isNaN(id)){
    User.findByPk(id).then(user=>{
      if(user != undefined){
        res.render('admin/users/edit', {
          user: user
        })
      }else{
        res.redirect('/admin/users')
      }
    }).catch((err)=>{
      res.redirect('/admin/users')
      console.log(err)
    })
  }else{
    res.redirect('/admin/users')
  }
})


//Update product in database
router.post('/users/update', adminAuth,  (req, res)=>{
  let id = req.body.id;
  let name = req.body.name
  let email = req.body.email;
  let password = req.body.password

      let salt = bcrypt.genSaltSync(10)
      let hash = bcrypt.hashSync(password, salt)

      User.update({
        name: name,
        email: email,
        password: hash
        }, { 
          where:{ 
          id: id
          }
        }).then(()=>{
          res.redirect('/admin/users')
        }).catch(err=>{
          res.redirect('/admin/users')
          console.log(err)
        })

})


router.get('/login', (req, res)=>{
  res.render('admin/users/login')
})

router.post('/authenticate', (req, res)=>{
  let email = req.body.email
  let password = req.body.password
  User.findOne({
      where:{
        email: email
      }}).then(user=>{
        if(user != undefined){

          console.log('Senha fornecida:', password);
          console.log('Senha armazenada (hash):', user.password);
          console.log(email, " e ", password)
          let correct = bcrypt.compareSync(password, user.password)
          console.log(correct)
          if(correct){
            req.session.user = {
              id: user.id,
              email: user.email
            }
            res.redirect('/admin/products')
          }else{
            res.redirect('/login')
          }
        }else{
          res.redirect('/login')
          console.log('fala')
        }
  })
})

router.get('/logout', (req, res)=>{
  req.session.user = undefined
  res.redirect('/')
})

module.exports = router