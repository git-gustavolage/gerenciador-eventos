import { MapPinIcon, UsersIcon, NotePencilIcon, CalendarSlashIcon } from "@phosphor-icons/react";
import { useState } from "react";
import { CancelAtividadeModal } from "./CancelAtividadeModal";
import { ModalEditAtividade } from "./ModalEditAtividade";

export function AtividadeCard({ atividade = {}, onSuccess }) {
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);

    const ministrante = atividade.ministrante ?? null;
    const inscritos = length.inscritos ?? [];

    const initial = ministrante?.nome?.charAt(0)?.toUpperCase() + ministrante?.nome?.charAt(1)?.toLowerCase() ?? "?";

    const handleDelete = () => {
        setShowCancelModal(true);
    };

    const handleClose = () => {
        setShowEditModal(false);
        setShowCancelModal(false);
    };

    const handleSuccess = () => {
        onSuccess();
    };

    return (
        <>
            <div className="bg-white border border-neutral-300 rounded-sm p-5 transition-all duration-200 hover:shadow-md shadow-neutral-300">
                <div className="w-full flex flex-col items-start justify-between">
                    <div className="w-full inline-flex items-center justify-between mb-2">
                        <span className="text-xs font-medium px-2 py-1 rounded-sm bg-emerald-100 text-emerald-800">
                            {atividade.tipo ?? "Palestra"}
                        </span>
                        <p className="font-semibold text-emerald-600">
                            {atividade.data_inicio.slice(11, 16)} - {atividade.data_fim.slice(11, 16)}
                        </p>
                    </div>

                    <h3 className="text-lg font-bold text-neutral-800 tracking-wide">{atividade.titulo}</h3>

                    {atividade.descricao && <p className="text-sm text-neutral-500 line-clamp-3">{atividade.descricao}</p>}
                </div>

                <div className="inline-flex gap-1 items-center text-neutral-600 my-4 px-2 bg-neutral-100 rounded-sm">
                    <MapPinIcon size={16} className="min-w-[18px]" />
                    {atividade?.ambiente && <span className="text-xs font-medium py-1">{atividade.ambiente?.nome}</span>}
                </div>

                {!!ministrante && (
                    <div className="flex flex-col mb-4">
                        <p className="text-sm text-neutral-800 font-medium mb-1">Ministrantes: </p>

                        <span
                            title={ministrante.nome}
                            className="w-fit min-w-10 min-h-10 flex items-center justify-center p-2 bg-blue-200 rounded-full font-bold text-neutral-800 cursor-default"
                        >
                            {initial}
                        </span>
                    </div>
                )}

                <div className="w-full inline-flex items-center justify-between border-t border-neutral-300 pt-3">
                    <div>
                        <div className="inline-flex gap-2 items-center text-neutral-600">
                            <UsersIcon size={20} className="min-w-[20px]" />
                            <span className="text-sm font-medium py-1">
                                {inscritos?.length}/{atividade.limite_participantes}
                            </span>
                        </div>
                    </div>

                    <div className="inline-flex gap-2 items-center justify-start">
                        <div className="relative group">
                            <button
                                onClick={() => setShowEditModal(true)}
                                className="p-1.5 bg-neutral-100 rounded-sm text-neutral-600 hover:bg-neutral-200 focus:ring-1 focus:ring-neutral-300"
                            >
                                <NotePencilIcon size={18} />
                            </button>

                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 translate-y-1 mb-2 px-2 py-1 text-xs text-white bg-neutral-900 rounded whitespace-nowrap opacity-0 pointer-events-none transition-all duration-200 group-focus-within:opacity-100 group-focus-within:translate-y-0 group-hover:opacity-100 group-hover:translate-y-0">
                                Editar
                                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-neutral-900" />
                            </div>
                        </div>

                        <div className="relative group">
                            <button
                                onClick={handleDelete}
                                className="p-1.5 bg-neutral-100 rounded-sm text-red-600 hover:bg-red-200 focus:ring-1 focus:ring-red-300"
                            >
                                <CalendarSlashIcon size={18} />
                            </button>

                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 translate-y-1 mb-2 px-2 py-1 text-xs text-white bg-neutral-900 rounded whitespace-nowrap opacity-0 pointer-events-none transition-all duration-200 group-focus-within:opacity-100 group-focus-within:translate-y-0 group-hover:opacity-100 group-hover:translate-y-0">
                                Cancelar
                                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-neutral-900" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {showEditModal && atividade && (
                <ModalEditAtividade open={showEditModal} atividade={atividade} onClose={handleClose} onSuccess={handleSuccess} />
            )}

            <CancelAtividadeModal
                atividade={atividade}
                show={showCancelModal}
                onClose={() => setShowCancelModal(false)}
                onSuccess={handleSuccess}
            />
        </>
    );
}
