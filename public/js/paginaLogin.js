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