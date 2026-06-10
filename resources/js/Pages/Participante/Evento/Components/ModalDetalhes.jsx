import { store } from "@/Actions/store";
import { routes } from "@/api/routes";
import Modal from "@/Components/Modal";
import PrimaryButton from "@/Components/PrimaryButton";
import { useAction } from "@/Hooks/useAction";
import { actionErrorHandlingDecorator } from "@/util/actionErrorHandlingDecorator";
import { formatDate } from "@/util/formatDate";
import { router } from "@inertiajs/react";
import { CalendarBlankIcon, CheckCircleIcon, ClockIcon, MapPinIcon, UsersIcon } from "@phosphor-icons/react";
import { toast } from "sonner";

export function ModalDetalhes({ open, onClose, atividade, inscrito = false }) {
    if (!atividade) return null;

    const inscricoes = atividade.inscricoes ?? [];

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
                <div className="border-b border-neutral-300 pb-4">
                    <h2 className="text-xl font-semibold text-neutral-800">{atividade.titulo}</h2>

                    <div className="mt-4 flex flex-wrap gap-2">
                        <div className="inline-flex items-center gap-2 rounded-sm bg-neutral-100 px-4 py-2 text-sm">
                            <CalendarBlankIcon size={16} />
                            <span>{data}</span>
                        </div>

                        <div className="inline-flex items-center gap-2 rounded-sm bg-neutral-100 px-4 py-2 text-sm">
                            <ClockIcon size={16} />
                            <span>
                                {inicio} às {fim}
                            </span>
                        </div>

                        <div className="inline-flex items-center gap-2 rounded-sm bg-neutral-100 px-4 py-2 text-sm">
                            <UsersIcon size={16} />
                            <span>
                                {inscricoes.length}/{atividade.limite_participantes}
                            </span>
                        </div>

                        {atividade.ambiente && (
                            <div className="inline-flex items-center gap-2 rounded-sm bg-emerald-100 px-4 py-2 text-sm font-medium text-emerald-700">
                                <MapPinIcon size={16} />
                                <span>{atividade.ambiente.nome}</span>
                            </div>
                        )}
                    </div>
                </div>

                {atividade.ministrantes?.length > 0 && (
                    <section>
                        <h3 className="text-lg font-semibold text-neutral-800">Ministrantes</h3>

                        <div className="w-full flex flex-col items-center divide-y divide-neutral-300">
                            {atividade.ministrantes.map((ministrante) => (
                                <div key={ministrante.id} className="w-full flex items-center gap-2 py-4">
                                    <MinistranteIcon ministrante={ministrante} />

                                    <div>
                                        <p className="font-medium text-neutral-800">{ministrante.nome}</p>
                                        <p className="text-sm text-neutral-500">{ministrante.email}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {atividade.descricao && (
                    <section className="space-y-2">
                        <h3 className="text-lg font-semibold text-neutral-800">Resumo</h3>

                        <p className="whitespace-pre-line leading-8 text-neutral-500">{atividade.descricao}</p>
                    </section>
                )}

                {inscrito && (
                    <div className="inline-flex items-center gap-2 rounded-sm bg-green-100 px-4 py-2 text-sm font-medium text-green-700">
                        <CheckCircleIcon size={16} weight="fill" />
                        <span>Você está inscrito</span>
                    </div>
                )}

                {!inscrito && (
                    <div className="border-t border-neutral-300 pt-6 flex justify-start">
                        <PrimaryButton onClick={handleSubmit} disabled={disabled}>
                            Inscrever-se na atividade
                        </PrimaryButton>
                    </div>
                )}
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
