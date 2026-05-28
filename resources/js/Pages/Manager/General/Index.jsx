import InputLabel from "@/Components/InputLabel";
import DateTimeInput from "@/Components/Inputs/DateTimeInput";
import { Input } from "@/Components/Inputs/Input";
import { InputRadio } from "@/Components/Inputs/InputRadio";
import { Select } from "@/Components/Inputs/Select";
import Textarea from "@/Components/Inputs/Textarea";
import PrimaryButton from "@/Components/PrimaryButton";
import ManagerLayout from "@/Layouts/ManagerLayout";
import { useForm } from "@inertiajs/react";
import { CalendarBlankIcon, MapPinLineIcon, TextTIcon, TrendUpIcon, XIcon } from "@phosphor-icons/react";
import { useState } from "react";

export default function Index({ event }) {
    const { data, setData } = useForm({
        titulo: event.titulo,
        descricao: event.descricao,
        formato: "",
        data_inicio: "",
        data_fim: "",
        hora_inicio: "",
        hora_fim: "",
    });

    console.log(event, data);

    return (
        <ManagerLayout title="Geral">
            <form className="w-full h-full flex items-center justify-center py-6 px-4 flex-col gap-16 max-w-3xl mx-auto">
                <fieldset className="w-full flex flex-col items-center justify-center gap-4">
                    <div className="w-full text-start">
                        <p className="mb-2 font-thin text-sm text-neutral-600 tracking-widest">Evento</p>
                        <h1 className="w-full font-medium text-3xl text-neutral-800 tracking-tight inline-flex gap-1 items-center">
                            <TextTIcon size={32} />
                            Informações gerais
                        </h1>
                    </div>

                    <div className="w-full flex flex-col gap-4">
                        <div className="space-y-2">
                            <InputLabel htmlFor="titulo" value="Título do evento" />
                            <Input
                                id="titulo"
                                type="text"
                                placeholder="Título do evento"
                                value={data.titulo}
                                onChange={(e) => setData("titulo", e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <InputLabel htmlFor="descricao" value="Descrição do evento" />
                            <Textarea
                                id="descricao"
                                value={data.descricao}
                                onChange={(e) => setData("descricao", e.target.value)}
                                placeholder="Descrição do evento"
                                rows={5}
                            />
                        </div>
                    </div>

                    {/* categorias */}

                    <div className="w-full">
                        <PrimaryButton type="submit">Salvar</PrimaryButton>
                    </div>
                </fieldset>

                <EventLocationSection data={data} setData={setData} />

                <fieldset className="w-full flex flex-col items-center justify-center gap-8 border-t border-t-neutral-300 pt-8">
                    <h1 className="w-full font-medium text-3xl text-neutral-800 tracking-tight inline-flex gap-1 items-center">
                        <CalendarBlankIcon size={32} />
                        Data e hora
                    </h1>

                    <div className="w-full flex flex-col gap-4">
                        <DateTimeInput
                            label="Data do início do evento"
                            dateValue={data.data_inicio}
                            onDateChange={(e) => setData("data_inicio", e.target.value)}
                            timeValue={data.hora_inicio}
                            onTimeChange={(e) => setData("hora_inicio", e.target.value)}
                        />
                        <DateTimeInput
                            label="Data do término do evento"
                            dateValue={data.data_fim}
                            onDateChange={(e) => setData("data_fim", e.target.value)}
                            timeValue={data.hora_fim}
                            onTimeChange={(e) => setData("hora_fim", e.target.value)}
                        />
                    </div>

                    <div className="w-full text-start">
                        <PrimaryButton type="submit">Salvar</PrimaryButton>
                    </div>
                </fieldset>
            </form>
        </ManagerLayout>
    );
}

function EventLocationSection({ data, setData }) {
    const format_options = [
        { label: "Online", value: "online" },
        { label: "Presencial", value: "presencial" },
        { label: "Híbrido", value: "hibrido" },
    ];

    const [creatingLocation, setCreatingLocation] = useState(false);

    return (
        <fieldset className="w-full flex flex-col items-center justify-center gap-8 border-t border-t-neutral-300 pt-8">
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
                                onClick={() => setData("formato", format.value)}
                                selected={format.value == data.formato}
                            />
                        ))}
                    </div>
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
                    <div className="w-full flex flex-col gap-4 rounded-sm border border-neutral-200 p-6 bg-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-sm font-semibold text-neutral-800">Nova localidade</h2>

                                <p className="text-sm text-neutral-500">Informe os dados da localidade do evento.</p>
                            </div>

                            <button
                                type="button"
                                onClick={() => setCreatingLocation(false)}
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

                            <button
                                type="button"
                                onClick={() => setCreatingLocation(false)}
                                className="px-5 py-2.5 rounded-sm border border-neutral-300 text-sm font-medium text-neutral-700 hover:bg-neutral-100 transition-colors"
                            >
                                Voltar
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <div className="w-full">
                <PrimaryButton type="submit">Salvar</PrimaryButton>
            </div>
        </fieldset>
    );
}
