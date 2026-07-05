# LIFE RADAR DATABASE

## Filosofia do Banco

O banco de dados do **Life Radar** é projetado seguindo as melhores práticas de integridade e extensibilidade, adotando os seguintes princípios fundamentais:

*   **O histórico é a fonte da verdade:** Todas as alterações, treinos, aportes e medições são registrados como eventos imutáveis com carimbo de data/hora (*timestamps*). Não há sobrescrita de dados históricos para garantir uma linha do tempo auditável de evolução pessoal.
*   **Não existem estados atuais persistidos:** Métricas instantâneas (como peso atual, patrimônio líquido atual, total de horas estudadas) são calculadas dinamicamente agregando-se os registros de histórico através de views otimizadas.
*   **Cada domínio possui sua própria tabela:** Para maximizar a escalabilidade, tipagem e validação dos dados, os domínios (físico, acadêmico, financeiro) possuem suas próprias tabelas isoladas em vez de uma tabela única genérica.
*   **Todo dado pertence a um usuário:** Cada linha de cada tabela possui uma referência direta ao identificador único do usuário correspondente (`user_id`).
*   **Views calculam estados atuais:** Views SQL agregam as informações das tabelas de domínio para fornecer resumos de performance em tempo real de forma eficiente.

---

## Entidades Principais

As tabelas do sistema estão mapeadas para representar de forma estrita as necessidades de cada pilar:

### `profiles`
*   **Descrição:** Armazena os dados cadastrais do usuário, preferências de tema e configurações gerais.
*   **Finalidade:** Identificar o usuário no sistema e salvar parâmetros globais de visualização.

### `body_records`
*   **Descrição:** Registros antropométricos do pilar físico (peso, gordura corporal, massa muscular e medidas de circunferência).
*   **Finalidade:** Monitorar a evolução da composição corporal e do peso ao longo do tempo.

### `running_sessions`
*   **Descrição:** Sessões de corrida contendo métricas avançadas (distância, duração, ritmo/pace médio, batimentos cardíacos médios e calorias).
*   **Finalidade:** Registrar treinos cardiovasculares e permitir futuras integrações com relógios inteligentes (Zeblaze).

### `calisthenics_sessions`
*   **Descrição:** Sessões de treino focadas em força, ginástica e calistenia (exercícios, repetições, séries, notas de intensidade e progresso em habilidades).
*   **Finalidade:** Acompanhar a evolução técnica e de força muscular.

### `study_sessions`
*   **Descrição:** Registros de horas de estudo individuais (matéria, área de conhecimento, tempo líquido estudado e questões resolvidas/acertos).
*   **Finalidade:** Quantificar a dedicação acadêmica e calcular a eficiência de aprendizado por disciplina.

### `financial_records`
*   **Descrição:** Log de movimentações, aportes, resgates e saldos de contas e ativos financeiros.
*   **Finalidade:** Servir como base para o cálculo de patrimônio líquido consolidado e evolução de investimentos.

### `goals`
*   **Descrição:** Metas pessoais parametrizadas por pilar (ex: peso alvo, horas semanais de estudo, patrimônio alvo).
*   **Finalidade:** Medir a distância entre o estado atual calculado e os objetivos definidos para o ciclo.

### `ai_insights`
*   **Descrição:** Recomendações personalizadas e relatórios consolidados produzidos pelo Treinador IA.
*   **Finalidade:** Guardar o histórico de orientações sugeridas e o nível de engajamento do usuário.

---

## View `life_history`

A visualização unificada da linha do tempo no painel de histórico é consolidada pela view agregadora `life_history`. 

Essa view realiza uma operação de união (`UNION ALL`) das tabelas de domínio (`body_records`, `running_sessions`, `calisthenics_sessions`, `study_sessions`, `financial_records`, `goals`), padronizando o retorno em um formato comum contendo:
*   `id` (com prefixo do domínio correspondente)
*   `user_id` (do proprietário do registro)
*   `timestamp` (momento do registro)
*   `category` (domínio associado)
*   `description` (resumo em texto livre da ação realizada)
*   `payload` (JSON contendo os detalhes específicos do registro original para renderização dinâmica)

Isso permite carregar e buscar toda a linha do tempo do usuário através de uma única consulta performática e paginável.

---

## Estratégia de Segurança

O Supabase garante o controle rigoroso de acesso e segurança no banco de dados através dos seguintes mecanismos:

*   **RLS (Row Level Security) Obrigatório:** O Row Level Security é habilitado por padrão em todas as tabelas criadas no banco de dados.
*   **Isolamento por Usuário:** Políticas de acesso (*Policies*) garantem que um usuário só possa visualizar, inserir, atualizar ou remover dados pertencentes a ele mesmo, validando a restrição `auth.uid() = user_id`.
*   **Acesso Anônimo Bloqueado:** Todas as requisições que não apresentem um token de autorização JWT de usuário autenticado são rejeitadas por padrão para leitura e escrita de dados sensíveis.

---

## Estratégia de Evolução

A arquitetura do banco de dados foi projetada visando suportar de forma transparente os seguintes incrementos futuros:

1.  **Integração futura com Zeblaze:** Estrutura otimizada para recepção de cargas brutas de dados via API ou sincronização local.
2.  **Edge Functions:** Processamento em segundo plano no Supabase para automatizar conversões e formatação de dados de sensores.
3.  **Analytics avançado:** Índices secundários posicionados nos campos de data e categoria das tabelas de pilar para agilizar o tempo de resposta de relatórios consolidados anuais ou mensais.
4.  **Recomendações por IA:** Integração simplificada de modelos de linguagem para ler os payloads padronizados do histórico e salvar as análises estruturadas diretamente na tabela `ai_insights`.
