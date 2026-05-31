import { update } from "@/Actions/update";
import { getCategorias } from "@/api/getCategorias";
import { eventosRoutes } from "@/api/routes";
import InputError from "@/Components/Inputs/InputError";
import InputLabel from "@/Components/Inputs/InputLabel";
import { CategoryOption } from "@/Components/Inputs/CategoryOption";
import DateTimeInput from "@/Components/Inputs/DateTimeInput";
import { Input } from "@/Components/Inputs/Input";
import { InputRadio } from "@/Components/Inputs/InputRadio";
import Textarea from "@/Components/Inputs/Textarea";
import PrimaryButton from "@/Components/PrimaryButton";
import { useAction } from "@/Hooks/useAction";
import useData from "@/Hooks/useData";
import ManagerLayout from "@/Layouts/ManagerLayout";
import { actionErrorHandlingDecorator } from "@/util/actionErrorHandlingDecorator";
import { CalendarBlankIcon, ImageIcon, MapPinLineIcon, TextTIcon, TrendUpIcon } from "@phosphor-icons/react";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { toFormData } from "@/Actions/toFormData";

export default function Index({ evento }) {
    return (
        <ManagerLayout title="Geral">
            <section className="w-full h-full flex items-center justify-center py-6 px-4 pb-64 flex-col gap-16 max-w-3xl mx-auto">
                <EventBasicForm event={evento} />

                <EventDivulgationForm evento={evento} />

                <EventLocationSection event={evento} />

                <EventDatetimeForm event={evento} />
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

        await action.execute(eventosRoutes.update(), payload);
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

function EventDivulgationForm({ evento = {} }) {
    const [data, setData] = useData({
        banner: evento.banner,
        categorias: evento.categorias ?? [],
    });

    const [preview, setPreview] = useState(evento.banner ?? null);

    const handleBannerChange = (e) => {
        const file = e.target.files?.[0];

        if (!file) return;

        setData("banner", file);

        const url = URL.createObjectURL(file);

        setPreview((old) => {
            if (old) {
                URL.revokeObjectURL(old);
            }

            return url;
        });
    };

    useEffect(() => {
        return () => {
            if (preview) {
                URL.revokeObjectURL(preview);
            }
        };
    }, [preview]);

    const categorias = getCategorias();

    const toggleCategory = (category) => {
        const alreadySelected = data.categorias.includes(category);

        if (alreadySelected) {
            setData(
                "categorias",
                data.categorias.filter((item) => item !== category)
            );

            return;
        }

        setData("categorias", [...data.categorias, category]);
    };

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

    const disabled = action.loading || !data.categorias;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (disabled) return;

        const payload = {
            categorias: data.categorias,
            banner: data.banner,
        };

        await action.execute(eventosRoutes.update(), toFormData(payload));
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="w-full flex flex-col items-center justify-center gap-4 border-t border-t-neutral-300 pt-8"
        >
            <div className="w-full text-start">
                <h1 className="w-full font-medium text-3xl text-neutral-800 tracking-tight inline-flex gap-1 items-center">
                    <TrendUpIcon size={32} />
                    Divulgação
                </h1>
            </div>

            <div className="w-full flex flex-col gap-4">
                <ImageUploadInput preview={preview} onChange={handleBannerChange} errors={action?.error?.errors} />

                <div className="space-y-1">
                    <InputLabel value="Categoria do evento" />

                    <div className="flex flex-wrap gap-3">
                        {categorias.map((category) => {
                            const selected = data.categorias.includes(category);

                            return (
                                <CategoryOption
                                    key={category}
                                    value={category}
                                    onSelect={() => toggleCategory(category)}
                                    selected={selected}
                                />
                            );
                        })}
                    </div>
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
        endereco: event.endereco ?? "",
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

function EventDatetimeForm({ event = {} }) {
    const [data, setData] = useData({
        data_inicio: event.data_inicio,
        data_fim: event.data_fim,
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

function ImageUploadInput({ preview, onChange, errors }) {
    return (
        <div className="space-y-2">
            <InputLabel htmlFor="banner" value="Imagem de capa do evento" />

            <label
                htmlFor="banner"
                className="
                    flex min-h-56 w-full cursor-pointer flex-col items-center justify-center
                    rounded-sm border-2 border-dashed border-neutral-300
                    bg-neutral-50 transition
                    hover:border-emerald-500 hover:bg-emerald-50/50
                "
            >
                {preview ? (
                    <div className="relative h-full w-full">
                        <img src={preview} alt="Banner do evento" className="h-56 w-full rounded-sm object-cover" />

                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition hover:opacity-100">
                            <span className="text-sm font-medium text-white">Alterar imagem</span>
                        </div>
                    </div>
                ) : (
                    <>
                        <ImageIcon size={40} className="mb-3 text-neutral-400" />

                        <p className="font-medium text-neutral-700">Clique para selecionar uma imagem</p>

                        <p className="mt-1 text-sm text-neutral-500">PNG, JPG ou WEBP</p>

                        <p className="text-xs text-neutral-400">Recomendado: 1200x630px</p>
                    </>
                )}

                <input id="banner" type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={onChange} />
            </label>

            <InputError message={errors?.banner} />
        </div>
    );
}
