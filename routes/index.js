const express = require('express')
const router = express.Router()

// Rota para a homepage
router.get('/', (req, res) => {
  if(req.session.user) {
    res.redirect(res.locals.basePath + '/homepage')
  } else {
    res.redirect(res.locals.basePath + '/login')
  }
});

module.exports = router
