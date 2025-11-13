/**
 * Esse file vai se comunicar com o backend da aplicação inteira.
 * Como existem 21 endpoints diferentes dentro do backend, foi criada uma funcao
 * generica de request que faz a chamada no backend e faz tratamento de erros
 * essa funcao recebe o endpoint e as opcoes da requisicao (metodo, body, etc)
 * e traz o resultado em json
 * 
 * vou deixar comentado cada funcao aqui embaixo para melhor entedimento de todos
 */

// A porta do backend configurado no .env do backend. Leia o readme do backend que explica como configurar
const BASE_URL = 'http://localhost:3001/api'; // Adicionei o /api no final da url pra facilitar a chamada dos endpoints

/**
 * Função generica para realizar requisições http...
 * @param {string} endpoint - O caminho da rota por exemplo: '/auth/login', '/usuarios' e etc
 * @param {object} options - Opções de configuração para a requisição, exemplo: method, body e etc, como explicado acima
 * @returns {Promise<object>} - objeto do json
 */
async function request(endpoint, options = {}) {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
    
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
    ...options,
  });

  // Se a resposta for 204 no content(sem conteudo), retorna objeto simples de sucesso. entao os proximos nao preciso comentar que vai ser basicamente a mesma coisa 
  if (response.status === 204) {
    return { success: true, message: 'Operação realizada com sucesso' };
  }

  if (!response.ok) {
    let errorData = {};
    try {
      errorData = await response.json();
    } catch (e) {
      throw new Error(`Erro ${response.status}: ${response.statusText}`);
    }
    throw new Error(errorData.message || `Erro na requisição: ${response.status}`);
  }

  return response.json();
}

/**
 * Aqui pra baixo são os objetos com funções específicas para cada 1 dos endpoints da API
 */
