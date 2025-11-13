const express = require('express')
const router = express.Router()
const mongo = require('../models/Users')
const statesData = require('../assets/data/br-states.json')
const validators = require('../util/validators')

router.get('/register', (req, res) => {
    res.render('register-page', { states: statesData.states, error: undefined })
})

router.post('/register', async (req, res) => {
    
    let errors = ''

    let obj = req.body

    if(obj.password !== obj.passwordConfirmation) {
        errors = 'A senha de confirmação está diferente da senha inserida.'
        return res.render('register-page', { states: statesData.states, error: errors })
    }

    console.log(obj)

    if(!validators.validateUserObject(obj)) {
        errors = 'Favor preencher todos os campos requisitados.'
        return res.render('register-page', { states: statesData.states, error: errors })
    }

    let newUser = {
        nome: obj.name,
        endereco: obj.address,
        cidade: obj.city,
        estado: obj.state,
        cep: obj.cep,
        celular: obj.phone,
        email: obj.email,
        cpf: obj.cpf,
        rg: obj.rg,
        crm: obj.crm,
        ufCrm: obj.crmState,
        password: obj.password,
        hasPaid: false
    }

    if(await mongo.findUser(req.app.locals.db, { cpf: obj.cpf })){
        errors = 'Um usuário com esse CPF já está cadastrado.'
        return res.render('login-page', { error: errors })
    } else if(await mongo.findUser(req.app.locals.db, { email: obj.email })){
        errors = 'Este e-mail já está em uso.'
        return res.render('login-page', { error: errors })
    } else {
        await mongo.insertUser(req.app.locals.db, newUser)
    }


    if(!validators.validateCpf(obj.cpf)) {
        errors += '- O número do CPF é inválido!\n'
    }

    if(!obj.terms) {
        errors += '- É necessário aceitar os termos para concluir o registro.\n'
    }

    if(!obj.email.includes("@", ".")) {
        errors += '- O e-mail inserido é inválido.\n'
    }
    
    if(!errors) {
        return res.render('home-page')
    } else {
        return res.render('register-page', { states: statesData.states, error: errors })
    }
})

module.exports = router