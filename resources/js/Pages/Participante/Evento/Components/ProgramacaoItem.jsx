import { formatDate } from "@/util/formatDate";
import { useState } from "react";
import { ModalDetalhes } from "./ModalDetalhes";
import { CheckCircleIcon, MapPinIcon } from "@phosphor-icons/react";

export function ProgramacaoItem({ atividade, inscrito = false }) {
    const [open, setOpen] = useState(false);

    const inicio = formatDate(atividade.data_inicio, "DD/MM/YYYY HH:ii:ss", "HH:ii");
    const fim = formatDate(atividade.data_fim, "DD/MM/YYYY HH:ii:ss", "HH:ii");

    return (
        <>
            <button
                type="button"
                onClick={() => setOpen(true)}
                className="w-full rounded-sm border border-neutral-300 bg-white px-5 py-4 text-left transition-all hover:border-emerald-400 hover:bg-neutral-50 hover:shadow-sm outline-none"
            >
                <div className="flex items-center justify-between gap-4 max-md:flex-col">
                    <div className="w-full flex flex-col gap-2">
                        <div className="min-w-0 flex-1">
                            <div className="inline-flex items-center gap-2 text-sm">
                                <span className="size-2 rounded-full bg-emerald-500" />

                                <span className="font-medium text-neutral-800">
                                    {inicio} - {fim}
                                </span>
                                <span className="font-medium text-neutral-800">{atividade.titulo}</span>
                            </div>
                        </div>

                        <div className="min-w-0 flex-1">
                            <div className="inline-flex items-center gap-2 text-sm">
                                <MapPinIcon />
                                <span className="text-neutral-500">{atividade?.ambiente?.nome}</span>
                            </div>
                        </div>
                    </div>

                    {inscrito && (
                        <div className="inline-flex items-center gap-2 text-sm text-neutral-800 font-medium max-md:w-full max-md:justify-start">
                            <CheckCircleIcon size={24} weight="fill" className="shrink-0 text-emerald-500" />
                            Inscrito
                        </div>
                    )}
                </div>
            </button>

            <ModalDetalhes open={open} onClose={() => setOpen(false)} atividade={atividade} inscrito={inscrito} />
        </>
    );
}
