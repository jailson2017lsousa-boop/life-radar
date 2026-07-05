# Changelog

Todo o progresso técnico e versões lançadas do **Life Radar** serão devidamente documentados neste arquivo de acordo com as especificações do [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/).

---

## [1.0.0-alpha] - 2026-07-04

### Adicionado
- **Arquitetura Feature-Driven:** Reestruturação modular do projeto isolando o código em features independentes e escaláveis (`/src/features`).
- **Pilar de Performance Física:** Interface visual e fluxo para controle de peso, dados antropométricos, calistenia, corrida e logs de condicionamento.
- **Pilar Acadêmico:** Módulo de controle de tempo líquido de estudos com gráficos e acompanhamento de tarefas prioritárias.
- **Pilar Financeiro:** Painel de investimentos contendo distribuição gráfica de ativos, simulação de dividendos e aportes programados.
- **Histórico Consolidado de Eventos:** Página dedicada para pesquisa cruzada em tempo real com filtros rápidos por categoria.
- **Barra de Navegação Global e Layout:** Criação do cabeçalho unificado com alternância nativa de temas (Claro / Escuro) e botão de busca global.
- **Busca Transversal (Modal):** Lupa global acessível de qualquer pilar para buscar e navegar instantaneamente até os registros correspondentes.

### Removido
- **Servidor Express Independente:** Exclusão completa do arquivo `server.ts` e simplificação do fluxo do Vite para assegurar uma aplicação client-only purificada.
- **Dependência de LocalStorage:** Eliminação de sincronizações com o cache do navegador no App e no Layout, preparando o caminho para uma integração nativa e centralizada via Supabase SDK.
- **Dependência de TypeScript Externo no Servidor:** Limpeza dos scripts `"dev"`, `"build"` e `"start"` no `package.json` para rodar diretamente via Vite CLI.

---

*Nota: Esta versão alpha marca a conclusão bem-sucedida da Sprint 1 e define o estado limpo e estável para a inicialização da Sprint 2 com o Supabase.*
