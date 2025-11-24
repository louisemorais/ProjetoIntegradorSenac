# Agenda Fácil

## Sobre o Projeto
O AgendaFácil é uma solução web e mobile desenvolvida para facilitar o processo de agendamento de serviços entre prestadores de serviços e clientes. Esta API RESTful fornece todos os endpoints necessários para gerenciar o sistema completo de agendamentos.

## Sobre o Frontend

Interface Web desenvolvida em **React** com **Vite** para o sistema de agendamento online Agenda Fácil.

O frontend do Agenda Fácil é uma aplicação web moderna que conecta clientes e prestadores de serviços através de uma interface intuitiva. Desenvolvida com React e Material-UI, oferece uma experiência de usuário fluida e profissional.

## Tecnologias Utilizadas

- **React 19.1.1** - Biblioteca JavaScript para interfaces de usuário
- **Vite 7.1.7** - Build tool e dev server extremamente rápido
- **React Router DOM 7.9.5** - Roteamento e navegação
- **Material-UI (MUI) 7.3.5** - Componentes de UI modernos e estilizados
- **MUI X Date Pickers 8.17.0** - Componentes de seleção de data/hora
- **Day.js 1.11.19** - Manipulação de datas
- **ESLint** - Linting e qualidade de código

## Pré-requisitos

Para rodar o frontend, você precisará ter instalado:

1. **Node.js** (versão 20.0.0 ou superior)
2. **npm** (versão 10.0.0 ou superior)
3. **Backend da aplicação** rodando em `http://localhost:3001`

## Instalação e Configuração

### 1. Navegar até a Pasta do Frontend

```bash
cd ProjetoIntegradorSenac/agendaFacil
```

### 2. Instalar Dependências

Instale todas as dependências do projeto listadas no `package.json`:

```bash
npm install
```

### 3. Verificar Configuração da API

O frontend se conecta ao backend através do arquivo `src/services/api.js`. A URL padrão é:

```javascript
const BASE_URL = 'http://localhost:3001/api';
```

Se o backend estiver rodando em uma porta diferente, edite este arquivo antes de iniciar o servidor.

## Executando o Projeto

### Modo de Desenvolvimento

Inicia o servidor de desenvolvimento com hot-reload (as mudanças são refletidas instantaneamente):

```bash
npm run dev
```

O servidor estará disponível em `http://localhost:5173/` (ou outra porta, se a 5173 estiver em uso).

### Build para Produção

Gera os arquivos otimizados para produção:

```bash
npm run build
```

Os arquivos serão gerados na pasta `dist/`.

## Funcionalidades Principais

### 1. **Autenticação**
- Login de usuários (clientes e prestadores)
- Cadastro de novos usuários
- Gerenciamento de sessão via localStorage

### 2. **Navegação e Busca**
- Página inicial com categorias de serviços
- Listagem de prestadores por categoria
- Busca avançada com filtros
- Prestadores em destaque

### 3. **Agendamentos**
- Visualização de detalhes do prestador
- Seleção de serviços disponíveis
- Escolha de data e horário
- Verificação de horários disponíveis em tempo real
- Confirmação de agendamento
- Listagem de agendamentos do usuário
- Cancelamento de agendamentos

### 4. **Perfil do Usuário**
- Visualização de dados pessoais
- Edição de informações
- Histórico de agendamentos

## Rotas da Aplicação

| Rota | Componente | Descrição |
|------|-----------|-----------|
| `/` | Home | Página inicial com categorias |
| `/servicos` | Servicos | Listagem de todos os serviços |
| `/servicos/:categoria` | Servicos | Serviços filtrados por categoria |
| `/login` | Login | Página de autenticação |
| `/registro` | Registro | Cadastro de novos usuários |
| `/prestador/:id` | DetalhesPrestador | Detalhes e serviços do prestador |
| `/agendamento/:prestadorId/:servicoId` | Agendamento | Criação de novo agendamento |
| `/meus-agendamentos` | MeusAgendamentos | Agendamentos do usuário logado |
| `/perfil` | Perfil | Perfil do usuário logado |

## Comunicação com o Backend

O arquivo `src/services/api.js` centraliza toda a comunicação com o backend através de uma arquitetura modular:

### Estrutura da API

```javascript
import { api } from '../services/api';

// Exemplos de uso:
await api.auth.login(email, senha);
await api.usuarios.criar(dadosUsuario);
await api.prestadores.listar({ categoria: 'Beleza' });
await api.agendamentos.criar(dadosAgendamento);
```

