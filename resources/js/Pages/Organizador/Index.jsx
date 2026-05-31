import { Link } from "@inertiajs/react";
import {
    CalendarBlankIcon,
    CalendarCheckIcon,
    UsersIcon,
    PlusIcon,
    ArrowRightIcon,
    ClockIcon,
} from "@phosphor-icons/react";
import ManagerLayout from "@/Layouts/ManagerLayout";

function safeRoute(name, params) {
    try { return route(name, params); } catch { return "#"; }
}

function statusInfo(evento) {
    if (evento.is_cancelado)
        return { label: "Cancelado", className: "bg-red-50 text-red-600 border border-red-100" };
    if (!evento.is_publicado)
        return { label: "Rascunho", className: "bg-neutral-100 text-neutral-500 border border-neutral-200" };
    if (evento.data_fim_inscricoes && new Date(evento.data_fim_inscricoes) < new Date())
        return { label: "Encerrado", className: "bg-amber-50 text-amber-600 border border-amber-100" };
    return { label: "Publicado", className: "bg-emerald-50 text-emerald-700 border border-emerald-100" };
}

function StatusBadge({ evento }) {
    const { label, className } = statusInfo(evento);
    return (
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${className}`}>
            {label}
        </span>
    );
}

function StatCard({ icon: Icon, label, value, sub, accent }) {
    const styles = {
        emerald: { bar: "bg-emerald-500", icon: "bg-emerald-50 text-emerald-600", value: "text-emerald-700" },
        blue: { bar: "bg-blue-500", icon: "bg-blue-50 text-blue-600", value: "text-blue-700" },
        violet: { bar: "bg-violet-500", icon: "bg-violet-50 text-violet-600", value: "text-violet-700" },
    };
    const s = styles[accent];

    return (
        <div className="relative overflow-hidden rounded-2xl bg-white border border-neutral-200 p-5 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow flex-1 min-w-0">
            <div className={`absolute left-0 top-0 h-full w-1 ${s.bar}`} />

            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${s.icon}`}>
                <Icon size={20} weight="duotone" />
            </div>

            <div>
                <p className={`text-3xl font-bold tracking-tight ${s.value}`}>{value}</p>
                <p className="mt-0.5 text-sm font-medium text-neutral-700 leading-snug">{label}</p>
                {sub && <p className="mt-0.5 text-xs text-neutral-400">{sub}</p>}
            </div>
        </div>
    );
}

function EmptyState() {
    return (
        <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-500 mb-4">
                <CalendarBlankIcon size={32} weight="duotone" />
            </div>
            <h3 className="text-lg font-semibold text-neutral-800">Nenhum evento ainda</h3>
            <p className="mt-1 text-sm text-neutral-400 max-w-xs">
                Crie seu primeiro evento e comece a gerenciar inscrições.
            </p>
            <Link
                href={safeRoute("eventos.create")}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 transition-colors"
            >
                <PlusIcon size={16} weight="bold" />
                Criar evento
            </Link>
        </div>
    );
}

export default function Dashboard({ stats, eventos }) {
    return (
        <ManagerLayout title="Meus Eventos" defaultSidebarOpen={false}>

            <div className="border-b border-neutral-200 bg-white">
                <div className="mx-auto max-w-6xl px-6 py-8 max-md:px-4">
                    <div className="flex items-center justify-between gap-4 flex-wrap">
                        <div>
                            <h1 className="text-2xl font-bold text-neutral-900">Meus Eventos</h1>
                            <p className="mt-1 text-sm text-neutral-500">
                                Gerencie seus eventos e acompanhe as inscrições
                            </p>
                        </div>

                        <Link
                            href={safeRoute("eventos.create")}
                            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 active:bg-emerald-800 transition-colors"
                        >
                            <PlusIcon size={16} weight="bold" />
                            Novo evento
                        </Link>
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-6xl px-6 py-8 max-md:px-4 flex flex-col gap-8">


                <div className="flex flex-row gap-4">
                    <StatCard
                        icon={CalendarBlankIcon}
                        label="Total de eventos"
                        value={stats.total_eventos}
                        sub="Criados e co-organizados"
                        accent="emerald"
                    />
                    <StatCard
                        icon={CalendarCheckIcon}
                        label="Publicados com inscrições ativas"
                        value={stats.eventos_publicados_ativos}
                        sub="Inscrições ainda abertas"
                        accent="blue"
                    />
                    <StatCard
                        icon={UsersIcon}
                        label="Total de inscrições"
                        value={stats.total_inscricoes}
                        sub="Em todas as atividades"
                        accent="violet"
                    />
                </div>

                <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm overflow-hidden">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
                        <h2 className="font-semibold text-neutral-800">Todos os eventos</h2>
                        <span className="text-xs text-neutral-400">
                            {eventos.length} evento{eventos.length !== 1 ? "s" : ""}
                        </span>
                    </div>

                    {eventos.length === 0 ? (
                        <EmptyState />
                    ) : (
                        <div className="divide-y divide-neutral-100">
                            {eventos.map((evento) => (
                                <div
                                    key={evento.id}
                                    className="flex items-center justify-between gap-4 px-6 py-4 hover:bg-neutral-50 transition-colors flex-wrap"
                                >
                                    <div className="flex flex-col gap-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="font-medium text-neutral-900 truncate">
                                                {evento.titulo}
                                            </span>
                                            <StatusBadge evento={evento} />
                                        </div>

                                        <div className="flex items-center gap-3 text-xs text-neutral-400 flex-wrap">
                                            <span className="capitalize">{evento.formato?.replace("_", " ")}</span>

                                            <span>·</span>

                                            <span className="flex items-center gap-1">
                                                <CalendarBlankIcon size={12} />
                                                {evento.total_atividades} atividade{evento.total_atividades !== 1 ? "s" : ""}
                                            </span>

                                            <span>·</span>

                                            <span className="flex items-center gap-1">
                                                <UsersIcon size={12} />
                                                {evento.total_inscricoes} {evento.total_inscricoes !== 1 ? "inscrições" : "inscrição"}
                                            </span>

                                            {evento.data_fim_inscricoes && (
                                                <>
                                                    <span>·</span>
                                                    <span className="flex items-center gap-1">
                                                        <ClockIcon size={12} />
                                                        Inscrições até {new Date(evento.data_fim_inscricoes).toLocaleDateString("pt-BR")}
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    <Link
                                        href={safeRoute("organizador.evento", { id: evento.id })}
                                        className="flex-shrink-0 inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-600 hover:bg-neutral-100 transition-colors"
                                    >
                                        Gerenciar
                                        <ArrowRightIcon size={12} weight="bold" />
                                    </Link>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </ManagerLayout>
    );
}
