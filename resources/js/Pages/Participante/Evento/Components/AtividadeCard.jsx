import { ClockIcon, MapPinIcon, UserIcon } from "@phosphor-icons/react";
import { useState } from "react";
import Modal from "@/Components/Modal";

export function AtividadeCard({ atividade }) {
    const [open, setOpen] = useState(false);

    const inicio = atividade.data_inicio?.slice(11, 16);
    const fim = atividade.data_fim?.slice(11, 16);

    const ministrante = atividade.ministrantes?.map((m) => m.nome).join(", ") || "Não informado";

    return (
        <>
            <button
                type="button"
                onClick={() => setOpen(true)}
                className="w-full p-4 bg-white border border-neutral-300 rounded-sm hover:border-emerald-300 hover:bg-neutral-50 transition-all text-left"
            >
                <div className="grid grid-cols-[120px_1fr_auto] gap-6 items-center max-md:grid-cols-1">
                    <div className="inline-flex items-center gap-2 font-medium text-neutral-700">
                        <ClockIcon size={16} />
                        {inicio} - {fim}
                    </div>

                    <div className="space-y-2">
                        <h3 className="font-semibold text-neutral-900">{atividade.titulo}</h3>

                        <div className="flex flex-wrap gap-4 text-sm text-neutral-500">
                            <span className="inline-flex items-center gap-1">
                                <UserIcon size={14} />
                                {ministrante}
                            </span>

                            <span className="inline-flex items-center gap-1">
                                <MapPinIcon size={14} />
                                {atividade.ambiente?.nome}
                            </span>
                        </div>
                    </div>

                    {atividade.inscrito && (
                        <span className="px-3 py-1 text-xs bg-emerald-100 text-emerald-700 rounded-sm font-medium">Inscrito</span>
                    )}
                </div>
            </button>

            <AtividadeModal open={open} onClose={() => setOpen(false)} atividade={atividade} />
        </>
    );
}

function AtividadeModal({ open, onClose, atividade }) {
    if (!atividade) return null;

    const ministrantes = atividade.ministrantes?.map((m) => m.nome).join(", ") || "Não informado";

    return (
        <Modal show={open} onClose={onClose}>
            <div className="p-6 space-y-6">
                <div>
                    <h2 className="text-2xl font-semibold text-neutral-900">{atividade.titulo}</h2>

                    <p className="text-neutral-500 mt-1">
                        {atividade.data_inicio} - {atividade.data_fim}
                    </p>
                </div>

                {atividade.descricao && (
                    <div>
                        <h3 className="font-medium text-neutral-900 mb-2">Descrição</h3>

                        <p className="text-neutral-600 leading-relaxed">{atividade.descricao}</p>
                    </div>
                )}

                <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
                    <InfoItem label="Local" value={atividade.ambiente?.nome || "Não informado"} />

                    <InfoItem label="Capacidade" value={atividade.limite_participantes || "Livre"} />

                    <InfoItem label="Ministrante(s)" value={ministrantes} />

                    <InfoItem label="Horário" value={`${atividade.data_inicio} - ${atividade.data_fim}`} />
                </div>
            </div>
        </Modal>
    );
}

function InfoItem({ label, value }) {
    return (
        <div className="border border-neutral-200 rounded-sm p-4">
            <p className="text-xs uppercase tracking-wide text-neutral-500">{label}</p>

            <p className="mt-1 text-neutral-800 font-medium">{value}</p>
        </div>
    );
}
