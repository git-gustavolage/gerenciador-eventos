import { InputRadio } from "@/Components/Inputs/InputRadio";
import { Input } from "@/Components/Inputs/Input";
import useData from "@/Hooks/useData";
import { useState } from "react";
import { Container } from "@/Components/Container";
import PrimaryButton from "@/Components/PrimaryButton";
import { store } from "@/Actions/store";
import { useAction } from "@/Hooks/useAction";
import { actionErrorHandlingDecorator } from "@/util/actionErrorHandlingDecorator";
import { toast } from "sonner";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { router } from "@inertiajs/react";
import { eventosRoutes } from "@/api/routes";
import { getCategorias } from "@/api/getCategorias";
import { CategoryOption } from "@/Components/Inputs/CategoryOption";

export default function Index() {
    const [data, setData] = useData({
        titulo: "",
        descricao: "",
        formato: "",
        categorias: [],
    });

    const totalSteps = 3;
    const [step, setStep] = useState(1);

    const handleNextStep = () => {
        setStep((prev) => (prev + 1 > totalSteps ? prev : prev + 1));
    };

    const handlePreviusStep = () => {
        setStep((prev) => (prev - 1 < 0 ? prev : prev - 1));
    };

    const action = useAction({ actionFn: actionErrorHandlingDecorator(store) });
    const disabled = !data.titulo || !data.formato || !data.categorias?.length || action.loading;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (disabled) return;

        const payload = {
            ...data,
        };

        const res = await action.execute(eventosRoutes.store(), payload);
        if (res?.success) {
            toast.info("Evento criado com sucesso!");
            setTimeout(() => {
                router.visit(route("organizador.index"));
            }, 1000);
        }
    };

    return (
        <AuthenticatedLayout>
            <div className="w-full flex justify-center">
                <form
                    onSubmit={(e) => handleSubmit(e)}
                    className="w-[80%] max-w-4xl max-md:w-full flex items-center justify-center py-6 px-4 flex-col gap-8"
                >
                    <div className="w-full flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                            <p className="text-neutral-600 font-medium text-sm">
                                Passo {step} de {totalSteps}
                            </p>
                        </div>

                        <div className="relative w-full h-2 overflow-hidden rounded-md bg-slate-200">
                            <div
                                className="h-full rounded-md bg-emerald-500 transition-all duration-300 ease-in-out"
                                style={{
                                    width: `${(step / totalSteps) * 100}%`,
                                }}
                            />
                        </div>
                    </div>

                    {step == 1 && <EventFormBasicsSection data={data} setData={setData} onNext={handleNextStep} />}

                    {step == 2 && (
                        <EventFormCategorySection
                            data={data}
                            setData={setData}
                            onPrevius={handlePreviusStep}
                            onNext={handleNextStep}
                        />
                    )}

                    {step == 3 && (
                        <EventFormConfirmationSection loading={disabled} data={data} onPrevius={handlePreviusStep} />
                    )}
                </form>
            </div>
        </AuthenticatedLayout>
    );
}

function EventFormBasicsSection({ data, setData, onNext }) {
    return (
        <Container>
            <div className="flex flex-col gap-2 w-full items-start">
                <h2 className="w-full font-semibold text-3xl text-medium">Crie um novo evento</h2>
                <p className="text-sm text-neutral-500">Informe os dados iniciais para o cadastro do evento.</p>
            </div>

            <div className="w-full flex items-start justify-center flex-col gap-1">
                <label htmlFor="title" className="text-dark text-sm font-normal">
                    Qual o título do evento?
                </label>
                <Input
                    id="title"
                    placeholder="Título do evento"
                    value={data.titulo}
                    onChange={(e) => setData("titulo", e.target.value)}
                />
            </div>

            <div className="w-full flex items-start justify-center flex-col gap-1">
                <label htmlFor="description" className="text-dark text-sm font-normal">
                    Adicione uma descrição para o evento (opcional)
                </label>
                <textarea
                    id="description"
                    placeholder="Desceva o evento..."
                    value={data.descricao}
                    onChange={(e) => setData("descricao", e.target.value)}
                    rows={4}
                    className="w-full rounded-sm border border-neutral-300 resize-none text-sm outline-none focus:ring-green-300 focus:border-emerald-500"
                ></textarea>
            </div>

            <div className="w-full text-start">
                <PrimaryButton disabled={!data.titulo} onClick={onNext}>
                    Próximo
                </PrimaryButton>
            </div>
        </Container>
    );
}

