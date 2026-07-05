# Roadmap do Life Radar

Este documento descreve as etapas de planejamento, objetivos técnicos e o cronograma de desenvolvimento do **Life Radar**, estruturado em sprints incrementais para garantir qualidade técnica e integridade de arquitetura.

---

## 🗺️ Visão Geral de Sprints

```text
  [Sprint 1] ───> [Sprint 2] ───> [Sprint 3] ───> [Sprint 4]
  UI Offline      Supabase & BD   Integração      Treinador IA
 (Concluída ✅)   (A Seguir ⏳)    Dos Pilares     Edge Functions
```

---

## 🏃 Sprints Detalhadas

### **Sprint 1: Estrutura Base e UI Offline**  
**Status: Concluída ✅**

- [x] **Configuração do Ambiente:** Estruturação inicial do projeto com React, Vite, TypeScript e Tailwind CSS.
- [x] **Arquitetura Orientada a Features (Feature-Driven):** Organização das pastas do projeto isolando cada pilar em componentes independentes.
- [x] **Componente Global de Layout:** Criação do `Layout.tsx` unificando navegação, busca global de registros e alternância dinâmica de tema (Light / Dark).
- [x] **Desenvolvimento das Interfaces Iniciais:**
  - **Dashboard Principal:** Métricas consolidadas, progresso geral e área do Treinador IA.
  - **Pilar Físico:** Lógica e UI para registros corporativos, calistenia e dados de corrida.
  - **Pilar Acadêmico:** Visualização de horas de estudo por área e acompanhamento de tarefas.
  - **Pilar Financeiro:** Distribuição patrimonial e controle de ativos.
  - **Histórico Completo:** Log consolidado com busca cruzada e ações de exclusão.
- [x] **Refatoração e Limpeza de Arquitetura:** Remoção completa do servidor Express, endpoints REST e persistência `localStorage` para deixar o ecossistema limpo e pronto para a integração nativa com Supabase.

---

### **Sprint 2: Infraestrutura Supabase e Modelagem do Banco**  
**Status: A Seguir ⏳**

- [ ] **Provisionamento no Supabase:** Criação do projeto, tabelas relacionais e políticas de segurança RLS (Row Level Security).
- [ ] **Modelagem das Tabelas:**
  - `usuarios`: Perfis e configurações de metas.
  - `historico_registros`: Registro único e polimórfico dos pilares (Físico, Acadêmico, Financeiro).
  - `metas_prioridades`: Lista de prioridades ativas e prazos.
  - `recomendacoes_ia`: Histórico de feedbacks gerados pelo Treinador IA.
- [ ] **Integração do Supabase SDK:** Configuração do cliente Supabase e substituição definitiva dos estados em memória (`initialData.ts`) por requisições e persistência em nuvem.
- [ ] **Autenticação de Usuário:** Implementação do fluxo de login e cadastro seguro via Supabase Auth.

---

### **Sprint 3: Integração de Pilares e Automações**  
**Status: Planejado 📅**

- [ ] **Integração Física (Zeblaze):** Mocking/leitura ou canais de integração para dados do relógio inteligente (passos, batimentos, sono, distâncias).
- [ ] **Estatísticas Acadêmicas:** Implementação de gráficos avançados de correlação entre horas estudadas e metas de aproveitamento.
- [ ] **Motor de Carteira Financeira:** Atualização dinâmica de ativos (ações/FIIs) com APIs públicas de cotação ou simulações realistas e histórico de evolução patrimonial.
- [ ] **Sincronização em Tempo Real:** Escuta de eventos no Supabase para atualizar as interfaces imediatamente após qualquer inserção.

---

### **Sprint 4: Treinador IA via Edge Functions**  
**Status: Planejado 📅**

- [ ] **Supabase Edge Functions:** Implementação de funções serverless em TypeScript no próprio Supabase para chamadas seguras à API do Google Gemini.
- [ ] **Modelo de Prompt de Engenharia (Prompt Engineering):** Algoritmo otimizado que consome o histórico recente de múltiplos pilares e cospe uma resposta estruturada de orientação.
- [ ] **Geração Ativa de Recomendações:** Substituição da simulação estática por chamadas reais que geram e arquivam feedbacks semanais ou diários de forma contextualizada.
