# Site para a ONG Mãos Na Massa

## Configurando:
Começe instalando o Node.js:
https://nodejs.org/

Depois, baixe/clone o repositório no seu computador.

Após baixar/clonar o repositório, abra o terminal<sub>(no diretório do projeto)</sub> e digite:<br/>
`npm i nodemon mongoose express dotenv`<br/>
Isso serve para instalar as dependências do projeto.<br/>

Também devemos criar um arquivo ***.env***<sub>(sem nome apenas com a extensão)</sub> e nele devemos colar o seguinte código:<br/>
`MONGODB_URI=mongodb+srv://<usuário>:<senha>@cluster0.qygeu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`<br/>
Se você está lendo isso é porque provavelmente te enviamos o usuário e a senha do cluster, então troque onde temos o `<usuário>` e `<senha>` pelo usuário e senha fornecidos.

## Rodando o site:
Caso tenha feito tudo acima de maneira correta, basta digitar `npm start` no terminal e acessar ***localhost:3000*** no seu navegador.
