const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail', // ou outro
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
})

async function sendApprovalEmail(user) {
  const mailOptions = {
    from: `"AnatPat Cursos" <${process.env.EMAIL_USER}>`,
    to: user.email,
    subject: 'Sua conta foi aprovada!',
    html: `
      <h2>Parabéns, ${user.nome}!</h2>
      <p>Sua conta foi aprovada por um administrador.</p>
      <p>Agora você já pode acessar a plataforma de cursos no link abaixo com o mesmo usuário e senha criados normalmente.</p>
      <a href="${process.env.LINK_CURSOS}">Fazer login</a>
    `
  }

  return transporter.sendMail(mailOptions);
}

async function sendPasswordResetEmail(token, email) {

  const link = `${process.env.BASE_URL}/reset-password/${token}`

  const mailOptions = {
    from: `"AnatPat Cursos" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Redefinir senha",
    html: `
      <h3>Redefinição de senha</h3>
      <p>Clique no link abaixo:</p>
      <a href="${link}">Redefinir Senha</a>
    `
  }

  return transporter.sendMail(mailOptions);
}

module.exports = { sendApprovalEmail, sendPasswordResetEmail };