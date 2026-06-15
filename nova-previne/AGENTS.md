<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

# UI/UX Pro Design Intelligence — Nova Previne

Sempre que implementar ou alterar qualquer tela, componente, layout ou fluxo visual deste projeto, siga obrigatoriamente estas diretrizes.

---

## 1. Objetivo visual

O sistema deve parecer um produto profissional de uma clínica odontológica moderna, confiável e premium.

A interface deve transmitir:

- Saúde
- Confiança
- Limpeza
- Tecnologia
- Acolhimento
- Organização
- Clareza
- Profissionalismo

Evite qualquer visual com aparência genérica, amadora, poluída ou de template simples.

---

## 2. Identidade visual da Nova Previne

Use como base uma identidade odontológica moderna com predominância de:

- Branco
- Azul
- Verde
- Tons claros de azul e verde
- Azul escuro para contraste e títulos
- Cinzas suaves para textos secundários

Sugestão de paleta:

```ts
const colors = {
  primaryBlue: "#008FD3",
  darkBlue: "#003B6F",
  primaryGreen: "#009E5A",
  lightBlue: "#EAF7FC",
  lightGreen: "#EAF8F1",
  white: "#FFFFFF",
  grayText: "#4B5563",
  grayLight: "#F3F4F6",
};
```

A interface deve usar essas cores com equilíbrio. Não usar cores fortes demais em excesso.

---

## 3. Estilo geral

A interface deve ter:

- Layout limpo
- Bastante respiro visual
- Cards arredondados
- Sombras suaves
- Bordas discretas
- Ícones modernos
- Tipografia clara
- Botões bem definidos
- Seções bem espaçadas
- Animações sutis
- Boa hierarquia visual

Evite:

- Excesso de gradientes
- Excesso de sombras fortes
- Muitos elementos decorativos
- Textos muito colados
- Cards poluídos
- Botões sem hierarquia
- Telas com aparência de sistema antigo

---

## 4. Inspiração visual

Use como referência visual as artes de divulgação feitas para a clínica Nova Previne:

- Visual moderno
- Fundo claro
- Azul e verde predominantes
- Elementos odontológicos discretos
- Destaque para 20 anos
- Sensação de campanha profissional
- Comunicação clara e direta

Aplique essa inspiração no site inteiro, mas sem deixar o layout com cara de panfleto. O site deve ser mais limpo, institucional e sofisticado.

---

## 5. Tipografia

Use tipografia moderna e legível.

Preferências:

- Títulos grandes, fortes e limpos
- Subtítulos médios e claros
- Textos com boa altura de linha
- Contraste adequado
- Evitar excesso de caixa alta

Sugestão:

- Fonte principal: Inter, Geist, Manrope ou similar.
- Títulos: peso 700 ou 800.
- Textos: peso 400 ou 500.

---

## 6. Componentes

Todo componente deve ser reutilizável, limpo e responsivo.

Componentes obrigatórios devem seguir padrão visual consistente:

- Button
- Input
- Textarea
- Select
- Card
- Badge
- Modal
- Header
- Footer
- DashboardSidebar
- DashboardHeader
- AppointmentCard
- DentistCard
- ServiceCard
- StatusBadge
- EmptyState
- LoadingState
- Alert
- ConfirmDialog

Não criar componentes visualmente diferentes sem necessidade. Manter padrão.

---

## 7. Botões

Os botões devem ter hierarquia clara.

Use:

- Botão primário: azul ou verde sólido.
- Botão secundário: fundo claro com borda.
- Botão de ação positiva: verde.
- Botão de alerta/cancelamento: vermelho discreto.
- Botão neutro: cinza claro.

Todos os botões devem ter:

- Estado hover
- Estado disabled
- Estado loading, quando necessário
- Boa área de clique
- Texto claro e direto

---

## 8. Cards

Cards devem ter:

- Fundo branco
- Bordas suaves
- Cantos arredondados
- Sombra leve
- Espaçamento interno confortável
- Ícone ou destaque visual quando fizer sentido

Cards não devem ficar carregados. Distribuir bem as informações.

---

## 9. Formulários

Formulários devem ser claros e fáceis de usar.

Todo formulário deve ter:

