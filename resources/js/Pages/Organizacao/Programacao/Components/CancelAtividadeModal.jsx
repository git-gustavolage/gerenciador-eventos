import { update } from "@/Actions/update";
import { routes } from "@/api/routes";
import DangerButton from "@/Components/DangerButton";
import Modal from "@/Components/Modal";
import SecondaryButton from "@/Components/SecondaryButton";
import { useAction } from "@/Hooks/useAction";
import { actionErrorHandlingDecorator } from "@/util/actionErrorHandlingDecorator";
import { toast } from "sonner";

export function CancelAtividadeModal({ atividade = {}, show, onClose = () => {}, onSuccess = () => {} }) {
    const action = useAction({
        actionFn: actionErrorHandlingDecorator(update),
        onSuccess: () => {
            toast.success("Atividade cancelada.");
            onClose();
            onSuccess();
        },
    });

    const disabled = !atividade.id || action.loading;

    const handleSubmit = async (e) => {
        e.preventDefault();

        await action.execute(routes.atividades.cancel(atividade.id));
    };

    return (
        <Modal show={show} onClose={onClose} maxWidth="sm" center>
            <form onSubmit={handleSubmit} className="space-y-4">
                <h2 className="text-lg font-bold text-neutral-800">Cancelar a atividade</h2>

                <div className="text-neutral-600">
                    <p>
                        A atividade <strong className="text-neutral-800">"{atividade.titulo}"</strong> será cancelada.
                    </p>
                    <p className="mt-2">Esta ação não pode ser desfeita.</p>
                    <p className="mt-2">Tem certeza que deseja prosseguir com esta ação?</p>
                </div>

                <div className="flex items-center gap-4">
                    <DangerButton disabled={disabled}>Cancelar atividade</DangerButton>
                    <SecondaryButton onClick={onClose}>Fechar</SecondaryButton>
                </div>
            </form>
        </Modal>
    );
}
