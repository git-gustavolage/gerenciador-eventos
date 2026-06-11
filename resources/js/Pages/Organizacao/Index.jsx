import { useState } from "react";
import ManagerLayout from "@/Layouts/ManagerLayout";
import { toast } from "sonner";
import {
    RocketLaunchIcon,
    MegaphoneIcon,
    XCircleIcon,
    InfoIcon,
    CheckCircleIcon,
    CalendarCheckIcon,
} from "@phosphor-icons/react";
import Modal from "@/Components/Modal";
import { useAction } from "@/Hooks/useAction";
import { update } from "@/Actions/update";
import { actionErrorHandlingDecorator } from "@/util/actionErrorHandlingDecorator";
import { routes } from "@/api/routes";
import { patch } from "@/Actions/patch";
import { router } from "@inertiajs/react";

export default function Index({ evento }) {
    const [openPublish, setOpenPublish] = useState(false);
    const [openCancel, setOpenCancel] = useState(false);

    const publishAction = useAction({
        actionFn: actionErrorHandlingDecorator(patch),
        onSuccess: () => {
            setOpenPublish(false);
            router.reload();
            toast.success("Evento publicado com sucesso!");
        },
    });

    const cancelAction = useAction({
        actionFn: actionErrorHandlingDecorator(patch),
        onSuccess: () => {
            setOpenCancel(false);
            router.reload();
            toast.error("O evento foi cancelado.");
        },
    });

    const loading = publishAction.loading || cancelAction.loading;

    const handlePublish = async () => {
        if (publishAction.loading) return;

        await publishAction.execute(routes.eventos.publish(), {
            id_evento: evento.id,
        });
    };

    const handleCancel = async () => {
        if (publishAction.loading) return;

        await cancelAction.execute(routes.eventos.cancel(), {
            id_evento: evento.id,
        });
    };

    return (
        <ManagerLayout title="Início">
            <div className="max-w-4xl mx-auto py-8 px-4 flex flex-col gap-8">
                <div className="bg-white border border-neutral-300 rounded-sm p-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-6 opacity-5 text-neutral-800 pointer-events-none hidden sm:block">
                        <RocketLaunchIcon size={140} weight="duotone" />
                    </div>

                    <div className="flex flex-col gap-4 max-w-xl">
                        <span className="inline-flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 rounded-full px-3 py-1 w-fit">
                            <CalendarCheckIcon size={14} weight="fill" /> Painel do Organizador
                        </span>
                        <h1 className="text-2xl sm:text-3xl font-black text-neutral-800 tracking-tight">Seja muito bem-vindo!</h1>
                        <p className="text-neutral-500 text-sm leading-relaxed">
                            Este é o seu centro de comando. Aqui você tem total liberdade para planejar, estruturar as atividades,
                            convidar ministrantes e gerenciar cada detalhe do seu evento de ponta a ponta.
                        </p>
                    </div>
                </div>

                <div className="bg-white border border-neutral-300 rounded-sm p-6 sm:p-8 flex flex-col gap-6">
                    <div className="flex flex-col gap-1">
                        <h2 className="font-bold text-neutral-800 text-lg">Status da Publicação</h2>
                        <p className="text-xs text-neutral-500">Controle a visibilidade do seu evento para o público geral.</p>
                    </div>

                    {evento?.is_cancelado ? (
                        <div className="rounded-sm bg-red-50 border border-red-200 p-4 flex items-start gap-4 text-red-700 text-sm">
                            <XCircleIcon size={20} weight="fill" className="shrink-0 text-red-500 mt-0.5" />
                            <div>
                                <span className="font-bold block">Este evento foi cancelado</span>
                                <p className="text-xs text-red-600/90 mt-0.5">
                                    Ele não aceita mais inscrições e exibe um aviso de cancelamento na página pública.
                                </p>
                            </div>
                        </div>
                    ) : evento?.is_publicado ? (
                        <div className="rounded-sm bg-emerald-50 border border-emerald-300 p-4 flex items-start gap-4 text-emerald-800 text-sm">
                            <CheckCircleIcon size={20} weight="fill" className="shrink-0 text-emerald-500 mt-0.5" />
                            <div>
                                <span className="font-bold block">Seu evento já está publicado e ativo!</span>
                                <p className="text-xs text-emerald-700 mt-1">
                                    O público já consegue visualizar a programação completa e realizar inscrições.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="rounded-sm bg-neutral-50 border border-neutral-300 p-4 flex items-start gap-4 text-neutral-600 text-sm">
                            <InfoIcon size={20} weight="duotone" className="shrink-0 text-neutral-500 mt-0.5" />
                            <div>
                                <span className="font-bold block text-neutral-800">Seu evento está em modo Rascunho</span>
                                <p className="text-xs text-neutral-500 mt-0.5">
                                    Até que você publique, apenas você e organizadores autorizados possuem acesso à página dele.
                                </p>
                            </div>
                        </div>
                    )}

                    {!evento?.is_cancelado && (
                        <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-neutral-100">
                            {!evento?.is_publicado && (
                                <button
                                    onClick={() => setOpenPublish(true)}
                                    className="rounded-sm bg-emerald-600 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-700 transition-all flex items-center gap-2"
                                >
                                    <MegaphoneIcon size={18} weight="bold" />
                                    Publicar Evento
                                </button>
                            )}

                            <button
                                onClick={() => setOpenCancel(true)}
                                className="rounded-sm border border-red-200 bg-white px-5 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 hover:border-red-300 transition-all flex items-center gap-2"
                            >
                                <XCircleIcon size={18} weight="bold" />
                                Cancelar Evento
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {openPublish && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/40 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white border border-neutral-300 rounded-sm max-w-md w-full p-6 shadow-xl flex flex-col gap-4">
                        <div className="w-12 h-12 rounded-sm bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
                            <MegaphoneIcon size={24} weight="duotone" />
                        </div>

                        <div className="flex flex-col gap-2">
                            <h3 className="font-black text-neutral-800 text-lg leading-tight">Quer publicar o evento agora?</h3>
                            <p className="text-sm text-neutral-500 leading-relaxed">
                                Se você confirmar, o evento será publicado para todos na plataforma imediatamente.{" "}
                                <strong className="text-neutral-700">Atenção:</strong> após publicado, o evento se torna
                                definitivo e não há como voltar ao estado de Rascunho, sendo possível apenas o cancelamento total
                                dele.
                            </p>
                        </div>

                        <div className="flex items-center gap-4 mt-2">
                            <button
                                disabled={loading}
                                onClick={handlePublish}
                                className="flex-1 rounded-sm bg-emerald-600 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50 transition-all"
                            >
                                {loading ? "Publicando..." : "Sim, publicar evento"}
                            </button>
                            <button
                                disabled={loading}
                                onClick={() => setOpenPublish(false)}
                                className="flex-1 rounded-sm border border-neutral-300 bg-white py-2 text-sm font-semibold text-neutral-600 hover:bg-neutral-50 disabled:opacity-50 transition-all"
                            >
                                Voltar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <Modal show={openCancel} onClose={handleCancel} maxWidth="md" center>
                <div className="flex flex-col gap-2">
                    <h3 className="font-black text-neutral-800 text-lg leading-tight">Tem certeza que deseja cancelar?</h3>
                    <p className="text-sm text-neutral-500 leading-relaxed">
                        Esta ação irá suspender as atividades e inscrições de forma permanente. O público continuará vendo a
                        página, mas com um aviso explícito de que o evento foi cancelado. Esta ação não poderá ser desfeita.
                    </p>
                </div>

                <div className="flex items-center gap-4 mt-2">
                    <button
                        disabled={loading}
                        onClick={handleCancel}
                        className="flex-1 rounded-sm bg-red-600 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50 transition-all"
                    >
                        {loading ? "Cancelando..." : "Sim, cancelar evento"}
                    </button>
                    <button
                        disabled={loading}
                        onClick={() => setOpenCancel(false)}
                        className="flex-1 rounded-sm border border-neutral-300 bg-white py-2 text-sm font-semibold text-neutral-600 hover:bg-neutral-50 disabled:opacity-50 transition-all"
                    >
                        Voltar
                    </button>
                </div>
            </Modal>
        </ManagerLayout>
    );
}