- Labels claros
- Placeholders úteis
- Mensagens de erro amigáveis
- Validação visual
- Espaçamento confortável
- Botão principal bem destacado
- Estados de carregamento
- Feedback de sucesso ou erro

Evitar formulários longos demais sem organização. Quando necessário, dividir em etapas.

---

## 10. Fluxo de agendamento

A tela de agendamento deve ser uma das mais bem feitas do sistema.

Ela deve parecer um fluxo guiado em etapas:

1. Escolha do tratamento
2. Escolha do dentista
3. Escolha da data
4. Escolha do horário
5. Descrição do caso
6. Confirmação

Cada etapa deve ter:

- Título claro
- Explicação curta
- Opções bem apresentadas
- Feedback visual da seleção
- Botões de avançar e voltar
- Validações amigáveis

Evite colocar tudo em uma única tela poluída.

---

## 11. Dashboard do paciente

O dashboard do paciente deve ser simples, acolhedor e objetivo.

Priorize:

- Próxima consulta em destaque
- Status claro
- Botão para novo agendamento
- Histórico organizado
- Dados do perfil fáceis de editar
- Notificações visíveis

Não deixar o dashboard com cara de painel técnico demais.

---

## 12. Dashboard do dentista

O dashboard do dentista deve parecer profissional e produtivo.

Priorize:

- Consultas do dia
- Solicitações pendentes
- Agenda semanal
- Botões de aceitar/recusar
- Informações do paciente bem organizadas
- Descrição prévia do caso em área destacada

A experiência deve lembrar um painel de trabalho clínico.

---

## 13. Dashboard administrativo

O dashboard admin deve ser mais gerencial.

Priorize:

- Métricas em cards
- Tabelas limpas
- Filtros úteis
- Ações claras
- Visualização rápida da operação da clínica

---

## 14. Responsividade

Toda tela deve funcionar perfeitamente em:

- Desktop
- Notebook
- Tablet
- Celular

No mobile:

- Header deve virar menu responsivo.
- Cards devem empilhar corretamente.
- Botões devem ocupar largura confortável.
- Textos não podem quebrar de forma estranha.
- Tabelas devem virar cards ou ter scroll horizontal bem tratado.

Nunca finalizar uma tela sem revisar mobile.

---

## 15. Acessibilidade

Sempre cuidar de:

- Contraste adequado
- Labels em inputs
- Botões com texto claro
- Estados de foco
- Navegação por teclado quando possível
- Textos alternativos em imagens
- Não depender apenas de cor para status

---

## 16. Microcopy

Use textos claros, humanos e profissionais.

Exemplos:

- “Sua consulta foi solicitada com sucesso.”
- “O dentista ainda precisa confirmar este horário.”
- “Descreva brevemente o motivo da consulta.”
- “Escolha um horário disponível.”
- “Nenhuma consulta encontrada.”
- “Você ainda não possui solicitações pendentes.”

Evite mensagens técnicas para o usuário final.

---

## 17. Estados de tela

Toda tela importante deve prever:

- Loading
- Empty state
- Error state
- Success state
- Disabled state

Não deixar listas vazias sem explicação.

---

## 18. Qualidade visual obrigatória

Antes de finalizar qualquer tela, revisar:

- A tela tem boa hierarquia visual?
- O usuário entende rapidamente o que fazer?
- Há espaçamento suficiente?
- Os botões principais estão claros?
- A tela funciona bem no mobile?
- As cores estão coerentes com a Nova Previne?
- O visual parece profissional?
- Existem elementos desnecessários poluindo a tela?

Se a resposta for “não” para qualquer item, refinar antes de concluir.

---

## 19. Padrão de implementação

Ao criar uma tela:

1. Criar layout responsivo.
2. Criar componentes reutilizáveis.
3. Usar dados reais quando possível.
4. Usar estados de loading/empty/error.
5. Testar fluxo principal.
6. Revisar visual.
7. Revisar mobile.
8. Só então considerar a tela concluída.

---

## 20. Regra final

Sempre priorize qualidade visual e experiência do usuário.

O sistema não deve parecer apenas funcional. Ele deve parecer um produto real, bonito, confiável e pronto para ser apresentado a uma clínica odontológica.
