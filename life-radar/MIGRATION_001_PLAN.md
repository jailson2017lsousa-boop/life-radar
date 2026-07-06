# Migration 001

## Objetivo

Esta migration será responsável apenas pela infraestrutura inicial do banco.

Ela não conterá regras de negócio.

Não conterá Views.

Não conterá Functions de domínio.

Não conterá Edge Functions.

Não conterá IA.

## Extensões

Será utilizada a extensão `pgcrypto` para geração de UUIDs.

## Função Genérica

Será prevista uma função genérica para atualizar automaticamente o campo `updated_at` sempre que um registro for alterado.

Essa função será reutilizável e servirá como base para a manutenção de metadados de auditoria nas tabelas iniciais.

## Primeiras Tabelas

### user_profiles

Objetivo

Criar a estrutura inicial para armazenar o perfil público de cada usuário autenticado.

Campos

- `id`: identificador único em UUID
- `user_id`: referência ao usuário autenticado
- `full_name`: nome completo do usuário
- `display_name`: nome exibido
- `avatar_url`: URL do avatar, se existir
- `created_at`: data de criação
- `updated_at`: data da última atualização
- `deleted_at`: marcação de exclusão lógica

Relacionamentos

- Relacionamento com o usuário autenticado via `user_id`
- Estrutura inicial sem dependência de módulos de negócio

### user_settings

Objetivo

Criar a estrutura inicial para armazenar preferências básicas do usuário.

Campos

- `id`: identificador único em UUID
- `user_id`: referência ao usuário autenticado
- `theme`: preferência de tema
- `language`: idioma preferido
- `notifications_enabled`: flag de notificações
- `created_at`: data de criação
- `updated_at`: data da última atualização
- `deleted_at`: marcação de exclusão lógica

Relacionamentos

- Relacionamento com o usuário autenticado via `user_id`
- Estrutura independente de outras áreas do sistema

## Índices

Serão previstos índices básicos para otimizar consultas frequentes sobre:

- `user_id` nas tabelas iniciais
- `created_at` para ordenação temporal
- `updated_at` para acompanhamento de alterações

## Fora do Escopo

Ficarão para migrations futuras:

- RLS
- Policies
- Views
- Triggers de negócio
- Tabelas físicas
- Financeiro
- Acadêmico
- Treinos
- IA

## Resultado Esperado

Após a aplicação desta migration, o projeto passará a possuir apenas a infraestrutura mínima para receber usuários autenticados de forma organizada, com estrutura inicial para perfis e configurações básicas.
