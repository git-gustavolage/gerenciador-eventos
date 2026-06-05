import { destroy } from "@/Actions/destroy";
import { routes } from "@/api/routes";
import DangerButton from "@/Components/DangerButton";
import Modal from "@/Components/Modal";
import SecondaryButton from "@/Components/SecondaryButton";
import { useAction } from "@/Hooks/useAction";
import { actionErrorHandlingDecorator } from "@/util/actionErrorHandlingDecorator";
import { XIcon } from "@phosphor-icons/react";
import { useState } from "react";
import { toast } from "sonner";

export function PendingInviteCard({ convite = {}, reload = () => {} }) {
    const [open, setOpen] = useState(false);

    const action = useAction({
        actionFn: actionErrorHandlingDecorator(destroy),
        onSuccess: (res) => {
            toast.success("Convite cancelado com sucesso!");
            reload();
            setOpen(false);
        },
    });

    const disabled = action.loading;

    const handleCancelInvite = async () => {
        if (disabled) return;

        await action.execute(routes.convites.cancel({ id: convite.id }));
    };

    return (
        <>
            <div
                className={`w-full group flex items-start gap-4 rounded-sm border bg-white p-4 transition-colors relative ${convite.expirado ? "border-orange-300 bg-orange-50/30" : "border-neutral-300 hover:border-neutral-400"}`}
            >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-lg font-semibold text-neutral-600">
                    {convite.email?.charAt(0).toUpperCase()}
                    {convite.email?.charAt(1).toLowerCase()}
                </div>

                <div className="min-w-0 flex-1">
                    <h2 className="truncate text-sm font-semibold text-neutral-800">{convite.email}</h2>

                    <p className="truncate text-xs text-neutral-500">Convite enviado em {convite.created_at}</p>

                    <div className="mt-2 flex items-center gap-2">
                        <span
                            className={`inline-flex rounded-sm px-2 py-1 text-xs font-medium ${
                                convite.expirado ? "bg-orange-100 text-orange-700" : "bg-blue-100 text-blue-700"
                            }`}
                        >
                            {convite.expirado ? "Expirado" : "Pendente"}
                        </span>

                        {convite.expirado && <span className="text-xs text-neutral-500">Necessário reenviar convite</span>}
                    </div>
                </div>

                <button
                    type="button"
                    onClick={() => setOpen(true)}
                    className="absolute top-2 right-2 opacity-0 transition-all text-neutral-400 group-hover:opacity-100 hover:bg-neutral-100 hover:text-neutral-600 p-2 rounded-sm"
                >
                    <XIcon size={20} weight="bold" />
                </button>
            </div>

            <Modal show={open} onClose={() => setOpen(false)} maxWidth="sm" center>
                <div className="space-y-4">
                    <h2 className="text-lg font-medium text-neutral-800">Cancelar convite</h2>

                    <div className="text-neutral-600">
                        <p>
                            O convite enviado para <strong className="text-neutral-800">{convite.email}</strong> será invalidado.
                        </p>

                        <p className="mt-2">O destinatário não poderá mais utilizar o link recebido.</p>
                    </div>

                    <div className="flex items-center gap-4 max-md:flex-col">
                        <DangerButton onClick={handleCancelInvite} disabled={disabled}>
                            Cancelar convite
                        </DangerButton>

                        <SecondaryButton onClick={() => setOpen(false)}>Fechar</SecondaryButton>
                    </div>
                </div>
            </Modal>
        </>
    );
}
