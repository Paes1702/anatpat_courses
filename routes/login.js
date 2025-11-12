const express = require('express');
const router = express.Router();

// Rota para a homepage
router.get('/login', (req, res) => {
  res.render('login-page');
});

router.post('/login', function (req, res) {
  res.send('POST request to the homepage')
})

module.exports = router;