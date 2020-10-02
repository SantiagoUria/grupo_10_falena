const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt');

const { validationResult } = require('express-validator');
const { title } = require('process');


const dbUser = require(path.join(__dirname, '..', 'data', 'dbUser'))


module.exports = {
    login: (req, res, next) => {
        res.render('login', {
            css: 'login.css',
            menu: 'user',
            title: 'Ingresar'
        });
    },
    loginProcess: (req, res, next) => {
        let errors = validationResult(req);
        if(errors.isEmpty()){
            dbUser.forEach(user => {
                if(user.email == req.body.email){
                    req.session.user = {
                        id: user.id,
                        nick: user.firstname + " " + user.lastname,
                        email: user.email,
                    }
                }
            })
            if(req.body.remember){
                res.cookie('userFalena', req.session.user, { maxAge: 1000 * 60 * 60 })
            }
            res.redirect('/')
        } else {
            res.render('login', {
                title: "Ingresar",
                css: "login.css",
                menu: 'user',
                errors: errors.mapped(),
                old: req.body
            })
            res.send(errors)
        }
    },
    register: (req, res) => {
        res.render('register', {
            css: 'register.css',
            menu: 'user',
            title: 'Registrarse'
        });
    },
    registerProcess: (req, res) => {
        let errors = validationResult(req);
        let lastID = 0;
        if(dbUser.length != 0){
            dbUser.forEach(user => {
                if(user.id > lastID){
                    lastID = user.id
                }
            })
        }
        if(errors.isEmpty()){
            let newUser = {
                id: lastID + 1,
                first_name: req.body.firstname.trim(),
                last_name: req.body.lastname.trim(),
                email: req.body.email.trim(),
                password:bcrypt.hashSync(req.body.password,10),
                rol:"user"
            }
            dbUser.push(newUser);
            fs.writeFileSync(path.join(__dirname,'..','data','dbUser.json'),JSON.stringify(dbUser),'utf-8')
    
            return res.redirect('/user/login')
        }else{
            res.render('re',{
                title:"Registro de Usuario",
                css:"register.css",
                errors:errors.mapped(),
                old:req.body
            })
        }
       
    },
    cart: (req, res, next) => {
        res.render('cart', {
            css: 'cart.css',
            menu: 'user'
        })
    }
}