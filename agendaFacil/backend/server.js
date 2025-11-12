const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares

app.use(cors());
app.use(express.json());

// Configuração do db

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'agendafacil',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

let pool;

// inicializar pool de conexões
async function initializeDatabase() {
  try {
    pool = mysql.createPool(dbConfig);
    await pool.query('SELECT 1');
    console.log('✅ Conexão com banco de dados AgendaFácil estabelecida');
  } catch (error) {
    console.error('❌ Erro ao conectar ao banco de dados:', error);
    process.exit(1);
  }
}


// ROTAS DE AUTENTICAÇÃO

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, senha } = req.body;
    
    if (!email || !senha) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email e senha são obrigatórios' 
      });
    }
    
    const [usuarios] = await pool.query(
      'SELECT id, nome, email, telefone, tipo_usuario, foto_perfil FROM usuarios WHERE email = ? AND senha = ? AND ativo = TRUE',
      [email, senha]
    );
    
    if (usuarios.length === 0) {
      return res.status(401).json({ 
        success: false, 
        message: 'Email ou senha inválidos' 
      });
    }
    
    res.json({ 
      success: true, 
      message: 'Login realizado com sucesso',
      data: usuarios[0]
    });
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    res.status(500).json({ success: false, message: 'Erro ao fazer login' });
  }
});


// ROTAS DE USUÁRIOS

// Listar todos os usuários
app.get('/api/usuarios', async (req, res) => {
  try {
    const { tipo_usuario } = req.query;
    let query = 'SELECT id, nome, email, telefone, tipo_usuario, foto_perfil, ativo, created_at FROM usuarios';
    const params = [];
    
    if (tipo_usuario) {
      query += ' WHERE tipo_usuario = ?';
      params.push(tipo_usuario);
    }
    
    query += ' ORDER BY created_at DESC';
    
    const [usuarios] = await pool.query(query, params);
    res.json({ success: true, data: usuarios });
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    res.status(500).json({ success: false, message: 'Erro ao buscar usuários' });
  }
});

// Buscar usuário por ID
app.get('/api/usuarios/:id', async (req, res) => {
  try {
    const [usuarios] = await pool.query(
      'SELECT id, nome, email, telefone, tipo_usuario, foto_perfil, ativo, created_at FROM usuarios WHERE id = ?',
      [req.params.id]
    );
    
    if (usuarios.length === 0) {
      return res.status(404).json({ success: false, message: 'Usuário não encontrado' });
    }
    
    res.json({ success: true, data: usuarios[0] });
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    res.status(500).json({ success: false, message: 'Erro ao buscar usuário' });
  }
});

// Criar novo usuário
app.post('/api/usuarios', async (req, res) => {
  try {
    const { nome, email, senha, telefone, tipo_usuario } = req.body;
    
    if (!nome || !email || !senha) {
      return res.status(400).json({ 
        success: false, 
        message: 'Nome, email e senha são obrigatórios' 
      });
    }
    
    // Verificar se email já existe
    const [existente] = await pool.query(
      'SELECT id FROM usuarios WHERE email = ?',
      [email]
    );
    
    if (existente.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email já cadastrado' 
      });
    }
    
    // usar hash de senha diferente (bcrypt por exemplo) caso seja utilizado em prod/venda/saas o que possivelmente nunca sera usado, sei la quem sabe.
    const [result] = await pool.query(
      'INSERT INTO usuarios (nome, email, senha, telefone, tipo_usuario) VALUES (?, ?, ?, ?, ?)',
      [nome, email, senha, telefone, tipo_usuario || 'cliente']
    );
    
    res.status(201).json({ 
      success: true, 
      message: 'Usuário criado com sucesso',
      data: { id: result.insertId, nome, email, tipo_usuario: tipo_usuario || 'cliente' }
    });
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    res.status(500).json({ success: false, message: 'Erro ao criar usuário' });
  }
});

