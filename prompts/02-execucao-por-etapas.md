Complemento importante para execução do projeto:

Não implemente o sistema inteiro de uma vez. O projeto deve ser desenvolvido obrigatoriamente por etapas, de forma incremental, validando cada fase antes de avançar para a próxima.

A cada etapa, faça apenas o que foi pedido naquela fase, teste se está funcionando, corrija eventuais erros e só depois avance para a próxima etapa.

Sempre que terminar uma etapa, informe claramente:

* O que foi implementado.
* Quais arquivos foram criados ou alterados.
* Como testar aquela etapa.
* Se existe alguma pendência antes da próxima fase.
* Se o projeto continua rodando corretamente.

Não pule etapas. Não misture funcionalidades grandes em uma única entrega. Priorize estabilidade, organização e funcionamento real.

---

# Fase 1 — Planejamento inicial e estrutura do projeto

Nesta fase, crie apenas a base inicial do projeto.

Tarefas:

1. Criar o projeto `nova-previne`.
2. Configurar Next.js com TypeScript.
3. Configurar Tailwind CSS.
4. Configurar ESLint e Prettier.
5. Criar estrutura inicial de pastas.
6. Criar README inicial com descrição do projeto.
7. Criar `.env.example`.
8. Garantir que o projeto rode localmente.

Não implemente autenticação, banco ou telas completas ainda.

Critério de conclusão:

* O projeto deve abrir sem erros.
* A página inicial pode ser simples, apenas confirmando que o setup está funcionando.

---

# Fase 2 — Docker, PostgreSQL e Prisma

Nesta fase, configure a infraestrutura do projeto.

Tarefas:

1. Criar `Dockerfile`.
2. Criar `docker-compose.yml`.
3. Configurar serviço da aplicação.
4. Configurar serviço PostgreSQL.
5. Instalar e configurar Prisma.
6. Criar conexão com o banco.
7. Criar arquivo `schema.prisma` inicial.
8. Rodar primeira migration.
9. Criar seed inicial básico.

Critério de conclusão:

* O banco deve subir com Docker.
* A aplicação deve conseguir conectar ao banco.
* O Prisma deve estar funcionando.
* Deve existir pelo menos uma tabela simples de teste ou o schema inicial validado.

---

# Fase 3 — Modelagem completa do banco

Nesta fase, implemente o modelo de dados real.

Tarefas:

1. Criar os models principais:

   * User
   * PatientProfile
   * DentistProfile
   * Service
   * DentistAvailability
   * ScheduleBlock
   * Appointment
   * Notification
   * WhatsAppReminderLog
   * ContactMessage

2. Criar enums:

   * UserRole
   * AppointmentStatus
   * NotificationType
   * ReminderStatus

3. Criar relações corretamente.

4. Criar migrations.

5. Criar seed com:

   * Admin
   * Paciente teste
   * 3 dentistas
   * Serviços odontológicos
   * Disponibilidades básicas dos dentistas

Critério de conclusão:

* Migration deve rodar sem erro.
* Seed deve popular o banco.
* Deve ser possível visualizar os dados pelo Prisma Studio.

---

# Fase 4 — Layout base e identidade visual

Nesta fase, foque apenas no visual base do sistema.

Tarefas:

1. Criar design system básico:

   * cores
   * botões
   * inputs
   * cards
   * badges
   * containers
   * títulos

2. Criar componentes:

   * Header
   * Footer
   * Button
   * Card
   * SectionTitle
   * StatusBadge

3. Aplicar identidade visual da Nova Previne:

   * azul
   * verde
   * branco
   * elementos arredondados
   * visual odontológico moderno
   * inspiração nas artes criadas anteriormente

4. Criar layout responsivo base.

Critério de conclusão:

* O site deve ter aparência profissional.
* Header e footer devem aparecer corretamente.
* A responsividade básica deve funcionar.

---

# Fase 5 — Páginas públicas

Nesta fase, implemente as páginas públicas, sem área logada ainda.

Tarefas:

1. Criar página Home.
2. Criar página Sobre.
3. Criar página Tratamentos.
4. Criar página Dentistas.
5. Criar página Contato.
6. Criar formulário de contato.
7. Listar serviços vindos do banco.
8. Listar dentistas ativos vindos do banco.

