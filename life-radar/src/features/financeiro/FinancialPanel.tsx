import React, { useState } from 'react';
import { HistoryRecord } from '../../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { DollarSign, TrendingUp, Landmark, Award, Plus, Calendar, Coins, ArrowRight, ShieldCheck } from 'lucide-react';

interface FinancialPanelProps {
  history: HistoryRecord[];
  onAddRecord: (record: Omit<HistoryRecord, 'id' | 'timestamp'>) => void;
}

export const FinancialPanel: React.FC<FinancialPanelProps> = ({ history, onAddRecord }) => {
  const [showAssetForm, setShowAssetForm] = useState(false);
  const [showGoalForm, setShowGoalForm] = useState(false);

  // Asset form states
  const [assetName, setAssetName] = useState('');
  const [assetCategory, setAssetCategory] = useState<'Reserva' | 'Renda Fixa' | 'Ações' | 'FIIs' | 'Cripto'>('Reserva');
  const [assetValue, setAssetValue] = useState('');

  // Goal form states
  const [goalName, setGoalName] = useState('');
  const [goalTargetValue, setGoalTargetValue] = useState('');
  const [goalTargetDate, setGoalTargetDate] = useState('');

  // Filter asset updates & goals
  const assetLogs = history.filter(r => r.category === 'financial_asset');
  const goalLogs = history.filter(r => r.category === 'financial_goal');

  // --- COMPUTE THE LATEST VALUE OF EACH UNIQUE ASSET (O histórico é a verdade) ---
  const latestBalances: Record<string, { value: number; category: string }> = {};
  // Process oldest first so that newer logs override older ones
  [...assetLogs].reverse().forEach(log => {
    if (log.asset) {
      latestBalances[log.asset.assetName] = {
        value: log.asset.value,
        category: log.asset.category
      };
    }
  });

  const totalPatrimony = Object.values(latestBalances).reduce((acc, curr) => acc + curr.value, 0);

  // Group by category for Pie Chart
  const categoryTotals: Record<string, number> = {
    'Reserva': 0,
    'Renda Fixa': 0,
    'Ações': 0,
    'FIIs': 0,
    'Cripto': 0
  };

  Object.values(latestBalances).forEach(item => {
    if (categoryTotals[item.category] !== undefined) {
      categoryTotals[item.category] += item.value;
    }
  });

  const pieColors: Record<string, string> = {
    'Reserva': '#10b981',    // Emerald-500
    'Renda Fixa': '#059669',  // Emerald-600
    'Ações': '#34d399',       // Emerald-400
    'FIIs': '#047857',        // Emerald-700
    'Cripto': '#6ee7b7'       // Emerald-300
  };

  const pieData = Object.entries(categoryTotals)
    .map(([name, value]) => ({
      name,
      value,
      color: pieColors[name] || '#10b981'
    }))
    .filter(d => d.value > 0);

  // --- GET ACTIVE GOALS (Unique by name, taking latest goal specs) ---
  const activeGoals: Record<string, { targetValue: number; targetDate: string }> = {};
  [...goalLogs].reverse().forEach(log => {
    if (log.goal) {
      activeGoals[log.goal.goalName] = {
        targetValue: log.goal.targetValue,
        targetDate: log.goal.targetDate
      };
    }
  });

  const handleAssetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assetName || !assetValue) return;

    onAddRecord({
      category: 'financial_asset',
      description: `Atualização de Saldo: ${assetName}`,
      asset: {
        assetName,
        category: assetCategory,
        value: parseFloat(assetValue)
      }
    });

    setAssetName('');
    setAssetValue('');
    setShowAssetForm(false);
  };

  const handleGoalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalName || !goalTargetValue || !goalTargetDate) return;

    onAddRecord({
      category: 'financial_goal',
      description: `Nova Meta Criada: ${goalName}`,
      goal: {
        goalName,
        targetValue: parseFloat(goalTargetValue),
        targetDate: goalTargetDate
      }
    });

    setGoalName('');
    setGoalTargetValue('');
    setGoalTargetDate('');
    setShowGoalForm(false);
  };

  return (
    <div className="space-y-6 animate-fade-in" id="financial-panel">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-emerald-900 dark:text-emerald-400">Consolidação Patrimonial & Metas</h2>
          <p className="text-xs text-slate-500 mt-1">Gestão de ativos baseada no histórico de aportes e fábrica automatizada de objetivos financeiros</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowAssetForm(true)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
            id="btn-new-asset"
          >
            <Plus className="w-3.5 h-3.5" strokeWidth={2} />
            Atualizar Ativo
          </button>
          <button
            onClick={() => setShowGoalForm(true)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-emerald-600 dark:border-emerald-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold shadow-sm transition-all cursor-pointer"
            id="btn-new-goal"
          >
            <Award className="w-3.5 h-3.5" strokeWidth={1.5} />
            Nova Meta
          </button>
        </div>
      </div>

      {/* --- FINANCIAL BENTO GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4" id="financial-metrics">
        {/* Total Wealth card */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
            <DollarSign className="w-6 h-6" strokeWidth={1.5} />
          </div>
          <div>
            <span className="block text-xs text-slate-500">Patrimônio Consolidado</span>
            <span className="text-2xl font-extrabold font-sans">
              R$ {totalPatrimony.toLocaleString('pt-BR')}
            </span>
            <span className="block text-[10px] text-slate-400 mt-0.5">
              Reflete a soma dos últimos saldos cronológicos
            </span>
          </div>
        </div>

        {/* Emergência card */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="w-6 h-6" strokeWidth={1.5} />
          </div>
          <div>
            <span className="block text-xs text-slate-500">Reserva de Emergência</span>
            <span className="text-2xl font-extrabold font-sans text-emerald-600 dark:text-emerald-400">
              R$ {(categoryTotals['Reserva'] || 0).toLocaleString('pt-BR')}
            </span>
            <span className="block text-[10px] text-slate-400 mt-0.5">
              {categoryTotals['Reserva'] >= 20000 ? '✅ Meta de R$ 20k Concluída' : '⚠️ Construindo meta de R$ 20.000'}
            </span>
          </div>
        </div>

        {/* Investimentos card */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
            <Coins className="w-6 h-6" strokeWidth={1.5} />
          </div>
          <div>
            <span className="block text-xs text-slate-500">Total Investido (Sem Reserva)</span>
            <span className="text-2xl font-extrabold font-sans">
              R$ {(totalPatrimony - categoryTotals['Reserva']).toLocaleString('pt-BR')}
            </span>
            <span className="block text-[10px] text-slate-400 mt-0.5">
              Renda Fixa, Ações, FIIs e Bitcoin
            </span>
          </div>
        </div>
      </div>

      {/* --- ALLOCATION PIE CHART AND ASSETS LIST --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" id="financial-breakdown">
        {/* Assets detailed List */}
        <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl p-5">
          <h3 className="font-semibold text-sm mb-4">Saldos Atuais por Ativo</h3>
          <div className="divide-y divide-slate-100 dark:divide-slate-800 space-y-1">
            {Object.entries(latestBalances).map(([name, asset]) => (
              <div key={name} className="py-2.5 flex justify-between items-center text-xs">
                <div>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 block">{name}</span>
                  <span className="text-[10px] text-slate-400 font-mono uppercase bg-slate-50 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                    {asset.category}
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                    R$ {asset.value.toLocaleString('pt-BR')}
                  </span>
                  <span className="block text-[9px] text-slate-400">
                    {totalPatrimony > 0 ? `${((asset.value / totalPatrimony) * 100).toFixed(1)}% do total` : '0%'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recharts Pie Chart */}
        <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl p-5 flex flex-col justify-between">
          <h3 className="font-semibold text-sm mb-3">Distribuição de Alocação de Ativos</h3>
          {pieData.length > 0 ? (
            <div className="flex flex-col sm:flex-row items-center justify-around gap-6 py-4">
              <div className="w-44 h-44 flex-shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={75}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(val: number) => `R$ ${val.toLocaleString('pt-BR')}`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2 text-xs">
                {pieData.map((d, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }}></span>
                    <span className="text-slate-700 dark:text-slate-300 font-medium">{d.name}</span>
                    <span className="text-slate-400 font-mono">({Math.round((d.value / totalPatrimony) * 100)}%)</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-slate-400 text-sm text-center py-10">Cadastre um ativo para ver o gráfico de alocação.</p>
          )}
        </div>
      </div>

      {/* --- FÁBRICA DE METAS (Goals Progress) --- */}
      <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl p-5">
        <h3 className="font-semibold text-sm mb-4">Fábrica de Metas Ativas</h3>
        
        <div className="space-y-6">
          {Object.entries(activeGoals).map(([name, goal]) => {
            // Check if goal is about 'Reserva' specifically, or total patrimony
            const isEmergencyGoal = name.toLowerCase().includes('reserva');
            const currentValue = isEmergencyGoal ? (categoryTotals['Reserva'] || 0) : totalPatrimony;
            const progressPct = Math.min(100, Math.round((currentValue / goal.targetValue) * 100));

            return (
              <div key={name} className="space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div>
                    <span className="font-semibold text-xs text-slate-800 dark:text-slate-100 block">{name}</span>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> Prazo Final: {new Date(goal.targetDate).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  <div className="text-left sm:text-right">
                    <span className="font-mono text-xs text-slate-700 dark:text-slate-300 font-bold block">
                      R$ {currentValue.toLocaleString('pt-BR')} / R$ {goal.targetValue.toLocaleString('pt-BR')}
                    </span>
                    <span className="text-[10px] text-emerald-600 font-semibold uppercase font-mono bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded-full">
                      {progressPct}% Concluído
                    </span>
                  </div>
                </div>

                <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner flex">
                  <div 
                    className="h-full bg-emerald-600 rounded-full transition-all duration-700"
                    style={{ width: `${progressPct}%` }}
                  ></div>
                </div>
              </div>
            );
          })}

          {Object.keys(activeGoals).length === 0 && (
            <p className="text-slate-400 text-xs text-center py-4">Nenhuma meta configurada ainda. Clique em 'Nova Meta' para começar!</p>
          )}
        </div>
      </div>

      {/* --- FORM DIALOG: ADD NEW ASSET --- */}
      {showAssetForm && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 dark:bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full shadow-xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100">Atualizar Saldo de Ativo</h3>
              <button
                onClick={() => setShowAssetForm(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs font-mono border border-slate-200 dark:border-slate-800 px-2 py-1 rounded cursor-pointer"
              >
                Fechar
              </button>
            </div>

            <form onSubmit={handleAssetSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Nome do Ativo *</label>
                <input
                  type="text" required
                  value={assetName} onChange={e => setAssetName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm focus:outline-none focus:border-emerald-500"
                  placeholder="Ex: Tesouro Selic, FII HGLG11, Bitcoin..."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Categoria *</label>
                  <select
                    value={assetCategory} onChange={e => setAssetCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Reserva">Reserva de Emergência</option>
                    <option value="Renda Fixa">Renda Fixa (Títulos)</option>
                    <option value="Ações">Ações (Bolsa)</option>
                    <option value="FIIs">Fundos Imobiliários</option>
                    <option value="Cripto">Criptoativos</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Valor Atual (R$) *</label>
                  <input
                    type="number" required min="0" step="0.01"
                    value={assetValue} onChange={e => setAssetValue(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm focus:outline-none focus:border-emerald-500"
                    placeholder="Ex: 14200"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition-all cursor-pointer shadow-md shadow-emerald-600/10"
              >
                Atualizar Saldo no Histórico
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- FORM DIALOG: ADD NEW GOAL --- */}
      {showGoalForm && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 dark:bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full shadow-xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100">Criar Nova Meta de Acumulação</h3>
              <button
                onClick={() => setShowGoalForm(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs font-mono border border-slate-200 dark:border-slate-800 px-2 py-1 rounded cursor-pointer"
              >
                Fechar
              </button>
            </div>

            <form onSubmit={handleGoalSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Título/Descrição da Meta *</label>
                <input
                  type="text" required
                  value={goalName} onChange={e => setGoalName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm focus:outline-none focus:border-emerald-500"
                  placeholder="Ex: Patrimônio Total de R$ 100k"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Valor Alvo (R$) *</label>
                  <input
                    type="number" required min="1" step="100"
                    value={goalTargetValue} onChange={e => setGoalTargetValue(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm focus:outline-none focus:border-emerald-500"
                    placeholder="Ex: 100000"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Prazo Final *</label>
                  <input
                    type="date" required
                    value={goalTargetDate} onChange={e => setGoalTargetDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition-all cursor-pointer shadow-md shadow-emerald-600/10"
              >
                Salvar Meta no Histórico
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
