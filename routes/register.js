const express = require('express');
const router = express.Router();

// Rota para a homepage
router.get('/register', (req, res) => {
  res.render('register-page');
});

module.exports = router;