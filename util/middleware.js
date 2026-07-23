const mongoUsers = require('../models/Users')
const { ObjectId } = require('mongodb')

function checkApproved(req, res, next) {
    const bp = res.locals.basePath

    if (!req.session || !req.session.user) {
        return res.redirect(bp + '/login')
    }

    if (!req.session.user.approved) {
        return res.redirect(bp + '/homepage/curso')
    }

    const start = new Date(process.env.COURSE_START_DATE)
    const end = new Date(process.env.COURSE_END_DATE)
    const now = new Date()

    if (now < start || now > end) {
        return res.redirect(bp + '/homepage/curso')
    }

    next()
}

//Middleware para validar permissão de administrador
async function isAdmin(req, res, next) {
    const bp = res.locals.basePath

    if (!req.session.user) return res.redirect(bp + '/login')

    const user = await mongoUsers.findUser(req.app.locals.db, { _id: new ObjectId(req.session.userId) })

    if (!user.isAdmin) {
        return res.redirect(bp + '/login')
    }

  next()
}

module.exports = { checkApproved, isAdmin }