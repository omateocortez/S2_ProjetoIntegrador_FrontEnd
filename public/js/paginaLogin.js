document.querySelector('#loginForm').addEventListener('submit', function(event){

    event.preventDefault()

    const form = event.target
    const formData = new FormData(form)

    const formDataObject = Object.fromEntries(formData);

    fetch(form.action, {
        method: form.method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formDataObject)
    })
    .then(response => response.json())
    .then(data => {
        if (data.ok) {
            const referrer = document.referrer
            console.log(referrer)
            if(referrer && !referrer.includes('/Cadastro')){
                window.location.href = referrer   
            } else{
                window.location.href = '/Home'
            }
        } else {
            console.log('Erro:', data.mensagem)
            alert(data.mensagem)
        }
    })
    .catch(error => {
        console.error('Error ao realizar login:', error)
        alert('Erro! Por favor, tente novamente mais tarde.')
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

document.getElementById('esqueceuSenhaButton').addEventListener('click', function(event) {
    event.preventDefault()
    
    var myModal = new bootstrap.Modal(document.getElementById('accessCodeModal'))
    
    usermail = document.getElementById('email').value
    
    if(!usermail){
        alert('Preencha o campo com o seu e-mail e tente novamente!')
        return
    }

    myModal.show()

    let data = {
        email: usermail
    }
    
    fetch(`/users/sendcode`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    }).then(response => response.json())
    .then(data => {
        if (data.ok) {
            console.log('Código enviado.')
        } else {
            alert(data.mensagem)
            console.warn('Erro ao enviar código!')
        }
    })
    .catch(err => {
        console.error(err)
        alert('Erro ao enviar código.')
    })

})

document.getElementById('checkCodeButton').addEventListener('click', function(event) {
    event.preventDefault()
    
    usermail = document.getElementById('email').value
    code = document.getElementById('codeInput').value

    console.log(code)
    
    if(!usermail){
        alert('Preencha o campo com o seu e-mail e tente novamente!')
        return
    }

    let data = {
        email: usermail,
        code: code
    }

    console.log(data)
    
    fetch(`/users/checkcode`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    }).then(response => response.json())
    .then(data => {
        if (data.ok) {
            const referrer = document.referrer
            console.log(referrer)
            if(referrer && !referrer.includes('/Cadastro')){
                window.location.href = referrer   
            } else{
                window.location.href = '/Home'
            }
        } else {
            console.log('Acesso negado:', data.mensagem)
            alert(data.mensagem)
        }
    })
    .catch(err => {
        console.error(err)
        alert('Erro ao validar código.')
    })

})
