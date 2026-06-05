import { update } from "@/Actions/update";
import { getFormatos } from "@/api/getFormatos";
import { eventosRoutes } from "@/api/routes";
import InputError from "@/Components/Inputs/InputError";
import InputLabel from "@/Components/Inputs/InputLabel";
import { InputRadio } from "@/Components/Inputs/InputRadio";
import { Select } from "@/Components/Inputs/Select";
import PrimaryButton from "@/Components/PrimaryButton";
import { useAction } from "@/Hooks/useAction";
import useData from "@/Hooks/useData";
import { actionErrorHandlingDecorator } from "@/util/actionErrorHandlingDecorator";
import { usePage } from "@inertiajs/react";
import { MapPinLineIcon } from "@phosphor-icons/react";
import { toast } from "sonner";

export function EventLocationForm({ evento = {} }) {
    const formatos = getFormatos();
    const { locais } = usePage().props;

    const [data, setData] = useData({
        formato: evento.formato ?? "",
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

    const disabled = !data.formato || !data.id_local || action.loading;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (disabled) return;

        const payload = {
            formato: data.formato,
            id_local: data.id_local,
        };

        await action.execute(eventosRoutes.update(), payload);
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
                <div className="w-full flex items-start justify-center flex-col gap-2">
                    <span className="text-neutral-600 text-sm font-normal">Formato</span>

                    <div className="w-full flex items-center justify-center gap-4">
                        {formatos.map((formato, index) => (
                            <InputRadio
                                key={index}
                                label={formato.label}
                                id={formato.value}
                                value={data.formato}
                                onClick={() => {
                                    setData("formato", formato.value);
                                    action.clearError("formato");
                                }}
                                selected={formato.value == data.formato}
                            />
                        ))}
                    </div>
                    <InputError message={action.error?.errors?.formato} />
                </div>

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
