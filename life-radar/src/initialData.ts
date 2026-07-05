import { HistoryRecord, CoachRecommendation } from './types';

export const initialHistory: HistoryRecord[] = [
  // --- COMPOSIÇÃO CORPORAL ---
  {
    id: 'b-1',
    timestamp: '2026-06-10T08:00:00Z',
    category: 'physical_body',
    description: 'Registro de Composição Corporal Inicial',
    body: {
      weight: 78.5,
      bodyFat: 16.5,
      chest: 102,
      waist: 86,
      biceps: 37.5,
      thighs: 58
    }
  },
  {
    id: 'b-2',
    timestamp: '2026-06-24T08:00:00Z',
    category: 'physical_body',
    description: 'Registro de Composição Corporal Mensal',
    body: {
      weight: 77.2,
      bodyFat: 15.3,
      chest: 102.5,
      waist: 84.0,
      biceps: 37.8,
      thighs: 57.5
    }
  },
  {
    id: 'b-3',
    timestamp: '2026-07-02T08:00:00Z',
    category: 'physical_body',
    description: 'Registro de Peso e Medidas (Progresso)',
    body: {
      weight: 76.4,
      bodyFat: 14.5,
      chest: 103,
      waist: 82.5,
      biceps: 38.0,
      thighs: 57.2
    }
  },

  // --- CALISTENIA ---
  {
    id: 'c-1',
    timestamp: '2026-06-12T17:30:00Z',
    category: 'physical_calisthenics',
    description: 'Treino de Skills Básicas',
    calisthenics: {
      skill: 'Barra Fixa',
      level: 'básico',
      sets: 4,
      reps: 10,
      notes: 'Foco na cadência controlada e amplitude máxima'
    }
  },
  {
    id: 'c-2',
    timestamp: '2026-06-12T18:00:00Z',
    category: 'physical_calisthenics',
    description: 'Treino de Skills Básicas',
    calisthenics: {
      skill: 'Paralelas',
      level: 'básico',
      sets: 4,
      reps: 12,
      notes: 'Executado sem dor no ombro, mantendo escápulas ativas'
    }
  },
  {
    id: 'c-3',
    timestamp: '2026-06-19T17:00:00Z',
    category: 'physical_calisthenics',
    description: 'Treino focado em Handstand',
    calisthenics: {
      skill: 'Handstand (Parada de Mão)',
      level: 'avançado',
      sets: 5,
      reps: 1,
      durationSeconds: 15,
      notes: 'Equilíbrio sólido contra a parede, tentando afastar os pés'
    }
  },
  {
    id: 'c-4',
    timestamp: '2026-06-26T17:30:00Z',
    category: 'physical_calisthenics',
    description: 'Treino Avançado de Força',
    calisthenics: {
      skill: 'Muscle-Up',
      level: 'avançado',
      sets: 3,
      reps: 3,
      notes: 'Transição rápida. Consegui completar todas as séries sem auxílio de elástico'
    }
  },
  {
    id: 'c-5',
    timestamp: '2026-07-01T18:00:00Z',
    category: 'physical_calisthenics',
    description: 'Treino de Isometria Avançada',
    calisthenics: {
      skill: 'L-Sit',
      level: 'avançado',
      sets: 4,
      reps: 1,
      durationSeconds: 20,
      notes: 'Excelente contração de abdômen e depressão escapular'
    }
  },
  {
    id: 'c-6',
    timestamp: '2026-07-03T17:30:00Z',
    category: 'physical_calisthenics',
    description: 'Treino de Skills Básicas Integradas',
    calisthenics: {
      skill: 'Flexões de Braço',
      level: 'básico',
      sets: 4,
      reps: 25,
      notes: 'Execução explosiva na subida'
    }
  },

  // --- CORRIDA (ZEBLAZE SMARTWATCH) ---
  {
    id: 'r-1',
    timestamp: '2026-06-14T07:00:00Z',
    category: 'physical_run',
    description: 'Corrida Matinal - Ritmo Regenerativo',
    run: {
      distance: 5.2,
      duration: 31,
      pace: '5:57',
      avgHeartRate: 135,
      effortZones: {
        regenerative: 60,
        cardio: 30,
        limiar: 10,
        anaerobic: 0,
        maximum: 0
      }
    }
  },
  {
    id: 'r-2',
    timestamp: '2026-06-21T07:00:00Z',
    category: 'physical_run',
    description: 'Corrida de Distância - Tempo Run',
    run: {
      distance: 8.0,
      duration: 44,
      pace: '5:30',
      avgHeartRate: 152,
      effortZones: {
        regenerative: 15,
        cardio: 50,
        limiar: 25,
        anaerobic: 10,
        maximum: 0
      }
    }
  },
  {
    id: 'r-3',
    timestamp: '2026-06-28T07:15:00Z',
    category: 'physical_run',
    description: 'Corrida de Limiar Láctico - Zeblaze Sync',
    run: {
      distance: 6.5,
      duration: 33,
      pace: '5:04',
      avgHeartRate: 164,
      effortZones: {
        regenerative: 5,
        cardio: 20,
        limiar: 55,
        anaerobic: 15,
        maximum: 5
      }
    }
  },
  {
    id: 'r-4',
    timestamp: '2026-07-03T06:30:00Z',
    category: 'physical_run',
    description: 'Superação de Recorde nos 10km - Zeblaze Sync',
    run: {
      distance: 10.0,
      duration: 51,
      pace: '5:06',
      avgHeartRate: 158,
      effortZones: {
        regenerative: 8,
        cardio: 32,
        limiar: 45,
        anaerobic: 12,
        maximum: 3
      }
    }
  },

  // --- ACADÊMICO ---
  {
    id: 'a-1',
    timestamp: '2026-06-15T14:00:00Z',
    category: 'academic',
    description: 'Estudo de Psicologia Clínica',
    study: {
      area: 'Psicologia',
      topic: 'Diagnóstico e Psicopatologia',
      durationMinutes: 120,
      questionsSolved: 20,
      questionsCorrect: 16,
      questionsWrong: 4
    }
  },
  {
    id: 'a-2',
    timestamp: '2026-06-18T19:00:00Z',
    category: 'academic',
    description: 'Estudo de Direito Constitucional',
    study: {
      area: 'Direito',
      topic: 'Direitos e Garantias Fundamentais',
      durationMinutes: 90,
      questionsSolved: 15,
      questionsCorrect: 11,
      questionsWrong: 4
    }
  },
  {
    id: 'a-3',
    timestamp: '2026-06-22T14:30:00Z',
    category: 'academic',
    description: 'Ciclo Teórico de Psicologia',
    study: {
      area: 'Psicologia',
      topic: 'Teoria da Atribuição Humana e TCC',
      durationMinutes: 150,
      questionsSolved: 25,
      questionsCorrect: 22,
      questionsWrong: 3
    }
  },
  {
    id: 'a-4',
    timestamp: '2026-06-25T20:00:00Z',
    category: 'academic',
    description: 'Estudo de Direito Penal',
    study: {
      area: 'Direito',
      topic: 'Teoria do Crime e Ilicitude',
      durationMinutes: 100,
      questionsSolved: 18,
      questionsCorrect: 14,
      questionsWrong: 4
    }
  },
  {
    id: 'a-5',
    timestamp: '2026-07-02T15:00:00Z',
    category: 'academic',
    description: 'Revisão Intensiva de Psicologia de Concurso',
    study: {
      area: 'Psicologia',
      topic: 'Avaliação Psicológica e Ética',
      durationMinutes: 180,
      questionsSolved: 40,
      questionsCorrect: 35,
      questionsWrong: 5
    }
  },
  {
    id: 'a-6',
    timestamp: '2026-07-03T19:30:00Z',
    category: 'academic',
    description: 'Estudo de Processo Civil',
    study: {
      area: 'Direito',
      topic: 'Recursos no Código de Processo Civil',
      durationMinutes: 110,
      questionsSolved: 20,
      questionsCorrect: 17,
      questionsWrong: 3
    }
  },

  // --- FINANCEIRO: ATIVOS / APORTES ---
  {
    id: 'f-1',
    timestamp: '2026-06-01T10:00:00Z',
    category: 'financial_asset',
    description: 'Aporte Mensal e Balanceamento',
    asset: {
      assetName: 'Reserva de Emergência (Tesouro Selic)',
      category: 'Reserva',
      value: 12500
    }
  },
  {
    id: 'f-2',
    timestamp: '2026-06-01T10:10:00Z',
    category: 'financial_asset',
    description: 'Investimento em Renda Fixa Inflação',
    asset: {
      assetName: 'IPCA+ 2035',
      category: 'Renda Fixa',
      value: 18400
    }
  },
  {
    id: 'f-3',
    timestamp: '2026-06-01T10:20:00Z',
    category: 'financial_asset',
    description: 'Ações de Dividendos',
    asset: {
      assetName: 'Carteira de Dividendos (BBAS3, EGIE3, TAEE11)',
      category: 'Ações',
      value: 14200
    }
  },
  {
    id: 'f-4',
    timestamp: '2026-06-01T10:30:00Z',
    category: 'financial_asset',
    description: 'Fundos Imobiliários de Tijolo',
    asset: {
      assetName: 'FIIs de Shopping e Galpões (KNRI11, HGLG11)',
      category: 'FIIs',
      value: 9800
    }
  },
  {
    id: 'f-5',
    timestamp: '2026-06-01T10:40:00Z',
    category: 'financial_asset',
    description: 'Exposição Cripto Bitcoin',
    asset: {
      assetName: 'Bitcoin (Custódia Fria)',
      category: 'Cripto',
      value: 3200
    }
  },
  // Aporte de Julho
  {
    id: 'f-6',
    timestamp: '2026-07-01T10:00:00Z',
    category: 'financial_asset',
    description: 'Atualização e Aporte Mensal Julho',
    asset: {
      assetName: 'Reserva de Emergência (Tesouro Selic)',
      category: 'Reserva',
      value: 13500 // +1000
    }
  },
  {
    id: 'f-7',
    timestamp: '2026-07-01T10:10:00Z',
    category: 'financial_asset',
    description: 'Atualização IPCA+ e Reinvestimento',
    asset: {
      assetName: 'IPCA+ 2035',
      category: 'Renda Fixa',
      value: 19500 // +1100
    }
  },
  {
    id: 'f-8',
    timestamp: '2026-07-01T10:20:00Z',
    category: 'financial_asset',
    description: 'Compra de Frações BBAS3 e Valorização',
    asset: {
      assetName: 'Carteira de Dividendos (BBAS3, EGIE3, TAEE11)',
      category: 'Ações',
      value: 15300 // +1100
    }
  },
  {
    id: 'f-9',
    timestamp: '2026-07-01T10:30:00Z',
    category: 'financial_asset',
    description: 'Aporte em HGLG11',
    asset: {
      assetName: 'Fundos Imobiliários de Tijolo (KNRI11, HGLG11)',
      category: 'FIIs',
      value: 10500 // +700
    }
  },
  {
    id: 'f-10',
    timestamp: '2026-07-01T10:40:00Z',
    category: 'financial_asset',
    description: 'Valorização de Mercado Cripto',
    asset: {
      assetName: 'Bitcoin (Custódia Fria)',
      category: 'Cripto',
      value: 3600 // +400
    }
  },

  // --- FINANCEIRO: METAS ---
  {
    id: 'fg-1',
    timestamp: '2026-06-01T09:00:00Z',
    category: 'financial_goal',
    description: 'Configuração de Meta de Reserva Total',
    goal: {
      goalName: 'Reserva de Emergência (Meta: R$ 20.000)',
      targetValue: 20000,
      targetDate: '2026-12-31'
    }
  },
  {
    id: 'fg-2',
    timestamp: '2026-06-01T09:10:00Z',
    category: 'financial_goal',
    description: 'Configuração de Meta de Investimento de Longo Prazo',
    goal: {
      goalName: 'Patrimônio Total de R$ 100k',
      targetValue: 100000,
      targetDate: '2027-06-30'
    }
  }
];

export const mockDefaultRecommendation: CoachRecommendation = {
  date: '2026-07-04',
  recommendation: 'Jailson, sua performance geral está muito sólida. Na corrida, o seu pace médio nos 10km caiu para 5:06 min/km com batimentos controlados na zona de limiar, confirmando ganho de VO2 Máximo pelo smartwatch Zeblaze. Nos estudos, a consistência em Psicologia se mantém excelente com 87.5% de aproveitamento em Diagnóstico, mas recomendamos expandir o ciclo de Processo Civil que teve menor densidade esta semana. No financeiro, o patrimônio consolidado alcançou R$ 62.400, o que representa 62.4% da sua meta principal para 2027. Continue no ritmo!',
  priorities: [
    'Corrida de regeneração leve (foco em Zona 1/2 por 30-40 min)',
    'Estudar Recursos no Processo Civil e resolver 15 questões adicionais',
    'Revisar limites de aportes mensais de investimentos pós-fechamento'
  ]
};
