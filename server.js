const express = require('express')
const app = express()
const ejs = require('ejs')
const statesData = require('./assets/data/br-states.json')
const _port = 3000

app.use('/bootstrap', express.static('./node_modules/bootstrap/dist'))
app.use('/sweetalert', express.static('./node_modules/sweetalert2/dist'))
app.use('/inputmask', express.static('./node_modules/inputmask/dist'))
app.use('/util', express.static('./util'))
app.use('/assets', express.static('./assets'))

app.set('view engine', 'ejs');
app.set('views', './views');


app.get('/', (req, res) => {
  res.render('login-page')
//   res.render('register-page', { states: statesData.states })
})

app.listen(_port, (error) =>{
    if(!error)
        console.log("Server is Running and listening on port "+ _port);
    else 
        console.log("Error occurred, server can't start", error);
    }
);