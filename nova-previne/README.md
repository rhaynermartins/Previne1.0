# Nova Previne

Base inicial do sistema web da Clinica Odontologica Nova Previne.

O projeto sera desenvolvido em fases incrementais. A Fase 1 entrega apenas a estrutura inicial com Next.js, TypeScript, Tailwind CSS, ESLint, Prettier, README, `.env.example` e uma pagina inicial simples para validar o setup.

## Stack Inicial

- Next.js com App Router
- React
- TypeScript
- Tailwind CSS
- ESLint
- Prettier
- npm

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run type-check
npm run format
npm run format:check
```

## Como Rodar Localmente

Instale as dependencias:

```bash
npm install
```

Execute o servidor de desenvolvimento:

```bash
npm run dev
```

Acesse:

```txt
http://localhost:3000
```

## Variaveis de Ambiente

Copie `.env.example` para `.env.local` quando precisar de configuracoes locais:

```bash
cp .env.example .env.local
```

No Windows PowerShell:

```powershell
Copy-Item .env.example .env.local
```

## Estrutura Inicial

```txt
nova-previne/
├── public/
│   └── images/
├── src/
│   ├── app/
│   ├── components/
│   │   ├── cards/
│   │   ├── forms/
│   │   ├── layout/
│   │   ├── sections/
│   │   └── ui/
│   ├── lib/
│   ├── services/
│   ├── styles/
│   └── types/
├── .env.example
├── .prettierrc
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

Nao implementado nesta fase:

- Banco de dados.
- Docker.
- Prisma.
- Autenticacao.
- Dashboards.
- Paginas publicas completas.
- Fluxo de agendamento.

Esses itens pertencem as fases seguintes e nao devem ser antecipados.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
