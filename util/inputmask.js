
// Máscara de CPF
document.addEventListener('DOMContentLoaded', () => {
  const cpfInput = document.getElementById('cpf');
  if (cpfInput) {
    Inputmask("999.999.999-99").mask(cpfInput);
  }
})

// Máscara de RG
document.addEventListener('DOMContentLoaded', () => {
  const rgInput = document.getElementById('rg');
  if (rgInput) {
    Inputmask("99.999.999-9").mask(rgInput);
  }
})

// Máscara de celular
document.addEventListener('DOMContentLoaded', () => {
  const phoneInput = document.getElementById('phone');
  if (phoneInput) {
    Inputmask("(99) 99999-9999").mask(phoneInput);
  }
})

// Máscara de CEP
document.addEventListener('DOMContentLoaded', () => {
  const cepInput = document.getElementById('cep');
  if (cepInput) {
    Inputmask("99.999-999").mask(cepInput);
  }
})