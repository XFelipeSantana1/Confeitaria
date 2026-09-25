CREATE DATABASE IF NOT EXISTS confeitaria_db
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE confeitaria_db;

CREATE TABLE usuarios (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    nome            VARCHAR(120)        NOT NULL,
    email           VARCHAR(150)        NOT NULL UNIQUE,
    senha_hash      VARCHAR(255)        NOT NULL,
    cargo           ENUM('admin','gestor') NOT NULL DEFAULT 'gestor',
    ativo           BOOLEAN             NOT NULL DEFAULT TRUE,
    criado_em       DATETIME            NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE categorias (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    nome            VARCHAR(80)         NOT NULL UNIQUE
) ENGINE=InnoDB;

CREATE TABLE insumos (
    id                  INT AUTO_INCREMENT PRIMARY KEY,
    nome                VARCHAR(120)        NOT NULL,
    unidade_medida      ENUM('g','kg','ml','l','unidade') NOT NULL,
    quantidade_atual    DECIMAL(10,3)       NOT NULL DEFAULT 0,
    quantidade_minima   DECIMAL(10,3)       NOT NULL DEFAULT 0,
    custo_unitario      DECIMAL(10,2)       NOT NULL DEFAULT 0,
    criado_em           DATETIME            NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em       DATETIME            NOT NULL DEFAULT CURRENT_TIMESTAMP
                                             ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE produtos (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    categoria_id    INT                 NULL,
    nome            VARCHAR(120)        NOT NULL,
    descricao       TEXT,
    preco           DECIMAL(10,2)       NOT NULL,
    imagem_url      VARCHAR(255),
    ativo           BOOLEAN             NOT NULL DEFAULT TRUE,
    criado_em       DATETIME            NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_produtos_categoria
        FOREIGN KEY (categoria_id) REFERENCES categorias(id)
        ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE produto_insumo (
    produto_id            INT             NOT NULL,
    insumo_id             INT             NOT NULL,
    quantidade_necessaria DECIMAL(10,3)   NOT NULL,
    PRIMARY KEY (produto_id, insumo_id),
    CONSTRAINT fk_pi_produto FOREIGN KEY (produto_id) REFERENCES produtos(id) ON DELETE CASCADE,
    CONSTRAINT fk_pi_insumo  FOREIGN KEY (insumo_id)  REFERENCES insumos(id)  ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE clientes (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    nome            VARCHAR(120),
    whatsapp        VARCHAR(20)         NOT NULL UNIQUE,
    endereco        VARCHAR(255),
    criado_em       DATETIME            NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE pedidos (
    id                  INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id          INT                 NOT NULL,
    status              ENUM('pendente','em_preparo','pronto','entregue','cancelado')
                                             NOT NULL DEFAULT 'pendente',
    forma_pagamento     ENUM('pix','cartao','dinheiro','outro'),
    status_pagamento    ENUM('pendente','pago','estornado') NOT NULL DEFAULT 'pendente',
    valor_total         DECIMAL(10,2)       NOT NULL DEFAULT 0,
    origem              ENUM('whatsapp','painel') NOT NULL DEFAULT 'whatsapp',
    criado_em           DATETIME            NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em       DATETIME            NOT NULL DEFAULT CURRENT_TIMESTAMP
                                             ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_pedidos_cliente FOREIGN KEY (cliente_id) REFERENCES clientes(id)
) ENGINE=InnoDB;

CREATE TABLE itens_pedido (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    pedido_id       INT                 NOT NULL,
    produto_id      INT                 NOT NULL,
    quantidade      INT                 NOT NULL,
    preco_unitario  DECIMAL(10,2)       NOT NULL,
    subtotal        DECIMAL(10,2)       NOT NULL,
    CONSTRAINT fk_ip_pedido  FOREIGN KEY (pedido_id)  REFERENCES pedidos(id)  ON DELETE CASCADE,
    CONSTRAINT fk_ip_produto FOREIGN KEY (produto_id) REFERENCES produtos(id)
) ENGINE=InnoDB;

CREATE TABLE movimentacoes_estoque (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    insumo_id       INT                 NOT NULL,
    tipo            ENUM('entrada','saida','ajuste','perda') NOT NULL,
    quantidade      DECIMAL(10,3)       NOT NULL,
    pedido_id       INT                 NULL,
    observacao      VARCHAR(255),
    criado_em       DATETIME            NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_mov_insumo FOREIGN KEY (insumo_id) REFERENCES insumos(id),
    CONSTRAINT fk_mov_pedido FOREIGN KEY (pedido_id) REFERENCES pedidos(id)
) ENGINE=InnoDB;

CREATE INDEX idx_insumos_baixo_estoque ON insumos (quantidade_atual, quantidade_minima);
CREATE INDEX idx_pedidos_status ON pedidos (status);
CREATE INDEX idx_itens_pedido_produto ON itens_pedido (produto_id);