Critério de conclusão:

* Todas as páginas públicas devem estar acessíveis.
* O visual deve estar moderno e responsivo.
* Serviços e dentistas devem vir do banco.
* O formulário de contato deve salvar mensagem no banco.

---

# Fase 6 — Autenticação e controle de acesso

Nesta fase, implemente login e cadastro.

Tarefas:

1. Criar cadastro de paciente.
2. Criar cadastro de dentista.
3. Criar login.
4. Criar logout.
5. Implementar hash de senha com bcrypt.
6. Implementar sessão segura com Auth.js/NextAuth ou JWT.
7. Criar proteção de rotas.
8. Criar redirecionamento por tipo de usuário:

   * paciente para `/dashboard/paciente`
   * dentista para `/dashboard/dentista`
   * admin para `/dashboard/admin`

Critério de conclusão:

* Paciente deve conseguir se cadastrar e logar.
* Dentista deve conseguir se cadastrar e logar.
* Admin seedado deve conseguir logar.
* Cada usuário deve cair no dashboard correto.
* Rotas protegidas não devem abrir sem login.

---

# Fase 7 — Dashboard do paciente

Nesta fase, implemente apenas a área do paciente.

Tarefas:

1. Criar dashboard do paciente.
2. Criar página de perfil do paciente.
3. Criar edição de dados do paciente.
4. Criar listagem de consultas do paciente.
5. Criar histórico de consultas.
6. Criar cards de status.
7. Criar botão para novo agendamento.

Critério de conclusão:

* Paciente logado deve visualizar seus dados.
* Paciente deve conseguir editar perfil.
* Paciente deve visualizar consultas relacionadas a ele.
* Layout deve estar responsivo.

---

# Fase 8 — Dashboard do dentista

Nesta fase, implemente apenas a área do dentista.

Tarefas:

1. Criar dashboard do dentista.

2. Criar página de perfil profissional.

3. Permitir edição de:

   * CRO
   * especialidade
   * bio
   * telefone
   * foto/avatar, se possível

4. Criar página de disponibilidade.

5. Permitir cadastrar dias e horários disponíveis.

6. Criar página de solicitações de consulta.

7. Criar página de agenda.

8. Criar histórico de atendimentos.

Critério de conclusão:

* Dentista logado deve conseguir editar seu perfil.
* Dentista deve conseguir configurar disponibilidade.
* Dentista deve visualizar consultas relacionadas a ele.
* Layout deve estar responsivo.

---

# Fase 9 — Fluxo de agendamento

Nesta fase, implemente o fluxo principal do sistema.

Tarefas:

1. Criar página de agendamento do paciente.

2. Criar fluxo em etapas:

   * escolher tratamento
   * escolher dentista
   * escolher data
   * escolher horário disponível
   * descrever o caso
   * confirmar solicitação

3. Buscar horários disponíveis com base na disponibilidade do dentista.

4. Impedir horários ocupados.

5. Criar consulta com status `REQUESTED`.

6. Criar notificação para o dentista.

7. Exibir confirmação para o paciente.

Critério de conclusão:

* Paciente deve conseguir solicitar consulta.
* Horários ocupados não devem aparecer.
* A consulta deve ser salva no banco.
* O dentista deve receber a solicitação.

---

# Fase 10 — Aceitar, recusar, cancelar e concluir consultas

Nesta fase, implemente as ações de status.

Tarefas:

1. Dentista pode aceitar consulta.
2. Dentista pode recusar consulta.
3. Ao recusar, deve informar motivo.
4. Paciente pode cancelar consulta.
5. Dentista pode concluir consulta.
6. Atualizar status corretamente.
7. Criar notificações internas para cada alteração.
8. Exibir status atualizado para paciente e dentista.

Critério de conclusão:

* O fluxo completo de status deve funcionar.
* Paciente deve acompanhar as mudanças.
* Dentista deve conseguir gerenciar solicitações.
* As regras de negócio devem impedir ações inválidas.

---

# Fase 11 — Notificações internas

Nesta fase, implemente o sistema de notificações.

Tarefas:

1. Criar listagem de notificações.
2. Criar indicador de notificações não lidas.
3. Permitir marcar notificação como lida.
4. Gerar notificações para:

   * nova consulta solicitada
   * consulta aceita
   * consulta recusada
   * consulta cancelada
   * consulta concluída
   * lembrete enviado

