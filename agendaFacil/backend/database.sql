-- AGENDAFÁCIL
-- Projeto Integrador do SENAC
-- Grupo: Anne, Leonardo, Louise, Wallisson

-- Cria o DB
CREATE DATABASE IF NOT EXISTS agendafacil CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE agendafacil;

-- Dropa views views, procedures e triggers se existirem
DROP VIEW IF EXISTS view_agendamentos_completos;
DROP VIEW IF EXISTS view_prestadores_destaque;

DROP PROCEDURE IF EXISTS buscar_horarios_disponiveis;
DROP PROCEDURE IF EXISTS estatisticas_prestador;
DROP PROCEDURE IF EXISTS buscar_prestador_completo;

DROP TRIGGER IF EXISTS atualizar_avaliacao_prestador;
DROP TRIGGER IF EXISTS criar_notificacao_agendamento;

-- Dropa tabelas
DROP TABLE IF EXISTS lista_espera;
DROP TABLE IF EXISTS notificacoes;
DROP TABLE IF EXISTS avaliacoes;
DROP TABLE IF EXISTS agendamentos;
DROP TABLE IF EXISTS servicos;
DROP TABLE IF EXISTS horarios_bloqueados;
DROP TABLE IF EXISTS imagens_prestadores;
DROP TABLE IF EXISTS prestadores;
DROP TABLE IF EXISTS usuarios;

-- tabela de clientes e prestadores
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    telefone VARCHAR(20),
    tipo_usuario ENUM('cliente', 'prestador', 'admin') DEFAULT 'cliente',
    foto_perfil VARCHAR(255),
    ativo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_tipo (tipo_usuario),
    INDEX idx_telefone (telefone)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- tabela do tipo de prestador
