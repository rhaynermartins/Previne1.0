# Nova Previne

Sistema web da Clinica Odontologica Nova Previne.

O projeto esta sendo desenvolvido em fases incrementais. No momento, foram concluidas as Fases 1, 2, 3 e 4: setup inicial, Docker, PostgreSQL, Prisma, modelagem completa do banco e layout base com identidade visual.

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
- Bcryptjs para hashes de senha no seed
- Lucide React para icones da interface

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

Para visualizar os dados pelo Prisma Studio:

```bash
npm run prisma:studio
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

## Dados Seedados

Credenciais de desenvolvimento:

```txt
Admin:
E-mail: admin@novaprevine.com
Senha: admin123

Paciente:
E-mail: paciente@teste.com
Senha: paciente123

Dentistas:
E-mail: joao.almeida@novaprevine.com
Senha: dentista123

E-mail: marina.costa@novaprevine.com
Senha: dentista123

E-mail: pedro.henrique@novaprevine.com
Senha: dentista123
```

O seed tambem cria:

- 6 servicos odontologicos.
- 3 perfis profissionais de dentistas.
- Disponibilidades basicas para os dentistas.
- Consultas de exemplo.
- Notificacoes internas de exemplo.
- Log simulado de lembrete por WhatsApp.
- Mensagem de contato de exemplo.

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
│       └── nova-previne-clinic-hero.png
├── src/
│   ├── app/
│   │   └── api/
│   │       └── health/
│   │           └── db/
│   ├── components/
│   │   ├── layout/
│   │   └── ui/
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

## Status da Fase 3

Concluido:

- Models principais criados no Prisma:
  - `User`
  - `PatientProfile`
  - `DentistProfile`
  - `Service`
  - `DentistAvailability`
  - `ScheduleBlock`
  - `Appointment`
  - `Notification`
  - `WhatsAppReminderLog`
  - `ContactMessage`
- Enums criados:
  - `UserRole`
  - `AppointmentStatus`
  - `NotificationType`
  - `ReminderStatus`
- Relacoes, indices e unicidades configurados.
- Migration `phase_3_core_domain_models` criada e aplicada.
- Seed completo criado com admin, paciente, dentistas, servicos, disponibilidades e dados de exemplo.
- Hashes de senha gerados com bcryptjs.

Nao implementado nesta fase:

- Autenticacao.
- Telas publicas completas.
- Dashboards.
- Fluxo real de agendamento.
- Acoes de aceitar, recusar, cancelar ou concluir consultas.

Esses itens pertencem as proximas fases.

## Status da Fase 4

Concluido:

- Design system inicial aplicado com paleta azul, verde, branco e cinzas suaves.
- Componentes base criados:
  - `Header`
  - `Footer`
  - `Button`
  - `ButtonLink`
  - `Card`
  - `Badge`
  - `StatusBadge`
  - `SectionTitle`
  - `Container`
  - `Input`
  - `Textarea`
  - `Select`
- Layout global com header e footer responsivos.
- Pagina inicial ajustada como superficie visual da identidade Nova Previne.
- Imagem hero odontologica adicionada em `public/images/nova-previne-clinic-hero.png`.
- Revisao mobile feita no Browser integrado.

Nao implementado nesta fase:

- Paginas publicas completas.
- Formulario de contato funcional.
- Listagem de servicos ou dentistas vinda do banco.
- Autenticacao.
- Dashboards.

Esses itens pertencem as proximas fases.
