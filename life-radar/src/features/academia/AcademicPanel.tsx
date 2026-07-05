import React, { useState, useEffect } from 'react';
import { HistoryRecord } from '../../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { GraduationCap, BookOpen, CheckSquare, Plus, Clock, Target, Calendar } from 'lucide-react';

interface AcademicPanelProps {
  history: HistoryRecord[];
  onAddRecord: (record: Omit<HistoryRecord, 'id' | 'timestamp'>) => void;
}

export const AcademicPanel: React.FC<AcademicPanelProps> = ({ history, onAddRecord }) => {
  const [showLogForm, setShowLogForm] = useState(false);
  const [activeTab, setActiveTab] = useState<'psico' | 'direito'>('psico');

  // New Study Log form state
  const [area, setArea] = useState<'Psicologia' | 'Direito'>('Psicologia');
  const [topic, setTopic] = useState('');
  const [durationMinutes, setDurationMinutes] = useState('');
  const [questionsSolved, setQuestionsSolved] = useState('');
  const [questionsCorrect, setQuestionsCorrect] = useState('');
  const [questionsWrong, setQuestionsWrong] = useState('');

  // Default syllabus / study cycle checklists (persisted in local state)
  const [syllabus, setSyllabus] = useState({
    psico: [
      { id: 'p-1', topic: 'Diagnóstico e Psicopatologia', completed: true },
      { id: 'p-2', topic: 'Avaliação Psicológica e Ética Profissional', completed: true },
      { id: 'p-3', topic: 'Teorias da Atribuição Humana e TCC', completed: true },
      { id: 'p-4', topic: 'Psicologia Escolar e do Desenvolvimento', completed: false },
      { id: 'p-5', topic: 'Teorias da Personalidade (Freud, Jung, Rogers)', completed: false },
      { id: 'p-6', topic: 'Psicologia Social e Dinâmicas de Grupo', completed: false },
    ],
    direito: [
      { id: 'd-1', topic: 'Direito Constitucional: Direitos e Garantias Fundamentais', completed: true },
      { id: 'd-2', topic: 'Direito Penal: Teoria do Crime e Ilicitude', completed: true },
      { id: 'd-3', topic: 'Código de Processo Civil: Teoria Geral dos Recursos', completed: true },
      { id: 'd-4', topic: 'Direito Administrativo: Atos Administrativos e Licitações', completed: false },
      { id: 'd-5', topic: 'Direito Civil: Teoria do Negócio Jurídico', completed: false },
      { id: 'd-6', topic: 'Direito Tributário: Competência Tributária', completed: false },
    ]
  });

  const toggleTopic = (category: 'psico' | 'direito', id: string) => {
    setSyllabus(prev => ({
      ...prev,
      [category]: prev[category].map(item => 
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    }));
  };

  const handleAddSyllabusTopic = (category: 'psico' | 'direito', title: string) => {
    if (!title) return;
    const newId = `${category === 'psico' ? 'p' : 'd'}-${Date.now()}`;
    setSyllabus(prev => ({
      ...prev,
      [category]: [...prev[category], { id: newId, topic: title, completed: false }]
    }));
  };

  // Filter histories for academic sessions
  const academicLogs = history.filter(r => r.category === 'academic');

  // Compute stats dynamically (Historical events ledger is the source of truth)
  const psicoLogs = academicLogs.filter(l => l.study?.area === 'Psicologia');
  const direitoLogs = academicLogs.filter(l => l.study?.area === 'Direito');

  const psicoMinutes = psicoLogs.reduce((acc, curr) => acc + (curr.study?.durationMinutes || 0), 0);
  const direitoMinutes = direitoLogs.reduce((acc, curr) => acc + (curr.study?.durationMinutes || 0), 0);

  const totalQuestionsSolved = academicLogs.reduce((acc, curr) => acc + (curr.study?.questionsSolved || 0), 0);
  const totalQuestionsCorrect = academicLogs.reduce((acc, curr) => acc + (curr.study?.questionsCorrect || 0), 0);
  const totalQuestionsWrong = academicLogs.reduce((acc, curr) => acc + (curr.study?.questionsWrong || 0), 0);

  // Recharts Study Time Pie Chart
  const pieData = [
    { name: 'Psicologia (Concurso)', value: psicoMinutes, color: '#6366f1' }, // Indigo-500
    { name: 'Direito (Vestibular)', value: direitoMinutes, color: '#10b981' }  // Emerald-500
  ].filter(d => d.value > 0);

  // Recharts Question Performance (correct vs wrong) per session
  const barData = [...academicLogs].reverse().map(log => ({
    date: new Date(log.timestamp).toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' }),
    correct: log.study?.questionsCorrect || 0,
    wrong: log.study?.questionsWrong || 0,
    area: log.study?.area || '',
    topic: log.study?.topic || ''
  }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic || !durationMinutes || !questionsSolved || !questionsCorrect) return;
    
    onAddRecord({
      category: 'academic',
      description: `Sessão de Estudos: ${topic}`,
      study: {
        area,
        topic,
        durationMinutes: parseInt(durationMinutes),
        questionsSolved: parseInt(questionsSolved),
        questionsCorrect: parseInt(questionsCorrect),
        questionsWrong: questionsWrong ? parseInt(questionsWrong) : (parseInt(questionsSolved) - parseInt(questionsCorrect)),
      }
    });

    // Reset fields
    setTopic('');
    setDurationMinutes('');
    setQuestionsSolved('');
    setQuestionsCorrect('');
    setQuestionsWrong('');
    setShowLogForm(false);
  };

  // Add custom new topic state
  const [newTopicInput, setNewTopicInput] = useState('');

  return (
    <div className="space-y-6 animate-fade-in" id="academic-panel">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-indigo-900 dark:text-indigo-400">Plano de Estudos Inteligente</h2>
          <p className="text-xs text-slate-500 mt-1">Sessões integradas com monitoramento de ciclos, progresso de matérias e exatidão de questões</p>
        </div>
        <button
          onClick={() => setShowLogForm(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-all cursor-pointer self-start md:self-auto"
          id="btn-new-study-log"
        >
          <Plus className="w-3.5 h-3.5" strokeWidth={2} />
          Registrar Sessão de Estudo
        </button>
      </div>

      {/* --- QUICK STATS GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4" id="academic-quick-stats">
        {/* Total Time card */}
        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
            <Clock className="w-5 h-5" strokeWidth={1.5} />
          </div>
          <div>
            <span className="block text-xs text-slate-500">Carga Horária Acumulada</span>
            <span className="text-lg font-bold font-sans">
              {Math.round((psicoMinutes + direitoMinutes) / 60)}h {(psicoMinutes + direitoMinutes) % 60}m
            </span>
            <span className="block text-[10px] text-slate-400 mt-0.5">
              Psicologia: {Math.round(psicoMinutes/60)}h | Direito: {Math.round(direitoMinutes/60)}h
            </span>
          </div>
        </div>

        {/* Accuracy card */}
        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
            <Target className="w-5 h-5" strokeWidth={1.5} />
          </div>
          <div>
            <span className="block text-xs text-slate-500">Aproveitamento Geral</span>
            <span className="text-lg font-bold font-sans text-indigo-600 dark:text-indigo-400">
              {totalQuestionsSolved > 0 ? Math.round((totalQuestionsCorrect / totalQuestionsSolved) * 100) : 0}%
            </span>
            <span className="block text-[10px] text-slate-400 mt-0.5">
              {totalQuestionsCorrect} corretas de {totalQuestionsSolved} resolvidas
            </span>
          </div>
        </div>

        {/* Topics Finished card */}
        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
            <CheckSquare className="w-5 h-5" strokeWidth={1.5} />
          </div>
          <div>
            <span className="block text-xs text-slate-500">Tópicos do Edital Concluídos</span>
            <span className="text-lg font-bold font-sans">
              {syllabus.psico.filter(x => x.completed).length + syllabus.direito.filter(x => x.completed).length} / {syllabus.psico.length + syllabus.direito.length}
            </span>
            <span className="block text-[10px] text-slate-400 mt-0.5">
              Psicologia: {syllabus.psico.filter(x => x.completed).length}/{syllabus.psico.length} | Direito: {syllabus.direito.filter(x => x.completed).length}/{syllabus.direito.length}
            </span>
          </div>
        </div>
      </div>

      {/* --- CHARTS AND SYLLABUS SPLIT --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="academic-charts-grid">
        {/* SYLLABUS CHECKLIST (Interactive) */}
        <div className="lg:col-span-1 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl p-5 flex flex-col h-full">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
            <h3 className="font-semibold text-sm">Controle de Conteúdo</h3>
            <div className="flex gap-1">
              <button
                onClick={() => setActiveTab('psico')}
                className={`px-2 py-1 rounded text-[10px] font-mono uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === 'psico' ? 'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 font-bold' : 'text-slate-400'
                }`}
              >
                Psico
              </button>
              <button
                onClick={() => setActiveTab('direito')}
                className={`px-2 py-1 rounded text-[10px] font-mono uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === 'direito' ? 'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 font-bold' : 'text-slate-400'
                }`}
              >
                Direito
              </button>
            </div>
          </div>

          <div className="space-y-2 flex-grow overflow-y-auto max-h-72 pr-1">
            {syllabus[activeTab].map(item => (
              <div
                key={item.id}
                onClick={() => toggleTopic(activeTab, item.id)}
                className={`p-2.5 rounded-lg border transition-all cursor-pointer flex items-start gap-2.5 select-none ${
                  item.completed
                    ? 'bg-emerald-50/40 dark:bg-emerald-950/10 border-emerald-100 dark:border-emerald-900/30'
                    : 'bg-slate-50 dark:bg-slate-800/40 border-slate-150 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-900'
                }`}
              >
                <div className={`mt-0.5 rounded p-0.5 flex-shrink-0 transition-all ${
                  item.completed ? 'bg-emerald-500 text-white' : 'border border-slate-300 dark:border-slate-700 text-transparent'
                }`}>
                  <CheckSquare className="w-3 h-3" strokeWidth={2.5} />
                </div>
                <span className={`text-xs leading-tight transition-all ${
                  item.completed ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-700 dark:text-slate-300'
                }`}>
                  {item.topic}
                </span>
              </div>
            ))}
          </div>

          {/* Quick inline Topic Adder */}
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex gap-2">
            <input
              type="text"
              placeholder="Adicionar outro tópico..."
              value={newTopicInput}
              onChange={e => setNewTopicInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  handleAddSyllabusTopic(activeTab, newTopicInput);
                  setNewTopicInput('');
                }
              }}
              className="flex-grow px-2 py-1 border border-slate-200 dark:border-slate-700 rounded-md text-xs bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100"
            />
            <button
              onClick={() => {
                handleAddSyllabusTopic(activeTab, newTopicInput);
                setNewTopicInput('');
              }}
              className="px-2 py-1 rounded bg-indigo-600 text-white text-xs font-semibold cursor-pointer"
            >
              Add
            </button>
          </div>
        </div>

        {/* ACCURACY COMPARATIVE BAR CHART */}
        <div className="lg:col-span-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl p-5 flex flex-col">
          <h3 className="font-semibold text-sm mb-4 text-slate-800 dark:text-slate-200">Desempenho em Questões (Acertos x Erros por Sessão)</h3>
          <div className="h-64 flex-grow">
            {barData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-800" />
                  <XAxis dataKey="date" tickLine={false} tick={{ fontSize: 10 }} />
                  <YAxis tickLine={false} tick={{ fontSize: 10 }} />
                  <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '8px' }} />
                  <Legend wrapperStyle={{ fontSize: 10 }} />
                  <Bar dataKey="correct" name="Questões Corretas" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="wrong" name="Questões Incorretas" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 text-sm">
                Registre uma sessão de estudo para visualizar o desempenho.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* --- CYCLE TIME DISTRIBUTION (PIE CHART) AND STUDY TIMELINE --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="academic-distribution">
        {/* Pie Chart Card */}
        <div className="p-5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl flex flex-col justify-between">
          <h3 className="font-semibold text-sm mb-3">Distribuição do Tempo de Estudo</h3>
          {pieData.length > 0 ? (
            <div className="flex flex-col md:flex-row items-center gap-6 py-4">
              <div className="w-40 h-40 flex-shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={70}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2 text-xs">
                {pieData.map((d, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }}></span>
                    <span className="text-slate-700 dark:text-slate-300 font-medium">{d.name}</span>
                    <span className="text-slate-400 font-mono">({Math.round(d.value / 60)}h)</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-slate-400 text-sm text-center py-10">Registre o tempo de estudo para visualizar o ciclo.</p>
          )}
        </div>

        {/* Study Timeline list */}
        <div className="p-5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl flex flex-col">
          <h3 className="font-semibold text-sm mb-4">Aulas & Revisões Recentes</h3>
          <div className="divide-y divide-slate-100 dark:divide-slate-800 flex-grow overflow-y-auto max-h-[17rem] pr-1">
            {academicLogs.map(log => (
              <div key={log.id} className="py-3 flex justify-between items-start text-xs">
                <div className="space-y-0.5">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{log.study?.topic}</span>
                  <div className="flex items-center gap-2 text-slate-400 text-[10px]">
                    <span className="font-medium text-indigo-600 dark:text-indigo-400">{log.study?.area}</span>
                    <span>•</span>
                    <span>{log.study?.durationMinutes} min de foco</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-slate-500 font-medium block">
                    {new Date(log.timestamp).toLocaleDateString('pt-BR')}
                  </span>
                  <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 dark:bg-emerald-950/20 px-1.5 py-0.5 rounded-full">
                    {log.study ? `${Math.round((log.study.questionsCorrect/log.study.questionsSolved)*100)}% acertos` : '0%'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- NEW STUDY LOG MODAL --- */}
      {showLogForm && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 dark:bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100">Registrar Sessão de Estudos</h3>
              <button
                onClick={() => setShowLogForm(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs font-mono border border-slate-200 dark:border-slate-800 px-2 py-1 rounded cursor-pointer"
              >
                Fechar
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Área de Estudo *</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setArea('Psicologia')}
                    className={`py-2 text-xs font-semibold rounded-lg border transition-all ${
                      area === 'Psicologia' ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 border-indigo-500 shadow-xs' : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    Concurso Psicologia
                  </button>
                  <button
                    type="button"
                    onClick={() => setArea('Direito')}
                    className={`py-2 text-xs font-semibold rounded-lg border transition-all ${
                      area === 'Direito' ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 border-emerald-500 shadow-xs' : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    Vestibular Direito
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Tópico Estudado *</label>
                <input
                  type="text" required
                  value={topic} onChange={e => setTopic(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm focus:outline-none focus:border-indigo-500"
                  placeholder="Ex: Recursos no CPC ou Avaliação Psicológica..."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Tempo Focado (minutos) *</label>
                  <input
                    type="number" required min="1"
                    value={durationMinutes} onChange={e => setDurationMinutes(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm focus:outline-none focus:border-indigo-500"
                    placeholder="Ex: 90"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Questões Resolvidas *</label>
                  <input
                    type="number" required min="0"
                    value={questionsSolved} onChange={e => setQuestionsSolved(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm focus:outline-none focus:border-indigo-500"
                    placeholder="Ex: 15"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Acertos *</label>
                  <input
                    type="number" required min="0"
                    value={questionsCorrect} onChange={e => setQuestionsCorrect(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm focus:outline-none focus:border-indigo-500"
                    placeholder="Ex: 12"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Erros (Calculado automático)</label>
                  <input
                    type="number" min="0" disabled
                    value={questionsSolved && questionsCorrect ? (parseInt(questionsSolved) - parseInt(questionsCorrect)) : ''}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 text-sm focus:outline-none text-slate-400"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition-all cursor-pointer shadow-md shadow-indigo-600/10"
              >
                Salvar Sessão no Histórico
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
