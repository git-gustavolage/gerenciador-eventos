import { useState } from "react";
import { Link, usePage } from "@inertiajs/react";
import Navbar from "@/Layouts/Common/Navbar";
import {
    CalendarBlankIcon,
    ClockIcon,
    MapPinIcon,
    UsersIcon,
    CheckCircleIcon,
    XCircleIcon,
    ChalkboardTeacherIcon,
    ArrowRightIcon,
    CaretDownIcon,
    CaretUpIcon,
} from "@phosphor-icons/react";

function formatDate(date) {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}

function formatTime(date) {
    if (!date) return "—";
    return new Date(date).toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
    });
}

function formatPeriodo(inicio, fim) {
    if (!inicio) return "—";
    const i = new Date(inicio);
    const f = fim ? new Date(fim) : null;
    if (f && i.toDateString() === f.toDateString()) {
        return `${formatDate(inicio)} · ${formatTime(inicio)} – ${formatTime(fim)}`;
    }
    return f ? `${formatDate(inicio)} – ${formatDate(fim)}` : formatDate(inicio);
}

function StatCard({ icon: Icon, label, value, accent }) {
    const styles = {
        emerald: { bar: "bg-emerald-500", icon: "bg-emerald-50 text-emerald-600", value: "text-emerald-700" },
        blue:    { bar: "bg-blue-500",    icon: "bg-blue-50 text-blue-600",       value: "text-blue-700"    },
        violet:  { bar: "bg-violet-500",  icon: "bg-violet-50 text-violet-600",   value: "text-violet-700"  },
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
            </div>
        </div>
    );
}

function AtividadeCard({ atividade }) {
    const [aberto, setAberto] = useState(false);
    const cancelada = atividade.is_cancelada;

    return (
        <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm overflow-hidden">
            <div className={`h-1 w-full ${cancelada ? "bg-red-400" : "bg-gradient-to-r from-emerald-400 to-teal-400"}`} />
            <div className="p-5">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1.5">
                            <h3 className="text-base font-bold text-neutral-900 leading-snug">
                                {atividade.titulo}
                            </h3>
                            {cancelada ? (
                                <span className="inline-flex items-center gap-1 rounded-full bg-red-50 border border-red-200 px-2.5 py-0.5 text-[11px] font-semibold text-red-600">
                                    <XCircleIcon size={11} weight="fill" /> Cancelada
                                </span>
                            ) : (
                                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-600">
                                    <CheckCircleIcon size={11} weight="fill" /> Ativa
                                </span>
                            )}
                        </div>

                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-neutral-500 font-medium">
                            <span className="flex items-center gap-1">
                                <CalendarBlankIcon size={12} weight="duotone" />
                                {formatPeriodo(atividade.data_inicio, atividade.data_fim)}
                            </span>
                            {atividade.ambiente?.nome && (
                                <span className="flex items-center gap-1">
                                    <MapPinIcon size={12} weight="duotone" />
                                    {atividade.ambiente.nome}
                                </span>
                            )}
                            {atividade.limite_participantes && (
                                <span className="flex items-center gap-1">
                                    <UsersIcon size={12} weight="duotone" />
                                    Limite: {atividade.limite_participantes}
                                </span>
                            )}
                        </div>
                    </div>

                    {atividade.evento && (
                        <Link
                            href={route("eventos.publico.show", atividade.evento.id)}
                            className="flex items-center gap-1.5 rounded-xl border border-neutral-200 px-3 py-1.5 text-xs font-semibold text-neutral-600 hover:bg-neutral-50 hover:border-neutral-300 transition-colors shrink-0"
                        >
                            Ver evento <ArrowRightIcon size={12} weight="bold" />
                        </Link>
                    )}
                </div>

                {atividade.descricao && (
                    <div className="mt-4 border-t border-neutral-100 pt-4">
                        <button
                            onClick={() => setAberto((v) => !v)}
                            className="flex w-full items-center justify-between text-xs font-semibold text-neutral-500 hover:text-neutral-700 transition-colors"
                        >
                            <span className="flex items-center gap-1.5">
                                <ClockIcon size={13} weight="duotone" />
                                Descrição da atividade
                            </span>
                            {aberto ? <CaretUpIcon size={12} weight="bold" /> : <CaretDownIcon size={12} weight="bold" />}
                        </button>

                        {aberto && (
                            <p className="mt-3 text-sm text-neutral-500 leading-relaxed">
                                {atividade.descricao}
                            </p>
                        )}
                    </div>
                )}
            </div>

            {atividade.evento?.titulo && (
                <div className="border-t border-neutral-100 px-5 py-3 bg-neutral-50 flex items-center gap-2">
                    <ChalkboardTeacherIcon size={13} className="text-neutral-400" />
                    <span className="text-xs text-neutral-500 font-medium">Evento:</span>
                    <span className="text-xs font-semibold text-emerald-700">{atividade.evento.titulo}</span>
                </div>
            )}
        </div>
    );
}

export default function MinhasAtividades() {
    const { ministrante, atividades = [] } = usePage().props;

    const ativas    = atividades.filter((a) => !a.is_cancelada);
    const canceladas = atividades.filter((a) => a.is_cancelada);

    return (
        <div className="min-h-screen bg-neutral-50">
            <Navbar />

            {/* Cabeçalho */}
            <div className="border-b border-neutral-200 bg-white">
                <div className="mx-auto max-w-6xl px-6 py-8 max-md:px-4">
                    <div className="flex items-center gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 shrink-0">
                            <ChalkboardTeacherIcon size={28} weight="duotone" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-neutral-900">
                                Olá, {ministrante.nome}
                            </h1>
                            <p className="mt-1 text-sm text-neutral-500">
                                Suas atividades como ministrante
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Conteúdo */}
            <div className="mx-auto max-w-6xl px-6 py-8 max-md:px-4 flex flex-col gap-8">
                {/* Stats */}
                <div className="flex flex-row gap-4">
                    <StatCard icon={CalendarBlankIcon} label="Total de atividades" value={atividades.length} accent="emerald" />
                    <StatCard icon={CheckCircleIcon}   label="Ativas"              value={ativas.length}     accent="blue"    />
                    <StatCard icon={XCircleIcon}       label="Canceladas"          value={canceladas.length} accent="violet"  />
                </div>

                {/* Lista */}
                <div className="flex flex-col gap-4">
                    {atividades.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-neutral-300 bg-white py-16 text-center shadow-sm">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-500">
                                <CalendarBlankIcon size={30} weight="duotone" />
                            </div>
                            <h3 className="text-lg font-semibold text-neutral-800">Nenhuma atividade encontrada</h3>
                            <p className="mt-1 text-sm text-neutral-500">
                                Você ainda não está vinculado a nenhuma atividade.
                            </p>
                        </div>
                    ) : (
                        atividades.map((atividade) => (
                            <AtividadeCard key={atividade.id} atividade={atividade} />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}