import { useState, useMemo } from "react";
import { toast } from "sonner";
import { CheckCircle, PaperPlaneRight, EnvelopeSimple, WarningCircle } from "@phosphor-icons/react";
import ManagerLayout from "@/Layouts/ManagerLayout";
import { usePage, router } from "@inertiajs/react";

import CartaoAtividade from "./Components/CartaoAtividade";
import ModalParticipantes from "./Components/ModalParticipantes";
import DialogoConfirmacao from "./Components/DialogoConfirmacao";

export default function Emissao() {
    const { atividades, certificates } = usePage().props;
    const [modalAtividade, setModalAtividade] = useState(null);
    const [processando, setProcessando] = useState(false);
    const [dialogoConfirmacao, setDialogoConfirmacao] = useState(null); 

    const mapaEmitidos = useMemo(() => {
        return Object.fromEntries(
            (certificates ?? []).map((c) => [`${c.id_user}-${c.id_atividade}`, c])
        );
    }, [certificates]);

    const estatisticasAtividades = useMemo(() => {
        return atividades.map(ativ => {
            const total = ativ.participantes.length;
            const emitidos = ativ.participantes.filter(p => mapaEmitidos[`${p.id_user}-${ativ.id}`]).length;
            const pendentes = total - emitidos;
            const progresso = total === 0 ? 0 : Math.round((emitidos / total) * 100);
            const finalizado = total > 0 && emitidos === total;

            return { ...ativ, total, emitidos, pendentes, progresso, finalizado };
        });
    }, [atividades, mapaEmitidos]);

    const totalInscritosGeral = estatisticasAtividades.reduce((acc, a) => acc + a.total, 0);
    const totalEmitidosGeral = estatisticasAtividades.reduce((acc, a) => acc + a.emitidos, 0);
    const eventoFinalizado = totalInscritosGeral > 0 && totalInscritosGeral === totalEmitidosGeral;

    const processarEmissaoIndividual = (id_user, id_atividade) => {
        setProcessando(true);
        router.post(route("eventos.organizacao.certificados.issue"), 
            { id_user, id_atividade }, 
            {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => toast.success("Certificado emitido!"),
                onError: () => toast.error("Erro ao emitir individualmente."),
                onFinish: () => setProcessando(false)
            }
        );
    };

    const solicitarEmissaoEmLote = (atividade = null) => {
        setDialogoConfirmacao({
            id_atividade: atividade ? atividade.id : null,
            titulo: atividade ? atividade.titulo : "Todo o Evento",
            pendentes: atividade ? atividade.pendentes : (totalInscritosGeral - totalEmitidosGeral)
        });
    };

    const executarEmissaoEmLote = () => {
        if (!dialogoConfirmacao) return;
        const id_atividade = dialogoConfirmacao.id_atividade;
        setDialogoConfirmacao(null);

        const toastId = toast.loading("Gerando e enviando certificados. Aguarde...");
        setProcessando(true);

        router.post(route("eventos.organizacao.certificados.batch"), 
            { id_atividade }, 
            {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => toast.success("Emissão em lote concluída!", { id: toastId }),
                onError: () => toast.error("Houve um erro no envio.", { id: toastId }),
                onFinish: () => {
                    setProcessando(false);
                    toast.dismiss(toastId);
                }
            }
        );
    };

    return (
        <ManagerLayout title="Painel de Emissão">
            <div className="mx-auto max-w-5xl px-4 py-8 relative">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4 bg-white p-6 border border-neutral-200 rounded-xl shadow-sm">
                    <div>
                        <h1 className="text-2xl font-bold text-neutral-800 flex items-center gap-2">
                            <EnvelopeSimple weight="duotone" className="text-emerald-600" size={32} />
                            Painel de Emissão
                        </h1>
                        <p className="text-neutral-500 mt-1">Gerencie e envie os certificados do evento.</p>
                        <div className="flex gap-4 mt-4 text-sm font-medium">
                            <div className="bg-neutral-100 px-3 py-1.5 rounded-md text-neutral-700">
                                Total Geral: <span className="text-neutral-900">{totalInscritosGeral}</span>
                            </div>
                            <div className="bg-emerald-50 px-3 py-1.5 rounded-md text-emerald-700">
                                Emitidos: <span className="text-emerald-700">{totalEmitidosGeral}</span>
                            </div>
                        </div>
                    </div>
                    <button 
                        disabled={processando || eventoFinalizado || totalInscritosGeral === 0}
                        onClick={() => solicitarEmissaoEmLote(null)}
                        className="flex items-center gap-2 bg-neutral-900 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {eventoFinalizado ? <CheckCircle weight="bold" size={20} /> : <PaperPlaneRight weight="bold" size={20} />}
                        {eventoFinalizado ? "Todos Emitidos" : "Emitir Pendentes (Geral)"}
                    </button>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    {estatisticasAtividades.map((ativ) => (
                        <CartaoAtividade 
                            key={ativ.id} 
                            ativ={ativ} 
                            processando={processando} 
                            aoAbrirModal={setModalAtividade} 
                            aoEmitirEmLote={solicitarEmissaoEmLote} 
                        />
                    ))}

                    {estatisticasAtividades.length === 0 && (
                        <div className="bg-white border border-neutral-200 border-dashed rounded-xl p-12 text-center">
                            <WarningCircle size={48} className="mx-auto text-neutral-300 mb-3" />
                            <h3 className="text-lg font-bold text-neutral-700 mb-1">Nenhuma atividade</h3>
                            <p className="text-neutral-500">Este evento ainda não possui atividades cadastradas.</p>
                        </div>
                    )}
                </div>

                {modalAtividade && (
                    <ModalParticipantes 
                        atividade={modalAtividade} 
                        mapaEmitidos={mapaEmitidos} 
                        aoFechar={() => setModalAtividade(null)} 
                        aoEmitir={processarEmissaoIndividual} 
                        processando={processando} 
                    />
                )}

                <DialogoConfirmacao 
                    dialogo={dialogoConfirmacao} 
                    aoFechar={() => setDialogoConfirmacao(null)} 
                    aoConfirmar={executarEmissaoEmLote} 
                />
            </div>
        </ManagerLayout>
    );
}