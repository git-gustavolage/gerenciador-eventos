import { store } from "@/Actions/store";
import { update } from "@/Actions/update";
import { eventos, localidades } from "@/api/routes";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import DateTimeInput from "@/Components/Inputs/DateTimeInput";
import { Input } from "@/Components/Inputs/Input";
import { InputRadio } from "@/Components/Inputs/InputRadio";
import { Select } from "@/Components/Inputs/Select";
import Textarea from "@/Components/Inputs/Textarea";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import { useAction } from "@/Hooks/useAction";
import useData from "@/Hooks/useData";
import ManagerLayout from "@/Layouts/ManagerLayout";
import { actionErrorHandlingDecorator } from "@/util/actionErrorHandlingDecorator";
import { CalendarBlankIcon, MapPinLineIcon, TextTIcon, TrendUpIcon, XIcon } from "@phosphor-icons/react";
import { useState } from "react";
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
        };

        await action.execute(eventos.update, payload);
    };

    const [creatingLocation, setCreatingLocation] = useState(false);

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

                {!creatingLocation && (
                    <div className="flex flex-col gap-4">
                        <Select id="id_localidade" label="Localidade">
                            <option value="">Selecione</option>
                        </Select>

                        <button
                            type="button"
                            onClick={() => setCreatingLocation(true)}
                            className=" w-fit text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
                        >
                            + Cadastrar nova localidade
                        </button>
                    </div>
                )}

                {creatingLocation && (
                    <LocalidadeSubForm onClose={() => setCreatingLocation(false)} />
                    // <div className="w-full flex flex-col gap-4 rounded-sm border border-neutral-200 p-6 bg-white">
                    //     <div className="flex items-center justify-between">
                    //         <div>
                    //             <h2 className="text-sm font-semibold text-neutral-800">Nova localidade</h2>

                    //             <p className="text-sm text-neutral-500">Informe os dados da localidade do evento.</p>
                    //         </div>

                    //         <button
                    //             type="button"
                    //             onClick={() => setCreatingLocation(false)}
                    //             className="text-sm font-medium text-neutral-500 hover:text-neutral-700 transition-colors"
                    //         >
                    //             <XIcon size={20} />
                    //         </button>
                    //     </div>

                    //     <div className="space-y-2">
                    //         <InputLabel htmlFor="localidade_nome" value="Nome da localidade" />

                    //         <Input id="localidade_nome" placeholder="Ex: Auditório Central" />
                    //     </div>

                    //     <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
                    //         <Select id="estado" label="Estado">
                    //             <option value="">Selecione o estado</option>
                    //         </Select>

                    //         <Select id="cidade" label="Cidade">
                    //             <option value="">Selecione a cidade</option>
                    //         </Select>
                    //     </div>

                    //     <div className="flex items-center justify-start gap-3 pt-2">
                    //         <PrimaryButton type="button">Salvar localidade</PrimaryButton>
                    //         <SecondaryButton type="button" onClick={() => setCreatingLocation(false)}>
                    //             Voltar
                    //         </SecondaryButton>
                    //     </div>
                    // </div>
                )}
            </div>

            <div className="w-full">
                <PrimaryButton disabled={disabled}>{action.loading ? "Enviando..." : "Salvar"}</PrimaryButton>
            </div>
        </form>
    );
}

function EventDatetimeForm({ event = {} }) {
    const [data, setData] = useData({
        data_inicio: event.data_inicio ?? "",
        data_fim: event.data_fim ?? "",
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
                    label="Data do início do evento"
                    value={data.data_inicio}
                    onChange={(e) => setData("data_inicio", e.target.value)}
                />

                <DateTimeInput
                    label="Data do término do evento"
                    value={data.data_fim}
                    onchange={(e) => setData("data_fim", e.target.value)}
                />
            </div>

            <div className="w-full text-start">
                <PrimaryButton disabled={disabled}>{action.loading ? "Enviando..." : "Salvar"}</PrimaryButton>
            </div>
        </form>
    );
}

function LocalidadeSubForm({ open, onClose }) {
    const [data, setData] = useData({});

    const action = useAction({
        actionFn: store,
        onSuccess: (res) => {
            if (!res.success) {
                toast.error("Erro ao cadastrar localidade. Tente novamente.");
            }
        },
        onError: (err) => {
            toast.error(err.message);
        },
    });

    const disabled = action.loading;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (disabled) return;

        const payload = {};

        await action.execute(localidades.store, payload);
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="w-full flex flex-col gap-4 rounded-sm border border-neutral-200 p-6 bg-white"
        >
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-sm font-semibold text-neutral-800">Nova localidade</h2>

                    <p className="text-sm text-neutral-500">Informe os dados da localidade do evento.</p>
                </div>

                <button
                    type="button"
                    onClick={onClose}
                    className="text-sm font-medium text-neutral-500 hover:text-neutral-700 transition-colors"
                >
                    <XIcon size={20} />
                </button>
            </div>

            <div className="space-y-2">
                <InputLabel htmlFor="localidade_nome" value="Nome da localidade" />

                <Input id="localidade_nome" placeholder="Ex: Auditório Central" />
            </div>

            <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
                <Select id="estado" label="Estado">
                    <option value="">Selecione o estado</option>
                </Select>

                <Select id="cidade" label="Cidade">
                    <option value="">Selecione a cidade</option>
                </Select>
            </div>

            <div className="flex items-center justify-start gap-3 pt-2">
                <PrimaryButton type="button">Salvar localidade</PrimaryButton>
                <SecondaryButton type="button" onClick={() => setCreatingLocation(false)}>
                    Voltar
                </SecondaryButton>
            </div>
        </form>
    );
}
