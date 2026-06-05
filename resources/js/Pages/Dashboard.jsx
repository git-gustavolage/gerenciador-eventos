import { useState } from "react";
import { Link, usePage } from "@inertiajs/react";
import {
    CalendarBlankIcon,
    CalendarCheckIcon,
    UsersIcon,
    PlusIcon,
    ArrowRightIcon,
    ClockIcon,
    TicketIcon,
    MapPinIcon,
    CheckCircleIcon,
    HourglassIcon,
    XCircleIcon,
    CaretDownIcon,
    CaretUpIcon,
    GearSixIcon,
} from "@phosphor-icons/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

function safeRoute(name, params) {
    try {
        return route(name, params);
    } catch {
        return "#";
    }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmtData(date) {
    return new Date(date).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}

function fmtHora(date) {
    return new Date(date).toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
    });
}

function fmtPeriodo(inicio, fim) {
    const i = new Date(inicio);
    const f = new Date(fim);
    if (i.toDateString() === f.toDateString()) {
        return `${fmtData(inicio)} · ${fmtHora(inicio)} – ${fmtHora(fim)}`;
    }
    return `${fmtData(inicio)} – ${fmtData(fim)}`;
}

// ── Badges ───────────────────────────────────────────────────────────────────

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

function InscricaoBadge({ status }) {
    const map = {
        confirmado: { label: "Confirmado", cls: "bg-emerald-50 text-emerald-700 border-emerald-200", Icon: CheckCircleIcon },
        pendente:   { label: "Pendente",   cls: "bg-amber-50 text-amber-700 border-amber-200",     Icon: HourglassIcon },
        cancelado:  { label: "Cancelado",  cls: "bg-red-50 text-red-700 border-red-200",           Icon: XCircleIcon },
    };
    const { label, cls, Icon } = map[status] ?? map.pendente;
    return (
        <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${cls}`}>
            <Icon size={11} weight="fill" />
            {label}
        </span>
    );
}

// ── Stat card ─────────────────────────────────────────────────────────────────

function StatCard({ icon: Icon, label, value, sub, accent }) {
    const styles = {
        emerald: { bar: "bg-emerald-500", icon: "bg-emerald-50 text-emerald-600", value: "text-emerald-700" },
        blue:    { bar: "bg-blue-500",    icon: "bg-blue-50 text-blue-600",       value: "text-blue-700" },
        violet:  { bar: "bg-violet-500",  icon: "bg-violet-50 text-violet-600",   value: "text-violet-700" },
        teal:    { bar: "bg-teal-500",    icon: "bg-teal-50 text-teal-600",       value: "text-teal-700" },
        cyan:    { bar: "bg-cyan-500",    icon: "bg-cyan-50 text-cyan-600",       value: "text-cyan-700" },
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

// ── Vista: Organizador ────────────────────────────────────────────────────────

function VistaOrganizador({ stats, eventos }) {
    return (
        <>
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
                    <EmptyOrganizador />
                ) : (
                    <div className="divide-y divide-neutral-100">
                        {eventos.map((evento) => (
                            <div
                                key={evento.id}
                                className="flex items-center justify-between gap-4 px-6 py-4 hover:bg-neutral-50 transition-colors flex-wrap"
                            >
                                <div className="flex flex-col gap-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="font-medium text-neutral-900 truncate">{evento.titulo}</span>
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
                                            {evento.total_inscricoes}{" "}
                                            {evento.total_inscricoes !== 1 ? "inscrições" : "inscrição"}
                                        </span>
                                        {evento.data_fim_inscricoes && (
                                            <>
                                                <span>·</span>
                                                <span className="flex items-center gap-1">
                                                    <ClockIcon size={12} />
                                                    Inscrições até{" "}
                                                    {new Date(evento.data_fim_inscricoes).toLocaleDateString("pt-BR")}
                                                </span>
                                            </>
                                        )}
                                    </div>
                                </div>

                                <Link
                                    href={safeRoute("eventos.organizacao.view", { id: evento.id })}
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
        </>
    );
}

function EmptyOrganizador() {
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

// ── Vista: Participante ───────────────────────────────────────────────────────

function CardEventoParticipante({ evento }) {
    const [aberto, setAberto] = useState(false);
    const ativas = evento.atividades_inscritas.filter((a) => a.status_inscricao !== "cancelado");

    return (
        <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm overflow-hidden">
            <div className="h-1 w-full bg-gradient-to-r from-emerald-400 to-teal-400" />
            <div className="p-5">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1.5">
                            <h3 className="text-base font-bold text-neutral-900 leading-snug">
                                {evento.titulo}
                            </h3>
                            <InscricaoBadge status={evento.status_inscricao} />
                        </div>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-neutral-500 font-medium">
                            <span className="flex items-center gap-1">
                                <CalendarBlankIcon size={12} weight="duotone" />
                                {fmtPeriodo(evento.data_inicio, evento.data_fim)}
                            </span>
                            {evento.local && (
                                <span className="flex items-center gap-1">
                                    <MapPinIcon size={12} weight="duotone" />
                                    {evento.local}
                                </span>
                            )}
                        </div>
                    </div>

                    <Link
                        href={safeRoute("eventos.publico.show", evento.id)}
                        className="flex items-center gap-1.5 rounded-xl border border-neutral-200 px-3 py-1.5 text-xs font-semibold text-neutral-600 hover:bg-neutral-50 hover:border-neutral-300 transition-colors shrink-0"
                    >
                        Ver evento <ArrowRightIcon size={12} weight="bold" />
                    </Link>
                </div>

                {ativas.length > 0 && (
                    <div className="mt-4 border-t border-neutral-100 pt-4">
                        <button
                            onClick={() => setAberto((v) => !v)}
                            className="flex w-full items-center justify-between text-xs font-semibold text-neutral-500 hover:text-neutral-700 transition-colors"
                        >
                            <span className="flex items-center gap-1.5">
                                <TicketIcon size={13} weight="duotone" />
                                {ativas.length} atividade{ativas.length !== 1 ? "s" : ""} inscrita{ativas.length !== 1 ? "s" : ""}
                            </span>
                            {aberto ? <CaretUpIcon size={12} weight="bold" /> : <CaretDownIcon size={12} weight="bold" />}
                        </button>

                        {aberto && (
                            <div className="mt-3 flex flex-col gap-2">
                                {ativas.map((atv) => (
                                    <div
                                        key={atv.id}
                                        className="flex items-start gap-3 rounded-xl border border-neutral-100 bg-neutral-50 px-4 py-3"
                                    >
                                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-neutral-800 leading-snug">
                                                {atv.titulo}
                                            </p>
                                            <p className="text-xs text-neutral-500 mt-0.5 flex items-center gap-1">
                                                <ClockIcon size={11} weight="duotone" />
                                                {fmtPeriodo(atv.data_inicio, atv.data_fim)}
                                                {atv.ambiente && ` · ${atv.ambiente}`}
                                            </p>
                                            {atv.ministrantes?.length > 0 && (
                                                <p className="text-xs text-neutral-400 mt-0.5 truncate">
                                                    {atv.ministrantes.join(", ")}
                                                </p>
                                            )}
                                        </div>
                                        <InscricaoBadge status={atv.status_inscricao} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

function VistaParticipante({ eventosParticipante }) {
    const totalAtividades = eventosParticipante.reduce(
        (acc, e) => acc + e.atividades_inscritas.filter((a) => a.status_inscricao !== "cancelado").length,
        0
    );
    const confirmados = eventosParticipante.filter((e) => e.status_inscricao === "confirmado").length;

    if (eventosParticipante.length === 0) {
        return (
            <div className="rounded-2xl border border-dashed border-neutral-300 bg-white py-16 text-center shadow-sm">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-500">
                    <TicketIcon size={30} weight="duotone" />
                </div>
                <h3 className="text-lg font-semibold text-neutral-800">Nenhuma inscrição ainda</h3>
                <p className="mt-1 text-sm text-neutral-500 max-w-xs mx-auto">
                    Explore a agenda e inscreva-se nos eventos que te interessam.
                </p>
                <Link
                    href={safeRoute("eventos.publico.index")}
                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 transition-colors"
                >
                    Explorar eventos
                </Link>
            </div>
        );
    }

    return (
        <>
            <div className="flex flex-row gap-4">
                <StatCard icon={TicketIcon}          label="Inscrições"  value={eventosParticipante.length} accent="emerald" />
                <StatCard icon={CheckCircleIcon}     label="Confirmadas" value={confirmados}                accent="teal" />
                <StatCard icon={CalendarBlankIcon}   label="Atividades"  value={totalAtividades}            accent="cyan" />
            </div>

            <div className="flex flex-col gap-4">
                {eventosParticipante.map((evento) => (
                    <CardEventoParticipante key={evento.id} evento={evento} />
                ))}
            </div>
        </>
    );
}

// ── Página principal ───────────────────────────────────────────────────────────

export default function Dashboard({ stats, eventos, eventosParticipante = [] }) {
    const [modo, setModo] = useState("organizador");
    const isOrg = modo === "organizador";

    return (
        <AuthenticatedLayout title="Meus Eventos" defaultSidebarOpen={false}>
            <div className="border-b border-neutral-200 bg-white">
                <div className="mx-auto max-w-6xl px-6 py-8 max-md:px-4">
                    <div className="flex items-center justify-between gap-4 flex-wrap">
                        <div>
                            <h1 className="text-2xl font-bold text-neutral-900">Meus Eventos</h1>
                            <p className="mt-1 text-sm text-neutral-500">
                                Gerencie seus eventos e acompanhe as inscrições
                            </p>
                        </div>

                        {isOrg && (
                            <Link
                                href={safeRoute("eventos.create")}
                                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 active:bg-emerald-800 transition-colors"
                            >
                                <PlusIcon size={16} weight="bold" />
                                Novo evento
                            </Link>
                        )}
                    </div>

                    {/* Toggle */}
                    <div className="mt-6 inline-flex rounded-xl border border-neutral-200 bg-neutral-100 p-1 gap-1">
                        <button
                            onClick={() => setModo("organizador")}
                            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
                                isOrg
                                    ? "bg-white text-emerald-700 shadow-sm border border-emerald-100"
                                    : "text-neutral-500 hover:text-neutral-700"
                            }`}
                        >
                            <GearSixIcon size={15} weight={isOrg ? "fill" : "regular"} className={isOrg ? "text-emerald-600" : ""} />
                            Organizador
                            {eventos.length > 0 && (
                                <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${isOrg ? "bg-emerald-100 text-emerald-700" : "bg-neutral-200 text-neutral-500"}`}>
                                    {eventos.length}
                                </span>
                            )}
                        </button>

                        <button
                            onClick={() => setModo("participante")}
                            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
                                !isOrg
                                    ? "bg-white text-teal-700 shadow-sm border border-teal-100"
                                    : "text-neutral-500 hover:text-neutral-700"
                            }`}
                        >
                            <TicketIcon size={15} weight={!isOrg ? "fill" : "regular"} className={!isOrg ? "text-teal-600" : ""} />
                            Participante
                            {eventosParticipante.length > 0 && (
                                <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${!isOrg ? "bg-teal-100 text-teal-700" : "bg-neutral-200 text-neutral-500"}`}>
                                    {eventosParticipante.length}
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-6xl px-6 py-8 max-md:px-4 flex flex-col gap-8">
                {isOrg
                    ? <VistaOrganizador stats={stats} eventos={eventos} />
                    : <VistaParticipante eventosParticipante={eventosParticipante} />
                }
            </div>
        </AuthenticatedLayout>
    );
}