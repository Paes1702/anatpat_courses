const express = require('express');
const router = express.Router();

// Rota para a homepage
router.get('/', (req, res) => {
  res.render('index', { title: 'Página Inicial' });
});

module.exports = router;