import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Menu } from "@/Components/Menu";
import { CalendarBlankIcon, MapPinIcon } from "@phosphor-icons/react";
import { CronogramaSection } from "./Components/CronogramaSection";
import { ProgramacaoGeralSection } from "./Components/ProgramacaoGeralSection";
import { formatDate } from "@/util/formatDate";

export default function Index({ evento = {}, inscricoes = [] }) {
    const atividades = evento.atividades ?? [];

    return (
        <AuthenticatedLayout titulo={evento.titulo}>
            <div className="space-y-6 pb-64">
                <section className="overflow-hidden rounded-sm border-b border-neutral-300 bg-white">
                    <div className="px-8 py-10 max-md:px-4">
                        <div className="max-w-4xl mx-auto">
                            <div className="space-y-4">
                                <div>
                                    <h1 className="text-3xl font-bold tracking-tight text-neutral-800">{evento.titulo}</h1>

                                    {evento.descricao && (
                                        <p className="mt-2 max-w-3xl text-neutral-600 leading-8">{evento.descricao}</p>
                                    )}
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    <div className="inline-flex items-center gap-2 rounded-sm bg-neutral-100 px-4 py-2 text-sm text-neutral-800">
                                        <CalendarBlankIcon size={18} />

                                        <span>
                                            {formatDate(evento.data_inicio, "DD/MM/YYYY HH:ii:ss", "DD/MM/YYYY")} até{" "}
                                            {formatDate(evento.data_fim, "DD/MM/YYYY HH:ii:ss", "DD/MM/YYYY")}
                                        </span>
                                    </div>

                                    {evento.local && (
                                        <div className="inline-flex items-center gap-2 rounded-sm bg-neutral-100 px-4 py-2 text-sm text-neutral-800">
                                            <MapPinIcon size={18} />

                                            <span>{evento.local.nome}</span>
                                        </div>
                                    )}
                                </div>

                                {evento.categorias?.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {evento.categorias.map((categoria) => (
                                            <span
                                                key={categoria}
                                                className="rounded-full bg-emerald-100 px-4 py-1 text-sm font-medium text-emerald-700 border border-emerald-300"
                                            >
                                                {categoria}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                <div className="w-full max-w-4xl mx-auto max-md:px-4">
                    <Menu>
                        <Menu.Tab label="Minhas atividades">
                            <CronogramaSection inscricoes={inscricoes} />
                        </Menu.Tab>

                        <Menu.Tab label="Programação geral">
                            <ProgramacaoGeralSection atividades={atividades} inscricoes={inscricoes} />
                        </Menu.Tab>
                    </Menu>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
