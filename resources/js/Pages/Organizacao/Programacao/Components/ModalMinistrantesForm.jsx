import { destroy } from "@/Actions/destroy";
import { store } from "@/Actions/store";
import { routes } from "@/api/routes";
import Modal from "@/Components/Modal";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import { useAction } from "@/Hooks/useAction";
import { actionErrorHandlingDecorator } from "@/util/actionErrorHandlingDecorator";
import { Link, usePage } from "@inertiajs/react";
import { PlusIcon, UserIcon } from "@phosphor-icons/react";
import { toast } from "sonner";

export function ModalMinistrantesForm({ atividade = {}, show, onClose, onSuccess }) {
    const { ministrantes = [] } = usePage().props;

    const storeAction = useAction({
        actionFn: actionErrorHandlingDecorator(store),
        onSuccess: () => {
            toast.success("Ministrante adicionado com sucesso.");
            onSuccess?.();
        },
    });

    const destroyAction = useAction({
        actionFn: actionErrorHandlingDecorator(destroy),
        onSuccess: () => {
            toast.success("Ministrante removido com sucesso.");
            onSuccess?.();
        },
    });

    const vinculados = atividade.ministrantes ?? [];

    const isVinculado = (idMinistrante) => {
        return vinculados.some((m) => m.id === idMinistrante);
    };

    const handleAdd = async (idMinistrante) => {
        if (atividade.is_cancelada) {
            toast.info("Não é possível alterar atividades canceladas.");
        }
        await storeAction.execute(routes.atividades.addMinistrante(), {
            id_atividade: atividade.id,
            id_ministrante: idMinistrante,
        });
    };

    const handleRemove = async (idMinistrante) => {
        if (atividade.is_cancelada) {
            toast.info("Não é possível alterar atividades canceladas.");
        }
        await destroyAction.execute(routes.atividades.removeMinistrante(), {
            id_atividade: atividade.id,
            id_ministrante: idMinistrante,
        });
    };

    const handleClose = () => {
        onClose();
    };

    return (
        <Modal show={show} onClose={handleClose}>
            <div className="space-y-4">
                <div className="space-y-1">
                    <h2 className="text-xl font-semibold text-neutral-800">Ministrantes da atividade</h2>

                    <p className="text-sm text-neutral-500">Adicione ou remova ministrantes vinculados a esta atividade.</p>
                </div>

                <div>
                    <Link
                        href={route("eventos.organizacao.ministrantes")}
                        className="text-sm text-emerald-500 hover:underline inline-flex items-center gap-1 hover:text-emerald-700"
                    >
                        <PlusIcon /> Cadastrar novo ministrante
                    </Link>
                </div>

                <div className="mt-6 max-h-[500px] overflow-y-auto space-y-3">
                    {ministrantes.map((ministrante) => {
                        const vinculado = isVinculado(ministrante.id);

                        return (
                            <div
                                key={ministrante.id}
                                className="flex items-center justify-between rounded-sm border border-neutral-300 bg-white p-4"
                            >
                                <div className="flex items-center gap-4">
                                    {ministrante.image_url ? (
                                        <img
                                            src={ministrante.image_url}
                                            alt={ministrante.nome}
                                            className="h-12 w-12 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-lg font-semibold text-emerald-700">
                                            {ministrante.nome?.charAt(0)?.toUpperCase()}
                                            {ministrante.nome?.charAt(1)?.toLowerCase()}
                                        </div>
                                    )}

                                    <div>
                                        <div className="font-medium text-neutral-900">{ministrante.nome}</div>

                                        <div className="text-sm text-neutral-500">{ministrante.email}</div>
                                    </div>
                                </div>

                                {vinculado ? (
                                    <SecondaryButton
                                        type="button"
                                        disabled={destroyAction.loading}
                                        onClick={() => handleRemove(ministrante.id)}
                                    >
                                        Remover
                                    </SecondaryButton>
                                ) : (
                                    <PrimaryButton
                                        type="button"
                                        disabled={storeAction.loading}
                                        onClick={() => handleAdd(ministrante.id)}
                                    >
                                        Adicionar
                                    </PrimaryButton>
                                )}
                            </div>
                        );
                    })}

                    {ministrantes.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <UserIcon size={40} className="text-neutral-400" />

                            <span className="mt-3 text-neutral-500">Nenhum ministrante cadastrado.</span>
                        </div>
                    )}
                </div>

                <div className="mt-6 flex justify-end">
                    <SecondaryButton onClick={handleClose}>Fechar</SecondaryButton>
                </div>
            </div>
        </Modal>
    );
}
