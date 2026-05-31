import { update } from "@/Actions/update";
import { eventosRoutes } from "@/api/routes";
import { Input } from "@/Components/Inputs/Input";
import InputError from "@/Components/Inputs/InputError";
import InputLabel from "@/Components/Inputs/InputLabel";
import { InputRadio } from "@/Components/Inputs/InputRadio";
import PrimaryButton from "@/Components/PrimaryButton";
import { useAction } from "@/Hooks/useAction";
import useData from "@/Hooks/useData";
import { actionErrorHandlingDecorator } from "@/util/actionErrorHandlingDecorator";
import { MapPinLineIcon } from "@phosphor-icons/react";
import { toast } from "sonner";

export function EventLocationForm({ evento = {} }) {
    const format_options = [
        { label: "Remoto", value: "remoto" },
        { label: "Presencial", value: "presencial" },
        { label: "Híbrido", value: "hibrido" },
    ];

    const [data, setData] = useData({
        formato: evento.formato ?? "",
        endereco: evento.endereco ?? "",
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

    const disabled = !data.formato || action.loading;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (disabled) return;

        const payload = {
            formato: data.formato,
            endereco: data.endereco,
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
                        {format_options.map((format, index) => (
                            <InputRadio
                                key={index}
                                label={format.label}
                                id={format.value}
                                value={data.formato}
                                onClick={() => {
                                    setData("formato", format.value);
                                    action.clearError("formato");
                                }}
                                selected={format.value == data.formato}
                            />
                        ))}
                    </div>
                    <InputError message={action.error?.errors?.formato} />
                </div>

                <div className="space-y-2">
                    <InputLabel htmlFor="endereco" value="Informe o endereço" />

                    <Input
                        id="endereco"
                        placeholder="Endereço"
                        value={data.endereco}
                        onChange={(e) => {
                            setData("endereco", e.target.value);
                            action.clearError("endereco");
                        }}
                        invalid={!!data?.error?.errors?.endereco}
                    />
                    <InputError message={data?.error?.errors?.endereco} />
                </div>
            </div>

            <div className="w-full">
                <PrimaryButton disabled={disabled}>{action.loading ? "Enviando..." : "Salvar"}</PrimaryButton>
            </div>
        </form>
    );
}