CREATE TABLE prestadores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    nome_estabelecimento VARCHAR(150),
    cnpj VARCHAR(18),
    categoria VARCHAR(50) NOT NULL,
    descricao TEXT,
    imagem_url VARCHAR(500) COMMENT 'URL da imagem de destaque do prestador/estabelecimento',
    endereco VARCHAR(255),
    cidade VARCHAR(100),
    estado VARCHAR(2),
    cep VARCHAR(10),
    horario_abertura TIME DEFAULT '09:00:00',
    horario_fechamento TIME DEFAULT '18:00:00',
    tempo_medio_atendimento INT DEFAULT 60,
    aceita_pagamento_online BOOLEAN DEFAULT FALSE,
    dias_funcionamento JSON,
    avaliacao_media DECIMAL(3,2) DEFAULT 0.00,
    total_avaliacoes INT DEFAULT 0,
    ativo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    INDEX idx_categoria (categoria),
    INDEX idx_cidade (cidade),
    INDEX idx_avaliacao (avaliacao_media),
    INDEX idx_ativo (ativo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- tabela de multiplas imagens para a galeria do prestador
CREATE TABLE imagens_prestadores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    prestador_id INT NOT NULL,
    url VARCHAR(500) NOT NULL,
    tipo ENUM('principal', 'galeria', 'logo', 'banner') DEFAULT 'galeria',
    ordem INT DEFAULT 0,
    descricao VARCHAR(255),
    ativo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (prestador_id) REFERENCES prestadores(id) ON DELETE CASCADE,
    INDEX idx_prestador (prestador_id),
    INDEX idx_tipo (tipo),
    INDEX idx_ativo (ativo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- tabela de horarios bloqueados para uso, logica la amebaixo
CREATE TABLE horarios_bloqueados (
    id INT AUTO_INCREMENT PRIMARY KEY,
    prestador_id INT NOT NULL,
    data_inicio DATETIME NOT NULL,
    data_fim DATETIME NOT NULL,
    motivo VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (prestador_id) REFERENCES prestadores(id) ON DELETE CASCADE,
    INDEX idx_prestador (prestador_id),
    INDEX idx_datas (data_inicio, data_fim)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- tabela de servicos
CREATE TABLE servicos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    prestador_id INT NOT NULL,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    duracao INT NOT NULL,
    preco DECIMAL(10,2) NOT NULL,
    ativo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (prestador_id) REFERENCES prestadores(id) ON DELETE CASCADE,
    INDEX idx_prestador (prestador_id),
    INDEX idx_ativo (ativo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- tabela de agendamentos
CREATE TABLE agendamentos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT NOT NULL,
    prestador_id INT NOT NULL,
    servico_id INT NOT NULL,
    data_agendamento DATE NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fim TIME NOT NULL,
    status ENUM('pendente', 'confirmado', 'em_andamento', 'concluido', 'cancelado', 'nao_compareceu') DEFAULT 'pendente',
    observacoes TEXT,
    valor_total DECIMAL(10,2) NOT NULL,
    lembrete_enviado BOOLEAN DEFAULT FALSE,
    cancelado_por INT,
    motivo_cancelamento TEXT,
    data_cancelamento TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (cliente_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (prestador_id) REFERENCES prestadores(id) ON DELETE CASCADE,
    FOREIGN KEY (servico_id) REFERENCES servicos(id) ON DELETE CASCADE,
    FOREIGN KEY (cancelado_por) REFERENCES usuarios(id) ON DELETE SET NULL,
    INDEX idx_cliente (cliente_id),
    INDEX idx_prestador (prestador_id),
    INDEX idx_data (data_agendamento),
    INDEX idx_status (status),
    INDEX idx_data_hora (data_agendamento, hora_inicio),
    INDEX idx_agendamento_completo (prestador_id, data_agendamento, status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- tabela de avaliacoes
CREATE TABLE avaliacoes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    agendamento_id INT NOT NULL,
    cliente_id INT NOT NULL,
    prestador_id INT NOT NULL,
    nota INT NOT NULL CHECK (nota BETWEEN 1 AND 5),
    comentario TEXT,
    resposta_prestador TEXT,
    data_resposta TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (agendamento_id) REFERENCES agendamentos(id) ON DELETE CASCADE,
    FOREIGN KEY (cliente_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (prestador_id) REFERENCES prestadores(id) ON DELETE CASCADE,
    INDEX idx_prestador (prestador_id),
    INDEX idx_nota (nota),
    UNIQUE KEY unique_avaliacao (agendamento_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- tabela de notificacao
CREATE TABLE notificacoes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    titulo VARCHAR(150) NOT NULL,
    mensagem TEXT NOT NULL,
    agendamento_id INT,
    lida BOOLEAN DEFAULT FALSE,
    enviada BOOLEAN DEFAULT FALSE,
    data_envio TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (agendamento_id) REFERENCES agendamentos(id) ON DELETE CASCADE,
    INDEX idx_usuario (usuario_id),
    INDEX idx_lida (lida),
    INDEX idx_tipo (tipo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- tabela de lista de espera
CREATE TABLE lista_espera (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT NOT NULL,
    prestador_id INT NOT NULL,
    servico_id INT NOT NULL,
    data_desejada DATE NOT NULL,
    periodo_desejado ENUM('manha', 'tarde', 'noite', 'qualquer') DEFAULT 'qualquer',
    notificado BOOLEAN DEFAULT FALSE,
    ativo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cliente_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (prestador_id) REFERENCES prestadores(id) ON DELETE CASCADE,
    FOREIGN KEY (servico_id) REFERENCES servicos(id) ON DELETE CASCADE,
    INDEX idx_prestador (prestador_id),
    INDEX idx_data (data_desejada),
    INDEX idx_ativo (ativo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- dados das personas iniciais

INSERT INTO usuarios (nome, email, senha, telefone, tipo_usuario, foto_perfil) VALUES
-- admin
('Administrador', 'admin@agendafacil.com', 'admin123', '11999999999', 'admin', NULL),

-- prestadores das personas da primeira entrega
('Marina Oliveira', 'marina@salaomarina.com', 'senha123', '11987654321', 'prestador', 'https://randomuser.me/api/portraits/women/10.jpg'),
('Dra. Josefina Lima', 'josefina@clinicalima.com', 'senha123', '11976543210', 'prestador', 'https://randomuser.me/api/portraits/women/29.jpg'),
('Carlos Mecânico', 'carlos@autoreparo.com', 'senha123', '11965432109', 'prestador', 'https://randomuser.me/api/portraits/men/1.jpg'),

-- NOVOS PRESTADORES ARTE E SOCIAL MEDIA
('Estúdio Cacildis', 'cacildis@arte.com', 'senha123', '11988888888', 'prestador', 'https://randomuser.me/api/portraits/women/57.jpg'),
('Agência Ticaricatica', 'ticaricatica@social.com', 'senha123', '11977777777', 'prestador', 'https://randomuser.me/api/portraits/men/78.jpg'),

-- clientes
('Jurssicley do Rego Silva', 'jurssicley@email.com', 'senha123', '11954321098', 'cliente', 'https://randomuser.me/api/portraits/men/2.jpg'),
('Ana Paula Costa', 'ana@email.com', 'senha123', '11943210987', 'cliente', 'https://randomuser.me/api/portraits/women/3.jpg'),
('Ricardo Almeida', 'ricardo@email.com', 'senha123', '11932109876', 'cliente', 'https://randomuser.me/api/portraits/men/3.jpg');

-- insere prestadores
INSERT INTO prestadores (usuario_id, nome_estabelecimento, categoria, descricao, imagem_url, endereco, cidade, estado, cep, horario_abertura, horario_fechamento, tempo_medio_atendimento, dias_funcionamento, aceita_pagamento_online) VALUES
(2, 'Salão Marina Oliveira', 'Beleza', 'Salão especializado em cortes femininos e masculinos, coloração, mechas e tratamentos capilares.', 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop&q=80', 'Rua das Flores, 123', 'São Paulo', 'SP', '01234-567', '09:00:00', '19:00:00', 60, '["segunda", "terca", "quarta", "quinta", "sexta", "sabado"]', TRUE),
(3, 'Clínica Dra. Josefina Lima', 'Saúde', 'Clínica médica com especialidades em clínica geral, pediatria e ginecologia. Equipe de 8 profissionais.', 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&h=300&fit=crop&q=80', 'Av. Paulista, 1000', 'São Paulo', 'SP', '01310-100', '08:00:00', '18:00:00', 30, '["segunda", "terca", "quarta", "quinta", "sexta"]', TRUE),
(4, 'Auto Reparo Carlos', 'Serviços Técnicos', 'Oficina mecânica especializada em manutenção preventiva e corretiva de veículos.', 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=300&fit=crop&q=80', 'Rua do Comércio, 456', 'São Paulo', 'SP', '02345-678', '08:00:00', '18:00:00', 120, '["segunda", "terca", "quarta", "quinta", "sexta", "sabado"]', FALSE),
-- NOVOS PRESTADORES
(5, 'Estúdio Cacildis', 'Arte', 'Estúdio especializado em design gráfico, ilustrações personalizadas e pinturas a óleo.', 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&h=300&fit=crop&q=80', 'Rua dos Comunistas, 13', 'São Paulo', 'SP', '03456-789', '10:00:00', '20:00:00', 90, '["terca", "quarta", "quinta", "sexta", "sabado"]', TRUE),
(6, 'Ticaricatica Marketing Digital', 'Social Media', 'Agência focada em gestão de redes sociais, criação de conteúdo e campanhas de anúncios.', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop&q=80', 'Av. Ibirapuera, 500', 'São Paulo', 'SP', '01234-890', '09:00:00', '17:00:00', 60, '["segunda", "terca", "quarta", "quinta", "sexta"]', TRUE);


-- insere servicos
INSERT INTO servicos (prestador_id, nome, descricao, duracao, preco) VALUES
-- marina 1
(1, 'Corte Masculino', 'Corte de cabelo masculino com finalização', 45, 50.00),
(1, 'Corte Feminino', 'Corte de cabelo feminino com lavagem e finalização', 60, 80.00),
(1, 'Coloração Completa', 'Coloração de todo o cabelo', 120, 150.00),
(1, 'Manicure', 'Manicure completa com esmaltação', 45, 35.00),
(1, 'Escova', 'Escova modeladora', 30, 40.00),

-- josefina 2
(2, 'Consulta Clínica Geral', 'Consulta médica de clínica geral', 30, 200.00),
(2, 'Consulta Pediatria', 'Consulta pediátrica', 30, 220.00),
(2, 'Consulta Ginecologia', 'Consulta ginecológica', 40, 250.00),
(2, 'Retorno', 'Consulta de retorno', 20, 100.00),

-- auto reparo 3
(3, 'Troca de Óleo', 'Troca de óleo e filtro', 60, 120.00),
(3, 'Alinhamento e Balanceamento', 'Alinhamento e balanceamento completo', 90, 150.00),
(3, 'Revisão Completa', 'Revisão geral do veículo', 180, 350.00),

-- NOVOS SERVIÇOS ARTE
(4, 'Ilustração Digital', 'Criação de arte digital personalizada', 180, 250.00),
(4, 'Design de Logo', 'Desenvolvimento de identidade visual e logo', 300, 500.00),

-- NOVOS SERVIÇOS SOCIAL MEDIA
(5, 'Consultoria Mensal', 'Gestão completa de duas redes sociais', 60, 800.00),
(5, 'Pacote de 10 Posts', 'Criação de 10 artes e legendas para redes', 120, 350.00);


-- Galeria de Imagens
-- Galeria do Salão Marina Oliveira
INSERT INTO imagens_prestadores (prestador_id, url, tipo, ordem, descricao) VALUES
(1, 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800', 'principal', 0, 'Fachada do salão'), -- só essa ta funfando por enquanto. omesmo para as outras categorias, só a principal funciona
(1, 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800', 'galeria', 1, 'Interior do salão'),
(1, 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=800', 'galeria', 2, 'Estação de trabalho'),
(1, 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=800', 'galeria', 3, 'Área de espera');

-- Galeria da Clínica Dra. Josefina
INSERT INTO imagens_prestadores (prestador_id, url, tipo, ordem, descricao) VALUES
(2, 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800', 'principal', 0, 'Recepção da clínica'),
(2, 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=800', 'galeria', 1, 'Consultório'),
(2, 'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=800', 'galeria', 2, 'Sala de espera');


-- exemplo de agendamento pra poc
INSERT INTO agendamentos (cliente_id, prestador_id, servico_id, data_agendamento, hora_inicio, hora_fim, status, valor_total, observacoes) VALUES
-- agendamentos confirmados
(7, 1, 1, '2025-11-15', '10:00:00', '10:45:00', 'confirmado', 50.00, 'Primeira vez no salão'),
(8, 1, 2, '2025-11-16', '14:00:00', '15:00:00', 'confirmado', 80.00, NULL),
(9, 2, 6, '2025-11-17', '09:00:00', '09:30:00', 'confirmado', 200.00, NULL),

-- agendamentos concluidos
(7, 1, 1, '2025-11-05', '10:00:00', '10:45:00', 'concluido', 50.00, NULL),
(8, 2, 6, '2025-11-06', '14:00:00', '14:30:00', 'concluido', 200.00, NULL),

-- cancelados
(9, 1, 2, '2025-11-10', '16:00:00', '17:00:00', 'cancelado', 80.00, 'Cliente cancelou por imprevistos');

-- avaliacoes
INSERT INTO avaliacoes (agendamento_id, cliente_id, prestador_id, nota, comentario) VALUES
(4, 7, 1, 5, 'Excelente atendimento! Marina é muito profissional e o corte ficou perfeito. Super recomendo!'),
(5, 8, 2, 5, 'Dra. Josefina é muito atenciosa e competente. Clínica muito bem organizada.');

-- atualiza avaliacao dos prestadores
UPDATE prestadores SET avaliacao_media = 5.00, total_avaliacoes = 1 WHERE id = 1;
UPDATE prestadores SET avaliacao_media = 5.00, total_avaliacoes = 1 WHERE id = 2;

-- exemplo de notificacao
INSERT INTO notificacoes (usuario_id, tipo, titulo, mensagem, agendamento_id, lida) VALUES
(7, 'lembrete', 'Lembrete de Agendamento', 'Você tem um agendamento amanhã às 10:00 no Salão Marina Oliveira', 1, FALSE),
(2, 'confirmacao', 'Novo Agendamento', 'Jurssicley do Rego Silva agendou Corte Masculino para 15/11/2025 às 10:00', 1, FALSE);


-- view de agendamento completo com infos de cliente, prestador e servico

CREATE OR REPLACE VIEW view_agendamentos_completos AS
SELECT 
    a.id AS agendamento_id,
    a.data_agendamento,
    a.hora_inicio,
    a.hora_fim,
    a.status,
    a.valor_total,
    a.observacoes,
    a.created_at AS data_criacao,
    c.id AS cliente_id,
    c.nome AS cliente_nome,
    c.telefone AS cliente_telefone,
    c.email AS cliente_email,
    p.id AS prestador_id,
    p.nome_estabelecimento AS prestador_nome,
    p.categoria AS prestador_categoria,
    s.id AS servico_id,
    s.nome AS servico_nome,
    s.duracao AS servico_duracao,
    s.preco AS servico_preco
FROM agendamentos a
INNER JOIN usuarios c ON a.cliente_id = c.id
INNER JOIN prestadores p ON a.prestador_id = p.id
INNER JOIN servicos s ON a.servico_id = s.id
ORDER BY a.data_agendamento DESC, a.hora_inicio DESC;

-- prestadores em destaque
CREATE OR REPLACE VIEW view_prestadores_destaque AS
SELECT 
    p.*,
    u.nome AS proprietario_nome,
    u.email AS proprietario_email,
    u.telefone AS proprietario_telefone,
    u.foto_perfil AS proprietario_foto,
    COUNT(DISTINCT s.id) AS total_servicos,
    COUNT(DISTINCT a.id) AS total_agendamentos,
    -- Pega a imagem principal da galeria ou usa a imagem_url do prestador (add imgs no front depois)
    COALESCE(
        (SELECT url FROM imagens_prestadores 
         WHERE prestador_id = p.id AND tipo = 'principal' AND ativo = TRUE 
         LIMIT 1),
        p.imagem_url
    ) AS imagem_principal
FROM prestadores p
INNER JOIN usuarios u ON p.usuario_id = u.id
LEFT JOIN servicos s ON p.id = s.prestador_id AND s.ativo = TRUE
LEFT JOIN agendamentos a ON p.id = a.prestador_id AND a.status = 'concluido'
WHERE p.ativo = TRUE
GROUP BY p.id
ORDER BY p.avaliacao_media DESC, p.total_avaliacoes DESC;

-- procedure pra dar finding em horarios e datas disponiveis
DELIMITER //
CREATE PROCEDURE buscar_horarios_disponiveis(
    IN p_prestador_id INT,
    IN p_data DATE,
    IN p_duracao_servico INT
)
BEGIN
    DECLARE v_hora_abertura TIME;
    DECLARE v_hora_fechamento TIME;
    
    -- buscador de horario de funcionamento dos prestadores
    SELECT horario_abertura, horario_fechamento 
    INTO v_hora_abertura, v_hora_fechamento
    FROM prestadores 
    WHERE id = p_prestador_id;
    
    -- gera horarios de intervalo
    SELECT 
        TIME_FORMAT(t.hora, '%H:%i') AS horario_disponivel
    FROM (
        SELECT ADDTIME(v_hora_abertura, SEC_TO_TIME(n * 1800)) AS hora
        FROM (
            SELECT 0 AS n UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 
            UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9 
            UNION SELECT 10 UNION SELECT 11 UNION SELECT 12 UNION SELECT 13 UNION SELECT 14 
            UNION SELECT 15 UNION SELECT 16 UNION SELECT 17 UNION SELECT 18 UNION SELECT 19
            UNION SELECT 20
        ) AS numbers
    ) AS t
    WHERE t.hora >= v_hora_abertura
    AND ADDTIME(t.hora, SEC_TO_TIME(p_duracao_servico * 60)) <= v_hora_fechamento
    AND NOT EXISTS (
        SELECT 1 FROM agendamentos 
        WHERE prestador_id = p_prestador_id 
        AND data_agendamento = p_data
        AND status NOT IN ('cancelado', 'nao_compareceu')
        -- Coloquei logica de sobreposicao de horarios caso tenha agendamento com horario que conflite
        AND (
            ADDTIME(t.hora, SEC_TO_TIME(p_duracao_servico * 60)) > hora_inicio 
            AND t.hora < hora_fim
        )
    )
    AND NOT EXISTS (
        SELECT 1 FROM horarios_bloqueados
        WHERE prestador_id = p_prestador_id
        AND TIMESTAMP(p_data, t.hora) >= data_inicio
        AND TIMESTAMP(p_data, t.hora) < data_fim
    )
    ORDER BY t.hora;
END //
DELIMITER ;

-- estatistica dos prestadores de servico
DELIMITER //
CREATE PROCEDURE estatisticas_prestador(
    IN p_prestador_id INT,
    IN p_data_inicio DATE,
    IN p_data_fim DATE
)
BEGIN
    SELECT 
        COUNT(*) AS total_agendamentos,
        SUM(CASE WHEN status = 'concluido' THEN 1 ELSE 0 END) AS total_concluidos,
        SUM(CASE WHEN status = 'cancelado' THEN 1 ELSE 0 END) AS total_cancelados,
        SUM(CASE WHEN status = 'nao_compareceu' THEN 1 ELSE 0 END) AS total_faltas,
        SUM(CASE WHEN status = 'concluido' THEN valor_total ELSE 0 END) AS faturamento_total,
        ROUND(AVG(CASE WHEN status = 'concluido' THEN valor_total ELSE NULL END), 2) AS ticket_medio,
        ROUND((SUM(CASE WHEN status = 'concluido' THEN 1 ELSE 0 END) * 100.0 / COUNT(*)), 2) AS taxa_conclusao
    FROM agendamentos
    WHERE prestador_id = p_prestador_id
    AND data_agendamento BETWEEN p_data_inicio AND p_data_fim;
END //
DELIMITER ;

-- procedure para buscar prestador com imagens
DELIMITER //
CREATE PROCEDURE buscar_prestador_completo(IN p_prestador_id INT)
BEGIN
    
    SELECT 
        p.*,
        u.nome AS proprietario_nome,
        u.email AS proprietario_email,
        u.telefone AS proprietario_telefone,
        u.foto_perfil AS proprietario_foto
    FROM prestadores p
    INNER JOIN usuarios u ON p.usuario_id = u.id
    WHERE p.id = p_prestador_id;
    
    
    SELECT 
        id,
        url,
        tipo,
        ordem,
        descricao
    FROM imagens_prestadores
    WHERE prestador_id = p_prestador_id 
    AND ativo = TRUE
    ORDER BY ordem;
    
    
    SELECT 
        id,
        nome,
        descricao,
        duracao,
        preco
    FROM servicos
    WHERE prestador_id = p_prestador_id 
    AND ativo = TRUE;
    
    
    SELECT 
        av.nota,
        av.comentario,
        av.created_at,
        u.nome AS cliente_nome,
        u.foto_perfil AS cliente_foto
    FROM avaliacoes av
    INNER JOIN usuarios u ON av.cliente_id = u.id
    WHERE av.prestador_id = p_prestador_id
    ORDER BY av.created_at DESC
    LIMIT 5;
END //
DELIMITER ;

-- trigger de atualizacao de avaliacao, faz media automaticamente
DELIMITER //
CREATE TRIGGER atualizar_avaliacao_prestador
AFTER INSERT ON avaliacoes
FOR EACH ROW
BEGIN
    UPDATE prestadores 
    SET 
        avaliacao_media = (
            SELECT ROUND(AVG(nota), 2)
            FROM avaliacoes 
            WHERE prestador_id = NEW.prestador_id
        ),
        total_avaliacoes = (
            SELECT COUNT(*) 
            FROM avaliacoes 
            WHERE prestador_id = NEW.prestador_id
        )
    WHERE id = NEW.prestador_id;
END //
DELIMITER ;

-- trigger de notificações automáticas na criacao de agendamento
DELIMITER //
CREATE TRIGGER criar_notificacao_agendamento
AFTER INSERT ON agendamentos
FOR EACH ROW
BEGIN
    -- notification para o cliente
    INSERT INTO notificacoes (usuario_id, tipo, titulo, mensagem, agendamento_id)
    VALUES (
        NEW.cliente_id,
        'confirmacao',
        'Agendamento Confirmado',
        CONCAT('Seu agendamento foi confirmado para ', DATE_FORMAT(NEW.data_agendamento, '%d/%m/%Y'), ' às ', TIME_FORMAT(NEW.hora_inicio, '%H:%i')),
        NEW.id
    );
    
    -- notification pro prestador
    INSERT INTO notificacoes (usuario_id, tipo, titulo, mensagem, agendamento_id)
    SELECT 
        p.usuario_id,
        'confirmacao',
        'Novo Agendamento',
        CONCAT('Novo agendamento para ', DATE_FORMAT(NEW.data_agendamento, '%d/%m/%Y'), ' às ', TIME_FORMAT(NEW.hora_inicio, '%H:%i')),
        NEW.id
    FROM prestadores p
    WHERE p.id = NEW.prestador_id;
END //
DELIMITER ;

-- Retorna delimitador ao padrão
DELIMITER ;

-- Ver todos os prestadores com imagens
SELECT 
    id,
    nome_estabelecimento,
    categoria,
    imagem_principal
FROM view_prestadores_destaque;

-- Testar a nova procedure
CALL buscar_prestador_completo(1);