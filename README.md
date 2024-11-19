# Site para a ONG Mãos Na Massa

<p align="center">
  <img src="https://github.com/Grupo-P-I-I-Segundo-Semestre/Imagens-Readme/blob/dad100bc6f5d64f4c9091305cd7c10c601494d3e/logo_mnm_preto.png" alt="Logo da ONG">
</p>

## Configurando:
Começe instalando o Node.js:
https://nodejs.org/

Depois, baixe/clone o repositório no seu computador.

Após baixar/clonar o repositório, abra o terminal<sub>(no diretório do projeto)</sub> e cole o seguinte código:
```
npm i nodemon mongoose express dotenv multer cors cookie-parser;
npm i bcrypt mongoose-unique-validator jsonwebtoken --legacy-peer-deps;
```
Isso serve para instalar as dependências do projeto. <sub>[\[clique aqui em caso de erro\]](https://github.com/omateocortez/S2_ProjetoIntegrador_FrontEnd/tree/experimental_backend?tab=readme-ov-file#poss%C3%ADveis-erros)</sub>
</br>

Agora, precisamos criar um arquivo ***.env***. Esse arquivo contém informações essenciais para o funcionamento do servidor, então é extremamente importante que ele esteja presente no diretório do projeto.</br>

![Alt Text](https://github.com/Grupo-P-I-I-Segundo-Semestre/Imagens-Readme/blob/main/gif_env.gif)</br>

Basta criar um arquivo sem nome de extensão **.env** dentro do repositório, depois colar as chaves de acesso que provavelmente te enviamos.

## Rodando o site:
Caso tenha feito tudo acima de maneira correta, basta digitar `npm start` no terminal e acessar ***localhost:3000*** no seu navegador.

![Alt Text](https://github.com/Grupo-P-I-I-Segundo-Semestre/Imagens-Readme/blob/main/gif_server.gif)</br>
</br>

## Possíveis erros:

### 1. Erro de execução restrita:
> "O arquivo não pode ser carregado porque a execução de scripts foi desabilitada neste sistema"

O erro acontece porque o sistema bloqueia a execução de scripts por segurança, para evitar que códigos maliciosos sejam rodados sem permissão.

#### Solução:
Abra o **Windows PowerShell** como administrador e execute o seguinte comando:
```powershell
Set-ExecutionPolicy RemoteSigned
```
Pressione a tecla **Enter** e depois a tecla **A** para confirmar.

#### Caso queira reverter por questões de segurança:
Abra o **Windows PowerShell** como administrador e execute o seguinte comando:
```powershell
Set-ExecutionPolicy Restricted
```
Pressione a tecla **Enter** e depois a tecla **A** para confirmar.
