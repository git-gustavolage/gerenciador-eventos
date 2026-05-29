import { update } from "@/Actions/update";
import { eventos } from "@/api/routes";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import DateTimeInput from "@/Components/Inputs/DateTimeInput";
import { Input } from "@/Components/Inputs/Input";
import { InputRadio } from "@/Components/Inputs/InputRadio";
import Textarea from "@/Components/Inputs/Textarea";
import PrimaryButton from "@/Components/PrimaryButton";
import { useAction } from "@/Hooks/useAction";
import useData from "@/Hooks/useData";
import ManagerLayout from "@/Layouts/ManagerLayout";
import { actionErrorHandlingDecorator } from "@/util/actionErrorHandlingDecorator";
import { formatDate } from "@/util/formatDate";
import { CalendarBlankIcon, MapPinLineIcon, TextTIcon } from "@phosphor-icons/react";
import { toast } from "sonner";

export default function Index({ event }) {
    return (
        <ManagerLayout title="Geral">
            <section className="w-full h-full flex items-center justify-center py-6 px-4 flex-col gap-16 max-w-3xl mx-auto">
                <EventBasicForm event={event} />

                <EventLocationSection event={event} />

                <EventDatetimeForm event={event} />
            </section>
        </ManagerLayout>
    );
}

function EventBasicForm({ event = {} }) {
    const [data, setData] = useData({
        titulo: event.titulo ?? "",
        descricao: event.descricao ?? "",
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

        await action.execute(eventos.update, payload);
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

function EventLocationSection({ event = {} }) {
    const format_options = [
        { label: "Remoto", value: "remoto" },
        { label: "Presencial", value: "presencial" },
        { label: "Híbrido", value: "hibrido" },
    ];

    const [data, setData] = useData({
        formato: event.formato ?? "",
        endereco: event.endereco,
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

        await action.execute(eventos.update, payload);
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="w-full flex flex-col items-center justify-center gap-8 border-t border-t-neutral-300 pt-8"
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
                            setData('endereco', e.target.value);
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

function EventDatetimeForm({ event = {} }) {
    console.log(event);
    
    const [data, setData] = useData({
        data_inicio: formatDate(event.data_inicio, "DD/MM/YYYY HH:MM:ss", "YYYY-MM-DD HH:mm:ss") ?? "",
        data_fim: formatDate(event.data_fim, "DD/MM/YYYY HH:MM:ss", "YYYY-MM-DD HH:mm:ss") ?? "",
    });

    console.log(data);
    

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

        await action.execute(eventos.update, payload);
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="w-full flex flex-col items-center justify-center gap-8 border-t border-t-neutral-300 pt-8"
        >
            <h1 className="w-full font-medium text-3xl text-neutral-800 tracking-tight inline-flex gap-1 items-center">
                <CalendarBlankIcon size={32} />
                Data e hora
            </h1>

            <div className="w-full flex flex-col gap-4">
                <DateTimeInput
                    id="data_inicio"
                    label="Data do início do evento"
                    value={data.data_inicio}
                    onChange={(e) => setData("data_inicio", e.target.value)}
                />

                <DateTimeInput
                    id="data_fim"
                    label="Data do término do evento"
                    value={data.data_fim}
                    onChange={(e) => setData("data_fim", e.target.value)}
                />
            </div>

            <div className="w-full text-start">
                <PrimaryButton disabled={disabled}>{action.loading ? "Enviando..." : "Salvar"}</PrimaryButton>
            </div>
        </form>
    );
}