function EventFormCategorySection({ data, setData, onPrevius, onNext }) {
    const format_options = ["Remoto", "Presencial", "Híbrido"];

    const category_options = getCategorias();

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

    const disabled = !data.formato || !data.categorias?.length;
    return (
        <Container>
            <div className="flex flex-col gap-2 w-full items-start">
                <h2 className="w-full font-semibold text-3xl text-medium">Categoria do evento</h2>

                <p className="text-sm text-neutral-500">Categorize seu evento e facilite sua busca.</p>
            </div>

            <div className="w-full flex items-start justify-center flex-col gap-2">
                <span className="text-dark text-sm font-normal">Qual o formato do evento?</span>

                <div className="w-full flex items-center gap-4 flex-wrap">
                    {format_options.map((format) => (
                        <InputRadio
                            key={format}
                            label={format}
                            id={format}
                            onClick={() => setData("formato", format)}
                            value={data.formato}
                            selected={data.formato === format}
                        />
                    ))}
                </div>
            </div>

            <div className="w-full flex flex-col gap-3">
                <label className="text-dark text-sm font-normal">Qual a categoria do evento?</label>

                <div className="flex flex-wrap gap-3">
                    {category_options.map((category) => {
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

            <div className="w-full flex gap-4 items-center justify-between max-sm:flex-col-reverse">
                <button
                    type="button"
                    className="w-fit max-sm:w-full py-2.5 px-8 bg-slate-200 hover:bg-slate-300 text-slate-700 duration-200 rounded-sm font-semibold text-sm whitespace-nowrap cursor-pointer"
                    onClick={onPrevius}
                >
                    Voltar
                </button>

                <PrimaryButton disabled={disabled} onClick={onNext}>
                    Próximo
                </PrimaryButton>
            </div>
        </Container>
    );
}

function EventFormConfirmationSection({ loading = false, data, onPrevius }) {
    const disabled = loading || !data.titulo || !data.formato || !data.categorias?.length;

    return (
        <Container>
            <div className="flex flex-col gap-2 w-full items-start">
                <h2 className="w-full font-semibold text-3xl text-neutral-900">Confirmação</h2>

                <p className="text-sm text-neutral-500 leading-relaxed">
                    Revise as informações abaixo antes de concluir o cadastro.
                </p>
            </div>

            <div className="w-full rounded-sm border border-neutral-200 bg-white overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-200 bg-neutral-50">
                    <div className="flex flex-col">
                        <span className="text-sm font-semibold text-neutral-800">Dados do evento</span>

                        <span className="text-xs text-neutral-500">
                            Verifique se todas as informações estão corretas
                        </span>
                    </div>
                </div>

                <div className="divide-y divide-neutral-200">
                    <div className="grid grid-cols-[180px_1fr] max-md:grid-cols-1 gap-2 px-5 py-4">
                        <span className="text-sm font-medium text-neutral-500">Nome do evento</span>

                        <p className="text-sm text-neutral-800 font-medium break-words">{data.titulo || "-"}</p>
                    </div>

                    <div className="grid grid-cols-[180px_1fr] max-md:grid-cols-1 gap-2 px-5 py-4">
                        <span className="text-sm font-medium text-neutral-500">Descrição</span>

                        <p className="text-sm text-neutral-700 leading-relaxed whitespace-pre-line break-words">
                            {data.descricao || "Nenhuma descrição informada."}
                        </p>
                    </div>

                    <div className="grid grid-cols-[180px_1fr] max-md:grid-cols-1 gap-2 px-5 py-4">
                        <span className="text-sm font-medium text-neutral-500">Formato</span>

                        <div>
                            <span className="inline-flex items-center rounded-full bg-emerald-100 text-emerald-700 px-3 py-1 text-xs font-semibold">
                                {data.formato}
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-[180px_1fr] max-md:grid-cols-1 gap-2 px-5 py-4">
                        <span className="text-sm font-medium text-neutral-500">Categorias</span>

                        <div className="flex flex-wrap gap-2">
                            {data.categorias?.length > 0 ? (
                                data.categorias.map((categoria, index) => (
                                    <span
                                        key={index}
                                        className="inline-flex items-center rounded-full border border-neutral-300 bg-white px-3 py-1 text-xs font-medium text-neutral-700"
                                    >
                                        {categoria}
                                    </span>
                                ))
                            ) : (
                                <span className="text-sm text-neutral-400">Nenhuma categoria selecionada.</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full flex gap-4 items-center justify-between max-sm:flex-col-reverse">
                <button
                    type="button"
                    className="w-fit max-sm:w-full py-2.5 px-8 bg-slate-200 hover:bg-slate-300 text-slate-700 duration-200 rounded-sm font-semibold text-sm whitespace-nowrap cursor-pointer"
                    onClick={onPrevius}
                >
                    Voltar
                </button>

                <PrimaryButton disabled={disabled} type="submit">
                    Confirmar e enviar
                </PrimaryButton>
            </div>
        </Container>
    );
}
