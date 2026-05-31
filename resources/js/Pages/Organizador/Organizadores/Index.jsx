import { convitesRoutes, organizadoresRoutes } from "@/api/routes";
import SecondaryButton from "@/Components/SecondaryButton";
import useApi from "@/Hooks/useApi";
import ManagerLayout from "@/Layouts/ManagerLayout";
import { PlusIcon } from "@phosphor-icons/react/dist/ssr";
import { OrganizerCard } from "../Components/OrganizerCard";
import Modal from "@/Components/Modal";
import { useState } from "react";
import PrimaryButton from "@/Components/PrimaryButton";
import InputLabel from "@/Components/Inputs/InputLabel";
import { Input } from "@/Components/Inputs/Input";
import useData from "@/Hooks/useData";
import { useAction } from "@/Hooks/useAction";
import { store } from "@/Actions/store";
import { toast } from "sonner";
import { usePage } from "@inertiajs/react";
import InputError from "@/Components/Inputs/InputError";

export default function Index({ evento = {} }) {
    const { data, reload } = useApi(organizadoresRoutes.index(), { id_evento: evento.id });

    const organizadores = data?.data ?? [];

    const [open, setOpen] = useState(false);

    return (
        <>
            <ManagerLayout title="Pessoal" defaultSidebarOpen>
                <div className="p-8 flex flex-col gap-8">
                    <div className="p-4 border border-neutral-300 rounded-sm bg-white">
                        <SecondaryButton onClick={() => setOpen(true)}>
                            Adicionar pessoas
                            <PlusIcon size={20} />
                        </SecondaryButton>
                    </div>

                    <div className="grid grid-cols-3 max-md:grid-cols-1 gap-4">
                        {organizadores.map((organizador) => (
                            <OrganizerCard key={organizador.id} organizer={organizador} reload={reload} />
                        ))}
                    </div>
                </div>
            </ManagerLayout>

            <InviteOrganizer open={open} onClose={() => setOpen(false)} />
        </>
    );
}

function InviteOrganizer({ open, onClose }) {
    const id_evento = usePage().props.auth.current_evento_id;

    const [data, setData, clear] = useData({
        email: "",
    });

    const action = useAction({
        actionFn: store,
        onSuccess: () => {
            toast.success("Link enviado!");
            clear();
            onClose();
        },
        onError: (err) => {
            toast.error(err.message || "Erro ao enivar o link. Tente novamente.");
        },
    });

    const disabled = action.loading || !data.email;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (disabled) return;

        const payload = {
            id_evento,
            email: data.email,
        };

        await action.execute(convitesRoutes.invite(), payload);
    };

    const handleClose = () => {
        clear();
        onClose();
    };

    return (
        <Modal show={open} onClose={handleClose}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <h2 className="text-lg font-medium text-neutral-800">Convidar novo organizador</h2>

                <div className="text-neutral-600">
                    <p className="mt-2">Você enviará um e-mail com o link para acesso a organização deste evento.</p>
                </div>
                <div className="text-neutral-600">
                    <InputLabel htmlFor="email" value="E-mail" />
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Digite o email para enviar o link"
                        value={data.email}
                        onChange={(e) => setData("email", e.target.value)}
                        invalid={!!action.error}
                    />
                    <InputError message={action.error?.message} />
                </div>

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={disabled}>Convidar</PrimaryButton>
                    <SecondaryButton onClick={handleClose}>Cancelar</SecondaryButton>
                </div>
            </form>
        </Modal>
    );
}
