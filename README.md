# Site para a ONG Mãos Na Massa

## Configurando:
Começe instalando o Node.js:
https://nodejs.org/

Depois, baixe/clone o repositório no seu computador.

Após baixar/clonar o repositório, abra o terminal<sub>(no diretório do projeto)</sub> e cole o seguinte texto:<br/>
######
    npm i nodemon mongoose express dotenv multer cors;
    npm i bcrypt --legacy-peer-deps mongoose-unique-validator --legacy-peer-deps jsonwebtoken --legacy-peer-deps;
Isso serve para instalar as dependências do projeto.<br/>

Se você está lendo isso é porque provavelmente te enviamos um arquivo ***.env***. Esse arquivo contém informações essenciais para o funcionamento do servidor, então é extremamente importante que ele seja colocado na pasta do projeto.

## Rodando o site:
Caso tenha feito tudo acima de maneira correta, basta digitar `npm start` no terminal e acessar ***localhost:3000*** no seu navegador.
