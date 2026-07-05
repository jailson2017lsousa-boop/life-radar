import React, { useState } from 'react';
import { HistoryRecord, CoachRecommendation } from '../../types';
import { Activity, BookOpen, DollarSign, Sparkles, TrendingUp, CheckCircle, ArrowRight, RefreshCw, Loader2, Target } from 'lucide-react';

interface HomePanelProps {
  history: HistoryRecord[];
  recommendation: CoachRecommendation;
  isRecommendationLoading: boolean;
  onRefreshRecommendation: () => void;
  onNavigateToTab: (tab: string) => void;
  theme: 'light' | 'dark';
}

export const HomePanel: React.FC<HomePanelProps> = ({
  history,
  recommendation,
  isRecommendationLoading,
  onRefreshRecommendation,
  onNavigateToTab,
  theme
}) => {
  // State for ticked daily priorities (persisted per session or computed)
  const [completedPriorities, setCompletedPriorities] = useState<Record<string, boolean>>({});

  const togglePriority = (p: string) => {
    setCompletedPriorities(prev => ({
      ...prev,
      [p]: !prev[p]
    }));
  };

  // --- COMPUTE REAL TIME METRICS FROM THE EVENT LEDGER ---
  // 1. Weight Composition
  const bodyLogs = history.filter(r => r.category === 'physical_body');
  const latestBody = bodyLogs.length > 0 ? bodyLogs[0].body : null; // Sorted newest first assumed
  
  // 2. Studies
  const studyLogs = history.filter(r => r.category === 'academic');
  const totalStudyMinutes = studyLogs.reduce((acc, curr) => acc + (curr.study?.durationMinutes || 0), 0);
  const totalCorrect = studyLogs.reduce((acc, curr) => acc + (curr.study?.questionsCorrect || 0), 0);
  const totalSolved = studyLogs.reduce((acc, curr) => acc + (curr.study?.questionsSolved || 0), 0);
  const accuracy = totalSolved > 0 ? Math.round((totalCorrect / totalSolved) * 100) : 0;

  // 3. Finance
  // Group by asset name to get latest balance of each asset
  const assetLogs = history.filter(r => r.category === 'financial_asset');
  const assetBalances: Record<string, number> = {};
  // Process asset logs in chronological order (oldest first) so that newer entries overwrite older ones
  [...assetLogs].reverse().forEach(log => {
    if (log.asset) {
      assetBalances[log.asset.assetName] = log.asset.value;
    }
  });
  const totalPatrimony = Object.values(assetBalances).reduce((acc, curr) => acc + curr, 0);

  // 4. Run (Zeblaze Smartwatch)
  const runLogs = history.filter(r => r.category === 'physical_run');
  const latestRun = runLogs.length > 0 ? runLogs[0].run : null;

  return (
    <div className="space-y-6 animate-fade-in" id="home-panel-container">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight" id="home-title">Life Radar</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1" id="home-subtitle">
            Sua central de performance pessoal e decisões orientadas a dados
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-900/50">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Sincronizado: Smartwatch Zeblaze</span>
        </div>
      </div>

      {/* --- TREINADOR IA COMPONENT (Cyan Accent) --- */}
      <div 
        className="p-6 rounded-2xl border bg-cyan-50/50 dark:bg-cyan-950/20 border-cyan-100 dark:border-cyan-900/50 shadow-sm relative overflow-hidden"
        id="treinador-ia-card"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl"></div>
        
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-100 dark:bg-cyan-950/80 text-cyan-700 dark:text-cyan-400">
              <Sparkles className="w-5 h-5" strokeWidth={1.5} />
            </div>
            <div>
              <h2 className="font-semibold text-cyan-900 dark:text-cyan-300">Treinador IA</h2>
              <p className="text-xs text-cyan-700/80 dark:text-cyan-400/80">Recomendações e Tendências</p>
            </div>
          </div>
          
          <button 
            onClick={onRefreshRecommendation}
            disabled={isRecommendationLoading}
            className="p-2 rounded-lg bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-50 transition-colors flex items-center gap-2 text-xs font-medium cursor-pointer"
            id="refresh-recommendation-btn"
          >
            {isRecommendationLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-cyan-600" strokeWidth={1.5} />
            ) : (
              <RefreshCw className="w-4 h-4 text-cyan-600" strokeWidth={1.5} />
            )}
            Análise Inteligente
          </button>
        </div>

        <div className="mt-4" id="coach-recommendation-text">
          {isRecommendationLoading ? (
            <div className="flex items-center gap-3 py-4 text-slate-500 dark:text-slate-400 text-sm">
              <Loader2 className="w-5 h-5 animate-spin text-cyan-600" strokeWidth={1.5} />
              <span>O Treinador IA está processando todo o seu histórico de performance para recalcular as recomendações...</span>
            </div>
          ) : (
            <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed font-sans">
              {recommendation.recommendation}
            </p>
          )}
        </div>

        {/* Priorities list */}
        <div className="mt-6 border-t border-cyan-100 dark:border-cyan-900/50 pt-5">
          <h3 className="text-xs font-mono uppercase tracking-wider text-cyan-800 dark:text-cyan-400 mb-3 font-semibold">
            Prioridades Recomendadas para Hoje
          </h3>
          <div className="grid md:grid-cols-3 gap-3">
            {recommendation.priorities.map((p, index) => {
              const isChecked = !!completedPriorities[p];
              return (
                <div 
                  key={index}
                  onClick={() => togglePriority(p)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 select-none ${
                    isChecked 
                      ? 'bg-emerald-50/40 dark:bg-emerald-950/10 border-emerald-100 dark:border-emerald-900/30' 
                      : 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-cyan-300 dark:hover:border-cyan-800'
                  }`}
                  id={`priority-item-${index}`}
                >
                  <div className={`mt-0.5 rounded-full p-0.5 flex-shrink-0 transition-all ${
                    isChecked 
                      ? 'bg-emerald-500 text-white' 
                      : 'border border-slate-300 dark:border-slate-700 text-transparent'
                  }`}>
                    <CheckCircle className="w-3.5 h-3.5" strokeWidth={2.5} />
                  </div>
                  <span className={`text-xs leading-tight transition-all ${
                    isChecked ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-700 dark:text-slate-300'
                  }`}>
                    {p}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* --- MAIN METRICS BENTO GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4" id="main-metrics-bento">
        {/* PHYSICAL BOX (Orange) */}
        <div 
          onClick={() => onNavigateToTab('Físico')}
          className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:shadow-md hover:border-orange-200 dark:hover:border-orange-900/40 transition-all cursor-pointer group"
          id="home-physical-bento"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400">
                <Activity className="w-5 h-5" strokeWidth={1.5} />
              </div>
              <span className="font-medium text-sm text-slate-900 dark:text-slate-200">Performance Física</span>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-orange-600 transition-colors" strokeWidth={1.5} />
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between items-baseline">
              <span className="text-2xl font-bold font-sans">
                {latestBody ? `${latestBody.weight} kg` : 'N/A'}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">Peso Corporal</span>
            </div>
            <div className="border-t border-slate-100 dark:border-slate-800 pt-2 flex justify-between items-center text-xs">
              <span className="text-slate-500 dark:text-slate-400">Gordura Corporal:</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                {latestBody?.bodyFat ? `${latestBody.bodyFat}%` : 'N/A'}
              </span>
            </div>
            {latestRun && (
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 dark:text-slate-400">Última Corrida:</span>
                <span className="font-semibold text-orange-600 dark:text-orange-400">
                  {latestRun.distance}km @ {latestRun.pace} pace
                </span>
              </div>
            )}
          </div>
        </div>

        {/* ACADEMIC BOX (Indigo) */}
        <div 
          onClick={() => onNavigateToTab('Estudos')}
          className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:shadow-md hover:border-indigo-200 dark:hover:border-indigo-900/40 transition-all cursor-pointer group"
          id="home-academic-bento"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400">
                <BookOpen className="w-5 h-5" strokeWidth={1.5} />
              </div>
              <span className="font-medium text-sm text-slate-900 dark:text-slate-200">Acadêmico</span>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" strokeWidth={1.5} />
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between items-baseline">
              <span className="text-2xl font-bold font-sans">
                {accuracy}%
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">Aproveitamento</span>
            </div>
            <div className="border-t border-slate-100 dark:border-slate-800 pt-2 flex justify-between items-center text-xs">
              <span className="text-slate-500 dark:text-slate-400">Tempo de Estudo:</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                {Math.round(totalStudyMinutes / 60)}h {totalStudyMinutes % 60}m
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500 dark:text-slate-400">Questões Resolvidas:</span>
              <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                {totalSolved} ({totalCorrect} Acertos)
              </span>
            </div>
          </div>
        </div>

        {/* FINANCIAL BOX (Emerald) */}
        <div 
          onClick={() => onNavigateToTab('Financeiro')}
          className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:shadow-md hover:border-emerald-200 dark:hover:border-emerald-900/40 transition-all cursor-pointer group"
          id="home-financial-bento"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
                <DollarSign className="w-5 h-5" strokeWidth={1.5} />
              </div>
              <span className="font-medium text-sm text-slate-900 dark:text-slate-200">Patrimônio Consolidado</span>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition-colors" strokeWidth={1.5} />
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between items-baseline">
              <span className="text-2xl font-bold font-sans">
                R$ {totalPatrimony.toLocaleString('pt-BR')}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">Saldo Atual</span>
            </div>
            <div className="border-t border-slate-100 dark:border-slate-800 pt-2 flex justify-between items-center text-xs">
              <span className="text-slate-500 dark:text-slate-400">Meta do Semestre:</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">R$ 100.000</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500 dark:text-slate-400">Progresso da Meta:</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                {Math.round((totalPatrimony / 100000) * 100)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* --- SIMPLIFIED META PROGRESS BARS --- */}
      <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <h3 className="font-semibold text-sm flex items-center gap-2 mb-4">
          <Target className="w-4 h-4 text-slate-500" strokeWidth={1.5} />
          Progresso das Metas Globais
        </h3>
        
        <div className="space-y-4">
          {/* Peso Alvo */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-600 dark:text-slate-400">Composição Corporal (Meta: Peso Saudável 75kg)</span>
              <span className="font-medium font-mono text-slate-700 dark:text-slate-300">
                {latestBody ? `${latestBody.weight}kg / 75kg` : 'N/A'}
              </span>
            </div>
            <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              {/* Target 75kg starting from e.g. 80. Progress: as weight decreases from initial 78.5 to 75, we show inverse progress */}
              <div 
                className="h-full bg-orange-600 rounded-full transition-all duration-500"
                style={{ width: latestBody ? `${Math.min(100, Math.max(10, Math.round(((78.5 - latestBody.weight) / (78.5 - 75)) * 100)))}%` : '0%' }}
              ></div>
            </div>
          </div>

          {/* Academic Total Questions (Meta: 300 questoes) */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-600 dark:text-slate-400">Densidade de Questões Resolvidas (Meta Semestral: 300 Questões)</span>
              <span className="font-medium font-mono text-slate-700 dark:text-slate-300">
                {totalSolved} / 300 questões
              </span>
            </div>
            <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.round((totalSolved / 300) * 100))}%` }}
              ></div>
            </div>
          </div>

          {/* Financial Reservoir */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-600 dark:text-slate-400">Reserva de Emergência Própria (Meta: R$ 20.000)</span>
              <span className="font-medium font-mono text-slate-700 dark:text-slate-300">
                R$ {assetBalances['Reserva de Emergência (Tesouro Selic)']?.toLocaleString('pt-BR') || '0'} / R$ 20.000
              </span>
            </div>
            <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.round(((assetBalances['Reserva de Emergência (Tesouro Selic)'] || 0) / 20000) * 100))}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
