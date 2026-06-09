import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Menu } from "@/Components/Menu";
import { CalendarIcon, MapPinIcon } from "@phosphor-icons/react";
import { CertificadosSection } from "./Components/CertificadosSection";
import { CronogramaSection } from "./Components/CronogramaSection";
import { ProgramacaoGeralSection } from "./Components/ProgramacaoGeralSection";

export default function Index({ evento = {}, inscricoes = [] }) {
    const atividades = evento.atividades ?? [];

    return (
        <AuthenticatedLayout titulo={evento.titulo}>
            <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
                <section className="bg-white border border-neutral-300 rounded-sm overflow-hidden">
                    <div className="p-6">
                        <h1 className="text-3xl font-bold text-neutral-800">{evento.titulo}</h1>

                        {evento.descricao && <p className="mt-2 text-neutral-500 leading-relaxed">{evento.descricao}</p>}

                        <div className="flex flex-col gap-4 mt-4">
                            <div className="inline-flex items-center gap-2 text-neutral-500">
                                <CalendarIcon size={18} />
                                <span>
                                    {evento.data_inicio} - {evento.data_fim}
                                </span>
                            </div>

                            <div className="inline-flex items-center gap-2 text-neutral-500">
                                <MapPinIcon size={18} />
                                <span>{evento.local?.nome}</span>
                            </div>
                        </div>

                        {evento.categorias?.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-6">
                                {evento.categorias.map((categoria) => (
                                    <span
                                        key={categoria}
                                        className="px-3 py-1 bg-emerald-100 border border-emerald-300 text-emerald-800 rounded-full text-sm"
                                    >
                                        {categoria}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </section>

                <Menu>
                    <Menu.Tab label="Minhas atividades">
                        <CronogramaSection inscricoes={inscricoes} />
                    </Menu.Tab>

                    <Menu.Tab label="Programação geral">
                        <ProgramacaoGeralSection atividades={atividades} inscricoes={inscricoes} />
                    </Menu.Tab>

                    <Menu.Tab label="Certificados">
                        <CertificadosSection certificados={[]} />
                    </Menu.Tab>
                </Menu>
            </div>
        </AuthenticatedLayout>
    );
}
