# E-IFRO - Sistema de gerenciamento de eventos

Breve descrição

## 1. Rodando o projeto

### 1.1 Via Docker

A opção recomendada para rodar o projeto é via Docker

Para rodar o projeto utilizando docker, rode o seguinte comando:

```bash
docker compose up -d --build --no-cache
```

Após isso o sistema estára disponível no endereço:  **http://localhost:8000**

### 1.2 Via XAMPP

Caso opte por rodar o projeto utilizando o XAMPP, siga os seguintes passos:

#### Pré requisitos:

- XAMPP
- Composer
- PHP
- Node

Instale as dependências do projeto com os comandos:

```bash
composer install
```

```bash
npm install
```

Após instaladas as depencências, copie o arquivo .env.example e crie o arquivo .env

Então Rode o seguinte comando:

```bash
php artisan key:generate
`````

Builde o código do frontend utilizando o seguinte comando:

```bash
npm run build
`````

Execute o projeto com o comando

```bash
php artisan serve --port=8000 --host=0.0.0.0
`````


### 1.2.1 Populando o banco

Caso tenha optado por rodar o sistema via XAMPP, é preciso manualmente rodar o comando para popular o banco com dados de exemplo

```bash
php artisan migrate --seed
```

Após isso o sistema estára disponível no endereço:  **http://localhost:8000**

## 2. Rodando os testes

### 2.1 Testes com Playright

Para rodar os testes do sistema utilizando o Playright, certifique-se que as dependências estejam instaladas e então rode o seguinte comando:

```bash
npx playwright test
```
