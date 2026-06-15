export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[linear-gradient(135deg,#f7fcff_0%,#eaf8f1_48%,#ffffff_100%)] px-6 py-12 text-[#003b6f]">
      <section className="w-full max-w-4xl rounded-[28px] border border-[#d8eef7] bg-white/90 p-8 shadow-[0_24px_80px_rgba(0,59,111,0.12)] backdrop-blur sm:p-10">
        <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#009e5a]">
              Nova Previne
            </p>
            <h1 className="mt-3 max-w-2xl text-4xl font-bold leading-tight sm:text-5xl">
              Base inicial do projeto configurada.
            </h1>
          </div>
          <div className="flex size-20 shrink-0 items-center justify-center rounded-3xl bg-[#eaf7fc] text-3xl font-black text-[#008fd3]">
            NP
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {[
            "Next.js com App Router",
            "TypeScript, ESLint e Prettier",
            "Tailwind CSS com identidade visual",
          ].map((item) => (
            <div
              className="rounded-2xl border border-[#d8eef7] bg-[#f8fcfe] p-5 shadow-sm"
              key={item}
            >
              <div className="mb-4 size-3 rounded-full bg-[#009e5a]" />
              <p className="text-base font-semibold text-[#003b6f]">{item}</p>
            </div>
          ))}
        </div>

        <p className="mt-8 max-w-2xl text-base leading-7 text-[#4b5563]">
          Fase 1 pronta para validacao local. As proximas funcionalidades devem
          respeitar a ordem incremental definida nos prompts do projeto.
        </p>
      </section>
    </main>
  );
}
