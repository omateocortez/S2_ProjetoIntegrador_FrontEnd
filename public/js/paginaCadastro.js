import { getUserAccessInfo } from '/utils/utils.js'

let userAccessInfo = null


document.addEventListener("DOMContentLoaded", async function() {

    userAccessInfo = await getUserAccessInfo()

    const funcButton = document.getElementById('cadastrar-como-func')

    if(userAccessInfo.isFunc){
        funcButton.style.display = 'block'
    }
})

// Toggle de visibilidade para o campo "Senha"
document.getElementById('togglePassword1').addEventListener('click', function () {
    const passwordInput = document.getElementById('Senha');
    const icon = this.querySelector('.material-symbols-rounded');

    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        icon.textContent = 'visibility';
        this.classList.add('visibility-inactive');
        this.classList.remove('visibility-active');
    } else {
        passwordInput.type = 'password';
        icon.textContent = 'visibility_off';
        this.classList.add('visibility-active');
        this.classList.remove('visibility-inactive');
    }
});

// Toggle de visibilidade para o campo "Confirme sua Senha"
document.getElementById('togglePassword2').addEventListener('click', function () {
    const passwordInput = document.getElementById('confirmaSenha');
    const icon = this.querySelector('.material-symbols-rounded');

    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        icon.textContent = 'visibility';
        this.classList.add('visibility-inactive');
        this.classList.remove('visibility-active');
    } else {
        passwordInput.type = 'password';
        icon.textContent = 'visibility_off';
        this.classList.add('visibility-active');
        this.classList.remove('visibility-inactive');
    }
});

function verificarSenhas() {
    const senha = document.getElementById('Senha');
    const confirmaSenha = document.getElementById('confirmaSenha');

    if (senha.value === confirmaSenha.value && senha.value.length >= 8) {
        // Adiciona o estilo de validação verde em ambos os campos
        senha.classList.add('is-valid');
        senha.classList.remove('is-invalid');
        confirmaSenha.classList.add('is-valid');
        confirmaSenha.classList.remove('is-invalid');
    } else {
        // Mostra o estilo de erro apenas no campo de confirmação
        senha.classList.remove('is-valid');
        confirmaSenha.classList.add('is-invalid');
        confirmaSenha.classList.remove('is-valid');
    }
}


// Adiciona o evento de input para verificar em tempo real
document.getElementById('confirmaSenha').addEventListener('input', verificarSenhas);

// Adiciona o evento de clique no botão Confirmar para a verificação final
document.querySelector('.confirmar').addEventListener('click', function () {

    verificarSenhas();

    const senha = document.getElementById('Senha').value;
    const confirmaSenha = document.getElementById('confirmaSenha').value;

    if (senha === confirmaSenha) {

        const formData = {
            nome: form1.querySelector('[name="nome"]').value,
            sobrenome: form1.querySelector('[name="sobrenome"]').value,
            email: form2.querySelector("#email").value,
            senha: form2.querySelector("#Senha").value,
        }

        if(userAccessInfo.isFunc){
            if(document.querySelector('[name=funcCheck]').checked){
                formData.funcionario = true
            }

            fetch('/users/signup-func', { //signup-func checa se é adm
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            })
            .then(response => {
                if (response.redirected) {
                    console.log('Redirecting...');
                    window.location.href = response.url;
                }else{
                    return response.json()
                }
            })
            .then(data =>{
                if(!data.ok){
                    alert(data.mensagem)
                }
                else{
                    console.log(data.mensagem)
                }
            })
            .catch(err => console.log(err))

        }else{ // se n for um funcionario cadastrando...

            fetch('/users/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            })
            .then(response => {
                if (response.redirected) {
                    console.log('Redirecting...');
                    window.location.href = response.url;
                }else{
                    return response.json()
                }
            })
            .then(data =>{
                if(!data.ok){
                    alert(data.mensagem)
                }else{
                    console.log(data.mensagem)
                }
            })
            .catch(err => console.log(err))
        }
    }else {
        alert("As senhas não conferem. Verifique e tente novamente.");
    }
});

