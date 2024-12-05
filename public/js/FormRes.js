document.addEventListener('DOMContentLoaded', function(){
        const formulario = document.getElementById('formulario_residencia')
    
    formulario.addEventListener('submit', async function(event){
        event.preventDefault()
    
        let assunto = 'Novo Formulário Residencial'
    
        let html = `
        <html>
            <body>
                <h1>Formulário Residencial</h1>
                
                <p><strong>Nome Completo:</strong> ${document.getElementById('nome').value}</p>
                <p><strong>Idade:</strong> ${document.getElementById('idade').value}</p>
                <p><strong>Endereço:</strong> ${document.getElementById('endereco').value}</p>
                <p><strong>Telefone:</strong> ${document.getElementById('telefone').value}</p>
                <p><strong>Email:</strong> ${document.getElementById('email').value}</p>
                <p><strong>Condição Atual de Moradia:</strong>${pegarResposta('cond_moradia')}</p>
                <p><strong>Grau de Escolarização:</strong>${pegarResposta('grau_escola')}</p>
                <p><strong>Renda Familiar:</strong>${pegarResposta('renda_fam')}</p>
                <p><strong>Número de Moradores na Residência:</strong> ${document.getElementById('qtd_pessoas').value}</p>
                <p><strong>Existem Portador(es) de Deficiência na Residência:</strong>${pegarResposta('defs')}</p>
                <p><strong>Tipo De Deficiência:</strong>${pegarResposta('tipo_def')}</p>
                <p><strong>Principal Necessidade:</strong>${pegarResposta('necessidade_accesso')}</p>
                <p><strong>Já Tentou Adaptar a Residência:</strong>${pegarResposta('tentou_reforma')}</p>
                <p><strong>Principais Dificuldades Enfrentadas Na Adaptação:</strong>${pegarResposta('dificuldades')}</p>
                <p><strong>Segurança e Acessibilidade da Residência:</strong>${pegarResposta('feedback_acesso')}</p>
                <p><strong>Impacto da Reforma:</strong>${pegarResposta('melhorias')}</p>
                <p><strong>Principais Dificuldades Enfrentadas No Dia a Dia:</strong> ${document.getElementById('ajuda').value}</p>
                <p><strong>De Que Forma Podemos Ajudar:</strong>${document.getElementById('ajudar_melhoria').value}</p>
                <p><strong>Gostaria de Receber informações:</strong>${pegarResposta('receber_info')}</p>
                <p><strong>Como Ficou Sabendo da ONG:</strong>${pegarResposta('saber_MNM')}</p>
            </body>
        </html>
        `

        let data = {
            assunto: assunto,
            html: html
        }
        
        fetch(`/sendforms`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        }).then(response => response.json())
        .then(data => {
            if (data.ok) {
                console.log('Formulário enviado.')
                location.reload()
            } else {
                alert(data.mensagem)
                console.warn('Erro ao enviar formulário!')
            }
        })
        .catch(err => {
            console.error(err)
            alert('Erro ao enviar formulário.')
        })

    })
})

function pegarResposta(name){
    const selecionado = document.querySelector(`input[name="${name}"]:checked`);
    
    if (selecionado) {
        if (selecionado.id && selecionado.id.toLowerCase().includes("outro")) {
            const otherTextInputId = `${selecionado.id}_texto`;
            const otherTextInput = document.getElementById(otherTextInputId);
            return otherTextInput ? otherTextInput.value : "\nUsuário clicou em 'outro' mas não digitou nada.";
        }
        
        const label = document.querySelector(`label[for="${selecionado.id}"]`);
        return label ? label.textContent : "\nErro ao registrar resposta.";
    }
    else return "\nUsuário não selecionou nada (Opcional)."
}