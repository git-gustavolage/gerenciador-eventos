import { useMemo } from "react";
import { useMenu } from "@/Components/Menu";
import PrimaryButton from "@/Components/PrimaryButton";
import { PlusIcon, TrashIcon } from "@phosphor-icons/react";
import { useState } from "react";
import { useAction } from "@/Hooks/useAction";
import { destroy } from "@/Actions/destroy";
import { actionErrorHandlingDecorator } from "@/util/actionErrorHandlingDecorator";
import { routes } from "@/api/routes";
import Modal from "@/Components/Modal";
import SecondaryButton from "@/Components/SecondaryButton";
import DangerButton from "@/Components/DangerButton";
import { toast } from "sonner";
import { router } from "@inertiajs/react";

export function CronogramaSection({ inscricoes = [] }) {
    const { setMenuIndex } = useMenu();

    const handleOpenProgramacao = () => {
        setMenuIndex(1);
    };

    const inscricoesAgrupadas = useMemo(() => {
        const parseDate = (dateString) => {
            const [date, time] = dateString.split(" ");
            const [day, month, year] = date.split("/");
            const [hour, minute, second] = time.split(":");

            return new Date(year, month - 1, day, hour, minute, second);
        };

        const ordenadas = [...inscricoes].sort((a, b) => {
            return parseDate(a.atividade.data_inicio) - parseDate(b.atividade.data_inicio);
        });

        return ordenadas.reduce((groups, inscricao) => {
            const [dia] = inscricao.atividade.data_inicio.split(" ");

            if (!groups[dia]) {
                groups[dia] = [];
            }

            groups[dia].push(inscricao);

            return groups;
        }, {});
    }, [inscricoes]);

    if (inscricoes.length === 0) {
        return (
            <section className="bg-white border border-neutral-300 rounded-sm">
                <div className="flex flex-col items-center justify-center px-8 py-16 text-center">
                    <div className="size-16 rounded-full bg-neutral-100 flex items-center justify-center mb-4">
                        <PlusIcon size={28} className="text-neutral-500" />
                    </div>

                    <h2 className="text-lg font-semibold text-neutral-800">Nenhuma atividade adicionada ao seu cronograma</h2>

                    <p className="max-w-md mt-2 text-sm text-neutral-500">
                        Explore a programação do evento e inscreva-se nas atividades de seu interesse. As atividades escolhidas
                        aparecerão aqui organizadas por dia e horário.
                    </p>

                    <div className="mt-6">
                        <PrimaryButton onClick={handleOpenProgramacao}>
                            <PlusIcon />
                            Explorar atividades
                        </PrimaryButton>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="bg-white border border-neutral-300 rounded-sm">
            <div className="p-5 border-b border-neutral-300">
                <h2 className="text-xl font-semibold text-neutral-800">Minhas atividades</h2>

                <p className="text-sm text-neutral-500 mt-1">Gerencie as atividades nas quais você está inscrito.</p>
            </div>

            <div>
                {Object.entries(inscricoesAgrupadas).map(([dia, inscricoesDia]) => (
                    <div key={dia}>
                        <div className="px-5 py-3 bg-neutral-50 border-b border-neutral-300">
                            <h3 className="font-medium text-neutral-700">
                                {new Date(dia.split("/").reverse().join("-")).toLocaleDateString("pt-BR", {
                                    weekday: "long",
                                    day: "2-digit",
                                    month: "long",
                                })}
                            </h3>
                        </div>

                        <div className="divide-y divide-neutral-300">
                            {inscricoesDia.map((inscricao) => (
                                <InscricaoCard key={inscricao.id} inscricao={inscricao} />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

function InscricaoCard({ inscricao }) {
    const inicio = inscricao.atividade.data_inicio.slice(11, 16);
    const fim = inscricao.atividade.data_fim.slice(11, 16);

    const [confirmandoCancelamento, setConfirmandoCancelamento] = useState(false);

    const action = useAction({
        actionFn: actionErrorHandlingDecorator(destroy),
        onSuccess: () => {
            toast.info("Inscrição cancelada com sucesso.");
            router.reload({ only: ["inscricoes"] });
            setConfirmandoCancelamento(false);
        },
    });

    const disabled = action.loading || !inscricao.id;

    const handleDelete = async () => {
        if (disabled) return;

        await action.execute(routes.inscricoes.atividades.destroy(), { id_inscricao: inscricao.id });
    };

    return (
        <>
            <div className="p-5">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <h4 className="font-medium text-neutral-800">{inscricao.atividade.titulo}</h4>

                        <p className="text-sm text-neutral-500 mt-1">
                            {inicio} às {fim}
                        </p>

                        {inscricao.atividade.descricao && (
                            <p className="text-sm text-neutral-500 mt-2">{inscricao.atividade.descricao}</p>
                        )}
                    </div>

                    <SecondaryButton onClick={() => setConfirmandoCancelamento(true)}>
                        <TrashIcon />
                        Cancelar inscrição
                    </SecondaryButton>
                </div>
            </div>

            <Modal show={confirmandoCancelamento} onClose={() => setConfirmandoCancelamento(false)} center maxWidth="md">
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-neutral-900">Cancelar inscrição</h2>

                    <p className="mt-2 text-sm text-neutral-600">
                        Deseja realmente cancelar sua inscrição na atividade <strong>{inscricao.atividade.titulo}</strong>?
                    </p>

                    <div className="space-x-4">
                        <DangerButton onClick={handleDelete} disabled={disabled}>
                            Confirmar cancelamento
                        </DangerButton>

                        <SecondaryButton onClick={() => setConfirmandoCancelamento(false)}>Voltar</SecondaryButton>
                    </div>
                </div>
            </Modal>
        </>
    );
}
