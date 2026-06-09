import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { ArrowRightIcon, CalendarBlankIcon, CalendarIcon, MapPinIcon } from "@phosphor-icons/react";
import { Link } from "@inertiajs/react";
import PrimaryLink from "@/Components/PrimaryLink";

export default function Index({ inscricoes = [] }) {
    const eventos = [...new Map(inscricoes.map((inscricao) => [inscricao.evento.id, inscricao.evento])).values()];

    return (
        <AuthenticatedLayout titulo="Meus Eventos">
            <div className="border-b border-neutral-300 bg-white">
                <div className="mx-auto max-w-6xl px-6 py-8 max-md:px-4">
                    <h1 className="text-2xl font-bold text-neutral-800">Meus Eventos</h1>

                    <p className="mt-1 text-sm text-neutral-500">Gerencie seus eventos e acompanhe suas inscrições.</p>
                </div>
            </div>

            <div className="mx-auto max-w-6xl p-6 max-md:p-4">
                {eventos.length === 0 ? (
                    <div className="rounded-sm border border-neutral-300 bg-white">
                        <div className="mx-auto flex max-w-md flex-col items-center px-6 py-16 text-center">
                            <div className="mb-5 flex size-16 items-center justify-center rounded-full bg-neutral-100">
                                <CalendarBlankIcon size={28} className="text-neutral-500" />
                            </div>

                            <h2 className="text-lg font-semibold text-neutral-800">Você ainda não participa de nenhum evento</h2>

                            <p className="mt-2 text-sm leading-relaxed text-neutral-500">
                                Explore os eventos disponíveis e realize sua inscrição. Depois disso, você poderá acompanhar aqui
                                todas as informações, atividades e atualizações dos eventos em que estiver participando.
                            </p>

                            <div className="mt-4">
                                <PrimaryLink href={route("eventos.explorar")}>Explorar eventos</PrimaryLink>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                        {eventos.map((evento) => (
                            <Link
                                key={evento.id}
                                href={route("participantes.evento", { id: evento.id })}
                                className="overflow-hidden rounded-sm border border-neutral-300 bg-white hover:shadow-md"
                            >
                                <div className="h-48 w-full overflow-hidden">
                                    {evento.banner ? (
                                        <img src={evento.banner} alt={evento.titulo} className="h-full w-full object-cover" />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-emerald-700 via-emerald-800 to-green-950">
                                            <span className="px-6 text-center text-lg font-semibold text-white">
                                                {evento.titulo}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-col p-4">
                                    <div>
                                        <h2 className="text-lg font-semibold text-neutral-800">{evento.titulo}</h2>
                                        <p className="line-clamp-3 text-sm text-neutral-500">{evento.descricao}</p>
                                    </div>

                                    <div className="mt-2 flex flex-wrap gap-2">
                                        <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-700 capitalize">
                                            {evento.formato}
                                        </span>
                                    </div>

                                    <div className="mt-2 space-y-2 border-t border-neutral-300 pt-4 text-sm text-neutral-600">
                                        <div className="flex items-center gap-2">
                                            <CalendarIcon size={16} />

                                            <span>
                                                {evento.data_inicio} - {evento.data_fim}
                                            </span>
                                        </div>

                                        {evento.local && (
                                            <div className="flex items-center gap-2">
                                                <MapPinIcon size={16} />

                                                <span>{evento.local?.nome}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="inline-flex items-center justify-between mt-auto pt-5 text-neutral-500 hover:underline cursor-pointer hover:text-neutral-800">
                                        <span className="text-sm font-medium text-primary">Ver detalhes</span>

                                        <ArrowRightIcon />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
