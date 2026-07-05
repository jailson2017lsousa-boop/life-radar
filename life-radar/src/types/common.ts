export interface MetricaProgresso {
    rotulo: string;
      atual: number;
        meta: number;
          unidade: string;
            detalhe: string;
              corAcento: string;
              }

              export interface ResumoPainel {
                usuario: string;
                  dataActual: string;
                    consistenciaDias: number;
                      prioridades: { id: string; texto: string; pilar: 'fisico' | 'academia' | 'financeiro' }[];
                        metricas: MetricaProgresso[];
                        }
                        