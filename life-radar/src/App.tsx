import { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { HomePanel } from './features/home/HomePanel';
import { PhysicalPanel } from './features/PhysicalPanel';
import { AcademicPanel } from './features/academia/AcademicPanel';
import { FinancialPanel } from './features/financeiro/FinancialPanel';
import { HistoryPanel } from './features/historico/HistoryPanel';
import { initialHistory, mockDefaultRecommendation } from './initialData';
import { HistoryRecord, CoachRecommendation } from './types';
import { Search, X, Calendar, Activity, BookOpen, DollarSign, ArrowRight } from 'lucide-react';

export default function App() {
  // Gerenciamento centralizado da aba ativa do Life Radar
  const [abaAtiva, setAbaAtiva] = useState<string>('home');
  
  // Controle de estado para a UI da Busca Global transversal
  const [buscaAberta, setBuscaAberta] = useState<boolean>(false);
  const [buscaQuery, setBuscaQuery] = useState<string>('');

  // Persistência local do histórico de performance (em memória apenas, sem localStorage)
  const [history, setHistory] = useState<HistoryRecord[]>(initialHistory);

  // Persistência local da recomendação do Treinador IA (em memória apenas, sem localStorage)
  const [recommendation, setRecommendation] = useState<CoachRecommendation>(mockDefaultRecommendation);

  const [isRecommendationLoading, setIsRecommendationLoading] = useState<boolean>(false);

  // Função para simular as recomendações do Treinador IA de forma 100% client-side
  const handleRefreshRecommendation = async () => {
    setIsRecommendationLoading(true);
    try {
      // Pequeno atraso artificial para simular o tempo de processamento
      await new Promise(resolve => setTimeout(resolve, 800));

      const dynamicRecommendations = [
        "Jailson, sua performance geral continua espetacular! Seu pace nas corridas e batimentos mostram excelente condicionamento cardiovascular. Nos estudos, certifique-se de equilibrar Psicologia e Processo Civil para manter o alto aproveitamento em ambos. No financeiro, com o patrimônio consolidado crescendo, você está cada vez mais próximo da sua meta principal de R$ 100k.",
        "Análise concluída com sucesso! Os dados do seu histórico confirmam alto comprometimento com as metas físicas e consistência nos estudos. Sugerimos focar em alongamento pós-corrida para prevenção de lesões e manter os aportes programados em renda fixa e ações de dividendos para aproveitar os juros compostos.",
        "Excelente progresso geral detectado! Suas métricas de saúde, estudos e investimentos mostram uma rotina altamente equilibrada. Continue monitorando as horas líquidas de estudo semanal e mantenha o ritmo dos treinos intervalados na corrida."
      ];

      const dynamicPriorities = [
        [
          'Manter treinos de ritmo e testar tiro de 1km para ganho de velocidade',
          'Fazer simulação de questões de Psicologia (mínimo 20 questões)',
          'Planejar aporte de investimentos para o próximo ciclo mensal'
        ],
        [
          'Corrida leve de rodagem por 45 minutos em ritmo confortável',
          'Ler doutrina recomendada de Processo Civil por 1 hora',
          'Registrar novas metas ou aportes de fundos imobiliários'
        ],
        [
          'Treinar mobilidade articular antes dos exercícios físicos principais',
          'Resolver flashcards de Psicologia para retenção ativa',
          'Verificar se a reserva de emergência está totalmente atualizada'
        ]
      ];

      const randomIndex = Math.floor(Math.random() * dynamicRecommendations.length);

      setRecommendation({
        date: new Date().toISOString().split('T')[0],
        recommendation: dynamicRecommendations[randomIndex],
        priorities: dynamicPriorities[randomIndex],
      });
    } catch (error) {
      console.error('Erro ao gerar recomendação do Treinador IA:', error);
    } finally {
      setIsRecommendationLoading(false);
    }
  };

  // Função centralizada para adicionar novos registros de performance
  const handleAddRecord = (newRecordData: Omit<HistoryRecord, 'id' | 'timestamp'>) => {
    const newRecord: HistoryRecord = {
      ...newRecordData,
      id: `reg-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    
    setHistory(prev => [newRecord, ...prev]);
    
    // Opcional: Notifica o usuário e sugere atualizar recomendações de forma sutil
  };

  // Função centralizada para deletar registros
  const handleDeleteRecord = (id: string) => {
    setHistory(prev => prev.filter(record => record.id !== id));
  };

  // Tema ativo no componente de layout
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const isDark = document.documentElement.classList.contains('dark');
      setTheme(isDark ? 'dark' : 'light');
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  // Renderização condicional baseada na aba ativa
  const renderizarFeature = () => {
    switch (abaAtiva) {
      case 'home':
        return (
          <HomePanel 
            history={history}
            recommendation={recommendation}
            isRecommendationLoading={isRecommendationLoading}
            onRefreshRecommendation={handleRefreshRecommendation}
            onNavigateToTab={(tabName) => {
              // Mapeia os rótulos de navegação do HomePanel para as IDs reais das abas
              const tabMap: Record<string, string> = {
                'Físico': 'fisico',
                'Estudos': 'academia',
                'Financeiro': 'financeiro',
                'Histórico': 'historico'
              };
              const mapped = tabMap[tabName];
              if (mapped) setAbaAtiva(mapped);
            }}
            theme={theme}
          />
        );
      case 'fisico':
        return <PhysicalPanel history={history} onAddRecord={handleAddRecord} />;
      case 'academia':
        return <AcademicPanel history={history} onAddRecord={handleAddRecord} />;
      case 'financeiro':
        return <FinancialPanel history={history} onAddRecord={handleAddRecord} />;
      case 'historico':
        return (
          <HistoryPanel 
            history={history} 
            onDeleteRecord={handleDeleteRecord}
            globalSearchQuery={buscaQuery}
            onGlobalSearchChange={setBuscaQuery}
          />
        );
      default:
        return <HomePanel 
          history={history}
          recommendation={recommendation}
          isRecommendationLoading={isRecommendationLoading}
          onRefreshRecommendation={handleRefreshRecommendation}
          onNavigateToTab={(tabName) => {
            const tabMap: Record<string, string> = {
              'Físico': 'fisico',
              'Estudos': 'academia',
              'Financeiro': 'financeiro',
              'Histórico': 'historico'
            };
            const mapped = tabMap[tabName];
            if (mapped) setAbaAtiva(mapped);
          }}
          theme={theme}
        />;
    }
  };

  const handleAbrirBusca = () => {
    setBuscaAberta(true);
  };

  // Filtragem rápida de registros para a Busca Global Modal
  const resultadosBusca = buscaQuery.trim() === '' ? [] : history.filter(record => {
    const query = buscaQuery.toLowerCase();
    const matchesDescription = record.description.toLowerCase().includes(query);
    const matchesCategory = record.category.toLowerCase().includes(query);
    
    let matchesDetail = false;
    if (record.body) {
      matchesDetail = record.body.weight.toString().includes(query) || (record.body.notes || '').toLowerCase().includes(query);
    } else if (record.calisthenics) {
      matchesDetail = record.calisthenics.skill.toLowerCase().includes(query) || (record.calisthenics.notes || '').toLowerCase().includes(query);
    } else if (record.run) {
      matchesDetail = record.run.distance.toString().includes(query) || (record.run.pace || '').includes(query);
    } else if (record.study) {
      matchesDetail = record.study.topic.toLowerCase().includes(query) || record.study.area.toLowerCase().includes(query);
    } else if (record.asset) {
      matchesDetail = record.asset.assetName.toLowerCase().includes(query) || record.asset.category.toLowerCase().includes(query);
    } else if (record.goal) {
      matchesDetail = record.goal.goalName.toLowerCase().includes(query);
    }
    
    return matchesDescription || matchesCategory || matchesDetail;
  }).slice(0, 5);

  return (
    <Layout 
      abaAtiva={abaAtiva} 
      setAbaAtiva={setAbaAtiva} 
      onSearchClick={handleAbrirBusca}
    >
      {renderizarFeature()}

      {/* --- MODAL DE BUSCA GLOBAL TRANSVERSAL --- */}
      {buscaAberta && (
        <div 
          className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-slate-950/40 backdrop-blur-sm animate-fade-in"
          onClick={() => {
            setBuscaAberta(false);
            setBuscaQuery('');
          }}
          id="global-search-modal"
        >
          <div 
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden animate-slide-up"
            onClick={e => e.stopPropagation()}
          >
            {/* Input Header */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-200 dark:border-slate-800">
              <Search className="w-5 h-5 text-slate-400" />
              <input 
                type="text"
                placeholder="Buscar em todo o Life Radar..."
                value={buscaQuery}
                onChange={e => setBuscaQuery(e.target.value)}
                autoFocus
                className="flex-grow bg-transparent border-none outline-none text-sm text-slate-900 dark:text-white placeholder-slate-400"
                id="modal-search-input"
              />
              <button 
                onClick={() => {
                  setBuscaAberta(false);
                  setBuscaQuery('');
                }}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Results */}
            <div className="p-4">
              {buscaQuery.trim() === '' ? (
                <p className="text-xs text-slate-400 text-center py-6">
                  Digite palavras-chave como "corrida", "peso", "psicologia" ou "selic".
                </p>
              ) : resultadosBusca.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-6">
                  Nenhum registro encontrado para "{buscaQuery}".
                </p>
              ) : (
                <div className="space-y-2">
                  <h4 className="text-[10px] font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                    Resultados do Histórico ({resultadosBusca.length})
                  </h4>
                  {resultadosBusca.map(record => {
                    // Mapeamento de cor e ícone por categoria
                    let icon = <Activity className="w-4 h-4 text-cyan-500" />;
                    let tabName = 'home';
                    if (record.category.startsWith('physical')) {
                      icon = <Activity className="w-4 h-4 text-orange-500" />;
                      tabName = 'fisico';
                    } else if (record.category === 'academic') {
                      icon = <BookOpen className="w-4 h-4 text-indigo-500" />;
                      tabName = 'academia';
                    } else if (record.category.startsWith('financial')) {
                      icon = <DollarSign className="w-4 h-4 text-emerald-500" />;
                      tabName = 'financeiro';
                    }

                    return (
                      <button
                        key={record.id}
                        onClick={() => {
                          setAbaAtiva(tabName);
                          setBuscaAberta(false);
                        }}
                        className="w-full text-left p-2.5 rounded-xl border border-slate-100 dark:border-slate-800/60 hover:bg-slate-50 dark:hover:bg-slate-800/50 flex items-center justify-between gap-3 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 flex-shrink-0">
                            {icon}
                          </div>
                          <div>
                            <p className="text-xs font-medium text-slate-800 dark:text-slate-200 line-clamp-1">
                              {record.description}
                            </p>
                            <span className="text-[10px] text-slate-400 flex items-center gap-1.5 mt-0.5 font-mono">
                              <Calendar className="w-3 h-3" />
                              {new Date(record.timestamp).toLocaleDateString('pt-BR')}
                            </span>
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                      </button>
                    );
                  })}

                  <div className="pt-2 text-center border-t border-slate-100 dark:border-slate-800/80 mt-2">
                    <button
                      onClick={() => {
                        setAbaAtiva('historico');
                        setBuscaAberta(false);
                      }}
                      className="text-xs text-cyan-600 dark:text-cyan-400 font-medium hover:underline inline-flex items-center gap-1 cursor-pointer"
                    >
                      Ver histórico completo
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
