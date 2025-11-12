function validarCPF(cpf) {
    cpf = cpf.replace(/[^\d]+/g, '') // remove tudo que não for número

    // CPF precisa ter 11 dígitos
    if (cpf.length !== 11) return false

    // Rejeita CPFs com todos os dígitos iguais (tipo 00000000000, 11111111111 etc)
    if (/^(\d)\1+$/.test(cpf)) return false

    // Validação do primeiro dígito verificador
    let soma = 0
    for (let i = 0; i < 9; i++) {
        soma += parseInt(cpf.charAt(i)) * (10 - i)
    }
    let resto = 11 - (soma % 11)
    if (resto === 10 || resto === 11) resto = 0
    if (resto !== parseInt(cpf.charAt(9))) return false

    // Validação do segundo dígito verificador
    soma = 0
    for (let i = 0; i < 10; i++) {
        soma += parseInt(cpf.charAt(i)) * (11 - i)
    }
    resto = 11 - (soma % 11)
    if (resto === 10 || resto === 11) resto = 0
    if (resto !== parseInt(cpf.charAt(10))) return false

    return true // CPF válido
}

function returnCpfError(e) {
    console.log("chamou")
    if(!validarCPF(document.getElementById('cpf').value)) {
        e.preventDefault()
        return Swal.fire({
            title: "Erro!",
            text: "CPF inválido!",
            icon: "error",
            showConfirmButton: true
        })
    }
}

function checkTerms(e) {            
    console.log("chamou")
    if(!document.getElementById('terms').checked){
        e.preventDefault()
        Swal.fire({
            title: "Erro!",
            text: "É necessário aceitar os termos para concluir o registro",
            icon: "error",
            showConfirmButton: true
        })
    }            
}

module.exports = checkTerms,returnCpfError