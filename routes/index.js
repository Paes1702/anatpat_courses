const express = require('express')
const router = express.Router()

// Rota para a homepage
router.get('/', (req, res, next) => {
  if(req.session.user) {
    res.redirect('/homepage')
  } else {
    res.redirect('/login')
  }
});

module.exports = router