// atualizar usuário
app.put('/api/usuarios/:id', async (req, res) => {
  try {
    const { nome, email, telefone, foto_perfil } = req.body;
    const { id } = req.params;
    
    const [result] = await pool.query(
      'UPDATE usuarios SET nome = ?, email = ?, telefone = ?, foto_perfil = ? WHERE id = ?',
      [nome, email, telefone, foto_perfil, id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Usuário não encontrado' });
    }
    
    res.json({ 
      success: true, 
      message: 'Usuário atualizado com sucesso',
      data: { id, nome, email, telefone }
    });
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    res.status(500).json({ success: false, message: 'Erro ao atualizar usuário' });
  }
});

// Deletar usuário
app.delete('/api/usuarios/:id', async (req, res) => {
  try {
    const [result] = await pool.query(
      'DELETE FROM usuarios WHERE id = ?',
      [req.params.id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Usuário não encontrado' });
    }
    
    res.json({ success: true, message: 'Usuário deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar usuário:', error);
    res.status(500).json({ success: false, message: 'Erro ao deletar usuário' });
  }
});

// ROTAS DE PRESTADORES

// Listar todos os prestadores
app.get('/api/prestadores', async (req, res) => {
  try {
    const { categoria, cidade } = req.query;
    
    let query = 'SELECT * FROM view_prestadores_destaque WHERE 1=1';
    const params = [];
    
    if (categoria) {
      query += ' AND categoria = ?';
      params.push(categoria);
    }
    
    if (cidade) {
      query += ' AND cidade LIKE ?';
      params.push(`%${cidade}%`);
    }
    
    const [prestadores] = await pool.query(query, params);
    res.json({ success: true, data: prestadores });
  } catch (error) {
    console.error('Erro ao buscar prestadores:', error);
    res.status(500).json({ success: false, message: 'Erro ao buscar prestadores' });
  }
});

// Buscar prestador por ID
app.get('/api/prestadores/:id', async (req, res) => {
  try {
    const [prestadores] = await pool.query(
      'SELECT * FROM view_prestadores_destaque WHERE id = ?',
      [req.params.id]
    );
    
    if (prestadores.length === 0) {
      return res.status(404).json({ success: false, message: 'Prestador não encontrado' });
    }
    
    res.json({ success: true, data: prestadores[0] });
  } catch (error) {
    console.error('Erro ao buscar prestador:', error);
    res.status(500).json({ success: false, message: 'Erro ao buscar prestador' });
  }
});

// Criar novo prestador
app.post('/api/prestadores', async (req, res) => {
  try {
    const {
      usuario_id, nome_estabelecimento, cnpj, categoria, descricao,
      endereco, cidade, estado, cep, horario_abertura, horario_fechamento,
      tempo_medio_atendimento, dias_funcionamento, aceita_pagamento_online
    } = req.body;
    
    if (!usuario_id || !categoria) {
      return res.status(400).json({ 
        success: false, 
        message: 'Usuário e categoria são obrigatórios' 
      });
    }
    
    const [result] = await pool.query(
      `INSERT INTO prestadores (
        usuario_id, nome_estabelecimento, cnpj, categoria, descricao,
        endereco, cidade, estado, cep, horario_abertura, horario_fechamento,
        tempo_medio_atendimento, dias_funcionamento, aceita_pagamento_online
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        usuario_id, nome_estabelecimento, cnpj, categoria, descricao,
        endereco, cidade, estado, cep, horario_abertura, horario_fechamento,
        tempo_medio_atendimento || 60, 
        JSON.stringify(dias_funcionamento || ["segunda", "terca", "quarta", "quinta", "sexta"]),
        aceita_pagamento_online || false
      ]
    );
    
    res.status(201).json({ 
      success: true, 
      message: 'Prestador criado com sucesso',
      data: { id: result.insertId }
    });
  } catch (error) {
    console.error('Erro ao criar prestador:', error);
    res.status(500).json({ success: false, message: 'Erro ao criar prestador' });
  }
});

// ROTAS DE SERVIÇOS

// Listar todos os serviços
app.get('/api/servicos', async (req, res) => {
  try {
    const { prestador_id } = req.query;
    
    let query = 'SELECT * FROM servicos WHERE ativo = TRUE';
    const params = [];
    
    if (prestador_id) {
      query += ' AND prestador_id = ?';
      params.push(prestador_id);
    }
    
    query += ' ORDER BY nome';
    
    const [servicos] = await pool.query(query, params);
    res.json({ success: true, data: servicos });
  } catch (error) {
    console.error('Erro ao buscar serviços:', error);
    res.status(500).json({ success: false, message: 'Erro ao buscar serviços' });
  }
});

// Listar serviços de um prestador específico
app.get('/api/prestadores/:prestadorId/servicos', async (req, res) => {
  try {
    const [servicos] = await pool.query(
      'SELECT * FROM servicos WHERE prestador_id = ? AND ativo = TRUE ORDER BY nome',
      [req.params.prestadorId]
    );
    
    res.json({ success: true, data: servicos });
  } catch (error) {
    console.error('Erro ao buscar serviços:', error);
    res.status(500).json({ success: false, message: 'Erro ao buscar serviços' });
  }
});

// Buscar serviço por ID
app.get('/api/servicos/:id', async (req, res) => {
  try {
    const [servicos] = await pool.query(
      'SELECT * FROM servicos WHERE id = ?',
      [req.params.id]
    );
    
    if (servicos.length === 0) {
      return res.status(404).json({ success: false, message: 'Serviço não encontrado' });
    }
    
    res.json({ success: true, data: servicos[0] });
  } catch (error) {
    console.error('Erro ao buscar serviço:', error);
    res.status(500).json({ success: false, message: 'Erro ao buscar serviço' });
  }
});

// Criar novo serviço
app.post('/api/servicos', async (req, res) => {
  try {
    const { prestador_id, nome, descricao, duracao, preco } = req.body;
    
    if (!prestador_id || !nome || !duracao || !preco) {
      return res.status(400).json({ 
        success: false, 
        message: 'Prestador, nome, duração e preço são obrigatórios' 
      });
    }
    
    const [result] = await pool.query(
      'INSERT INTO servicos (prestador_id, nome, descricao, duracao, preco) VALUES (?, ?, ?, ?, ?)',
      [prestador_id, nome, descricao, duracao, preco]
    );
    
    res.status(201).json({ 
      success: true, 
      message: 'Serviço criado com sucesso',
      data: { id: result.insertId, nome, duracao, preco }
    });
  } catch (error) {
    console.error('Erro ao criar serviço:', error);
    res.status(500).json({ success: false, message: 'Erro ao criar serviço' });
  }
});

// Atualizar serviço
app.put('/api/servicos/:id', async (req, res) => {
  try {
    const { nome, descricao, duracao, preco, ativo } = req.body;
    
    const [result] = await pool.query(
      'UPDATE servicos SET nome = ?, descricao = ?, duracao = ?, preco = ?, ativo = ? WHERE id = ?',
      [nome, descricao, duracao, preco, ativo, req.params.id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Serviço não encontrado' });
    }
    
    res.json({ success: true, message: 'Serviço atualizado com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar serviço:', error);
    res.status(500).json({ success: false, message: 'Erro ao atualizar serviço' });
  }
});

// Deletar serviço
app.delete('/api/servicos/:id', async (req, res) => {
  try {
    const [result] = await pool.query(
      'UPDATE servicos SET ativo = FALSE WHERE id = ?',
      [req.params.id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Serviço não encontrado' });
    }
    
    res.json({ success: true, message: 'Serviço desativado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar serviço:', error);
    res.status(500).json({ success: false, message: 'Erro ao deletar serviço' });
  }
});

// ROTAS DE AGENDAMENTOS

// Listar agendamentos com filtros
app.get('/api/agendamentos', async (req, res) => {
  try {
    const { cliente_id, prestador_id, data_agendamento, status } = req.query;
    
    let query = 'SELECT * FROM view_agendamentos_completos WHERE 1=1';
    const params = [];
    
    if (cliente_id) {
      query += ' AND cliente_id = ?';
      params.push(cliente_id);
    }
    
    if (prestador_id) {
      query += ' AND prestador_id = ?';
      params.push(prestador_id);
    }
    
    if (data_agendamento) {
      query += ' AND data_agendamento = ?';
      params.push(data_agendamento);
    }
    
    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }
    
    const [agendamentos] = await pool.query(query, params);
    res.json({ success: true, data: agendamentos });
  } catch (error) {
    console.error('Erro ao buscar agendamentos:', error);
    res.status(500).json({ success: false, message: 'Erro ao buscar agendamentos' });
  }
});

// Buscar agendamento por ID
app.get('/api/agendamentos/:id', async (req, res) => {
  try {
    const [agendamentos] = await pool.query(
      'SELECT * FROM view_agendamentos_completos WHERE agendamento_id = ?',
      [req.params.id]
    );
    
    if (agendamentos.length === 0) {
      return res.status(404).json({ success: false, message: 'Agendamento não encontrado' });
    }
    
    res.json({ success: true, data: agendamentos[0] });
  } catch (error) {
    console.error('Erro ao buscar agendamento:', error);
    res.status(500).json({ success: false, message: 'Erro ao buscar agendamento' });
  }
});

// Buscar horários disponíveis
app.get('/api/prestadores/:prestadorId/horarios-disponiveis', async (req, res) => {
  try {
    const { data, duracao } = req.query;
    
    if (!data || !duracao) {
      return res.status(400).json({ 
        success: false, 
        message: 'Data e duração são obrigatórios' 
      });
    }
    
    const [horarios] = await pool.query(
      'CALL buscar_horarios_disponiveis(?, ?, ?)',
      [req.params.prestadorId, data, parseInt(duracao)]
    );
    
    res.json({ success: true, data: horarios[0] });
  } catch (error) {
    console.error('Erro ao buscar horários:', error);
    res.status(500).json({ success: false, message: 'Erro ao buscar horários disponíveis' });
  }
});

// Criar novo agendamento
app.post('/api/agendamentos', async (req, res) => {
  try {
    const {
      cliente_id, prestador_id, servico_id,
      data_agendamento, hora_inicio, hora_fim,
      observacoes, valor_total
    } = req.body;
    
    if (!cliente_id || !prestador_id || !servico_id || !data_agendamento || !hora_inicio || !hora_fim || !valor_total) {
      return res.status(400).json({ 
        success: false, 
        message: 'Todos os campos obrigatórios devem ser preenchidos' 
      });
    }
    
    // Verificar se horário está disponível para evitar conflitos entre usuarios
    const [conflitos] = await pool.query(
      `SELECT id FROM agendamentos 
       WHERE prestador_id = ? 
       AND data_agendamento = ? 
       AND status NOT IN ('cancelado', 'nao_compareceu')
       AND (
         (? >= hora_inicio AND ? < hora_fim)
         OR (? > hora_inicio AND ? <= hora_fim)
         OR (? <= hora_inicio AND ? >= hora_fim)
       )`,
      [prestador_id, data_agendamento, hora_inicio, hora_inicio, hora_fim, hora_fim, hora_inicio, hora_fim]
    );
    
    if (conflitos.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Horário já está ocupado' 
      });
    }
    
    const [result] = await pool.query(
      `INSERT INTO agendamentos (
        cliente_id, prestador_id, servico_id,
        data_agendamento, hora_inicio, hora_fim,
        observacoes, valor_total, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'confirmado')`,
      [cliente_id, prestador_id, servico_id, data_agendamento, hora_inicio, hora_fim, observacoes, valor_total]
    );
    
    res.status(201).json({ 
      success: true, 
      message: 'Agendamento criado com sucesso',
      data: { id: result.insertId }
    });
  } catch (error) {
    console.error('Erro ao criar agendamento:', error);
    res.status(500).json({ success: false, message: 'Erro ao criar agendamento' });
  }
});

// Atualizar status do agendamento
app.put('/api/agendamentos/:id/status', async (req, res) => {
  try {
    const { status, motivo_cancelamento, cancelado_por } = req.body;
    
    const validStatus = ['pendente', 'confirmado', 'em_andamento', 'concluido', 'cancelado', 'nao_compareceu'];
    if (!validStatus.includes(status)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Status inválido' 
      });
    }
    
    let query = 'UPDATE agendamentos SET status = ?';
    const params = [status];
    
    if (status === 'cancelado') {
      query += ', motivo_cancelamento = ?, cancelado_por = ?, data_cancelamento = NOW()';
      params.push(motivo_cancelamento, cancelado_por);
    }
    
    query += ' WHERE id = ?';
    params.push(req.params.id);
    
    const [result] = await pool.query(query, params);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Agendamento não encontrado' });
    }
    
    res.json({ success: true, message: 'Status atualizado com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar status:', error);
    res.status(500).json({ success: false, message: 'Erro ao atualizar status' });
  }
});

// ROTAS DE AVALIAÇÕES

// Listar avaliações de um prestador
app.get('/api/prestadores/:prestadorId/avaliacoes', async (req, res) => {
  try {
    const [avaliacoes] = await pool.query(
      `SELECT a.*, u.nome AS cliente_nome, u.foto_perfil AS cliente_foto
       FROM avaliacoes a
       INNER JOIN usuarios u ON a.cliente_id = u.id
       WHERE a.prestador_id = ?
       ORDER BY a.created_at DESC`,
      [req.params.prestadorId]
    );
    
    res.json({ success: true, data: avaliacoes });
  } catch (error) {
    console.error('Erro ao buscar avaliações:', error);
    res.status(500).json({ success: false, message: 'Erro ao buscar avaliações' });
  }
});

// Criar nova avaliação
app.post('/api/avaliacoes', async (req, res) => {
  try {
    const { agendamento_id, cliente_id, prestador_id, nota, comentario } = req.body;
    
    if (!agendamento_id || !cliente_id || !prestador_id || !nota) {
      return res.status(400).json({ 
        success: false, 
        message: 'Agendamento, cliente, prestador e nota são obrigatórios' 
      });
    }
    
    if (nota < 1 || nota > 5) {
      return res.status(400).json({ 
        success: false, 
        message: 'Nota deve estar entre 1 e 5' 
      });
    }
    
    const [result] = await pool.query(
      'INSERT INTO avaliacoes (agendamento_id, cliente_id, prestador_id, nota, comentario) VALUES (?, ?, ?, ?, ?)',
      [agendamento_id, cliente_id, prestador_id, nota, comentario]
    );
    
    res.status(201).json({ 
      success: true, 
      message: 'Avaliação criada com sucesso',
      data: { id: result.insertId }
    });
  } catch (error) {
    console.error('Erro ao criar avaliação:', error);
    res.status(500).json({ success: false, message: 'Erro ao criar avaliação' });
  }
});

// ROTAS DE NOTIFICAÇÕES

// Listar notificações de um usuário
app.get('/api/usuarios/:usuarioId/notificacoes', async (req, res) => {
  try {
    const { lida } = req.query;
    
    let query = 'SELECT * FROM notificacoes WHERE usuario_id = ?';
    const params = [req.params.usuarioId];
    
    if (lida !== undefined) {
      query += ' AND lida = ?';
      params.push(lida === 'true');
    }
    
    query += ' ORDER BY created_at DESC LIMIT 50';
    
    const [notificacoes] = await pool.query(query, params);
    
    res.json({ success: true, data: notificacoes });
  } catch (error) {
    console.error('Erro ao buscar notificações:', error);
    res.status(500).json({ success: false, message: 'Erro ao buscar notificações' });
  }
});

// Marcar notificação como lida
app.put('/api/notificacoes/:id/lida', async (req, res) => {
  try {
    const [result] = await pool.query(
      'UPDATE notificacoes SET lida = TRUE WHERE id = ?',
      [req.params.id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Notificação não encontrada' });
    }
    
    res.json({ success: true, message: 'Notificação marcada como lida' });
  } catch (error) {
    console.error('Erro ao atualizar notificação:', error);
    res.status(500).json({ success: false, message: 'Erro ao atualizar notificação' });
  }
});

// ROTAS DE ESTATÍSTICAS

// Estatísticas do prestador
app.get('/api/prestadores/:prestadorId/estatisticas', async (req, res) => {
  try {
    const { data_inicio, data_fim } = req.query;
    
    if (!data_inicio || !data_fim) {
      return res.status(400).json({ 
        success: false, 
        message: 'Data de início e fim são obrigatórias' 
      });
    }
    
    const [stats] = await pool.query(
      'CALL estatisticas_prestador(?, ?, ?)',
      [req.params.prestadorId, data_inicio, data_fim]
    );
    
    res.json({ success: true, data: stats[0][0] });
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({ success: false, message: 'Erro ao buscar estatísticas' });
  }
});

// ROTAS AUXILIARES

// Checa saude
app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ 
      success: true, 
      message: 'API AgendaFácil funcionando',
      database: 'Conectado',
      timestamp: new Date()
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Erro na conexão com banco de dados' 
    });
  }
});

// Infos da API, rota raiz
app.get('/', (req, res) => {
  res.json({ 
    message: 'API AgendaFácil - Sistema de Agendamento Inteligente',
    version: '1.0.0',
    projeto: 'Projeto Integrador SENAC',
    grupo: [
      'Anne Daniela Silva',
      'Leonardo Dallepiane Ceretta',
      'Louise de Sousa Morais',
      'Wallisson Stevan Souza Silva'
    ],
    endpoints: {
      auth: {
        login: 'POST /api/auth/login'
      },
      usuarios: {
        listar: 'GET /api/usuarios',
        buscar: 'GET /api/usuarios/:id',
        criar: 'POST /api/usuarios',
        atualizar: 'PUT /api/usuarios/:id',
        deletar: 'DELETE /api/usuarios/:id'
      },
      prestadores: {
        listar: 'GET /api/prestadores',
        buscar: 'GET /api/prestadores/:id',
        criar: 'POST /api/prestadores',
        servicos: 'GET /api/prestadores/:id/servicos',
        avaliacoes: 'GET /api/prestadores/:id/avaliacoes',
        horarios: 'GET /api/prestadores/:id/horarios-disponiveis',
        estatisticas: 'GET /api/prestadores/:id/estatisticas'
      },
      servicos: {
        listar: 'GET /api/servicos',
        buscar: 'GET /api/servicos/:id',
        criar: 'POST /api/servicos',
        atualizar: 'PUT /api/servicos/:id',
        deletar: 'DELETE /api/servicos/:id'
      },
      agendamentos: {
        listar: 'GET /api/agendamentos',
        buscar: 'GET /api/agendamentos/:id',
        criar: 'POST /api/agendamentos',
        atualizar_status: 'PUT /api/agendamentos/:id/status'
      },
      avaliacoes: {
        criar: 'POST /api/avaliacoes'
      },
      notificacoes: {
        listar: 'GET /api/usuarios/:id/notificacoes',
        marcar_lida: 'PUT /api/notificacoes/:id/lida'
      },
      health: 'GET /api/health'
    }
  });
});

// Inicializar server bem bonitinho

async function startServer() {
  await initializeDatabase();
  app.listen(PORT, () => {
    console.log('========================================');
    console.log('AgendaFácil API - Servidor Iniciado');
    console.log('========================================');
    console.log(`URL: http://localhost:${PORT}`);
    console.log(`Banco de Dados: ${dbConfig.database}`);
    console.log(`Horário: ${new Date().toLocaleString('pt-BR')}`);
    console.log('========================================');
    console.log('  Endpoints disponíveis:');
    console.log('   • GET  /api/health - Health check');
    console.log('   • POST /api/auth/login - Login');
    console.log('   • GET  /api/prestadores - Listar prestadores');
    console.log('   • GET  /api/servicos - Listar serviços');
    console.log('   • GET  /api/agendamentos - Listar agendamentos');
    console.log('   • POST /api/agendamentos - Criar agendamento');
    console.log('========================================');
  });
}

startServer();