import { update } from "@/Actions/update";
import { routes } from "@/api/routes";
import { Input } from "@/Components/Inputs/Input";
import InputError from "@/Components/Inputs/InputError";
import InputLabel from "@/Components/Inputs/InputLabel";
import Textarea from "@/Components/Inputs/Textarea";
import PrimaryButton from "@/Components/PrimaryButton";
import { useAction } from "@/Hooks/useAction";
import useData from "@/Hooks/useData";
import { actionErrorHandlingDecorator } from "@/util/actionErrorHandlingDecorator";
import { TextTIcon } from "@phosphor-icons/react";
import { toast } from "sonner";

export function EventGeneralForm({ evento = {} }) {
    const [data, setData] = useData({
        titulo: evento.titulo ?? "",
        descricao: evento.descricao ?? "",
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

    const disabled = action.loading || !data.titulo;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (disabled) return;

        const payload = {
            titulo: data.titulo,
            descricao: data.descricao,
        };

        await action.execute(routes.eventos.update(), payload);
    };

    return (
        <form onSubmit={handleSubmit} className="w-full flex flex-col items-center justify-center gap-4">
            <div className="w-full text-start">
                <p className="mb-2 font-thin text-sm text-neutral-600 tracking-widest">Evento</p>
                <h1 className="w-full font-medium text-3xl text-neutral-800 tracking-tight inline-flex gap-1 items-center">
                    <TextTIcon size={32} />
                    Informações gerais
                </h1>
            </div>

            <div className="w-full flex flex-col gap-4">
                <div className="space-y-1">
                    <InputLabel htmlFor="titulo" value="Título do evento" />
                    <Input
                        id="titulo"
                        type="text"
                        placeholder="Título do evento"
                        value={data.titulo}
                        onChange={(e) => {
                            setData("titulo", e.target.value);
                            action.clearError("titulo");
                        }}
                        invalid={!!action.error?.errors?.titulo}
                    />
                    <InputError message={action.error?.errors?.titulo} />
                </div>

                <div className="space-y-1">
                    <InputLabel htmlFor="descricao" value="Descrição do evento" />
                    <Textarea
                        id="descricao"
                        value={data.descricao}
                        onChange={(e) => {
                            setData("descricao", e.target.value);
                            action.clearError("descricao");
                        }}
                        placeholder="Descrição do evento"
                        rows={5}
                        maxLength={255}
                        invalid={!!action.error?.errors?.descricao}
                    />
                    <InputError message={action.error?.errors?.descricao} />
                </div>
            </div>

            <div className="w-full">
                <PrimaryButton disabled={disabled}>{action.loading ? "Enviando..." : "Salvar"}</PrimaryButton>
            </div>
        </form>
    );
}