Critério de conclusão:

* Usuários devem visualizar suas notificações.
* Notificações devem estar associadas ao usuário correto.
* Notificações devem poder ser marcadas como lidas.

---

# Fase 12 — Lembretes por WhatsApp

Nesta fase, implemente a estrutura de lembretes.

Tarefas:

1. Criar `whatsappService`.

2. Criar função `sendWhatsAppReminder`.

3. Criar template de mensagem.

4. Criar log de envio.

5. Simular envio inicialmente, caso não haja API real configurada.

6. Preparar estrutura para integração futura com:

   * WhatsApp Business API
   * Twilio
   * Z-API
   * Evolution API
   * Meta WhatsApp Cloud API

7. Criar endpoint para disparar lembrete manualmente.

8. Criar indicação visual no painel se o lembrete foi enviado.

Critério de conclusão:

* O sistema deve gerar mensagem corretamente.
* O log deve ser salvo no banco.
* A estrutura deve estar pronta para integração real.

---

# Fase 13 — Dashboard administrativo

Nesta fase, implemente a área do administrador.

Tarefas:

1. Criar dashboard admin.

2. Exibir métricas:

   * total de pacientes
   * total de dentistas
   * total de consultas
   * consultas pendentes
   * consultas confirmadas
   * mensagens de contato

3. Gerenciar pacientes.

4. Gerenciar dentistas.

5. Ativar/desativar dentistas.

6. Gerenciar serviços.

7. Visualizar consultas.

8. Visualizar mensagens de contato.

Critério de conclusão:

* Admin deve conseguir acessar apenas a área dele.
* Admin deve conseguir visualizar dados gerais.
* Admin deve conseguir gerenciar os principais cadastros.

---

# Fase 14 — Refinamento visual e responsividade

Nesta fase, revise o frontend inteiro.

Tarefas:

1. Revisar responsividade no mobile.
2. Revisar espaçamentos.
3. Revisar cores.
4. Revisar botões.
5. Revisar formulários.
6. Revisar dashboards.
7. Melhorar telas vazias.
8. Melhorar mensagens de erro.
9. Adicionar loading states.
10. Adicionar feedback visual de sucesso/erro.

Critério de conclusão:

* O site deve parecer profissional.
* Nenhuma tela deve parecer inacabada.
* O sistema deve funcionar bem em desktop e mobile.

---

# Fase 15 — Testes manuais e revisão final

Nesta fase, valide o sistema inteiro.

Testar obrigatoriamente:

1. Cadastro de paciente.
2. Login de paciente.
3. Cadastro de dentista.
4. Login de dentista.
5. Login de admin.
6. Edição de perfil do paciente.
7. Edição de perfil do dentista.
8. Cadastro de disponibilidade.
9. Solicitação de consulta.
10. Aceite de consulta.
11. Recusa de consulta com motivo.
12. Cancelamento de consulta.
13. Conclusão de consulta.
14. Notificações.
15. Lembrete WhatsApp simulado.
16. Formulário de contato.
17. Responsividade.
18. Execução com Docker.

Critério de conclusão:

* Não deve haver erro crítico.
* Fluxo principal deve estar funcionando.
* README deve estar completo.
* Projeto deve estar pronto para apresentação.

---

# Regra obrigatória de execução

Antes de avançar de uma fase para outra, confirme que a fase atual está funcionando.

Não continue para a próxima fase se:

* O projeto não compila.
* O Docker não sobe.
* O banco não conecta.
* A migration falha.
* A autenticação quebra.
* O fluxo principal da fase atual está incompleto.
* Existe erro visível no console.

Se encontrar erro, corrija primeiro.

---

# Forma de resposta esperada a cada fase

Ao finalizar cada fase, responda neste formato:

## Fase concluída: [nome da fase]

### Implementado

* item 1
* item 2
* item 3

### Arquivos principais alterados

* arquivo 1
* arquivo 2
* arquivo 3

### Como testar

1. passo 1
2. passo 2
3. passo 3

### Observações

* pendências, se houver
* decisões técnicas tomadas
* próximos passos

Só avance para a próxima fase depois de confirmar que a fase atual está estável.
