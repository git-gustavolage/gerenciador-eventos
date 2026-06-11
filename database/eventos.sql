CREATE DATABASE eventos;

USE eventos;

CREATE TABLE users (
	id bigint(20) primary key not null auto_increment,
	nome varchar(255) not null,
	email varchar(255) unique not null,
	password varchar(255) not null,
	admin tinyint(1) not null default 0,
	ativo tinyint(1) not null default 1
);

CREATE TABLE locais (
	id bigint(20) primary key not null auto_increment,
	nome varchar(255) not null
);

CREATE TABLE ambientes (
	id bigint(20) primary key not null auto_increment,
	id_local bigint(20),
	nome varchar(255) not null,
	capacidade int default 0,

	CONSTRAINT ambientes_id_local_foreign FOREIGN KEY (id_local)
	REFERENCES locais(id) ON DELETE RESTRICT
);

CREATE TABLE eventos (
	id bigint(20) primary key not null auto_increment,
	id_user bigint(20) not null,
	id_local bigint(20),
	titulo varchar(255) not null,
	descricao LONGTEXT,
	formato varchar(255) not null,
	categorias LONGTEXT not null,
    banner_path varchar(500),
	data_inicio datetime,
	data_fim datetime,
	data_inicio_inscricoes datetime,
	data_fim_inscricoes datetime,
    limite_inscricoes int,
	is_publicado tinyint(1) not null default 0,
	is_cancelado tinyint(1) not null default 0,
	is_encerrado tinyint(1) not null default 0,

	CONSTRAINT eventos_id_user_foreign FOREIGN KEY (id_user)
	REFERENCES users(id) ON DELETE RESTRICT,

	CONSTRAINT eventos_id_local_foreign FOREIGN KEY (id_local)
	REFERENCES locais(id) ON DELETE RESTRICT
);

CREATE TABLE organizadores (
	id bigint(20) primary key not null auto_increment,
	perfil varchar(255) not null,
	id_user bigint(20) not null,
	id_evento bigint(20) not null,

	CONSTRAINT organizadores_id_evento_foreign FOREIGN KEY (id_evento)
	REFERENCES eventos(id) ON DELETE CASCADE,

	CONSTRAINT organizadores_id_user_foreign FOREIGN KEY (id_user)
	REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE atividades (
	id bigint(20) primary key not null auto_increment,
	id_evento bigint(20) not null,
	titulo varchar(255) not null,
	descricao varchar(255),
	id_ambiente bigint(20) not null,
	data_inicio datetime not null,
	data_fim datetime not null,
	data_cancelamento datetime not null,
	is_cancelada tinyint(1) not null default 0,
	limite_participantes int null,

	CONSTRAINT atividades_id_evento_foreign FOREIGN KEY (id_evento)
	REFERENCES eventos(id) ON DELETE CASCADE
);

CREATE TABLE inscricoes_eventos (
	id bigint(20) primary key not null auto_increment,
	id_user bigint(20) not null,
	id_evento bigint(20) not null,
	status varchar(255) default "pendente",
	comapareceu tinyint(1) default 0,

	CONSTRAINT inscricoes_eventos_id_user_foreign FOREIGN KEY(id_user)
	REFERENCES users(id) ON DELETE CASCADE,

	CONSTRAINT inscricoes_eventos_id_evento_foreign FOREIGN KEY (id_evento)
	REFERENCES eventos(id) ON DELETE CASCADE
);

CREATE TABLE inscricoes_atividades (
	id bigint(20) primary key not null auto_increment,
	id_user bigint(20) not null,
	id_atividade bigint(20) not null,
	status varchar(255) default "pendente",
	comapareceu tinyint(1) default 0,

	CONSTRAINT inscricoes_atividades_id_user_foreign FOREIGN KEY(id_user)
	REFERENCES users(id) ON DELETE CASCADE,

	CONSTRAINT inscricoes_atividades_id_atividade_foreign FOREIGN KEY (id_atividade)
	REFERENCES atividades(id) ON DELETE CASCADE
);

CREATE TABLE ministrantes (
	id bigint(20) primary key not null auto_increment,
	id_user bigint(20),
	conta_id bigint(20),
	nome varchar(255) not null,
	email varchar(255) unique,
	telefone varchar(255) unique,
	bio varchar(500),
	foto_path varchar(500),
	cargo varchar(255),
	instituicao varchar(255),

	CONSTRAINT ministrantes_id_user_foreign FOREIGN KEY (id_user)
	REFERENCES users(id) ON DELETE SET NULL,

	CONSTRAINT ministrantes_conta_id_foreign FOREIGN KEY (conta_id)
	REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE convites (
	id bigint(20) primary key not null auto_increment,
	id_evento bigint(20) not null,
	email varchar(255) not null,
	token varchar(500) unique not null,
	aceito_em datetime,
	expira_em datetime,
	cancelado_em datetime,

	CONSTRAINT convites_id_evento_foreign FOREIGN KEY (id_evento)
	REFERENCES eventos(id) ON DELETE CASCADE
);

CREATE TABLE certificate_templates (
	id bigint(20) primary key not null auto_increment,
	id_evento bigint(20) not null,
	template_name varchar(255) not null,
    background_path varchar(255),
	fields longtext default "[]",

	CONSTRAINT certificate_templates_id_evento_foreign FOREIGN KEY (id_evento)
	REFERENCES eventos(id) ON DELETE CASCADE
);

CREATE TABLE certificates (
	id bigint(20) primary key not null auto_increment,
	id_user bigint(20) not null,
	id_evento bigint(20) not null,
	id_atividade bigint(20) not null,
	template_id bigint(20) not null,
	generated_file varchar(500),
	issued_at datetime,
	sent_at datetime,

	CONSTRAINT certificates_id_user_foreign FOREIGN KEY (id_user)
	REFERENCES users(id) ON DELETE CASCADE,

	CONSTRAINT certificates_id_evento_foreign FOREIGN KEY (id_evento)
	REFERENCES eventos(id) ON DELETE CASCADE,

	CONSTRAINT certificates_id_atividade_foreign  FOREIGN KEY (id_atividade)
	REFERENCES atividades(id) ON DELETE CASCADE,
    
    CONSTRAINT certificates_template_id_foreign  FOREIGN KEY (template_id)
	REFERENCES certificate_templates(id) ON DELETE CASCADE
);

CREATE TABLE atividades_ministrantes (
	id bigint(20) primary key not null auto_increment,
	id_atividade bigint(20) not null,
	id_ministrante bigint(20) not null,

	CONSTRAINT atividades_ministrantes_id_atividade_foreign FOREIGN KEY (id_atividade)
	REFERENCES atividades(id) ON DELETE CASCADE,

	CONSTRAINT atividades_ministrantes_id_ministrante_foreign FOREIGN KEY (id_ministrante)
	REFERENCES ministrantes(id) ON DELETE CASCADE
);
