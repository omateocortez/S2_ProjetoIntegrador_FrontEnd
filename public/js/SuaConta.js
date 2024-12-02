import { getUserAccessInfo } from '/utils/utils.js'

let userAccessInfo = null

const infoForm = document.getElementById('infoForm')

const passModal = document.getElementById('changePasswordModal')

const deleteModal = document.getElementById('DeleteUser')

const userId = document.getElementById('SuaConta').getAttribute('user-id')

document.addEventListener('DOMContentLoaded', async function(){
    userAccessInfo = await getUserAccessInfo()
})

infoForm.addEventListener('submit', function(event){
    event.preventDefault()

    const update_data = {
        nome: document.getElementById('nome').value,
        sobrenome: document.getElementById('sobrenome').value,
        email: document.getElementById('email').value,
        recebeForms: document.getElementById('mail-toggle').checked
    }
    console.log(document.getElementById('mail-toggle').checked)
    console.log(update_data)

    if(!userAccessInfo || !userAccessInfo.isAuthenticated){
        alert('Erro de autenticação.')
        return
    }

    fetch(`/users/update/${userId}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(update_data)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json()
    })
    .then(data => {
        if (data.ok) {
            console.log('Usuário atualizado.')
        } else {
            alert(data.mensagem)
            console.log('Erro ao atualizar usuário.')
        }
    })
    .catch(err => {
        alert('Erro ao atualizar usuário.')
        console.warn('Erro ao atualizar usuário.')
        console.error(err)
    })
})

passModal.addEventListener('show.bs.modal', function(event) {
    
    const confirmButton = passModal.querySelector('#saveNewPass')

    confirmButton.onclick = function() {
        if(!userAccessInfo || !userAccessInfo.isAuthenticated){
            alert('Erro de autenticação.')
            return
        }

        const nova_senha = document.getElementById('newPassword').value
        const confirma_nova_senha = document.getElementById('confirmPassword').value

        if(nova_senha.length < 8 ){
            alert('Senha precisa de no mínimo 8 caractéres.')
            return
        }

        if(nova_senha.length >= 8 && nova_senha === confirma_nova_senha){

            const update_data = {
                nova_senha: nova_senha
            }


            fetch(`/users/update/${userId}`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(update_data)
            })
            .then(response => response.json())
            .then(data => {
                if (data.ok) {
                    console.log('Usuário atualizado.')
                    const passModalInstance = bootstrap.Modal.getInstance(passModal)
                    passModalInstance.hide()
                } else {
                    alert(data.mensagem)
                    console.warn('Erro ao atualizar usuário.')
                }
            })
            .catch(err => { 
                alert('Erro ao atualizar usuário.')
                console.warn('Erro ao atualizar usuário.')
                console.error(err)
            })
        }
    }
    
})

deleteModal.addEventListener('show.bs.modal', function(event) {

    const deleteButton = deleteModal.querySelector('#delete_absolute_button')

    deleteButton.onclick = function() {
        if(!userAccessInfo || !userAccessInfo.isAuthenticated){
            alert('Erro de autenticação.')
            return
        }

        fetch(`/users/delete/${userId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        })
        .then(response => {
            if(response.ok){
                return response.json()
            }else{
                return response.text().then(text => {
                    throw new Error(`Request failed: ${response.status}, Response: ${text}`)
                })
            }
        })
        .then(data => {
            if(data.ok){
                fetch(`/users/logout/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include'
                })
                window.location.href = '/Home'
            }else{
                alert(data.mensagem)
            }
        })
        .catch(err => {
            console.error(err)
            alert('Erro ao deletar usuário.')
        })
    }
})

document.querySelectorAll('.btn-visibility').forEach(button => {
    button.addEventListener('click', function () {
        const input = this.previousElementSibling // Campo de entrada correspondente
        const icon = this.querySelector('.material-symbols-rounded')

        if (input.type === 'password') {
            input.type = 'text'
            icon.textContent = 'visibility'
            this.classList.remove('visibility-inactive')
            this.classList.add('visibility-active') // Estado ativo
        } else {
            input.type = 'password'
            icon.textContent = 'visibility_off'
            this.classList.remove('visibility-active')
            this.classList.add('visibility-inactive') // Estado inativo
        }
    })
})


document.addEventListener("DOMContentLoaded", () => {
    const newPassword = document.getElementById("newPassword")
    const confirmPassword = document.getElementById("confirmPassword")

    // Função de validação
    function validarSenhas() {

        if (newPassword.value.length >= 8 && newPassword.value === confirmPassword.value) {
            // Adiciona classes de sucesso
            newPassword.classList.add("is-valid")
            newPassword.classList.remove("is-invalid")
            confirmPassword.classList.add("is-valid")
            confirmPassword.classList.remove("is-invalid")
        } else {
            // Adiciona classes de erro
            newPassword.classList.add("is-invalid")
            newPassword.classList.remove("is-valid")
            confirmPassword.classList.add("is-invalid")
            confirmPassword.classList.remove("is-valid")
        }
    }

    // Eventos para validação em tempo real
    newPassword.addEventListener("input", validarSenhas)
    confirmPassword.addEventListener("input", validarSenhas)
})

