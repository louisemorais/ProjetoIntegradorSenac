# Agenda Fácil - Frontend

Interface Web desenvolvida em **React** com **Vite** para o sistema de agendamento online Agenda Fácil.

## Sobre o Frontend

O frontend do Agenda Fácil é uma aplicação web moderna e responsiva que conecta clientes e prestadores de serviços através de uma interface intuitiva. Desenvolvida com React e Material-UI, oferece uma experiência de usuário fluida e profissional.

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


## Estrutura do Projeto

```
agendaFacil/src/
├── components/              # Componentes reutilizáveis
│   ├── agendamentoResumido/ # Card resumido de agendamento
│   ├── button/              # Botão customizado
│   ├── calendar/            # Componente de calendário
│   ├── cards/               # Cards diversos (Categoria, Perfil, Serviços)
│   ├── footer/              # Rodapé da aplicação
│   ├── inputField/          # Campo de input customizado
│   ├── navbar/              # Barra de navegação
│   ├── scrollToTop/         # Componente para scroll ao topo
│   ├── search/              # Barra de pesquisa
│   └── selector/            # Componente seletor
├── pages/                   # Páginas da aplicação
│   ├── FormularioDeAgendamento/  # Formulário de agendamento
│   ├── Home.jsx             # Página inicial
│   ├── Servicos.jsx         # Listagem de serviços/prestadores
│   ├── Login.jsx            # Página de login
│   ├── Registro.jsx         # Página de cadastro
│   ├── DetalhesPrestador.jsx # Detalhes do prestador
│   ├── Agendamento.jsx      # Criação de agendamento
│   ├── MeusAgendamentos.jsx # Agendamentos do usuário
│   └── Perfil.jsx           # Perfil do usuário
├── services/                # Serviços e APIs
│   └── api.js               # Comunicação com o backend
├── imgs/                    # Imagens e recursos
│   └── category/            # Imagens das categorias
├── App.jsx                  # Componente principal com rotas
├── App.css                  # Estilos globais
└── main.jsx                 # Ponto de entrada da aplicação
```

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

### 5. **Interface Responsiva**
- Design adaptável para desktop, tablet e mobile
- Componentes Material-UI para consistência visual
- Experiência de usuário otimizada

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
✅ Responsividade em todos os dispositivos  

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

## Contribuindo

Para contribuir com o projeto:

1. Crie uma branch para sua feature: `git checkout -b feature/nova-funcionalidade`
2. Commit suas mudanças: `git commit -m 'Adiciona nova funcionalidade'`
3. Push para a branch: `git push origin feature/nova-funcionalidade`
4. Abra um Pull Request

## Suporte

Para dúvidas e suporte:
- **Email**: contato@agendafacil.com.br
- **Issues**: Abra uma issue no repositório

---

**Desenvolvido por: Grupo 2 - SENAC - 4º Semestre**  
**Projeto Integrador 2025**

