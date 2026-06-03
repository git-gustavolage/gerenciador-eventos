import ManagerLayout from "@/Layouts/ManagerLayout";
import { ArrowSquareOutIcon, PlusIcon } from "@phosphor-icons/react";

export default function Index({ atividades = [] }) {

    const groups = atividades.reduce((acc, atividade) => {
        const key = atividade.data_inicio.slice(0, 10); // YYYY-MM-DD

        if (!acc[key]) {
            acc[key] = [];
        }

        acc[key].push(atividade);

        return acc;
    }, {});

    const keys = Object.keys(groups).sort((a, b) => {
        const [diaA, mesA, anoA] = a.split('/');
        const [diaB, mesB, anoB] = b.split('/');

        return (
            new Date(anoA, mesA - 1, diaA) -
            new Date(anoB, mesB - 1, diaB)
        );
    });
    console.log(atividades, groups, keys);

    return (
        <ManagerLayout title="Programação" defaultSidebarOpen={false}>
            <div className="p-4 overflow-x-auto inline-flex gap-4">

                <div className="p-6 overflow-x-auto">
                    <div className="inline-flex gap-4 items-start">
                        {keys.map((key) => (
                            <div key={key} className="min-w-[360px] bg-slate-50 rounded-sm border border-neutral-300 overflow-hidden">
                                <div className="sticky top-0 bg-white border-b px-5 py-4 w-full flex items-center justify-between">
                                    <div className="space-y-1">
                                        <h2 className="font-bold text-neutral-800">{key}</h2>

                                        <p className="text-sm text-neutral-500">
                                            {groups[key].length} atividade(s)
                                        </p>
                                    </div>

                                    <button className="p-2 bg-neutral-50/50 rounded-sm border border-neutral-300 text-neutral-600 hover:text-neutral-800 hover:bg-neutral-100">
                                        <PlusIcon size={24} />
                                    </button>
                                </div>

                                <div className="p-4 flex flex-col gap-4">
                                    {groups[key].map((atividade) => (
                                        <Card
                                            key={atividade.id}
                                            atividade={atividade}
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </ManagerLayout>
    );
}

function Card({ atividade }) {

    const initial = atividade.ministrante?.nome?.charAt(0)?.toUpperCase() ?? "?";

    return (
        <div className="bg-white border border-neutral-300 rounded-sm p-4 transition-all duration-200 hover:shadow-md shadow-neutral-300">

            <div className="font-semibold text-emerald-600">
                {atividade.data_inicio.slice(11, 16)}
            </div>

            <h3 className="text-lg font-bold text-neutral-800">{atividade.titulo}</h3>

            {atividade.descricao && (
                <p className="mt-2 text-sm text-neutral-500 line-clamp-3">
                    {atividade.descricao}
                </p>
            )}

            {atividade.ministrante && (
                <div className="mt-4 pt-4 border-t flex items-center gap-4">

                    <div className="h-10 w-10 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center">
                        {initial}
                    </div>

                    <div className="min-w-0">
                        <p className="font-medium text-neutral-800 truncate">
                            {atividade.ministrante.nome}
                        </p>

                        <p className="text-xs text-neutral-500 truncate">
                            {atividade.ministrante.email}
                        </p>
                    </div>

                </div>
            )}

            <div className="flex items-center justify-between">
                <span
                    className="text-xs font-medium px-2 py-1 rounded-full bg-emerald-100 text-emerald-800">
                    {atividade.tipo ?? "Palestra"}
                </span>

                <div className="relative group">
                    <button className="p-1.5 bg-neutral-100 rounded-sm text-neutral-600 hover:bg-neutral-200">
                        <ArrowSquareOutIcon size={18} />
                    </button>

                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 translate-y-1 mb-2 px-2 py-1 text-xs text-white bg-neutral-900 rounded whitespace-nowrap opacity-0 pointer-events-none transition-all duration-200 group-hover:opacity-100 group-hover:translate-y-0">
                        Editar
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-neutral-900" />
                    </div>
                </div>
            </div>

        </div>
    );
}