export const api = {
  
  // ====================================================================
  // 1. ROTAS DE AUTENTICAÇÃO
  
  auth: {
    login: (email, senha) => request('/auth/login', {
      method: 'POST',
      body: { email, senha },
    }),
  },

  // ====================================================================
  // 2. ROTAS DE USUÁRIOS
  
  usuarios: {
    // GET /api/usuarios?tipo_usuario=cliente
    listar: (tipo_usuario) => request(`/usuarios${tipo_usuario ? `?tipo_usuario=${tipo_usuario}` : ''}`),
    
    // GET /api/usuarios/:id
    buscarPorId: (id) => request(`/usuarios/${id}`),
    
    // POST /api/usuarios
    criar: (dadosUsuario) => request('/usuarios', {
      method: 'POST',
      body: dadosUsuario,
    }),
    
    // PUT /api/usuarios/:id
    atualizar: (id, dadosUsuario) => request(`/usuarios/${id}`, {
      method: 'PUT',
      body: dadosUsuario,
    }),
    
    // DELETE /api/usuarios/:id
    deletar: (id) => request(`/usuarios/${id}`, {
      method: 'DELETE',
    }),
  },

  // ====================================================================
  // 3. ROTAS DE PRESTADORES
  
  prestadores: {
    // GET /api/prestadores?categoria=beleza&cidade=SaoPaulo
    listar: (filtros = {}) => {
      const params = new URLSearchParams(filtros).toString();
      return request(`/prestadores${params ? `?${params}` : ''}`);
    },
    
    // GET /api/prestadores/:id
    buscarPorId: (id) => request(`/prestadores/${id}`),
    
    // POST /api/prestadores
    criar: (dadosPrestador) => request('/prestadores', {
      method: 'POST',
      body: dadosPrestador,
    }),
    
    // GET /api/prestadores/:id/servicos
    servicos: (id) => request(`/prestadores/${id}/servicos`),
    
    // GET /api/prestadores/:id/avaliacoes
    avaliacoes: (id) => request(`/prestadores/${id}/avaliacoes`),
    
    // GET /api/prestadores/:id/horarios-disponiveis?data=2025-12-01&duracao=60
    horariosDisponiveis: (id, data, duracao) => request(`/prestadores/${id}/horarios-disponiveis?data=${data}&duracao=${duracao}`),
    
    // GET /api/prestadores/:id/estatisticas?data_inicio=...&data_fim=...
    estatisticas: (id, data_inicio, data_fim) => request(`/prestadores/${id}/estatisticas?data_inicio=${data_inicio}&data_fim=${data_fim}`),
  },

  // ====================================================================
  // 4. ROTAS DE SERVIÇOS
  
  servicos: {
    // GET /api/servicos?prestador_id=1
    listar: (prestador_id) => request(`/servicos${prestador_id ? `?prestador_id=${prestador_id}` : ''}`),
    
    // GET /api/servicos/:id
    buscarPorId: (id) => request(`/servicos/${id}`),
    
    // POST /api/servicos
    criar: (dadosServico) => request('/servicos', {
      method: 'POST',
      body: dadosServico,
    }),
    
    // PUT /api/servicos/:id
    atualizar: (id, dadosServico) => request(`/servicos/${id}`, {
      method: 'PUT',
      body: dadosServico,
    }),
    
    // DELETE /api/servicos/:id (na realidade é desativar ao inves de deletar)
    desativar: (id) => request(`/servicos/${id}`, {
      method: 'DELETE',
    }),
  },

  // ====================================================================
  // 5. ROTAS DE AGENDAMENTOS
  
  agendamentos: {
    // GET /api/agendamentos?cliente_id=1&status=confirmado
    listar: (filtros = {}) => {
      const params = new URLSearchParams(filtros).toString();
      return request(`/agendamentos${params ? `?${params}` : ''}`);
    },
    
    // GET /api/agendamentos/:id
    buscarPorId: (id) => request(`/agendamentos/${id}`),
    
    // POST /api/agendamentos
    criar: (dadosAgendamento) => request('/agendamentos', {
      method: 'POST',
      body: dadosAgendamento,
    }),
    
    // PUT /api/agendamentos/:id/status
    atualizarStatus: (id, status, motivo_cancelamento, cancelado_por) => request(`/agendamentos/${id}/status`, {
      method: 'PUT',
      body: { status, motivo_cancelamento, cancelado_por },
    }),
  },

  // ====================================================================
  // 6. ROTAS DE AVALIAÇÕES
  
  avaliacoes: {
    // POST /api/avaliacoes
    criar: (dadosAvaliacao) => request('/avaliacoes', {
      method: 'POST',
      body: dadosAvaliacao,
    }),
  },

  // ====================================================================
  // 7. ROTAS DE NOTIFICAÇÕES
  
  notificacoes: {
    // GET /api/usuarios/:id/notificacoes?lida=true
    listarPorUsuario: (usuarioId, lida) => request(`/usuarios/${usuarioId}/notificacoes${lida !== undefined ? `?lida=${lida}` : ''}`),
    
    // PUT /api/notificacoes/:id/lida
    marcarComoLida: (id) => request(`/notificacoes/${id}/lida`, {
      method: 'PUT',
    }),
  },

  // ====================================================================
  // 8. ROTAS AUXILIARES
  
  aux: {
    // Getzinho pra checar se o backend ta vivo
    healthCheck: () => request('/health'),
  },
};


/* então um pequeno resumo do foi feito nesse arquivo: 
    1. Criei uma função generica em HTTP usando fetch
    2. Add tratamento de erros para respostas que nao sao ok
    3. Criei objetos especificos para cada grupo de endpoints 
    4. Cada objeto tem metodos que sao correspondentes aos endpoints da API
    5. Cada metodo vai usar a funcao criada la em cima pra fazer a requisicao
    6. Adicionei comentários explicativos para cada parte do código para melhor entedimento
*/

/* obs: esse foi o melhor trabalho que ja fiz em questão de API, então me deem os parabens, nao to brincando nao cade os parabains??? risos
* o unico trabalho agora é linkar com o front usando isso: import { api } from '../services/api';
porem só precisa usar esse import em arquivos que fazem requisicao ao backend

um nav bar por exemplo nao faz requisicao no backend, entao nao precisa importar a api ali
o components/button também nao faz requisicao no backend entao idem
agora pages/Servicos.jsx faz requisicao no backend, entao precisa importar a api ali

com isso o react ficara bem organizado, com a logica de interface separada da logica de dados
*/

// se voces perceberem cada rota, por exemplo a 8. ROTAS AUXILIARES logo aqui em cima, está de acordo com as rotas do server, então fica facil de achar o que precisa
// qualquer duvida me perguntem, to a disposicao para ajudar no que for preciso