### Endpoints Disponíveis

- **auth**: Login
- **usuarios**: CRUD de usuários
- **prestadores**: Listar, buscar, serviços, avaliações, horários
- **servicos**: CRUD de serviços
- **agendamentos**: CRUD de agendamentos
- **avaliacoes**: Criar avaliações
- **notificacoes**: Gerenciar notificações

## Componentes Principais

### NavBar
Barra de navegação responsiva com links para as principais páginas e indicador de usuário logado.

### Footer
Rodapé completo com informações de contato, links rápidos, redes sociais e créditos de desenvolvimento.

### PerfilCard
Card reutilizável para exibir informações de prestadores com imagem, avaliação e categoria.

### CategoriaCard
Card para exibir categorias de serviços na página inicial.

### BarraDePesquisa
Componente de busca que filtra prestadores por nome, categoria ou descrição.

### Calendario
Componente de calendário para seleção de datas nos agendamentos.

## Estilização

O projeto utiliza uma combinação de:
- **Material-UI (MUI)** - Componentes pré-estilizados e sistema de temas
- **CSS Modules** - Estilos isolados por componente
- **Inline Styles (sx prop)** - Estilos dinâmicos do MUI

### Paleta de Cores Principal

- **Primária**: `#213448` (Azul escuro)
- **Secundária**: `#5F84FF` (Azul vibrante)
- **Fundo**: `#F9FAFB` / `#F3F4F6` (Cinza claro)
- **Texto**: `#213448` (Escuro) / `#64748B` (Médio)

## Gerenciamento de Estado

- **useState** - Estado local dos componentes
- **useEffect** - Efeitos colaterais e chamadas à API
- **localStorage** - Persistência de dados do usuário
- **React Router** - Navegação e parâmetros de rota

## Boas Práticas Implementadas

✅ Componentização e reutilização de código  
✅ Separação de responsabilidades (UI vs. Lógica)  
✅ Tratamento de erros e feedback ao usuário  
✅ Loading states para melhor UX  
✅ Validação de formulários  
✅ Código comentado e documentado  
✅ Nomenclatura clara e consistente  

## Melhorias Futuras

- [ ] Implementação de Context API para estado global
- [ ] Sistema de notificações em tempo real (WebSocket)
- [ ] Upload de imagens de perfil
- [ ] Sistema de avaliações e comentários mais completo
- [ ] Filtros avançados de busca (preço, localização, disponibilidade)
- [ ] Internacionalização (i18n)
- [ ] Testes unitários e de integração
- [ ] PWA (Progressive Web App)
- [ ] Dark mode
- [ ] Responsividade em todos os dispositivos  

## Resolução de Problemas


### Erro de conexão com backend
Verifique se:
1. O backend está rodando em `http://localhost:3001`
2. O banco de dados MySQL está configurado e ativo
3. Não há firewall bloqueando a comunicação

### Dependências desatualizadas
```bash
npm outdated  # Verificar dependências desatualizadas
npm update    # Atualizar dependências
```

### Limpar cache e reinstalar
```bash
rm -rf node_modules package-lock.json
npm install
```

---

<br>

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

    **Atenção:** Substitua `seu_password_do_mysql` pela senha do seu usuário MySQL. e apague os comentarios em cada linha de configuração, somente os comentários nas linhas de configuração!

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

Se usar windows baixe o  **MySQL Installer** no site oficial (https://dev.mysql.com/downloads/installer/). Quando estiver instalando, crie seu usuário que você irá fazer login para testar (por padrão é `root`) e a senha que você definir.

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

### 3. Gerenciamento de Permissões (Opcional)

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

## Próximos Passos e Refatoração

Atualmente, o backend está centralizado no arquivo `server.js`. Em um futuro próximo, planejamos refatorar a estrutura do projeto para manter o código organizado, separando bem as responsabilidades (Separation of Concerns)**.

Isso incluirá a divisão da lógica em módulos mais organizados, como:

*   **`routes/`**: Para definição de todas as rotas da API.
*   **`controllers/`**: Para o tratamento das requisições e respostas.
*   **`services/`**: Para a lógica de negócio e a interação com o banco de dados.

Essa refatoração visa melhorar a **manutenção**, **legibilidade** e **escalabilidade** do projeto.

---
<br>

## **Desenvolvido por: Grupo 2 - SENAC - 4º Semestre**
- Anne Daniela
- Leonardo Ceretta
- Louise Morais
- Wallisson Stevan 
**Projeto Integrador 2025**