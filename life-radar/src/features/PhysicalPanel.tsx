import React, { useState } from 'react';
import { HistoryRecord } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';
import { Dumbbell, Activity, Compass, Flame, Plus, Heart, Ruler, Scale } from 'lucide-react';

interface PhysicalPanelProps {
  history: HistoryRecord[];
  onAddRecord: (record: Omit<HistoryRecord, 'id' | 'timestamp'>) => void;
}

export const PhysicalPanel: React.FC<PhysicalPanelProps> = ({ history, onAddRecord }) => {
  const [activeSubTab, setActiveSubTab] = useState<'composition' | 'calisthenics' | 'run'>('composition');
  const [showLogForm, setShowLogForm] = useState(false);

  // Form states
  const [formType, setFormType] = useState<'body' | 'calisthenics' | 'run'>('body');
  
  // Body states
  const [weight, setWeight] = useState('');
  const [bodyFat, setBodyFat] = useState('');
  const [chest, setChest] = useState('');
  const [waist, setWaist] = useState('');
  const [biceps, setBiceps] = useState('');
  const [thighs, setThighs] = useState('');

  // Calisthenics states
  const [skill, setSkill] = useState('Flexões de Braço');
  const [level, setLevel] = useState<'básico' | 'avançado'>('básico');
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');
  const [durationSeconds, setDurationSeconds] = useState('');
  const [notes, setNotes] = useState('');

  // Run states
  const [distance, setDistance] = useState('');
  const [duration, setDuration] = useState('');
  const [pace, setPace] = useState('');
  const [avgHeartRate, setAvgHeartRate] = useState('');
  const [zoneRegenerative, setZoneRegenerative] = useState('30');
  const [zoneCardio, setZoneCardio] = useState('30');
  const [zoneLimiar, setZoneLimiar] = useState('20');
  const [zoneAnaerobic, setZoneAnaerobic] = useState('15');
  const [zoneMaximum, setZoneMaximum] = useState('5');

  // Filter histories
  const bodyLogs = history.filter(r => r.category === 'physical_body');
  const calisthenicsLogs = history.filter(r => r.category === 'physical_calisthenics');
  const runLogs = history.filter(r => r.category === 'physical_run');

  // Sort histories in chronological order for graphs
  const sortedBodyLogsForChart = [...bodyLogs].reverse().map(log => ({
    date: new Date(log.timestamp).toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' }),
    weight: log.body?.weight || 0,
    bodyFat: log.body?.bodyFat || 0,
  }));

  const sortedRunLogsForChart = [...runLogs].reverse().map(log => {
    // Convert pace "5:30" to a decimal number (5.5) for charting
    const [min, sec] = (log.run?.pace || '0:0').split(':').map(Number);
    const decimalPace = min + (sec || 0) / 60;
    return {
      date: new Date(log.timestamp).toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' }),
      distance: log.run?.distance || 0,
      pace: parseFloat(decimalPace.toFixed(2)),
      paceStr: log.run?.pace || '',
    };
  });

  // Calculate current computed metrics derived from history
  const latestBody = bodyLogs.length > 0 ? bodyLogs[0].body : null;
  const latestRun = runLogs.length > 0 ? runLogs[0].run : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formType === 'body') {
      if (!weight) return;
      onAddRecord({
        category: 'physical_body',
        description: 'Medição de Composição Corporal',
        body: {
          weight: parseFloat(weight),
          bodyFat: bodyFat ? parseFloat(bodyFat) : undefined,
          chest: chest ? parseFloat(chest) : undefined,
          waist: waist ? parseFloat(waist) : undefined,
          biceps: biceps ? parseFloat(biceps) : undefined,
          thighs: thighs ? parseFloat(thighs) : undefined,
        },
      });
      // reset states
      setWeight(''); setBodyFat(''); setChest(''); setWaist(''); setBiceps(''); setThighs('');
    } else if (formType === 'calisthenics') {
      if (!skill || !sets || !reps) return;
      onAddRecord({
        category: 'physical_calisthenics',
        description: `Treino de Calistenia: ${skill}`,
        calisthenics: {
          skill,
          level,
          sets: parseInt(sets),
          reps: parseInt(reps),
          durationSeconds: durationSeconds ? parseInt(durationSeconds) : undefined,
          notes: notes || undefined,
        },
      });
      setSets(''); setReps(''); setDurationSeconds(''); setNotes('');
    } else if (formType === 'run') {
      if (!distance || !duration || !pace || !avgHeartRate) return;
      onAddRecord({
        category: 'physical_run',
        description: `Corrida Zeblaze Sync: ${distance}km`,
        run: {
          distance: parseFloat(distance),
          duration: parseFloat(duration),
          pace,
          avgHeartRate: parseInt(avgHeartRate),
          effortZones: {
            regenerative: parseInt(zoneRegenerative) || 0,
            cardio: parseInt(zoneCardio) || 0,
            limiar: parseInt(zoneLimiar) || 0,
            anaerobic: parseInt(zoneAnaerobic) || 0,
            maximum: parseInt(zoneMaximum) || 0,
          },
        },
      });
      setDistance(''); setDuration(''); setPace(''); setAvgHeartRate('');
    }
    setShowLogForm(false);
  };

  return (
    <div className="space-y-6 animate-fade-in" id="physical-panel">
      {/* Sub tabs navigation */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveSubTab('composition')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
              activeSubTab === 'composition'
                ? 'bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            id="subtab-composition"
          >
            Composição Corporal
          </button>
          <button
            onClick={() => setActiveSubTab('calisthenics')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
              activeSubTab === 'calisthenics'
                ? 'bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            id="subtab-calisthenics"
          >
            Calistenia
          </button>
          <button
            onClick={() => setActiveSubTab('run')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
              activeSubTab === 'run'
                ? 'bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            id="subtab-run"
          >
            Corrida (Zeblaze)
          </button>
        </div>

        <button
          onClick={() => {
            setShowLogForm(true);
            setFormType(activeSubTab === 'composition' ? 'body' : activeSubTab === 'calisthenics' ? 'calisthenics' : 'run');
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
          id="btn-new-physical-log"
        >
          <Plus className="w-3.5 h-3.5" strokeWidth={2} />
          Registrar Treino/Medida
        </button>
      </div>

      {/* --- FORM MODAL / DRAWER --- */}
      {showLogForm && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 dark:bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100">Registrar Performance Física</h3>
              <button
                onClick={() => setShowLogForm(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs font-mono border border-slate-200 dark:border-slate-800 px-2 py-1 rounded cursor-pointer"
              >
                Fechar
              </button>
            </div>

            {/* Type Selector inside Form */}
            <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
              <button
                type="button"
                onClick={() => setFormType('body')}
                className={`py-1 text-xs font-medium rounded-md transition-all ${
                  formType === 'body' ? 'bg-white dark:bg-slate-900 text-orange-600 shadow-sm' : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Medidas
              </button>
              <button
                type="button"
                onClick={() => setFormType('calisthenics')}
                className={`py-1 text-xs font-medium rounded-md transition-all ${
                  formType === 'calisthenics' ? 'bg-white dark:bg-slate-900 text-orange-600 shadow-sm' : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Calistenia
              </button>
              <button
                type="button"
                onClick={() => setFormType('run')}
                className={`py-1 text-xs font-medium rounded-md transition-all ${
                  formType === 'run' ? 'bg-white dark:bg-slate-900 text-orange-600 shadow-sm' : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Corrida
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {formType === 'body' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Peso Corporal (kg) *</label>
                      <input
                        type="number" step="0.1" required
                        value={weight} onChange={e => setWeight(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm focus:outline-none focus:border-orange-500"
                        placeholder="Ex: 76.5"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Gordura Corporal (%)</label>
                      <input
                        type="number" step="0.1"
                        value={bodyFat} onChange={e => setBodyFat(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm focus:outline-none focus:border-orange-500"
                        placeholder="Ex: 14.5"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Circunferência Peito (cm)</label>
                      <input
                        type="number" step="0.5"
                        value={chest} onChange={e => setChest(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm focus:outline-none focus:border-orange-500"
                        placeholder="Ex: 103"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Circunferência Cintura (cm)</label>
                      <input
                        type="number" step="0.5"
                        value={waist} onChange={e => setWaist(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm focus:outline-none focus:border-orange-500"
                        placeholder="Ex: 82.5"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Bíceps (cm)</label>
                      <input
                        type="number" step="0.1"
                        value={biceps} onChange={e => setBiceps(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm focus:outline-none focus:border-orange-500"
                        placeholder="Ex: 38"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Coxa (cm)</label>
                      <input
                        type="number" step="0.1"
                        value={thighs} onChange={e => setThighs(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm focus:outline-none focus:border-orange-500"
                        placeholder="Ex: 57"
                      />
                    </div>
                  </div>
                </div>
              )}

              {formType === 'calisthenics' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Habilidade / Exercício *</label>
                    <select
                      value={skill} onChange={e => setSkill(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm focus:outline-none focus:border-orange-500"
                    >
                      <optgroup label="Básicos">
                        <option value="Flexões de Braço">Flexões de Braço</option>
                        <option value="Barra Fixa">Barra Fixa</option>
                        <option value="Paralelas">Paralelas</option>
                        <option value="Agachamento Corporal">Agachamento Corporal</option>
                      </optgroup>
                      <optgroup label="Avançados / Isometrias">
                        <option value="Handstand (Parada de Mão)">Handstand (Parada de Mão)</option>
                        <option value="Muscle-Up">Muscle-Up</option>
                        <option value="L-Sit">L-Sit</option>
                        <option value="Front Lever Progression">Front Lever Progression</option>
                        <option value="Planche Progression">Planche Progression</option>
                      </optgroup>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Nível de Skill</label>
                      <select
                        value={level} onChange={e => setLevel(e.target.value as any)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm focus:outline-none focus:border-orange-500"
                      >
                        <option value="básico">Básico</option>
                        <option value="avançado">Avançado</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Séries (Sets) *</label>
                      <input
                        type="number" required min="1"
                        value={sets} onChange={e => setSets(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm focus:outline-none focus:border-orange-500"
                        placeholder="Ex: 4"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Repetições (Reps) *</label>
                      <input
                        type="number" required min="1"
                        value={reps} onChange={e => setReps(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm focus:outline-none focus:border-orange-500"
                        placeholder="Ex: 10 (ou 1 se isométrico)"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Segundos Isometria (Opcional)</label>
                      <input
                        type="number" min="0"
                        value={durationSeconds} onChange={e => setDurationSeconds(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm focus:outline-none focus:border-orange-500"
                        placeholder="Ex: 15"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Anotações do Treino</label>
                    <textarea
                      value={notes} onChange={e => setNotes(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm focus:outline-none focus:border-orange-500 h-16 resize-none"
                      placeholder="Ex: Pegada bem fechada, focado na transição explosiva..."
                    />
                  </div>
                </div>
              )}

              {formType === 'run' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Distância (km) *</label>
                      <input
                        type="number" step="0.01" required
                        value={distance} onChange={e => setDistance(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm focus:outline-none focus:border-orange-500"
                        placeholder="Ex: 6.50"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Duração (minutos) *</label>
                      <input
                        type="number" step="0.1" required
                        value={duration} onChange={e => setDuration(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm focus:outline-none focus:border-orange-500"
                        placeholder="Ex: 33"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Ritmo (Pace médio) *</label>
                      <input
                        type="text" required
                        value={pace} onChange={e => setPace(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm focus:outline-none focus:border-orange-500"
                        placeholder="Ex: 5:06"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Frequência Cardíaca Média (bpm) *</label>
                      <input
                        type="number" required
                        value={avgHeartRate} onChange={e => setAvgHeartRate(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm focus:outline-none focus:border-orange-500"
                        placeholder="Ex: 158"
                      />
                    </div>
                  </div>
                  
                  <div className="border-t border-slate-100 dark:border-slate-800 pt-2">
                    <span className="block text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Zonas de Frequência Cardíaca (%) - Zeblaze Sync</span>
                    <div className="grid grid-cols-5 gap-2">
                      <div>
                        <label className="block text-[10px] text-slate-500 text-center">Regen.</label>
                        <input
                          type="number" max="100" value={zoneRegenerative} onChange={e => setZoneRegenerative(e.target.value)}
                          className="w-full text-center py-1 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-500 text-center">Cardio</label>
                        <input
                          type="number" max="100" value={zoneCardio} onChange={e => setZoneCardio(e.target.value)}
                          className="w-full text-center py-1 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-500 text-center">Limiar</label>
                        <input
                          type="number" max="100" value={zoneLimiar} onChange={e => setZoneLimiar(e.target.value)}
                          className="w-full text-center py-1 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-500 text-center">Anaer.</label>
                        <input
                          type="number" max="100" value={zoneAnaerobic} onChange={e => setZoneAnaerobic(e.target.value)}
                          className="w-full text-center py-1 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-500 text-center">Máx.</label>
                        <input
                          type="number" max="100" value={zoneMaximum} onChange={e => setZoneMaximum(e.target.value)}
                          className="w-full text-center py-1 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-semibold text-sm transition-all cursor-pointer shadow-md shadow-orange-600/10"
              >
                Salvar Registro no Histórico
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- SUB TAB PANELS --- */}
      {activeSubTab === 'composition' && (
        <div className="space-y-6" id="composition-panel">
          {/* Top Quick Indicators */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400">
                <Scale className="w-5 h-5" strokeWidth={1.5} />
              </div>
              <div>
                <span className="block text-xs text-slate-500">Peso Atual</span>
                <span className="text-lg font-bold">{latestBody?.weight ? `${latestBody.weight} kg` : 'N/A'}</span>
              </div>
            </div>
            
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400">
                <Flame className="w-5 h-5" strokeWidth={1.5} />
              </div>
              <div>
                <span className="block text-xs text-slate-500">Gordura Corporal</span>
                <span className="text-lg font-bold">{latestBody?.bodyFat ? `${latestBody.bodyFat} %` : 'N/A'}</span>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400">
                <Ruler className="w-5 h-5" strokeWidth={1.5} />
              </div>
              <div>
                <span className="block text-xs text-slate-500">Cintura</span>
                <span className="text-lg font-bold">{latestBody?.waist ? `${latestBody.waist} cm` : 'N/A'}</span>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400">
                <Dumbbell className="w-5 h-5" strokeWidth={1.5} />
              </div>
              <div>
                <span className="block text-xs text-slate-500">Bíceps</span>
                <span className="text-lg font-bold">{latestBody?.biceps ? `${latestBody.biceps} cm` : 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Chart Section */}
          <div className="p-5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl">
            <h3 className="font-semibold text-sm mb-4">Evolução de Peso & Gordura Corporal</h3>
            <div className="h-64">
              {sortedBodyLogsForChart.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={sortedBodyLogsForChart} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ea580c" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#ea580c" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-800" />
                    <XAxis dataKey="date" tickLine={false} tick={{ fontSize: 10 }} />
                    <YAxis domain={['dataMin - 1', 'dataMax + 1']} tickLine={false} tick={{ fontSize: 10 }} />
                    <Tooltip contentStyle={{ fontSize: '12px', borderRadius: '8px' }} />
                    <Area type="monotone" dataKey="weight" name="Peso (kg)" stroke="#ea580c" strokeWidth={2} fillOpacity={1} fill="url(#weightGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-400 text-sm">Registre as primeiras medidas para ver a evolução.</div>
              )}
            </div>
          </div>

          {/* Historical Medições List */}
          <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl p-5">
            <h3 className="font-semibold text-sm mb-4">Histórico de Medições</h3>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {bodyLogs.map(log => (
                <div key={log.id} className="py-3 flex justify-between items-center text-sm">
                  <div>
                    <span className="font-medium">{log.body?.weight} kg</span>
                    <span className="text-xs text-slate-400 ml-2">Gordura: {log.body?.bodyFat}%</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-500 block">
                      {new Date(log.timestamp).toLocaleDateString('pt-BR')}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Cintura: {log.body?.waist}cm | Bíceps: {log.body?.biceps}cm
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'calisthenics' && (
        <div className="space-y-6" id="calisthenics-panel">
          {/* Quick info or selector for basic/advanced skills */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Skills básicas card */}
            <div className="p-5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl">
              <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase">Foco de Treinamento</span>
              <h3 className="font-semibold text-base mt-1 text-slate-800 dark:text-slate-200">Skills Básicas</h3>
              <p className="text-xs text-slate-500 mt-1 mb-4">Construção de base de força muscular de empurrar e puxar.</p>
              
              <div className="space-y-3">
                {['Flexões de Braço', 'Barra Fixa', 'Paralelas', 'Agachamento Corporal'].map(sk => {
                  const workouts = calisthenicsLogs.filter(l => l.calisthenics?.skill === sk);
                  const latest = workouts.length > 0 ? workouts[0].calisthenics : null;
                  return (
                    <div key={sk} className="p-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-xl flex justify-between items-center">
                      <div>
                        <span className="text-xs font-semibold block text-slate-700 dark:text-slate-300">{sk}</span>
                        <span className="text-[10px] text-slate-500">Última série: {latest ? `${latest.sets}x${latest.reps}` : 'Nenhum treino logado'}</span>
                      </div>
                      <span className="text-[10px] font-mono text-orange-600 bg-orange-50 dark:bg-orange-950/30 px-2 py-0.5 rounded-full">Base</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Skills Avançadas card */}
            <div className="p-5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl">
              <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase">Foco de Treinamento</span>
              <h3 className="font-semibold text-base mt-1 text-slate-800 dark:text-slate-200">Skills Avançadas</h3>
              <p className="text-xs text-slate-500 mt-1 mb-4">Progresso de equilíbrio, isometrias de alta tensão e muscle-ups.</p>

              <div className="space-y-3">
                {['Handstand (Parada de Mão)', 'Muscle-Up', 'L-Sit', 'Front Lever Progression'].map(sk => {
                  const workouts = calisthenicsLogs.filter(l => l.calisthenics?.skill === sk);
                  const latest = workouts.length > 0 ? workouts[0].calisthenics : null;
                  return (
                    <div key={sk} className="p-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-xl flex justify-between items-center">
                      <div>
                        <span className="text-xs font-semibold block text-slate-700 dark:text-slate-300">{sk}</span>
                        <span className="text-[10px] text-slate-500">
                          {latest ? `${latest.sets} séries ${latest.durationSeconds ? `de ${latest.durationSeconds}s` : `de ${latest.reps} reps`}` : 'Ainda sem registro'}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-indigo-600 bg-indigo-50 dark:bg-indigo-950/30 px-2 py-0.5 rounded-full">Avançado</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Timeline of Calisthenics */}
          <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl p-5">
            <h3 className="font-semibold text-sm mb-4">Registro de Treinos de Calistenia</h3>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {calisthenicsLogs.map(log => (
                <div key={log.id} className="py-3.5 flex justify-between items-start text-sm">
                  <div>
                    <span className="font-medium text-slate-800 dark:text-slate-200">{log.calisthenics?.skill}</span>
                    <span className="text-xs text-slate-400 block mt-0.5">
                      {log.calisthenics?.sets}x{log.calisthenics?.reps} {log.calisthenics?.durationSeconds ? `(${log.calisthenics.durationSeconds}s de isometria)` : ''}
                    </span>
                    {log.calisthenics?.notes && (
                      <span className="text-xs italic text-slate-500 block mt-1">
                        "{log.calisthenics.notes}"
                      </span>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-500 block">
                      {new Date(log.timestamp).toLocaleDateString('pt-BR')}
                    </span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      log.calisthenics?.level === 'avançado' ? 'bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400' : 'bg-orange-50 dark:bg-orange-950/20 text-orange-600 dark:text-orange-400'
                    }`}>
                      {log.calisthenics?.level}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'run' && (
        <div className="space-y-6" id="run-panel">
          {/* Zeblaze Smartwatch Box */}
          <div className="p-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 dark:bg-orange-950 text-orange-600 dark:text-orange-400 rounded-xl">
                  <Compass className="w-6 h-6 animate-spin-slow" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Zeblaze Smartwatch Sync</h3>
                  <p className="text-xs text-slate-500">Última corrida sincronizada com precisão de GPS e Frequência Cardíaca</p>
                </div>
              </div>
              {latestRun && (
                <div className="bg-orange-50 dark:bg-orange-950/30 border border-orange-100 dark:border-orange-900/40 px-3 py-1.5 rounded-xl flex items-center gap-2">
                  <Activity className="w-4 h-4 text-orange-600" />
                  <span className="text-xs font-semibold text-orange-700 dark:text-orange-400">Pace Recorde: {latestRun.pace} min/km</span>
                </div>
              )}
            </div>

            {latestRun ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                  <span className="text-xs text-slate-500 block">Distância Total</span>
                  <span className="text-2xl font-extrabold text-orange-600 dark:text-orange-400">{latestRun.distance} km</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                  <span className="text-xs text-slate-500 block">Tempo Total</span>
                  <span className="text-2xl font-extrabold text-slate-800 dark:text-slate-200">{latestRun.duration} min</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                  <span className="text-xs text-slate-500 block">Pace Médio</span>
                  <span className="text-2xl font-extrabold text-slate-800 dark:text-slate-200">{latestRun.pace} /km</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                  <span className="text-xs text-slate-500 block flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5 text-red-500" /> FC Média
                  </span>
                  <span className="text-2xl font-extrabold text-slate-800 dark:text-slate-200">{latestRun.avgHeartRate} bpm</span>
                </div>
              </div>
            ) : (
              <p className="text-slate-500 text-sm">Nenhuma corrida registrada ainda.</p>
            )}

            {/* Heart Rate effort zones custom visualizer - Garmin inspired */}
            {latestRun && (
              <div className="space-y-3 pt-2">
                <span className="text-xs font-mono uppercase tracking-wider text-slate-500 block">Distribuição de Esforço por Zonas de FC (Zeblaze Tracker)</span>
                
                {/* Horizontal segmented progress bar representing zones */}
                <div className="w-full h-4 rounded-lg bg-slate-100 dark:bg-slate-800 flex overflow-hidden">
                  <div 
                    className="h-full bg-blue-400 transition-all cursor-help" 
                    style={{ width: `${latestRun.effortZones?.regenerative || 0}%` }}
                    title={`Zona 1 - Regenerativo: ${latestRun.effortZones?.regenerative}%`}
                  ></div>
                  <div 
                    className="h-full bg-emerald-400 transition-all cursor-help" 
                    style={{ width: `${latestRun.effortZones?.cardio || 0}%` }}
                    title={`Zona 2 - Cardio: ${latestRun.effortZones?.cardio}%`}
                  ></div>
                  <div 
                    className="h-full bg-yellow-400 transition-all cursor-help" 
                    style={{ width: `${latestRun.effortZones?.limiar || 0}%` }}
                    title={`Zona 3 - Limiar Láctico: ${latestRun.effortZones?.limiar}%`}
                  ></div>
                  <div 
                    className="h-full bg-orange-400 transition-all cursor-help" 
                    style={{ width: `${latestRun.effortZones?.anaerobic || 0}%` }}
                    title={`Zona 4 - Anaeróbico: ${latestRun.effortZones?.anaerobic}%`}
                  ></div>
                  <div 
                    className="h-full bg-red-500 transition-all cursor-help" 
                    style={{ width: `${latestRun.effortZones?.maximum || 0}%` }}
                    title={`Zona 5 - Esforço Máximo: ${latestRun.effortZones?.maximum}%`}
                  ></div>
                </div>

                {/* Legend with percentages */}
                <div className="grid grid-cols-5 gap-1 pt-1 text-[10px] text-center font-mono">
                  <div className="flex flex-col items-center">
                    <span className="w-2.5 h-2.5 rounded bg-blue-400 mb-1"></span>
                    <span className="text-slate-500">Z1 (Regen.)</span>
                    <span className="font-semibold">{latestRun.effortZones?.regenerative}%</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="w-2.5 h-2.5 rounded bg-emerald-400 mb-1"></span>
                    <span className="text-slate-500">Z2 (Aeróbio)</span>
                    <span className="font-semibold">{latestRun.effortZones?.cardio}%</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="w-2.5 h-2.5 rounded bg-yellow-400 mb-1"></span>
                    <span className="text-slate-500">Z3 (Limiar)</span>
                    <span className="font-semibold">{latestRun.effortZones?.limiar}%</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="w-2.5 h-2.5 rounded bg-orange-400 mb-1"></span>
                    <span className="text-slate-500">Z4 (Anaer.)</span>
                    <span className="font-semibold">{latestRun.effortZones?.anaerobic}%</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="w-2.5 h-2.5 rounded bg-red-500 mb-1"></span>
                    <span className="text-slate-500">Z5 (Máx.)</span>
                    <span className="font-semibold">{latestRun.effortZones?.maximum}%</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Running Pace progression graph */}
          <div className="p-5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl">
            <h3 className="font-semibold text-sm mb-4">Evolução de Ritmo (Pace) & Distância</h3>
            <div className="h-64">
              {sortedRunLogsForChart.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={sortedRunLogsForChart} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-800" />
                    <XAxis dataKey="date" tickLine={false} tick={{ fontSize: 10 }} />
                    <YAxis yAxisId="left" tickLine={false} tick={{ fontSize: 10 }} label={{ value: 'Distância (km)', angle: -90, position: 'insideLeft', style: { fontSize: 10 } }} />
                    <YAxis yAxisId="right" orientation="right" tickLine={false} tick={{ fontSize: 10 }} label={{ value: 'Pace (min/km)', angle: 90, position: 'insideRight', style: { fontSize: 10 } }} domain={['dataMin - 0.5', 'dataMax + 0.5']} reversed />
                    <Tooltip contentStyle={{ fontSize: '12px', borderRadius: '8px' }} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Line yAxisId="left" type="monotone" dataKey="distance" name="Distância (km)" stroke="#ea580c" strokeWidth={2.5} activeDot={{ r: 6 }} />
                    <Line yAxisId="right" type="monotone" dataKey="pace" name="Pace (Min/km)" stroke="#3b82f6" strokeWidth={1.5} strokeDasharray="3 3" />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-400 text-sm">Registre corridas para ver a evolução.</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
