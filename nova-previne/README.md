# Nova Previne

Base inicial do sistema web da Clinica Odontologica Nova Previne.

O projeto sera desenvolvido em fases incrementais. No momento, foram concluidas apenas as Fases 1 e 2: setup inicial, Docker, PostgreSQL e Prisma com uma tabela minima de validacao.

## Stack Atual

- Next.js com App Router
- React
- TypeScript
- Tailwind CSS
- ESLint
- Prettier
- Prisma ORM
- PostgreSQL
- Docker e Docker Compose

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run type-check
npm run format
npm run format:check
npm run prisma:generate
npm run prisma:migrate
npm run prisma:deploy
npm run prisma:seed
npm run prisma:studio
```

## Como Rodar Localmente

Instale as dependencias:

```bash
npm install
```

Crie o arquivo `.env` a partir do exemplo:

```powershell
Copy-Item .env.example .env
```

Suba o banco com Docker Compose:

```bash
docker compose up -d db
```

Se o ambiente usar o binario legado:

```bash
docker-compose up -d db
```

Gere o Prisma Client e aplique as migrations:

```bash
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

Execute o servidor de desenvolvimento:

```bash
npm run dev
```

Acesse:

```txt
http://localhost:3000
```

Endpoint de validacao do banco:

```txt
http://localhost:3000/api/health/db
```

## Como Rodar com Docker

Suba banco e aplicacao:

```bash
docker compose up -d --build
```

Ou, com o binario legado:

```bash
docker-compose up -d --build
```

O servico `app` executa automaticamente:

- `npm run prisma:deploy`
- `npm run prisma:seed`
- `npm run dev`

## Variaveis de Ambiente

```txt
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_CLINIC_NAME="Clinica Odontologica Nova Previne"

DATABASE_URL="postgresql://nova_previne:nova_previne_dev@localhost:5432/nova_previne?schema=public"

POSTGRES_USER="nova_previne"
POSTGRES_PASSWORD="nova_previne_dev"
POSTGRES_DB="nova_previne"
POSTGRES_PORT="5432"
```

## Estrutura Inicial

```txt
nova-previne/
├── docker-compose.yml
├── Dockerfile
├── prisma/
│   ├── migrations/
│   ├── schema.prisma
│   └── seed.ts
├── public/
│   └── images/
├── src/
│   ├── app/
│   │   └── api/
│   │       └── health/
│   │           └── db/
│   ├── components/
│   ├── lib/
│   │   └── prisma.ts
│   ├── services/
│   ├── styles/
│   └── types/
├── .env.example
├── AGENTS.md
├── package.json
└── README.md
```

## Status da Fase 1

Concluido:

- Projeto `nova-previne` criado.
- Next.js configurado com TypeScript.
- Tailwind CSS configurado.
- ESLint e Prettier configurados.
- Estrutura inicial de pastas criada.
- README inicial criado.
- `.env.example` criado.
- Pagina inicial simples criada para validacao local.

## Status da Fase 2

Concluido:

- `Dockerfile` criado.
- `docker-compose.yml` criado com servicos `app` e `db`.
- PostgreSQL configurado em container.
- Prisma instalado e configurado.
- `prisma.config.ts` criado.
- `schema.prisma` inicial criado com model `HealthCheck`.
- Primeira migration criada e aplicada.
- Seed basico criado e executado.
- Prisma Client configurado com adapter PostgreSQL.
- Endpoint `/api/health/db` criado para validar conexao app/banco.

Nao implementado nesta fase:

- Modelagem completa do banco.
- Autenticacao.
- Cadastros de pacientes/dentistas.
- Dashboards.
- Paginas publicas completas.
- Fluxo de agendamento.

Esses itens pertencem as fases seguintes e nao devem ser antecipados.
