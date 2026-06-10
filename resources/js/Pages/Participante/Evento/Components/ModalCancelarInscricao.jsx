import Modal from "@/Components/Modal";
import DangerButton from "@/Components/DangerButton";
import SecondaryButton from "@/Components/SecondaryButton";

export function ModalCancelarInscricao({ open, onClose, atividade, onConfirm, loading = false }) {
    return (
        <Modal show={open} onClose={onClose} center maxWidth="md">
            <div className="space-y-4">
                <h2 className="text-lg font-semibold text-neutral-900">Cancelar inscrição</h2>

                <p className="text-sm text-neutral-600">
                    Deseja realmente cancelar sua inscrição na atividade <strong>{atividade?.titulo}</strong>?
                </p>

                <div className="flex gap-3">
                    <DangerButton onClick={onConfirm} disabled={loading}>
                        Confirmar cancelamento
                    </DangerButton>

                    <SecondaryButton onClick={onClose} disabled={loading}>
                        Voltar
                    </SecondaryButton>
                </div>
            </div>
        </Modal>
    );
}
