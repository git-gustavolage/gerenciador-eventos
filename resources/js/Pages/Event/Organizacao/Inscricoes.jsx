import { useState } from "react";
import { router, Head } from "@inertiajs/react";
import { 
    CheckIcon, 
    XIcon, 
    UserIcon, 
    CheckCircleIcon,
    ClockIcon,
    EnvelopeIcon,
    TicketIcon, 
    CalendarCheckIcon 
} from "@phosphor-icons/react";
import PrimaryButton from "@/Components/PrimaryButton";
import ManagerLayout from "@/Layouts/ManagerLayout"; 


import InscricoesAtividade from "./InscricoesAtividade"; 

export default function Inscricoes({ inscricoes, inscricoesAtividades, atividades }) {
    const [loading, setLoading] = useState(false);
    const [abaAtiva, setAbaAtiva] = useState("evento"); 

    

    function handleConfirmarInscricao(id) {
        if (!confirm("Deseja confirmar a inscrição deste participante?")) return;
        
        router.put(route("eventos.organizacao.confirmar-inscricao", id), {}, {
            preserveScroll: true,
        });
    }

    function handleCancelarInscricao(id) {
        if (!confirm("Deseja realmente cancelar a inscrição deste participante?")) return;

        router.put(route("eventos.organizacao.cancelar-inscricao", id), {}, {
            preserveScroll: true,
        });
    }

    function handleTogglePresenca(id) {
        router.put(route("eventos.organizacao.toggle-presenca", id), {}, {
            preserveScroll: true,
        });
    }

    function handleConfirmarTodas() {
        if (!confirm("Deseja confirmar TODAS as inscrições que estão pendentes atualmente?")) return;

        setLoading(true);
        router.post(route("eventos.organizacao.confirmar-todas"), {}, {
            preserveScroll: true,
            onFinish: () => setLoading(false)
        });
    }

    return (
        <ManagerLayout title="Gerenciar Inscrições">
            <div className="min-h-screen bg-neutral-50">
                
                {/* HEADER */}
                <div className="border-b border-neutral-200 bg-white">
                    <div className="mx-auto max-w-5xl px-6 py-8 max-md:px-4">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <div>
                                <h1 className="text-3xl font-bold tracking-tight text-neutral-900">Inscrições do Evento</h1>
                                <p className="mt-1 text-sm text-neutral-500">Gerencie os participantes, confirmações e listas de presença.</p>
                            </div>

                            {abaAtiva === "evento" && (
                                <PrimaryButton 
                                    onClick={handleConfirmarTodas} 
                                    disabled={loading}
                                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700"
                                >
                                    <CheckCircleIcon size={18} weight="bold" />
                                    Confirmar todas pendentes
                                </PrimaryButton>
                            )}
                        </div>

                        {/* NAVEGAÇÃO POR ABAS (TABS) */}
                        <div className="mt-8 flex gap-2 border-b border-neutral-200">
                            <button
                                onClick={() => setAbaAtiva("evento")}
                                className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-medium transition-all ${
                                    abaAtiva === "evento"
                                        ? "border-emerald-600 text-emerald-600"
                                        : "border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300"
                                }`}
                            >
                                <CalendarCheckIcon size={18} />
                                Inscrições no Evento
                            </button>
                            <button
                                onClick={() => setAbaAtiva("atividades")}
                                className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-medium transition-all ${
                                    abaAtiva === "atividades"
                                        ? "border-emerald-600 text-emerald-600"
                                        : "border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300"
                                }`}
                            >
                                <TicketIcon size={18} />
                                Inscrições por Atividade
                            </button>
                        </div>

                    </div>
                </div>

                <div className="mx-auto max-w-5xl px-6 py-8 max-md:px-4">
                    
                    {abaAtiva === "evento" ? (
                        (!inscricoes || !inscricoes.data || inscricoes.data.length === 0) ? (
                            <div className="rounded-2xl border border-dashed border-neutral-300 bg-white py-16 text-center shadow-sm">
                                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-500">
                                    <UserIcon size={30} weight="duotone" />
                                </div>
                                <h3 className="text-lg font-semibold text-neutral-800">Nenhuma inscrição realizada</h3>
                                <p className="mt-1 text-sm text-neutral-500">Nenhum participante se inscreveu neste evento até o momento.</p>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-3">
                                {inscricoes.data.map((inscricao) => {
                                    const isPresente = inscricao.compareceu === 1 || inscricao.compareceu === true;

                                    return (
                                        <div key={inscricao.id} className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
                                            
                                            <div className="flex items-center gap-4 min-w-[280px]">
                                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-xl font-bold text-emerald-700">
                                                    {inscricao.user?.nome?.charAt(0)?.toUpperCase() || "?"}
                                                </div>
                                                
                                                <div className="flex flex-col gap-1">
                                                    <span className="font-semibold text-neutral-900">
                                                        {inscricao.user?.nome || "Usuário não encontrado"}
                                                    </span>
                                                    
                                                    <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-500">
                                                        <span className="inline-flex items-center gap-1 mr-1">
                                                            <EnvelopeIcon size={12} />
                                                            {inscricao.user?.email || "-"}
                                                        </span>
                                                        
                                                        {inscricao.status === "confirmado" && (
                                                            <div className="flex items-center gap-1.5 flex-wrap">
                                                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                                    Confirmado
                                                                </span>
                                                                {isPresente ? (
                                                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-medium bg-green-100 text-green-800 border border-green-200">
                                                                        <CheckIcon size={10} weight="bold" /> Presente
                                                                    </span>
                                                                ) : (
                                                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-medium bg-neutral-100 text-neutral-600 border border-neutral-200">
                                                                        <XIcon size={10} weight="bold" /> Ausente
                                                                    </span>
                                                                )}
                                                            </div>
                                                        )}
                                                        {inscricao.status === "pendente" && (
                                                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-medium bg-amber-50 text-amber-700 border border-amber-200">
                                                                <ClockIcon size={12} /> Pendente
                                                            </span>
                                                        )}
                                                        {inscricao.status === "cancelado" && (
                                                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-medium bg-red-50 text-red-700 border border-red-200">
                                                                Cancelado
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center max-sm:w-full justify-end max-sm:justify-start">
                                                {inscricao.status === "pendente" && (
                                                    <div className="flex flex-col gap-1.5 items-end max-sm:items-start">
                                                        <span className="text-xs font-medium text-neutral-600">confirmar a inscrição?</span>
                                                        <div className="flex items-center gap-2">
                                                            <button
                                                                type="button"
                                                                onClick={() => handleConfirmarInscricao(inscricao.id)}
                                                                className="inline-flex items-center gap-1 rounded-xl border border-emerald-200 bg-white px-4 py-2 text-xs font-semibold text-emerald-600 hover:bg-emerald-50 transition-colors"
                                                            >
                                                                Sim
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => handleCancelarInscricao(inscricao.id)}
                                                                className="inline-flex items-center gap-1 rounded-xl border border-neutral-200 bg-white px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors"
                                                            >
                                                                Não
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}

                                                {inscricao.status === "confirmado" && (
                                                    <div className="flex flex-col gap-1.5 items-end max-sm:items-start">
                                                        <span className="text-xs font-medium text-neutral-500">presença do participante</span>
                                                        <div className="flex flex-wrap items-center gap-2">
                                                            <div className="inline-flex rounded-xl p-1 bg-neutral-100 border border-neutral-200/60">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => !isPresente && handleTogglePresenca(inscricao.id)}
                                                                    className={`inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                                                                        isPresente ? "bg-emerald-600 text-white shadow-sm" : "text-neutral-500 hover:text-neutral-900"
                                                                    }`}
                                                                >
                                                                    <CheckIcon size={12} weight={isPresente ? "bold" : "regular"} />
                                                                    Presente
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => isPresente && handleTogglePresenca(inscricao.id)}
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
                                                                onClick={() => handleCancelarInscricao(inscricao.id)}
                                                                className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
                                                            >
                                                                cancelar a inscrição
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}

                                                {inscricao.status === "cancelado" && (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleConfirmarInscricao(inscricao.id)}
                                                        className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-200 px-4 py-2 text-xs font-semibold text-emerald-600 hover:bg-emerald-50 transition-colors"
                                                    >
                                                        reativar inscrição
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )
                    ) : (
                        <InscricoesAtividade inscricoes={inscricoesAtividades} atividades={atividades} />

                    )}

                    {abaAtiva === "evento" && inscricoes && inscricoes.links && inscricoes.links.length > 3 && (
                        <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-between items-center bg-white border border-neutral-200 rounded-2xl p-4 shadow-sm">
                            <span className="text-xs text-neutral-500">Mostrando listagem de participantes</span>
                            <div className="flex flex-wrap gap-1">
                                {inscricoes.links.map((link, index) => (
                                    <button
                                        key={index}
                                        disabled={!link.url}
                                        onClick={() => router.visit(link.url)}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-colors ${
                                            link.active 
                                                ? "bg-emerald-600 text-white" 
                                                : "bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50 disabled:opacity-50"
                                        }`}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </ManagerLayout>
    );
}