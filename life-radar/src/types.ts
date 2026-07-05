export interface BodyCompositionLog {
  weight: number; // kg
  bodyFat?: number; // %
  chest?: number; // cm
  waist?: number; // cm
  biceps?: number; // cm
  thighs?: number; // cm
}

export interface CalisthenicsLog {
  skill: string;
  level: 'básico' | 'avançado';
  sets: number;
  reps: number;
  durationSeconds?: number; // for isometric holds like handstand/l-sit
  notes?: string;
}

export interface RunLog {
  distance: number; // km
  duration: number; // minutes
  pace: string; // e.g. "5:30"
  avgHeartRate: number; // bpm
  effortZones: {
    regenerative: number; // %
    cardio: number; // %
    limiar: number; // %
    anaerobic: number; // %
    maximum: number; // %
  };
}

export interface StudyLog {
  area: 'Psicologia' | 'Direito';
  topic: string;
  durationMinutes: number;
  questionsSolved: number;
  questionsCorrect: number;
  questionsWrong: number;
}

export interface FinancialAssetLog {
  assetName: string;
  category: 'Reserva' | 'Renda Fixa' | 'Ações' | 'FIIs' | 'Cripto';
  value: number; // current total balance
}

export interface FinancialGoalLog {
  goalName: string;
  targetValue: number;
  targetDate: string; // YYYY-MM-DD
}

export type LogCategory = 
  | 'physical_body' 
  | 'physical_calisthenics' 
  | 'physical_run' 
  | 'academic' 
  | 'financial_asset' 
  | 'financial_goal';

export interface HistoryRecord {
  id: string;
  timestamp: string; // ISO string
  category: LogCategory;
  description: string;
  body?: BodyCompositionLog;
  calisthenics?: CalisthenicsLog;
  run?: RunLog;
  study?: StudyLog;
  asset?: FinancialAssetLog;
  goal?: FinancialGoalLog;
}

export interface CoachRecommendation {
  date: string;
  recommendation: string;
  priorities: string[];
}
