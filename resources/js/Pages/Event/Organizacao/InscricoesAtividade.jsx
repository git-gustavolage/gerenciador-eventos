import { useState } from "react";
import { router } from "@inertiajs/react";
import { 
    CheckIcon, 
    XIcon, 
    ClockIcon, 
    EnvelopeIcon, 
    CalendarBlankIcon,
    UsersIcon,
    FunnelIcon
} from "@phosphor-icons/react";

export default function InscricoesAtividade({ inscricoes, atividades = [] }) {
    const [filtroAtividade, setFiltroAtividade] = useState("todas");

    const atividadesUnicas = atividades;

    const lista = Array.isArray(inscricoes) ? inscricoes : (inscricoes?.data ?? []);

    const dadosFiltrados = lista.filter(inscricao => {
        if (filtroAtividade === "todas") return true;
        return inscricao.id_atividade === Number(filtroAtividade);
    });

    function handleConfirmarInscricaoAtividade(id) {
        if (!confirm("Deseja confirmar a inscrição nesta atividade?")) return;
        router.put(route("eventos.organizacao.atividades.confirmar-inscricao", id), {}, {
            preserveScroll: true,
        });
    }

    function handleCancelarInscricaoAtividade(id) {
        if (!confirm("Deseja realmente cancelar a inscrição nesta atividade?")) return;
        router.put(route("eventos.organizacao.atividades.cancelar-inscricao", id), {}, {
            preserveScroll: true,
        });
    }

    function handleTogglePresencaAtividade(id) {
        router.put(route("eventos.organizacao.atividades.toggle-presenca", id), {}, {
            preserveScroll: true,
        });
    }

    return (
        <div className="space-y-6">
            
            {}
            {atividadesUnicas.length > 0 && (
                <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
                    <div className="flex items-center gap-2 text-sm font-medium text-neutral-700">
                        <FunnelIcon size={18} className="text-neutral-400" />
                        <span>Filtrar por Atividade:</span>
                    </div>
                    <select
                        value={filtroAtividade}
                        onChange={(e) => setFiltroAtividade(e.target.value)}
                        className="w-full sm:w-72 rounded-xl border-neutral-200 text-sm shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                    >
                        <option value="todas">Todas as Atividades ({lista.length})</option>
                        {atividadesUnicas.map((atividade) => (
                            <option key={atividade.id} value={atividade.id}>
                                {atividade.titulo} ({lista.filter(i => i.id_atividade === atividade.id).length})
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {}
            {dadosFiltrados.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-neutral-300 bg-white py-16 text-center shadow-sm">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-neutral-50 text-neutral-400">
                        <UsersIcon size={30} weight="duotone" />
                    </div>
                    <h3 className="text-lg font-semibold text-neutral-800">Nenhuma inscrição encontrada</h3>
                    <p className="mt-1 text-sm text-neutral-500">
                        {filtroAtividade === "todas" 
                            ? "Nenhum participante se inscreveu em atividades até o momento."
                            : "Nenhum participante inscrito para a atividade selecionada."}
                    </p>
                </div>
            ) : (
                <div className="flex flex-col gap-3">
                    {dadosFiltrados.map((inscricao) => {
                        const isPresente = inscricao.compareceu === 1 || inscricao.compareceu === true;

                        return (
                            <div key={inscricao.id} className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
                                
                                {}
                                <div className="flex items-start gap-4 min-w-[280px] max-w-full">
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-neutral-100 text-xl font-bold text-neutral-700">
                                        {inscricao.user?.nome?.charAt(0)?.toUpperCase() || "?"}
                                    </div>
                                    
                                    <div className="flex flex-col gap-1 overflow-hidden">
                                        <span className="font-semibold text-neutral-900 truncate">
                                            {inscricao.user?.nome || "Usuário não encontrado"}
                                        </span>
                                        
                                        <div className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-md w-fit">
                                            <CalendarBlankIcon size={12} />
                                            <span className="truncate max-w-[250px]">{inscricao.atividade?.titulo || "Atividade"}</span>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-neutral-500">
                                            <span className="inline-flex items-center gap-1">
                                                <EnvelopeIcon size={12} />
                                                {inscricao.user?.email || "-"}
                                            </span>
                                            
                                            {inscricao.status === "confirmado" && (
                                                <div className="flex items-center gap-1.5">
                                                    {isPresente ? (
                                                        <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full font-medium bg-green-100 text-green-800 border border-green-200">
                                                            <CheckIcon size={10} weight="bold" /> Presente
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full font-medium bg-neutral-100 text-neutral-600 border border-neutral-200">
                                                            <XIcon size={10} weight="bold" /> Ausente
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                            {inscricao.status === "pendente" && (
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-medium bg-amber-50 text-amber-700 border border-amber-200">
                                                    <ClockIcon size={12} /> Pendente
                                                </span>
                                            )}
                                            {inscricao.status === "cancelado" && (
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-medium bg-red-50 text-red-700 border border-red-200">
                                                    Cancelado
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {}
                                <div className="flex items-center max-sm:w-full justify-end max-sm:justify-start">
                                    {inscricao.status === "pendente" && (
                                        <div className="flex flex-col gap-1.5 items-end max-sm:items-start">
                                            <span className="text-xs font-medium text-neutral-600">confirmar vaga?</span>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => handleConfirmarInscricaoAtividade(inscricao.id)}
                                                    className="inline-flex items-center gap-1 rounded-xl border border-emerald-200 bg-white px-4 py-2 text-xs font-semibold text-emerald-600 hover:bg-emerald-50 transition-colors"
                                                >
                                                    Sim
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleCancelarInscricaoAtividade(inscricao.id)}
                                                    className="inline-flex items-center gap-1 rounded-xl border border-neutral-200 bg-white px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors"
                                                >
                                                    Não
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {inscricao.status === "confirmado" && (
                                        <div className="flex flex-col gap-1.5 items-end max-sm:items-start">
                                            <span className="text-xs font-medium text-neutral-500">chamada/presença</span>
                                            <div className="flex flex-wrap items-center gap-2">
                                                <div className="inline-flex rounded-xl p-1 bg-neutral-100 border border-neutral-200/60">
                                                    <button
                                                        type="button"
                                                        onClick={() => !isPresente && handleTogglePresencaAtividade(inscricao.id)}
                                                        className={`inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                                                            isPresente ? "bg-emerald-600 text-white shadow-sm" : "text-neutral-500 hover:text-neutral-900"
                                                        }`}
                                                    >
                                                        <CheckIcon size={12} weight={isPresente ? "bold" : "regular"} />
                                                        Presente
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => isPresente && handleTogglePresencaAtividade(inscricao.id)}
                                                        className={`inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                                                            !isPresente ? "bg-neutral-600 text-white shadow-sm" : "text-neutral-500 hover:text-neutral-900"
                                                        }`}
                                                    >
                                                        <XIcon size={12} weight={!isPresente ? "bold" : "regular"} />
                                                        Ausente
                                                    </button>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => handleCancelarInscricaoAtividade(inscricao.id)}
                                                    className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
                                                >
                                                    remover vaga
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {inscricao.status === "cancelado" && (
                                        <button
                                            type="button"
                                            onClick={() => handleConfirmarInscricaoAtividade(inscricao.id)}
                                            className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-200 px-4 py-2 text-xs font-semibold text-emerald-600 hover:bg-emerald-50 transition-colors"
                                        >
                                            reativar vaga
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}