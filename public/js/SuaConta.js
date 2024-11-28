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
        email: document.getElementById('email').value
    }

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
    .then(response => response.json())
    .then(data => {
        if (data.ok) {
            console.log('Usuário atualizado.')
        } else {
            alert(data.mensagem)
            console.log('Erro ao atualizar usuário.')
        }
    })
    .catch(err => {
        console.error(err)
        alert('Erro ao atualizar usuário.')
    })
})

document.getElementById('togglePassword').addEventListener('click', function () {
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
                    const passModalInstance = bootstrap.Modal.getInstance(passModal);
                    passModalInstance.hide()
                } else {
                    alert(data.mensagem)
                    console.log('Erro ao atualizar usuário.')
                }
            })
            .catch(err => { 
                console.error(err)
                alert('Erro ao atualizar usuário.')
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