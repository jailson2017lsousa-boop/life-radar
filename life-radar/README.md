# Life Radar

O **Life Radar** é uma aplicação pessoal de alta performance voltada ao monitoramento integrado de saúde, estudos e finanças. Com uma arquitetura limpa e orientada a domínios (Feature-Driven), a plataforma oferece análises métricas avançadas, visualizações dinâmicas e planejamento personalizado para maximizar o desenvolvimento individual.

---

## 🛠️ Stack Tecnológica

O ecossistema foi projetado buscando alta performance, simplicidade de deploy e tipagem estática rigorosa:

- **Frontend:** React 18+ com Vite (Fast Refresh e otimização de bundles)
- **Linguagem:** TypeScript (Modo estrito para robustez e previsibilidade)
- **Estilização:** Tailwind CSS (Utilitários modernos de alta performance)
- **Banco de Dados & Autenticação (Planejado):** Supabase (PostgreSQL, Realtime, Row Level Security)
- **Visualizações:** Recharts (Gráficos interativos e responsivos)
- **Ícones:** Lucide React

---

## 🏗️ Estrutura do Projeto

A organização segue os princípios de uma **Feature-Driven Architecture** (Arquitetura Orientada a Features):

```text
├── src/
│   ├── assets/          # Recursos visuais estáticos
│   ├── components/      # Componentes compartilhados e globais (ex: Layout)
│   ├── features/        # Módulos isolados contendo lógica e UI de cada pilar
│   │   ├── academia/    # Gestão de estudos e progresso acadêmico
│   │   ├── financeiro/  # Gestão financeira, investimentos e ativos
│   │   ├── historico/   # Central de auditoria e logs de performance
│   │   ├── home/        # Dashboard consolidado e Treinador IA
│   │   └── PhysicalPanel.tsx # Gestão do pilar físico e condicionamento
│   ├── styles/          # Folhas de estilo globais (Tailwind CSS)
│   ├── types/           # Definições estritas de interfaces TypeScript
│   ├── App.tsx          # Ponto de entrada do aplicativo e orquestrador de estado
│   ├── initialData.ts   # Dados estáticos iniciais do sistema
│   └── main.tsx         # Inicialização do React no DOM
├── index.html           # Template HTML base
├── package.json         # Gerenciamento de dependências e scripts do ecossistema
├── tsconfig.json        # Configuração estrita do compilador TypeScript
└── vite.config.ts       # Configurações do Vite
```

---

## 🚀 Como Executar o Projeto Localmente

Siga as instruções abaixo para configurar e executar a aplicação em seu ambiente de desenvolvimento:

### 1. Pré-requisitos

Certifique-se de ter instalado em sua máquina:
- **Node.js** (versão 18 ou superior recomendada)
- **npm** (gerenciador de pacotes padrão do Node)

### 2. Instalação de Dependências

No diretório raiz do projeto, execute o comando a seguir para instalar todas as dependências requeridas:

```bash
npm install
```

### 3. Executando o Servidor de Desenvolvimento

Inicie o servidor local do Vite executando o script de desenvolvimento:

```bash
npm run dev
```

O projeto será disponibilizado localmente. Abra [http://localhost:3000](http://localhost:3000) (ou a porta indicada no terminal) em seu navegador de preferência.

### 4. Compilação de Produção

Para gerar uma build otimizada e minificada pronta para produção:

```bash
npm run build
```

Os artefatos compilados serão gerados na pasta `/dist`.

### 5. Execução do Linter

Para validar as regras de tipagem TypeScript e integridade sintática:

```bash
npm run lint
```
