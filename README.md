# E-IFRO - Sistema de gerenciamento de eventos

O E-IFRO é um sistema web voltado exclusivamente para a **Gestão de Eventos do IFRO**, desenvolvido para oferecer uma interface acessível e processos simplificados aos diversos públicos envolvidos, incluindo coordenadores de eventos institucionais, professores, servidores do IFRO, discentes e membros da comunidade externa.

Seu principal objetivo é centralizar as informações relacionadas aos **eventos da instituição**, mantendo os dados em um único repositório acessível, organizado e seguro. Dessa forma, usuários autorizados podem consultar, cadastrar, editar e gerenciar eventos e atividades com maior agilidade e eficiência.

---

## 1. Rodando o projeto

### 1.1 Via Docker

A opção recomendada para rodar o projeto é via Docker

Certifique-se de que possui o Docker instalado e rodando na sua máquina.

Para rodar o projeto utilizando docker, rode o seguinte comando:

```bash
docker compose up -d --build
```

Após isso o sistema estará disponível no endereço:  **http://localhost:8000**

### 1.2 Sem Docker

Caso opte por não utilizar o Docker, é possível executar o projeto diretamente no sistema operacional.

#### Pré-requisitos:

- PHP
- Composer
- Node.js
- npm

> [!NOTE]
Observação: o projeto requer apenas PHP, Composer, Node.js e npm. O XAMPP é opcional e pode ser utilizado apenas como uma forma prática de instalar e executar o PHP localmente.

Instale as dependências do projeto com os comandos:

```bash
composer install
```

```bash
npm install
```

Após instaladas as dependências, copie o arquivo **.env.example** e crie o arquivo **.env**

**Linux:**

```bash
cp .env.example .env
```

**Windows:**

```powershell
copy .env.example .env
```

Então Rode o seguinte comando:

```bash
php artisan key:generate
```

Builde o código do frontend utilizando o seguinte comando:

```bash
npm run build
```

Execute o projeto com o comando

```bash
php artisan serve --port=8000 --host=0.0.0.0
```

Após isso o sistema estará disponível no endereço:  **http://localhost:8000**

## 2. Configurando o banco de dados

O sistema está configurado para utilizar SQLite, não sendo necessária nenhuma configuração adicional para a conexão com o banco de dados. Caso opte pela conexão com outro SGBD, consulte a documentação oficial do Laravel: https://laravel.com/docs/12.x/database

> [!WARNING]
Caso tenha optado por rodar o sistema utilizando o Docker, esta configuração foi feita automaticamente. Ignore este tópico.

Caso não tenha optado por utilizar o docker, é preciso criar as tabelas iniciais no banco de dados para que o sistema funcione corretamente.

```bash
php artisan migrate
```

> [!NOTE]
Para facilitar a navegação e os testes do sistema, recomenda-se executar as migrations com a flag `--seed`, que cria registros iniciais de exemplo.

Caso deseje que o seu banco de dados já inicie com alguns registros para teste, utilize a flag "--seed":

```bash
php artisan migrate --seed
```

## 3. Rodando os testes

### 3.1 Testes com Playwright

Para rodar os testes do sistema utilizando o Playwright, certifique-se que as dependências estejam instaladas e que o projeto esteja rodando.

> [!WARNING]
Caso você esteja utilizando uma porta diferente de "8000", atualize o arquivo "playwright.config.js" e aponte para a URL correta.

Na primeira execução, instale os navegadores utilizados pelo Playwright:

```bash
npx playwright install
```

E então rode todos os testes com o seguinte comando:

```bash
npx playwright test
```

Caso queira rodar os testes individualmente:

```bash
// Login:
npx playwright test tests/playwright/login.spec.js

// Cadastro:
npx playwright test tests/playwright/cadastro.spec.js

// Restrição de acesso:
npx playwright test tests/playwright/seguranca.spec.js

// Fluxo completo no sistama: login -> area protegida -> logout
npx playwright test tests/playwright/fluxo-completo.spec.js
```
