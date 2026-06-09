import { useState } from "react";
import { router } from "@inertiajs/react";
import ManagerLayout from "@/Layouts/ManagerLayout";
import { 
    RocketLaunchIcon, 
    MegaphoneIcon, 
    XCircleIcon, 
    InfoIcon, 
    CheckCircleIcon,
    CalendarCheckIcon
} from "@phosphor-icons/react";

export default function Index({ evento }) {
    const [openPublish, setOpenPublish] = useState(false);
    const [openCancel, setOpenCancel] = useState(false);
    const [processing, setProcessing] = useState(false);

    const handlePublish = () => {
        setProcessing(true);
        router.put(route("eventos.update"), {
            is_publicado: true
        }, {
            onSuccess: () => {
                setOpenPublish(false);
                setProcessing(false);
            },
            onError: () => setProcessing(false)
        });
    };

    const handleCancel = () => {
        setProcessing(true);
        router.put(route("eventos.update"), {
            is_cancelado: true
        }, {
            onSuccess: () => {
                setOpenCancel(false);
                setProcessing(false);
            },
            onError: () => setProcessing(false)
        });
    };

    return (
        <ManagerLayout title="Início">
            <div className="max-w-4xl mx-auto py-8 px-4 flex flex-col gap-8">
                
                {}
                <div className="bg-white border border-neutral-200 rounded-3xl p-8 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-6 opacity-5 text-neutral-900 pointer-events-none hidden sm:block">
                        <RocketLaunchIcon size={140} weight="duotone" />
                    </div>
                    
                    <div className="flex flex-col gap-3 max-w-xl">
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 rounded-full px-3 py-1 w-fit">
                            <CalendarCheckIcon size={14} weight="fill" /> Painel do Organizador
                        </span>
                        <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight">
                            Seja muito bem-vindo!
                        </h1>
                        <p className="text-neutral-500 text-sm leading-relaxed">
                            Este é o seu centro de comando. Aqui você tem total liberdade para planejar, estruturar as atividades, convidar ministrantes e gerenciar cada detalhe do seu evento de ponta a ponta.
                        </p>
                    </div>
                </div>

                {}
                <div className="bg-white border border-neutral-200 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col gap-6">
                    <div className="flex flex-col gap-1">
                        <h2 className="font-bold text-neutral-900 text-lg">Status da Publicação</h2>
                        <p className="text-xs text-neutral-400">Controle a visibilidade do seu evento para o público geral.</p>
                    </div>

                    {}
                    {evento?.is_cancelado ? (
                        <div className="rounded-2xl bg-red-50 border border-red-200 p-4 flex items-start gap-3 text-red-700 text-sm">
                            <XCircleIcon size={20} weight="fill" className="shrink-0 text-red-500 mt-0.5" />
                            <div>
                                <span className="font-bold block">Este evento foi cancelado</span>
                                <p className="text-xs text-red-600/90 mt-0.5">Ele não aceita mais inscrições e exibe um aviso de cancelamento na página pública.</p>
                            </div>
                        </div>
                    ) : evento?.is_publicado ? (
                        <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4 flex items-start gap-3 text-emerald-800 text-sm">
                            <CheckCircleIcon size={20} weight="fill" className="shrink-0 text-emerald-500 mt-0.5" />
                            <div>
                                <span className="font-bold block">Seu evento já está publicado e ativo!</span>
                                <p className="text-xs text-emerald-700/90 mt-0.5">O público já consegue visualizar a programação completa e realizar inscrições.</p>
                            </div>
                        </div>
                    ) : (
                        <div className="rounded-2xl bg-neutral-50 border border-neutral-200 p-4 flex items-start gap-3 text-neutral-600 text-sm">
                            <InfoIcon size={20} weight="duotone" className="shrink-0 text-neutral-400 mt-0.5" />
                            <div>
                                <span className="font-bold block text-neutral-800">Seu evento está em modo Rascunho</span>
                                <p className="text-xs text-neutral-400 mt-0.5">Até que você publique, apenas você e organizadores autorizados possuem acesso à página dele.</p>
                            </div>
                        </div>
                    )}

                    {}
                    {!evento?.is_cancelado && (
                        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-neutral-100">
                            {!evento?.is_publicado && (
                                <button
                                    onClick={() => setOpenPublish(true)}
                                    className="rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 transition-all flex items-center gap-2"
                                >
                                    <MegaphoneIcon size={18} weight="bold" />
                                    Publicar Evento
                                </button>
                            )}
                            
                            <button
                                onClick={() => setOpenCancel(true)}
                                className="rounded-2xl border border-red-200 bg-white px-5 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 hover:border-red-300 transition-all flex items-center gap-2"
                            >
                                <XCircleIcon size={18} weight="bold" />
                                Cancelar Evento
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {}
            {openPublish && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/40 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white border border-neutral-200 rounded-3xl max-w-md w-full p-6 shadow-xl flex flex-col gap-5">
                        <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
                            <MegaphoneIcon size={24} weight="duotone" />
                        </div>
                        
                        <div className="flex flex-col gap-2">
                            <h3 className="font-black text-neutral-900 text-lg leading-tight">Quer publicar o evento agora?</h3>
                            <p className="text-sm text-neutral-500 leading-relaxed">
                                Se você confirmar, o evento será publicado para todos na plataforma imediatamente. <strong className="text-neutral-700">Atenção:</strong> após publicado, o evento se torna definitivo e não há como voltar ao estado de Rascunho, sendo possível apenas o cancelamento total dele.
                            </p>
                        </div>

                        <div className="flex items-center gap-3 mt-2">
                            <button
                                disabled={processing}
                                onClick={handlePublish}
                                className="flex-1 rounded-2xl bg-emerald-600 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 disabled:opacity-50 transition-all"
                            >
                                {processing ? "Publicando..." : "Sim, publicar evento"}
                            </button>
                            <button
                                disabled={processing}
                                onClick={() => setOpenPublish(false)}
                                className="flex-1 rounded-2xl border border-neutral-200 bg-white py-3 text-sm font-semibold text-neutral-600 hover:bg-neutral-50 disabled:opacity-50 transition-all"
                            >
                                Voltar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {}
            {openCancel && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/40 backdrop-blur-sm">
                    <div className="bg-white border border-neutral-200 rounded-3xl max-w-md w-full p-6 shadow-xl flex flex-col gap-5">
                        <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600">
                            <XCircleIcon size={24} weight="duotone" />
                        </div>
                        
                        <div className="flex flex-col gap-2">
                            <h3 className="font-black text-neutral-900 text-lg leading-tight">Tem certeza que deseja cancelar?</h3>
                            <p className="text-sm text-neutral-500 leading-relaxed">
                                Esta ação irá suspender as atividades e inscrições de forma permanente. O público continuará vendo a página, mas com um aviso explícito de que o evento foi cancelado. Esta ação não poderá ser desfeita.
                            </p>
                        </div>

                        <div className="flex items-center gap-3 mt-2">
                            <button
                                disabled={processing}
                                onClick={handleCancel}
                                className="flex-1 rounded-2xl bg-red-600 py-3 text-sm font-semibold text-white shadow-sm hover:bg-red-700 disabled:opacity-50 transition-all"
                            >
                                {processing ? "Cancelando..." : "Sim, cancelar evento"}
                            </button>
                            <button
                                disabled={processing}
                                onClick={() => setOpenCancel(false)}
                                className="flex-1 rounded-2xl border border-neutral-200 bg-white py-3 text-sm font-semibold text-neutral-600 hover:bg-neutral-50 disabled:opacity-50 transition-all"
                            >
                                Voltar
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </ManagerLayout>
    );
}