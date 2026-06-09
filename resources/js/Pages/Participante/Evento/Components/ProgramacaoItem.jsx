import { store } from "@/Actions/store";
import { routes } from "@/api/routes";
import Modal from "@/Components/Modal";
import PrimaryButton from "@/Components/PrimaryButton";
import { useAction } from "@/Hooks/useAction";
import { actionErrorHandlingDecorator } from "@/util/actionErrorHandlingDecorator";
import { formatDate } from "@/util/formatDate";
import { router } from "@inertiajs/react";
import { CalendarBlankIcon, MapPinIcon, UserIcon, UsersIcon } from "@phosphor-icons/react";
import { ClockIcon } from "@phosphor-icons/react/dist/ssr";
import { useState } from "react";
import { toast } from "sonner";

export function ProgramacaoItem({ atividade, inscrito = false }) {
    const [open, setOpen] = useState(false);

    const inicio = formatDate(atividade.data_inicio, "DD/MM/YYYY HH:ii:ss", "HH:ii");
    const fim = formatDate(atividade.data_fim, "DD/MM/YYYY HH:ii:ss", "HH:ii");

    const ministrantes = atividade.ministrantes?.map((m) => m.nome).join(", ") || "";

    return (
        <>
            <button
                type="button"
                onClick={() => setOpen(true)}
                className="w-full bg-white border border-neutral-300 rounded-sm px-5 py-4 hover:border-emerald-300 hover:shadow-sm transition-colors text-left"
            >
                <div className="flex flex-col gap-2">
                    <div className="inline-flex items-center gap-2">
                        <span className="size-2 rounded-full bg-emerald-500" />

                        <span className="text-sm font-medium text-neutral-800">
                            {inicio} - {fim}
                        </span>
                    </div>

                    <div className="min-w-0">
                        <h3 className="font-medium text-lg text-neutral-800">{atividade.titulo}</h3>

                        <p className="text-sm text-neutral-500 mt-1">{ministrantes ? `${ministrantes}` : ""}</p>
                    </div>

                    {atividade.inscrito && (
                        <span className="px-2 py-1 text-xs font-medium bg-emerald-100 text-emerald-700 rounded-sm">Inscrito</span>
                    )}
                </div>
            </button>

            <AtividadeModal open={open} onClose={() => setOpen(false)} atividade={atividade} inscrito={inscrito} />
        </>
    );
}

function AtividadeModal({ open, onClose, atividade, inscrito = false }) {
    if (!atividade) return null;

    const inicio = formatDate(atividade.data_inicio, "DD/MM/YYYY HH:ii:ss", "HH:ii");
    const fim = formatDate(atividade.data_fim, "DD/MM/YYYY HH:ii:ss", "HH:ii");

    const data = new Date(atividade.data_inicio).toLocaleDateString("pt-BR", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    });

    const action = useAction({
        actionFn: actionErrorHandlingDecorator(store),
        onSuccess: () => {
            toast.success("Inscrição realizada com sucesso!");
            router.reload();
            onClose();
        },
    });

    const disabled = action.loading;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (disabled || inscrito) return;

        const payload = {
            id_atividade: atividade.id,
        };

        await action.execute(routes.inscricoes.atividades.store(), payload);
    };

    return (
        <Modal show={open} onClose={onClose} maxWidth="4xl">
            <div className="space-y-4">
                <div className="space-y-2">
                    <h2 className="text-3xl font-medium text-neutral-800 leading-tight">{atividade.titulo}</h2>

                    <div className="bg-neutral-100 rounded-sm px-4 py-3 flex flex-wrap gap-6 text-neutral-800 border border-neutral-300">
                        <div className="inline-flex items-center gap-2">
                            <CalendarBlankIcon size={18} />
                            <span>{data}</span>
                        </div>

                        <div className="inline-flex items-center gap-2">
                            <ClockIcon size={18} />
                            <span>
                                {inicio} às {fim}
                            </span>
                        </div>
                    </div>

                    <div className="inline-flex gap-4 items-center">
                        {atividade.ambiente && (
                            <div className="inline-flex items-center gap-2 text-neutral-800">
                                <MapPinIcon size={18} />
                                <span>{atividade.ambiente.nome}</span>
                            </div>
                        )}

                        <div className="inline-flex items-center gap-2 text-neutral-800">
                            <UsersIcon size={18} />
                            <span>
                                {0}/{atividade.limite_participantes} Inscritos
                            </span>
                        </div>
                    </div>
                </div>

                {atividade.ministrantes?.length > 0 && (
                    <div className="space-y-2">
                        <h3 className="text-xl font-medium text-neutral-800">Ministrantes</h3>

                        {atividade.ministrantes.map((ministrante) => (
                            <div key={ministrante.id} className="border border-neutral-300 rounded-sm p-4 flex gap-4 items-start">
                                <MinistranteIcon ministrante={ministrante} />

                                <div>
                                    <p className="font-medium text-neutral-800">{ministrante.nome}</p>
                                    <p className="text-sm text-neutral-500">{ministrante.email}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {atividade.descricao && (
                    <div className="space-y-2">
                        <h3 className="text-xl font-medium text-neutral-800">Resumo</h3>

                        <p className="text-sm text-neutral-500 leading-8 whitespace-pre-line">{atividade.descricao}</p>
                    </div>
                )}

                <div className="pt-6 flex items-center justify-between max-md:flex-col max-md:items-stretch max-md:gap-4">
                    {!inscrito && (
                        <PrimaryButton onClick={handleSubmit} disabled={disabled}>
                            Inscrever-se na atividade
                        </PrimaryButton>
                    )}
                </div>
            </div>
        </Modal>
    );
}

function MinistranteIcon({ ministrante }) {
    const initial = (ministrante?.nome?.charAt(0)?.toUpperCase() ?? "") + (ministrante?.nome?.charAt(1)?.toLowerCase() ?? "");

    return (
        <span className="w-fit min-w-10 min-h-10 flex items-center justify-center p-2 bg-blue-200 rounded-full font-bold text-neutral-800 cursor-default">
            {initial || "?"}
        </span>
    );
}
