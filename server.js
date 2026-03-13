require('dotenv').config()
const express = require('express')
const app = express()
const session = require('express-session')
const mongoDB = require('./config/mongo-config')
const router = require('./routes/index')
const { checkApproved } = require('./util/middleware')
const path = require('path')

const _port = process.env.PORT
const loginRouter = require('./routes/login')
const homepageRouter = require('./routes/homepage')
const registerRouter = require('./routes/register')
const uploadRouter = require('./routes/upload')
const downloadRouter = require('./routes/download')
const adminRouter = require('./routes/admin')
const passResetRouter = require('./routes/passreset')
const certificateRouter = require('./routes/certificate')


app.use('/bootstrap', express.static('./node_modules/bootstrap/dist'))
app.use('/sweetalert', express.static('./node_modules/sweetalert2/dist'))
app.use('/inputmask', express.static('./node_modules/inputmask/dist'))
app.use('/util', express.static('./util'))
app.use('/assets', express.static('./assets'))

app.set('view engine', 'ejs')
app.set('views', './views')

app.use(express.urlencoded({ extended: false }))

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { 
    maxAge: 1000 * 60 * 60, //1 hora
    httpOnly: true
  } 
}))

app.use(
    '/curso',
    checkApproved,
    express.static(path.join(__dirname, 'curso'))
)

mongoDB().then((db) => {
    app.locals.db = db
  
    router.use(loginRouter)
    router.use(homepageRouter)
    router.use(registerRouter)
    router.use(uploadRouter)
    router.use(downloadRouter)
    router.use(adminRouter)
    router.use(passResetRouter)
    router.use(certificateRouter)
    
    app.use(router)
})


app.listen(_port, (error) =>{
    if(!error)
        console.log("Server is Running and listening on port "+ _port)
    else 
        console.log("Error occurred, server can't start", error)
    }
);