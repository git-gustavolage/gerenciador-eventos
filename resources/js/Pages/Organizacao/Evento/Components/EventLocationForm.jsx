import { update } from "@/Actions/update";
import { routes } from "@/api/routes";
import InputError from "@/Components/Inputs/InputError";
import InputLabel from "@/Components/Inputs/InputLabel";
import { Select } from "@/Components/Inputs/Select";
import PrimaryButton from "@/Components/PrimaryButton";
import { useAction } from "@/Hooks/useAction";
import useData from "@/Hooks/useData";
import { actionErrorHandlingDecorator } from "@/util/actionErrorHandlingDecorator";
import { usePage } from "@inertiajs/react";
import { MapPinLineIcon } from "@phosphor-icons/react";
import { toast } from "sonner";

export function EventLocationForm({ evento = {} }) {
    const { locais } = usePage().props;

    const [data, setData] = useData({
        id_local: evento.id_local ?? "",
    });

    const action = useAction({
        actionFn: actionErrorHandlingDecorator(update),
        onSuccess: (res) => {
            if (res.success) {
                toast.success("Alterações salvas com sucesso!");
            } else {
                toast.error("Erro ao salvar as alterações. Tente novamente.");
            }
        },
    });

    const disabled = !data.id_local || action.loading;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (disabled) return;

        const payload = {
            id_local: data.id_local,
        };

        await action.execute(routes.eventos.update(), payload);
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="w-full flex flex-col items-center justify-center gap-4 border-t border-t-neutral-300 pt-8"
        >
            <h1 className="w-full font-medium text-3xl text-neutral-800 tracking-tight inline-flex gap-1 items-center">
                <MapPinLineIcon size={32} />
                Local
            </h1>

            <div className="w-full flex flex-col gap-4">
                <div className="space-y-2">
                    <InputLabel htmlFor="id_local" value="Informe o local do evento" />

                    <Select
                        id="id_local"
                        value={data.id_local}
                        onChange={(e) => {
                            setData("id_local", e.target.value);
                            action.clearError("id_local");
                        }}
                        invalid={!!data?.error?.errors?.id_local}
                    >
                        <option disabled>Selecione um local</option>
                        {locais.map((local) => (
                            <option key={local.id} value={local.id}>
                                {local.nome}
                            </option>
                        ))}
                    </Select>

                    <InputError message={action?.error?.errors?.id_local} />
                </div>
            </div>

            <div className="w-full">
                <PrimaryButton disabled={disabled}>{action.loading ? "Enviando..." : "Salvar"}</PrimaryButton>
            </div>
        </form>
    );
}
