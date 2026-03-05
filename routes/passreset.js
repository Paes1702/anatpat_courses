const express = require('express')
const router = express.Router()
const mongoUsers = require('../models/Users')
const { sendPasswordResetEmail } = require('../config/nodemailer-config');
const crypto = require("crypto")
const bcrypt = require("bcrypt");
const { ObjectId } = require('mongodb')

router.get('/forgot-password', async (req, res) => {
    res.render('reset-password-page')
})

router.post('/forgot-password', async (req, res) => {

  const { email } = req.body

  const db = req.app.locals.db

  const user = await mongoUsers.findUser(db, { email: email })

  if (!user) {
    return res.redirect("/login");
  }

  const token = crypto.randomBytes(32).toString("hex");

  const filter = { _id: new ObjectId(user._id) }

  const changeObj = 
    {
        $set: {
            resetToken: token,
            resetTokenExpires: Date.now() + 3600000
        }
    }

  const result = await mongoUsers.updateUser(db, filter, changeObj)

  if (!result.matchedCount) {
    return res.render('reset-password-page', { error: 'Não foi possível gerar o token de redefinição de senha.' })
  }

  sendPasswordResetEmail(token, user.email).catch(err => {
    console.error("Erro ao enviar email: ", err);
  })

  res.render("reset-password-page", { success: `Um email de redefinição de senha foi enviado para ${user.email}.` })
})

router.get('/reset-password/:token', async (req, res) => {

  const db = req.app.locals.db

  const user = await mongoUsers.findUser(db, {
    resetToken: req.params.token,
    resetTokenExpires: { $gt: Date.now() }
  })

  if (!user) {
    return res.render("new-password-page", { error: "Token inválido ou expirado." });
  }

  res.render("new-password-page", {
    token: req.params.token
  })
})

router.post('/reset-password/:token', async (req, res) => {

  if (req.body.password !== req.body.passwordConfirm) {
    return res.render('new-password-page', { token: req.params.token , error: "Favor inserir a mesma senha nos dois campos." })
  }

  const db = req.app.locals.db

  const user = await mongoUsers.findUser(db, {
    resetToken: req.params.token,
    resetTokenExpires: { $gt: Date.now() }
  })

  if (!user) {
    return res.send("Token inválido");
  }

  const hashed = await bcrypt.hash(req.body.password, 10);

  const filter = { _id: new ObjectId(user._id) }

  const changeObj = 
    {
      $set: { password: hashed },
      $unset: {
        resetToken: "",
        resetTokenExpires: ""
      }
    }

  const result = await mongoUsers.updateUser(db, filter, changeObj)

  if (!result.matchedCount) {
    return res.render('new-password-page', { error: 'Não foi possível redefinir a senha.' })
  }

  res.redirect("/login");
})

module.exports = router