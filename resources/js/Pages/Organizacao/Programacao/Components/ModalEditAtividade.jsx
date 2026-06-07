import Modal from "@/Components/Modal";
import useData from "@/Hooks/useData";
import { usePage } from "@inertiajs/react";
import { toast } from "sonner";
import { useAction } from "@/Hooks/useAction";
import { actionErrorHandlingDecorator } from "@/util/actionErrorHandlingDecorator";
import { update } from "@/Actions/update";
import { routes } from "@/api/routes";
import { formatDate } from "@/util/formatDate";
import { Menu } from "@/Components/Menu";
import { FormAtividadeAmbiente } from "./FormAtividadeAmbiente";
import { FormAtividadeGeneral } from "./FormAtividadeGeneral";

export function ModalEditAtividade({ atividade = {}, open, onClose, onSuccess }) {
    const { current_evento_id } = usePage().props.auth;

    const [data, setData, clear] = useData({
        id_evento: current_evento_id,
        titulo: atividade?.titulo ?? "",
        descricao: atividade?.descricao ?? "",
        id_ambiente: atividade?.ambiente?.id ?? "",
        data_inicio: atividade ? formatDate(atividade.data_inicio, "DD/MM/YYYY HH:ii:ss", "YYYY-MM-DD HH:ii:ss") : "",
        data_fim: atividade ? formatDate(atividade.data_fim, "DD/MM/YYYY HH:ii:ss", "YYYY-MM-DD HH:ii:ss") : "",
        limite_participantes: atividade?.limite_participantes ?? "",
    });

    const action = useAction({
        actionFn: actionErrorHandlingDecorator(update),
        onSuccess: () => {
            onSuccess?.();
            toast.success("Atividade atualizada com sucesso!");
            clear();
            onClose();
        },
    });

    function handleClose() {
        clear();
        onClose();
    }

    const loading = action.loading;
    const disabled = loading;

    async function handleSubmit(e) {
        e.preventDefault();

        if (disabled) return;

        const payload = {
            ...data,
        };

        await action.execute(routes.atividades.update({ id: atividade.id }), payload);
    }

    return (
        <Modal show={open} onClose={handleClose} maxWidth="4xl">
            <div className="space-y-4">
                <div>
                    <h2 className="text-lg font-medium text-neutral-800">Editar atividade</h2>

                    <p className="mt-1 text-neutral-600">Atualize os dados da atividade.</p>
                </div>

                <Menu>
                    <Menu.Tab label="Dados gerais">
                        <FormAtividadeGeneral
                            data={data}
                            setData={setData}
                            editing
                            errors={action.error?.errors}
                            onClose={handleClose}
                            onSubmit={handleSubmit}
                            loading={loading}
                        />
                    </Menu.Tab>

                    <Menu.Tab label="Ambiente">
                        <FormAtividadeAmbiente
                            data={data}
                            setData={setData}
                            editing
                            errors={action.error?.errors}
                            onClose={handleClose}
                            onSubmit={handleSubmit}
                            loading={loading}
                        />
                    </Menu.Tab>
                </Menu>
            </div>
        </Modal>
    );
}
