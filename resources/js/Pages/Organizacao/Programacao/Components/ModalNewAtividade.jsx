import Modal from "@/Components/Modal";
import useData from "@/Hooks/useData";
import { usePage } from "@inertiajs/react";
import { toast } from "sonner";
import { useAction } from "@/Hooks/useAction";
import { store } from "@/Actions/store";
import { actionErrorHandlingDecorator } from "@/util/actionErrorHandlingDecorator";
import { routes } from "@/api/routes";
import { Menu } from "@/Components/Menu";
import { FormAtividadeAmbiente } from "./FormAtividadeAmbiente";
import { FormAtividadeGeneral } from "./FormAtividadeGeneral";

export default function ModalNewAtividade({ open, onClose, onSuccess }) {
    const { current_evento_id } = usePage().props.auth;

    const [data, setData, clear] = useData({
        id_evento: current_evento_id,
        titulo: "",
        descricao: "",
        id_ambiente: "",
        data_inicio: "",
        data_fim: "",
        limite_participantes: 1,
    });

    const action = useAction({
        actionFn: actionErrorHandlingDecorator(store),
        onSuccess: () => {
            toast.success("Atividade cadastrada com sucesso!");
            clear();
            onClose();
            onSuccess?.();
        },
    });

    function handleClose() {
        onClose();
        clear();
    }

    const disabled =
        action.loading || !data.titulo || !data.data_inicio || !data.data_fim || !data.id_ambiente || !data.id_evento;

    async function handleSubmit(e) {
        e.preventDefault();

        if (disabled) return;

        const payload = {
            ...data,
        };

        await action.execute(routes.atividades.store(), payload);
    }

    return (
        <Modal show={open} onClose={handleClose} maxWidth="4xl">
            <div className="space-y-4">
                <div>
                    <h2 className="text-lg font-medium text-neutral-800">Nova atividade</h2>

                    <p className="mt-1 text-neutral-600">Preencha os dados da atividade.</p>
                </div>

                <Menu>
                    <Menu.Tab label="Dados gerais">
                        <FormAtividadeGeneral
                            data={data}
                            setData={setData}
                            errors={action.error?.errors}
                            onClose={handleClose}
                            loading={action.loading}
                        />
                    </Menu.Tab>

                    <Menu.Tab label="Ambiente">
                        <FormAtividadeAmbiente
                            data={data}
                            setData={setData}
                            errors={action.error?.errors}
                            onClose={handleClose}
                            onSubmit={handleSubmit}
                            loading={action.loading}
                        />
                    </Menu.Tab>
                </Menu>
            </div>
        </Modal>
    );
}
