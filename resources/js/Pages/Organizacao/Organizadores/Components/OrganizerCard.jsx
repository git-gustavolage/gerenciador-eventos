import { destroy } from "@/Actions/destroy";
import { routes } from "@/api/routes";
import DangerButton from "@/Components/DangerButton";
import Modal from "@/Components/Modal";
import SecondaryButton from "@/Components/SecondaryButton";
import { useAction } from "@/Hooks/useAction";
import { XIcon } from "@phosphor-icons/react";
import { useState } from "react";
import { toast } from "sonner";

export function OrganizerCard({ organizer = {}, reload = () => {} }) {
    const [open, setOpen] = useState(false);

    const action = useAction({
        actionFn: destroy,
        onSuccess: (res) => {
            toast.success("Oranizador removido com sucesso!");
            reload();
            setOpen(false);
        },
        onError: (err) => {
            toast.error(err?.message || "Erro ao remover organizador. Tente novamente.");
            reload();
        },
    });

    const disabled = action.loading;

    const handleRemove = async () => {
        if (disabled) return;

        await action.execute(routes.organizadores.destroy({ id: organizer.id }));
    };

    return (
        <>
            <div className="w-full group flex items-start gap-4 rounded-sm border border-neutral-300 bg-white p-4 transition-colors hover:border-neutral-400 cursor-pointer relative">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-lg font-semibold text-emerald-800">
                    {organizer.nome?.charAt(0).toUpperCase()}
                    {organizer.nome?.charAt(1).toLowerCase()}
                </div>

                <div className="min-w-0 flex-1">
                    <h2 className="truncate text-sm font-semibold text-neutral-800">{organizer.nome}</h2>

                    <p className="truncate text-xs text-neutral-500">{organizer.email}</p>

                    <span className="mt-1 inline-flex rounded-sm1 bg-neutral-100 px-2 py-1 text-xs font-medium capitalize text-neutral-8 mt 00">
                        {organizer.perfil}
                    </span>
                </div>

                {organizer.perfil !== "gestor" && (
                    <button
                        type="button"
                        onClick={() => setOpen(true)}
                        className="absolute top-2 right-2 opacity-0 transition-all text-neutral-400 group-hover:opacity-100 hover:bg-neutral-100 hover:text-neutral-600 p-2 rounded-sm"
                    >
                        <XIcon size={20} weight="bold" />
                    </button>
                )}
            </div>

            <Modal show={open} onClose={() => setOpen(false)} maxWidth="sm" center>
                <div className="space-y-4">
                    <h2 className="text-lg font-medium text-neutral-800">Remover {organizer.nome}</h2>

                    <div className="text-neutral-600">
                        <p>
                            <strong className="text-neutral-800">{organizer.nome}</strong> perderá acesso ao evento e não poderá
                            realizar nenhum alteração.
                        </p>
                        <p className="mt-2">Tem certeza que deseja prosseguir com esta ação?</p>
                    </div>

                    <div className="flex items-center gap-4 max-md:flex-col">
                        <DangerButton onClick={handleRemove} disabled={disabled}>
                            Remover
                        </DangerButton>
                        <SecondaryButton onClick={() => setOpen(false)}>Cancelar</SecondaryButton>
                    </div>
                </div>
            </Modal>
        </>
    );
}
