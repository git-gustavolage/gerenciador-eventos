CREATE DATAVASE eventos;

USE eventos;

CREATE TABLE users (
	id bigint(20) primary key not null auto_increment,
	nome varchar(255) not null,
    cpf varchar(11) unique not null,
	email varchar(255) unique not null,
    email_verified_at datetime,
	password varchar(255) not null,
	is_admin tinyint(1) not null default 0,
	is_ativo tinyint(1) not null default 1
);

CREATE TABLE permissoes (
	id bigint(20) primary key not null auto_increment,
    nome varchar(255) unique not null
);

CREATE TABLE user_permissoes (
	id bigint(20) primary key not null auto_increment,
    id_user bigint(20) not null,
    id_permissao bigint(20) not null,

	CONSTRAINT user_permissoes_id_user_foreign FOREIGN KEY (id_user)
	REFERENCES users(id) ON DELETE CASCADE,

	CONSTRAINT user_permissoes_id_permissao_foreign FOREIGN KEY (id_permissao)
	REFERENCES permissoes(id) ON DELETE CASCADE
);

CREATE TABLE participantes (
	id bigint(20) primary key not null auto_increment,
    id_user bigint(20) not null,
	telefone varchar(255) not null,
	data_nascimento date not null,

	CONSTRAINT participantes_id_user_foreign FOREIGN KEY (id_user)
	REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE palestrantes (
	id bigint(20) primary key not null auto_increment,
    id_user bigint(20) not null,
	telefone varchar(255) not null,
	cargo varchar(255),
	instituicao varchar(255),
	image_path varchar(255),

	CONSTRAINT palestrantes_id_user_foreign FOREIGN KEY (id_user)
	REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE organizacoes (
	id bigint(20) primary key not null auto_increment,
    nome varchar(255) not null,
    email varchar(255) not null,
    telefone varchar(255) not null
);

CREATE TABLE organizacoes_membros (
	id bigint(20) primary key not null auto_increment,
    id_user bigint(20) not null,
    id_organizacao bigint(20) not null,

	CONSTRAINT organizacoes_membros_id_user_foreign FOREIGN KEY (id_user)
	REFERENCES users(id) ON DELETE CASCADE,

	CONSTRAINT organizacoes_membros_id_organizacao_foreign FOREIGN KEY (id_organizacao)
	REFERENCES organizacoes(id) ON DELETE CASCADE
);

CREATE TABLE localidades (
	id bigint(20) primary key not null auto_increment,
	nome varchar(255) not null,
	estado varchar(255),
	cidade varchar(255),
	pais varchar(255),
);

CREATE TABLE eventos (
	id bigint(20) primary key not null auto_increment,
	id_organizacao bigint(20) not null,
	id_localidade bigint(20) not null,
	titulo varchar(255) not null,
	descricao varchar(255) not null,
    banner_path varchar(255),
	formato varchar(255) not null,
	data_inicio datetime not null,
	data_fim datetime not null,
	data_inicio_inscricoes datetime,
	data_fim_inscricoes datetime,
    limite_inscricoes int,
	is_publicado tinyint(1) not null default 0,
	is_cancelado tinyint(1) not null default 0,
	
	CONSTRAINT eventos_id_organizacao_foreign FOREIGN KEY (id_organizacao)
	REFERENCES organizacoes(id) ON DELETE RESTRICT,

	CONSTRAINT eventos_id_localidade_foreign FOREIGN KEY (id_localidade)
	REFERENCES localidades(id) ON DELETE RESTRICT,
);

CREATE TABLE ingressos (
	id bigint primary key auto_increment,
	id_evento bigint not null,
	nome varchar(255) not null,
	descricao varchar(255),
	preco decimal(10,2) default 0,
	quantidade_total int null, -- null = ilimitado
	data_inicio_vendas datetime,
	data_fim_vendas datetime,
	
	CONSTRAINT ingressos_id_evento_foreign FOREIGN KEY (id_evento)
	REFERENCES eventos(id) ON DELETE CASCADE
);

CREATE TABLE ambientes (
	id bigint(20) primary key not null auto_increment,
    id_evento bigint(20) not null,
	nome varchar(255) not null,
	descricao varchar(255) null default null,

	CONSTRAINT ambientes_id_evento_foreign FOREIGN KEY (id_evento)
	REFERENCES eventos(id) ON DELETE CASCADE
);

CREATE TABLE atividades (
	id bigint(20) primary key not null auto_increment,
	id_evento bigint(20) not null,
	id_ambiente bigint(20) not null,
	titulo varchar(255) not null,
	descricao varchar(255) not null,
	data_inicio datetime not null,
	data_fim datetime not null,
	is_cancelada tinyint(1) not null default 0,
	limite_participantes int null,

	CONSTRAINT atividades_id_evento_foreign FOREIGN KEY (id_evento)
	REFERENCES eventos(id) ON DELETE CASCADE,
	
	CONSTRAINT atividades_id_ambiente_foreign FOREIGN KEY (id_ambiente)
	REFERENCES ambientes(id) ON DELETE CASCADE
);

CREATE TABLE atividades_palestrantes (
	id bigint(20) primary key not null auto_increment,
    id_palestrante bigint(20) not null,
    id_atividade bigint(20) not null,

    CONSTRAINT atividades_palestrantes_id_palestrante_foreign FOREIGN key (id_palestrante)
    REFERENCES palestrantes(id) ON DELETE RESTRICT,

	CONSTRAINT atividades_palestrantes_id_atividade_foreign FOREIGN KEY (id_atividade)
	REFERENCES atividades(id) ON DELETE CASCADE
);

CREATE TABLE categorias_de_inscricao (
	id bigint(20) primary key not null auto_increment,
    id_evento bigint(20) not null,
    nome varchar(255) not null,

    CONSTRAINT categorias_id_evento FOREIGN KEY (id_evento)
    REFERENCES eventos(id)
);

CREATE TABLE inscricoes (
	id bigint(20) primary key not null auto_increment,
	id_participante bigint(20) not null,
	id_ingresso bigint(20) not null,
	status int not null, -- 0: pendente, 1: confirmado, 2: cancelado
	data datetime not null,

	CONSTRAINT inscricoes_id_participante_foreign FOREIGN KEY (id_participante)
	REFERENCES participantes(id) ON DELETE CASCADE,
	
	CONSTRAINT inscricoes_id_ingresoo_foreign FOREIGN KEY (id_ingresoo)
	REFERENCES ingressos(id) ON DELETE CASCADE
);

CREATE TABLE inscricoes_atividades (
	id bigint(20) primary key not null auto_increment,
	id_inscricao bigint(20) not null,
	id_atividade bigint(20) not null,
	data date not null,
	
	CONSTRAINT inscricoes_atividades_id_inscricao_foreign FOREIGN KEY(id_inscricao)
	REFERENCES inscricoes(id) ON DELETE CASCADE,
	
	CONSTRAINT inscricoes_atividades_id_atividade_foreign FOREIGN KEY (id_atividade)
	REFERENCES atividades(id) ON DELETE CASCADE
);

CREATE TABLE presencas (
	id bigint(20) primary key not null auto_increment,
	id_inscricao bigint(20) not null,
	id_atividade bigint(20) not null,
	data datetime null default null,
	
	CONSTRAINT presencas_id_inscricao_foreign FOREIGN KEY (id_inscricao)
	REFERENCES inscricoes(id) ON DELETE CASCADE,
	
	CONSTRAINT presencas_id_atividade_foreign FOREIGN KEY (id_atividade)
	REFERENCES atividades(id) ON DELETE CASCADE
);

CREATE TABLE links_confirmacao_presenca (
	id bigint(20) primary key not null auto_increment,
    id_atividade bigint(20) not null,
    data_inicio datetime not null,
    data_fim datetime not null,
    url varchar(255) not null,
    is_cancelado tinyint(1) not null default 0,

	CONSTRAINT links_confirmacao_presenca_id_atividade_foreign FOREIGN KEY (id_atividade)
	REFERENCES atividades(id) ON DELETE CASCADE
);

CREATE TABLE certificados (
	id bigint(20) primary key not null auto_increment,
	id_participante bigint(20) not null,
	id_atividade bigint(20) not null,
    emitido_em datetime,
	carga_horaria_em_minutos int not null,

	CONSTRAINT certificados_id_participante_foreign FOREIGN KEY (id_participante) 
	REFERENCES participantes(id) ON DELETE SET NULL,

	CONSTRAINT certificados_id_atividade_foreign FOREIGN KEY (id_atividade)
	REFERENCES atividades(id) ON DELETE SET NULL
);
