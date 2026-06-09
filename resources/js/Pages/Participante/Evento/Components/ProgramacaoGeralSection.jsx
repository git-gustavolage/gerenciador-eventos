import { useMemo } from "react";
import { ProgramacaoItem } from "./ProgramacaoItem";

export function ProgramacaoGeralSection({ atividades = [], inscricoes = [] }) {

    const grupos = useMemo(() => {
        return [...atividades]
            .sort((a, b) => new Date(a.data_inicio) - new Date(b.data_inicio))
            .reduce((acc, atividade) => {
                const data = new Date(atividade.data_inicio).toLocaleDateString("pt-BR");

                if (!acc[data]) {
                    acc[data] = [];
                }

                acc[data].push(atividade);

                return acc;
            }, {});
    }, [atividades]);

    return (
        <section className="space-y-8">
            {Object.entries(grupos).map(([data, atividadesDia]) => (
                <div key={data} className="space-y-3">
                    <div className="flex items-center gap-4">
                        <span className="text-sm font-medium">{data}</span>
                    </div>

                    <div className="space-y-4">
                        {atividadesDia.map((atividade) => {
                            const inscrito = inscricoes.find((inscricao) => inscricao.id_atividade == atividade.id);
                            return <ProgramacaoItem key={atividade.id} atividade={atividade} inscrito={inscrito} />;
                        })}
                    </div>
                </div>
            ))}
        </section>
    );
}
