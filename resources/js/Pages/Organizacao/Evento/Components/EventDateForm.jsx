import { update } from "@/Actions/update";
import { eventosRoutes } from "@/api/routes";
import DateTimeInput from "@/Components/Inputs/DateTimeInput";
import PrimaryButton from "@/Components/PrimaryButton";
import { useAction } from "@/Hooks/useAction";
import useData from "@/Hooks/useData";
import { actionErrorHandlingDecorator } from "@/util/actionErrorHandlingDecorator";
import { CalendarBlankIcon } from "@phosphor-icons/react";
import { toast } from "sonner";

export function EventDateForm({ evento = {} }) {
    const [data, setData] = useData({
        data_inicio: evento.data_inicio,
        data_fim: evento.data_fim,
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

    const disabled = action.loading || !data.data_inicio || !data.data_fim;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (disabled) return;

        const payload = {
            data_inicio: data.data_inicio,
            data_fim: data.data_fim,
        };

        await action.execute(eventosRoutes.update(), payload);
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="w-full flex flex-col items-center justify-center gap-4 border-t border-t-neutral-300 pt-8"
        >
            <h1 className="w-full font-medium text-3xl text-neutral-800 tracking-tight inline-flex gap-1 items-center">
                <CalendarBlankIcon size={32} />
                Data
            </h1>

            <div className="w-full flex flex-col gap-4">
                <DateTimeInput
                    id="data_inicio"
                    label="Data do início do evento"
                    value={data.data_inicio}
                    onChange={(e) => setData("data_inicio", e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    withTime={false}
                />

                <DateTimeInput
                    id="data_fim"
                    label="Data do término do evento"
                    value={data.data_fim}
                    onChange={(e) => setData("data_fim", e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    withTime={false}
                />
            </div>

            <div className="w-full text-start">
                <PrimaryButton disabled={disabled}>{action.loading ? "Enviando..." : "Salvar"}</PrimaryButton>
            </div>
        </form>
    );
}
