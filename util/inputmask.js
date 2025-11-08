
document.addEventListener('DOMContentLoaded', () => {
  // Máscara de CPF
  const cpfInput = document.getElementById('cpf')
  if (cpfInput) {
    Inputmask("999.999.999-99").mask(cpfInput)
  }
  // Máscara de RG
  const rgInput = document.getElementById('rg')
  if (rgInput) {
    Inputmask("99.999.999-9").mask(rgInput)
  }
  // Máscara de celular
  const phoneInput = document.getElementById('phone')
  if (phoneInput) {
    Inputmask("(99) 99999-9999").mask(phoneInput)
  }
  // Máscara de CEP
  const cepInput = document.getElementById('cep')
  if (cepInput) {
    Inputmask("99.999-999").mask(cepInput)
  }
})