# EM DESENVOLVIMENTO

# Agenda Fácil
Sistema de Agendamento Inteligente
Projeto Integrador SENAC - 4º Semestre 

## Sobre o Projeto
O AgendaFácil é uma solução web e mobile desenvolvida para facilitar o processo de agendamento de serviços entre prestadores de serviços e clientes. Esta API RESTful fornece todos os endpoints necessários para gerenciar o sistema completo de agendamentos.

# -------daqui pra baixo infos de config do backend-------

# Backend

Configuração e execução do **Backend** do projeto.

API RESTful desenvolvida em **Node.js** com **Express.js** de framework e **MySQL** como banco de dados.

## Pré requisitos

Para rodar o backend, você precisará ter instalado em sua máquina:

1.  **Node** (versão 14.0.0 >)
2.  **npm** (versão 6.0.0 >)
3.  **MySQL Server** (3.6.5 > ou um ambiente de banco de dados compatível, como MariaDB)

## Instalação e Configuração

Siga os passos abaixo para configurar o ambiente do backend.

### 1. Clonar o Repositório

Primeiro, clone o repositório e navegue até a pasta do backend:

```bash
git clone https://github.com/louisemorais/ProjetoIntegradorSenac
cd ProjetoIntegradorSenac/agendaFacil/backend
```

### 2. Instalar Dependências

Instale as dependências do Node.js listadas no `package.json`:

```bash
npm install
```

### 3. Configurar Variáveis de Ambiente

O projeto utiliza um arquivo `.env` para gerenciar as variáveis de ambiente, especialmente as de conexão com o banco de dados.

1.  Crie um arquivo chamado `.env` na pasta `agendaFacil/backend`, copiando o conteúdo do arquivo `.env.example`:

    ```bash
    cp .env.example .env 
    ```

2.  Edite o arquivo `.env` e preencha as variáveis de conexão com o seu banco de dados MySQL:

    ```env
    # Porta do servidor
    PORT=3001

    # Configuração do MySQL
    DB_HOST=localhost
    DB_USER=root # ou o seu usuário do mysql
    DB_PASSWORD=seu_password_do_mysql # **SUBSTITUA** pelo seu password
    DB_NAME=agendafacil

    # Ambiente
    NODE_ENV=development
    ```

    **!!!! A T E N Ç Ã O !!!!:** Substitua `seu_password_do_mysql` pela senha do seu usuário MySQL. e apague os comentarios em cada linha de configuração, somente os comentários nas linhas de configuração!!!!!

## Configuração do Banco de Dados (MySQL)

O banco de dados deve ser configurado manualmente.

### 1. Instalar o MySQL

Se você ainda não tem o MySQL instalado, siga as instruções para o seu sistema operacional.

#### **Instalação no Linux (Debian/Ubuntu/Mint)**

```bash
# Atualizar a lista de pacotes
sudo apt update
# Instalar o servidor MySQL
sudo apt install mysql-server
# Rodar o script de segurança se você quiser, mas não é necessário
sudo mysql_secure_installation
```

#### **Instalação no Windows**

Se usar windows (kkkkkkkkkkkkkkk) baixe o  **MySQL Installer** no site oficial (https://dev.mysql.com/downloads/installer/). Quando estiver instalando, crie seu usuário que você irá fazer login para testar (por padrão é `root`) e a senha que você definir.

### 2. Criar o Banco de Dados e as Tabelas

O arquivo `database.sql` contém o script completo para criar o banco de dados e todas as tabelas necessárias.

1.  **Acessar o MySQL:**

    ```bash
    mysql -u seu_usuario -p
    # troque seu_usuario pelo usuário criado na configuração e digite sua senha quando solicitado
    ```

    *Se você estiver usando o usuário `root` e não tiver definido senha, pode ser apenas `mysql -u root`.*

2.  **Executar o Script SQL:**

    Dentro do console do MySQL, execute o script:

    ```sql
    SOURCE /caminho/completo/para/ProjetoIntegradorSenac/agendaFacil/backend/database.sql;
    ```

    **Exemplo no Linux:**
    ```sql
    SOURCE /home/usuario/ProjetoIntegradorSenac/agendaFacil/backend/database.sql;
    ```

    O script irá:
    *   Criar o banco de dados `agendafacil`.
    *   Criar as tabelas `usuarios`, `prestadores`, `servicos`, `agendamentos`, etc.

### 3. Gerenciamento de Permissões (Opcional mas eu particularmente recomendo)

Se você estiver usando um usuário MySQL diferente de `root` e ele não tiver permissões para criar bancos de dados, você precisará conceder as permissões necessárias.

No console do MySQL:

```sql
-- Conceder todas as permissões no banco 'agendafacil' para um usuário específico
GRANT ALL PRIVILEGES ON agendafacil.* TO 'seu_usuario'@'localhost' IDENTIFIED BY 'sua_senha';
FLUSH PRIVILEGES;
```

**Nota:** Substitua `'seu_usuario'` e `'sua_senha'` pelos valores corretos.

## Executando o Servidor

Com as dependências instaladas e o banco de dados configurado, você pode iniciar o servidor.

### Modo de Desenvolvimento

Utiliza `nodemon` para reiniciar o servidor automaticamente a cada alteração de arquivo.

```bash
npm run dev
```

O servidor estará rodando em `http://localhost:3001` (ou na porta definida no seu `.env`).

### Modo de Produção

Inicia o servidor usando o Node.js diretamente.

```bash
npm start
```

## Estrutura do Projeto (Somente backend)

A estrutura da pasta `backend` é a seguinte:

```
agendaFacil/backend/
├── node_modules
├── .env.example
├── database.sql
├── package-lock.json
├── package.json
├── server.js
└── ...                  
```

---
