import React, { useState } from 'react';
import { HistoryRecord } from '../../types';
import { Search, Trash2, Calendar, Filter, Activity, BookOpen, DollarSign, Dumbbell, Award, Ruler, RefreshCw } from 'lucide-react';

interface HistoryPanelProps {
  history: HistoryRecord[];
  onDeleteRecord: (id: string) => void;
  globalSearchQuery: string;
  onGlobalSearchChange: (query: string) => void;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({
  history,
  onDeleteRecord,
  globalSearchQuery,
  onGlobalSearchChange
}) => {
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Unified helper to render category tags and styles
  const getCategoryDetails = (category: string) => {
    switch (category) {
      case 'physical_body':
        return {
          label: 'Físico: Medidas',
          badgeClass: 'bg-orange-50 text-orange-600 border-orange-100 dark:bg-orange-950/20 dark:text-orange-400 dark:border-orange-900/30',
          icon: <Ruler className="w-4 h-4 text-orange-600" />
        };
      case 'physical_calisthenics':
        return {
          label: 'Físico: Calistenia',
          badgeClass: 'bg-orange-50 text-orange-600 border-orange-100 dark:bg-orange-950/20 dark:text-orange-400 dark:border-orange-900/30',
          icon: <Dumbbell className="w-4 h-4 text-orange-600" />
        };
      case 'physical_run':
        return {
          label: 'Físico: Corrida',
          badgeClass: 'bg-orange-50 text-orange-600 border-orange-100 dark:bg-orange-950/20 dark:text-orange-400 dark:border-orange-900/30',
          icon: <Activity className="w-4 h-4 text-orange-600" />
        };
      case 'academic':
        return {
          label: 'Acadêmico',
          badgeClass: 'bg-indigo-50 text-indigo-600 border-indigo-100 dark:bg-indigo-950/20 dark:text-indigo-400 dark:border-indigo-900/30',
          icon: <BookOpen className="w-4 h-4 text-indigo-600" />
        };
      case 'financial_asset':
        return {
          label: 'Finanças: Ativo',
          badgeClass: 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30',
          icon: <DollarSign className="w-4 h-4 text-emerald-600" />
        };
      case 'financial_goal':
        return {
          label: 'Finanças: Meta',
          badgeClass: 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30',
          icon: <Award className="w-4 h-4 text-emerald-600" />
        };
      default:
        return {
          label: 'Outro',
          badgeClass: 'bg-slate-50 text-slate-600 border-slate-100 dark:bg-slate-900/50 dark:text-slate-400 dark:border-slate-800',
          icon: <Calendar className="w-4 h-4 text-slate-500" />
        };
    }
  };

  // Filter records by Category AND by Search Query
  const filteredRecords = history.filter(record => {
    // 1. Category Filter
    if (categoryFilter !== 'all') {
      if (categoryFilter === 'physical' && !record.category.startsWith('physical_')) return false;
      if (categoryFilter === 'academic' && record.category !== 'academic') return false;
      if (categoryFilter === 'financial' && !record.category.startsWith('financial_')) return false;
      
      // Strict direct matches
      if (categoryFilter === 'physical_body' && record.category !== 'physical_body') return false;
      if (categoryFilter === 'physical_calisthenics' && record.category !== 'physical_calisthenics') return false;
      if (categoryFilter === 'physical_run' && record.category !== 'physical_run') return false;
      if (categoryFilter === 'financial_asset' && record.category !== 'financial_asset') return false;
      if (categoryFilter === 'financial_goal' && record.category !== 'financial_goal') return false;
    }

    // 2. Search Query (transversal)
    if (globalSearchQuery.trim()) {
      const q = globalSearchQuery.toLowerCase();
      
      // Check core attributes
      if (record.description.toLowerCase().includes(q)) return true;
      if (record.category.toLowerCase().includes(q)) return true;

      // Check specific nested payload attributes
      if (record.body) {
        if (record.body.weight.toString().includes(q)) return true;
        if (record.body.bodyFat?.toString().includes(q)) return true;
      }
      if (record.calisthenics) {
        if (record.calisthenics.skill.toLowerCase().includes(q)) return true;
        if (record.calisthenics.notes?.toLowerCase().includes(q)) return true;
        if (record.calisthenics.level.toLowerCase().includes(q)) return true;
      }
      if (record.run) {
        if (record.run.distance.toString().includes(q)) return true;
        if (record.run.pace.includes(q)) return true;
      }
      if (record.study) {
        if (record.study.topic.toLowerCase().includes(q)) return true;
        if (record.study.area.toLowerCase().includes(q)) return true;
      }
      if (record.asset) {
        if (record.asset.assetName.toLowerCase().includes(q)) return true;
        if (record.asset.category.toLowerCase().includes(q)) return true;
      }
      if (record.goal) {
        if (record.goal.goalName.toLowerCase().includes(q)) return true;
        if (record.goal.targetDate.includes(q)) return true;
      }

      return false;
    }

    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in" id="history-panel">
      {/* Search Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Histórico de Performance Unificado</h2>
          <p className="text-xs text-slate-500 mt-1">A fonte única de verdade do Life Radar. Exclua registros para recalcular os dados em tempo real.</p>
        </div>
        
        {/* Global Search Bar */}
        <div className="relative max-w-sm w-full" id="global-search-container">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-4 h-4 text-slate-400" strokeWidth={1.5} />
          </span>
          <input
            type="text"
            placeholder="Busca Global (Exercício, Ativo, Matéria...)"
            value={globalSearchQuery}
            onChange={e => onGlobalSearchChange(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-250 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:border-slate-400 dark:focus:border-slate-700 shadow-xs"
            id="global-search-input"
          />
        </div>
      </div>

      {/* Categories Filter Pills */}
      <div className="flex flex-wrap items-center gap-1.5 pb-1 border-b border-slate-100 dark:border-slate-800" id="history-filter-pills">
        <button
          onClick={() => setCategoryFilter('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
            categoryFilter === 'all'
              ? 'bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900 font-semibold shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Todos os Logs ({history.length})
        </button>
        <button
          onClick={() => setCategoryFilter('physical')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
            categoryFilter === 'physical'
              ? 'bg-orange-600 text-white font-semibold shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Performance Física
        </button>
        <button
          onClick={() => setCategoryFilter('academic')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
            categoryFilter === 'academic'
              ? 'bg-indigo-600 text-white font-semibold shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Acadêmico
        </button>
        <button
          onClick={() => setCategoryFilter('financial')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
            categoryFilter === 'financial'
              ? 'bg-emerald-600 text-white font-semibold shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Financeiro
        </button>
      </div>

      {/* Timeline list */}
      <div className="border border-slate-250 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-xs">
        <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-500 font-semibold">Linha do Tempo Cronológica</span>
          <span className="text-xs text-slate-400 font-mono">Mostrando {filteredRecords.length} registros</span>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800" id="timeline-list">
          {filteredRecords.map((record) => {
            const details = getCategoryDetails(record.category);
            const dateObj = new Date(record.timestamp);
            const formattedDate = dateObj.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });
            const formattedTime = dateObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

            return (
              <div key={record.id} className="p-4 flex items-start justify-between gap-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors group">
                <div className="flex items-start gap-3.5">
                  <div className="mt-1 p-2 rounded-xl bg-slate-100 dark:bg-slate-800 flex-shrink-0">
                    {details.icon}
                  </div>
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-slate-900 dark:text-slate-100 text-sm">{record.description}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border ${details.badgeClass}`}>
                        {details.label}
                      </span>
                    </div>
                    
                    {/* Render customized specifications based on log type */}
                    <div className="text-xs text-slate-500 dark:text-slate-400 font-sans leading-relaxed">
                      {record.body && (
                        <span>
                          Peso: <strong className="text-slate-700 dark:text-slate-300 font-semibold">{record.body.weight}kg</strong> | 
                          BF: <strong className="text-slate-700 dark:text-slate-300 font-semibold">{record.body.bodyFat || 'N/A'}%</strong> | 
                          Cintura: <strong className="text-slate-700 dark:text-slate-300 font-semibold">{record.body.waist || 'N/A'}cm</strong>
                        </span>
                      )}
                      {record.calisthenics && (
                        <span>
                          Skill: <strong className="text-slate-700 dark:text-slate-300 font-semibold">{record.calisthenics.skill}</strong> | 
                          Séries: <strong className="text-slate-700 dark:text-slate-300 font-semibold">{record.calisthenics.sets}</strong> | 
                          Reps: <strong className="text-slate-700 dark:text-slate-300 font-semibold">{record.calisthenics.reps}</strong> 
                          {record.calisthenics.durationSeconds ? ` (${record.calisthenics.durationSeconds}s isometria)` : ''}
                          {record.calisthenics.notes ? <span className="block mt-1 italic text-slate-400">"{record.calisthenics.notes}"</span> : null}
                        </span>
                      )}
                      {record.run && (
                        <span>
                          Zeblaze Sync: <strong className="text-slate-700 dark:text-slate-300 font-semibold">{record.run.distance} km</strong> em <strong className="text-slate-700 dark:text-slate-300 font-semibold">{record.run.duration}m</strong> | 
                          Ritmo: <strong className="text-slate-700 dark:text-slate-300 font-semibold">{record.run.pace} /km</strong> | 
                          FC: <strong className="text-slate-700 dark:text-slate-300 font-semibold">{record.run.avgHeartRate} bpm</strong>
                        </span>
                      )}
                      {record.study && (
                        <span>
                          Ciclo: <strong className="text-slate-700 dark:text-slate-300 font-semibold">{record.study.area}</strong> - Tópico: <strong className="text-slate-700 dark:text-slate-300 font-semibold">{record.study.topic}</strong> | 
                          Duração: <strong className="text-slate-700 dark:text-slate-300 font-semibold">{record.study.durationMinutes} min</strong> | 
                          Questões: <strong className="text-slate-700 dark:text-slate-300 font-semibold">{record.study.questionsSolved}</strong> (Acertos: <strong className="text-emerald-600 font-semibold">{record.study.questionsCorrect}</strong>)
                        </span>
                      )}
                      {record.asset && (
                        <span>
                          Ativo: <strong className="text-slate-700 dark:text-slate-300 font-semibold">{record.asset.assetName}</strong> ({record.asset.category}) | 
                          Saldo: <strong className="text-slate-700 dark:text-slate-300 font-semibold">R$ {record.asset.value.toLocaleString('pt-BR')}</strong>
                        </span>
                      )}
                      {record.goal && (
                        <span>
                          Meta: <strong className="text-slate-700 dark:text-slate-300 font-semibold">{record.goal.goalName}</strong> | 
                          Alvo: <strong className="text-slate-700 dark:text-slate-300 font-semibold">R$ {record.goal.targetValue.toLocaleString('pt-BR')}</strong> | 
                          Prazo: <strong className="text-slate-700 dark:text-slate-300 font-semibold">{new Date(record.goal.targetDate).toLocaleDateString('pt-BR')}</strong>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400 pt-0.5">
                      <span>{formattedDate}</span>
                      <span>•</span>
                      <span>{formattedTime}</span>
                    </div>
                  </div>
                </div>

                {/* Delete Ledger Button */}
                <button
                  onClick={() => onDeleteRecord(record.id)}
                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors cursor-pointer opacity-0 group-hover:opacity-100 focus:opacity-100"
                  title="Excluir do Histórico"
                  id={`delete-record-btn-${record.id}`}
                >
                  <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                </button>
              </div>
            );
          })}

          {filteredRecords.length === 0 && (
            <div className="p-8 text-center text-slate-400 text-sm">
              Nenhum registro encontrado correspondendo aos filtros aplicados.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
