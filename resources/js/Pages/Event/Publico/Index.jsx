import { useState } from "react";
import Navbar from "@/Layouts/Common/Navbar";
import {
    CalendarBlankIcon,
    CalendarCheckIcon,
    ClockIcon,
    MapPinIcon,
    TagIcon,
    MonitorIcon,
    TelevisionIcon,
    HouseLineIcon,
    ArrowRightIcon,
    InfoIcon,
    ChairIcon,
    UserCircleIcon,
    CheckCircleIcon,
} from "@phosphor-icons/react";
import Modal from "@/Components/Modal";
import InputLabel from "@/Components/Inputs/InputLabel";
import { Input } from "@/Components/Inputs/Input";
import { router, usePage } from "@inertiajs/react";
import PrimaryButton from "@/Components/PrimaryButton";
import { useAction } from "@/Hooks/useAction";
import { store } from "@/Actions/store";
import { actionErrorHandlingDecorator } from "@/util/actionErrorHandlingDecorator";
import { routes } from "@/api/routes";

function formatDate(dateStr) {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    });
}

function formatTime(dateStr) {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
    });
}

function formatDateTime(dateStr) {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    return (
        d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" }) +
        " às " +
        d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
    );
}

function FormatoIcon({ formato }) {
    if (formato === "presencial") return <HouseLineIcon size={14} />;
    if (formato === "remoto") return <MonitorIcon size={14} />;
    return <TelevisionIcon size={14} />;
}

function statusInfo(evento) {
    if (evento.is_cancelado) return { label: "Cancelado", className: "bg-red-50 text-red-600 border border-red-200" };
    if (!evento.is_publicado)
        return { label: "Rascunho", className: "bg-neutral-100 text-neutral-500 border border-neutral-200" };
    if (evento.data_fim_inscricoes && new Date(evento.data_fim_inscricoes) < new Date())
        return { label: "Inscrições encerradas", className: "bg-amber-50 text-amber-700 border border-amber-200" };
    if (evento.data_inicio_inscricoes && new Date(evento.data_inicio_inscricoes) > new Date())
        return { label: "Em breve", className: "bg-blue-50 text-blue-700 border border-blue-200" };
    return { label: "Inscrições abertas", className: "bg-emerald-50 text-emerald-700 border border-emerald-200" };
}

function StatusBadge({ evento }) {
    const { label, className } = statusInfo(evento);
    return <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${className}`}>{label}</span>;
}

function InfoRow({ icon: Icon, children }) {
    return (
        <div className="flex items-start gap-2.5 text-sm text-neutral-600">
            <Icon size={16} weight="duotone" className="mt-0.5 shrink-0 text-emerald-600" />
            <div className="flex-1">{children}</div>
        </div>
    );
}

function InscricaoButton({ evento, onAbrirModal }) {
    const { label } = statusInfo(evento);
    const ativa = label === "Inscrições abertas";

    if (!ativa) {
        return (
            <button
                disabled
                className="w-full rounded-2xl bg-neutral-100 px-6 py-3.5 text-sm font-semibold text-neutral-400 cursor-not-allowed"
            >
                {label}
            </button>
        );
    }

    return (
        <button
            onClick={onAbrirModal}
            className="w-full rounded-2xl bg-emerald-600 px-6 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 active:scale-[.98] transition-all flex items-center justify-center gap-2"
        >
            Inscrever-se gratuitamente
            <ArrowRightIcon size={15} weight="bold" />
        </button>
    );
}

function MinhasInscricoes({ evento, atividadesInscritas, inscritoNoEvento }) {
    const temQualquer = inscritoNoEvento || atividadesInscritas.length > 0;
    if (!temQualquer) return null;

    const atvsInscritas = (evento.atividades ?? []).filter((a) => atividadesInscritas.includes(a.id));

    return (
        <div className="flex flex-col gap-2 pt-1 border-t border-neutral-100">
            <span className="text-xs font-medium text-neutral-400 uppercase tracking-wide">Suas inscrições</span>

            {/* Inscrição no evento geral */}
            {inscritoNoEvento && (
                <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 px-3 py-2">
                    <CheckCircleIcon size={14} weight="fill" className="text-emerald-600 shrink-0" />
                    <span className="text-xs font-medium text-emerald-800">Inscrito no evento geral</span>
                </div>
            )}

            {/* Atividades inscritas */}
            {atvsInscritas.map((a) => (
                <div key={a.id} className="flex items-start gap-2 rounded-xl bg-emerald-50 border border-emerald-200 px-3 py-2">
                    <CheckCircleIcon size={14} weight="fill" className="text-emerald-600 shrink-0 mt-0.5" />
                    <div className="flex flex-col min-w-0">
                        <span className="text-xs font-medium text-emerald-800 leading-snug">{a.titulo}</span>
                        <span className="text-xs text-emerald-600">
                            {formatTime(a.data_inicio)} – {formatTime(a.data_fim)}
                            {a.ambiente?.nome ? ` · ${a.ambiente.nome}` : ""}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
}

function AtividadeCard({ atividade }) {
    const dia = formatDate(atividade.data_inicio);
    const inicio = formatTime(atividade.data_inicio);
    const fim = formatTime(atividade.data_fim);

    return (
        <div
            className={`rounded-2xl border bg-white p-5 flex flex-col gap-3 transition-shadow hover:shadow-md ${
                atividade.is_cancelada ? "opacity-50" : "border-neutral-200 shadow-sm"
            }`}
        >
            <div className="flex items-start justify-between gap-3 flex-wrap">
                <h3 className="font-semibold text-neutral-800 leading-snug">{atividade.titulo}</h3>
                {atividade.is_cancelada && (
                    <span className="shrink-0 rounded-full bg-red-50 border border-red-200 px-2.5 py-0.5 text-xs font-medium text-red-600">
                        Cancelada
                    </span>
                )}
            </div>

            {atividade.descricao && <p className="text-sm text-neutral-500 leading-relaxed">{atividade.descricao}</p>}

            <div className="flex flex-wrap gap-3 text-xs text-neutral-500">
                <span className="inline-flex items-center gap-1">
                    <CalendarBlankIcon size={12} />
                    {dia}
                </span>
                <span className="inline-flex items-center gap-1">
                    <ClockIcon size={12} />
                    {inicio} – {fim}
                </span>
                {atividade.ambiente && (
                    <span className="inline-flex items-center gap-1">
                        <MapPinIcon size={12} />
                        {atividade.ambiente.nome}
                    </span>
                )}
                {atividade.limite_participantes && (
                    <span className="inline-flex items-center gap-1">
                        <ChairIcon size={12} />
                        Até {atividade.limite_participantes} vagas
                    </span>
                )}
            </div>

            {atividade.ministrantes?.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1 border-t border-neutral-100">
                    {atividade.ministrantes.map((m) => (
                        <div
                            key={m.id}
                            className="flex items-center gap-1.5 rounded-full bg-neutral-50 border border-neutral-200 px-3 py-1"
                        >
                            <UserCircleIcon size={14} weight="duotone" className="text-emerald-600" />
                            <span className="text-xs font-medium text-neutral-700">{m.nome}</span>
                            {m.cargo && <span className="text-xs text-neutral-400">· {m.cargo}</span>}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

function groupByDay(atividades) {
    const map = {};
    for (const a of atividades) {
        const day = new Date(a.data_inicio).toDateString();
        if (!map[day]) map[day] = { label: formatDate(a.data_inicio), items: [] };
        map[day].items.push(a);
    }
    return Object.values(map);
}

export default function EventoPublico({ evento, isOwner, inscritoNoEvento = false, atividadesInscritas = [] }) {
    const [modalAberto, setModalAberto] = useState(false);
    const [inscritoEvento, setInscritoEvento] = useState(inscritoNoEvento);
    const [atvsInscritas, setAtvsInscritas] = useState(atividadesInscritas);

    const ev = evento;
    const grupos = groupByDay(evento.atividades ?? []);
    const inscritosPercent = evento.limite_inscricoes
        ? Math.min(100, Math.round(((evento.total_inscricoes ?? 0) / evento.limite_inscricoes) * 100))
        : null;

    function handleInscricaoSucesso({ inscritoNoEvento: novoEvento, novasAtividades }) {
        if (novoEvento) setInscritoEvento(true);
        if (novasAtividades?.length) setAtvsInscritas((prev) => [...new Set([...prev, ...novasAtividades])]);
        setModalAberto(false);
    }

    return (
        <div className="min-h-screen bg-neutral-50 font-sans flex flex-col">
            <Navbar />

            {isOwner && (!evento.is_publicado || evento.is_cancelado) && (
                <div className="bg-amber-100 text-amber-900 text-center px-4 py-2.5 text-sm font-medium flex items-center justify-center gap-2 border border-amber-300 sticky top-14 z-10">
                    <InfoIcon size={18} weight="fill" />
                    <span>
                        Você está visualizando este evento como <strong>Organizador</strong>. Ele está em modo{" "}
                        <strong>{!evento.is_publicado ? "Rascunho" : "Cancelado"}</strong>.
                    </span>
                </div>
            )}

            <div className="w-full bg-neutral-200 relative aspect-[21/9] md:h-[380px] overflow-hidden border-b border-neutral-200">
                {evento.banner_path ? (
                    <img src={`/midia/${evento.banner_path}`} alt="Banner do evento" className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-emerald-800 via-neutral-900 to-neutral-800" />
                )}
            </div>

            <div className="mx-auto w-full max-w-5xl px-6 py-8 max-md:px-4 flex flex-col gap-8">
                <div className="flex flex-col gap-4 border-b border-neutral-200 pb-6">
                    <div className="flex items-center">
                        <StatusBadge evento={ev} />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black text-neutral-800 leading-tight tracking-tight">{ev.titulo}</h1>
                    <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-sm text-neutral-500 font-medium">
                        {ev.data_inicio && (
                            <span className="inline-flex items-center gap-1.5">
                                <CalendarBlankIcon size={16} className="text-neutral-400" />
                                {formatDate(ev.data_inicio)}
                                {ev.data_fim && ev.data_fim !== ev.data_inicio && <> – {formatDate(ev.data_fim)}</>}
                            </span>
                        )}
                        <span className="text-neutral-300 max-md:hidden">·</span>
                        <span className="inline-flex items-center gap-1.5 capitalize">
                            <FormatoIcon formato={ev.formato?.value ?? ev.formato} />
                            {(ev.formato?.value ?? ev.formato)?.replace("_", " ")}
                        </span>
                        {ev.local && (
                            <>
                                <span className="text-neutral-300 max-md:hidden">·</span>
                                <span className="inline-flex items-center gap-1.5">
                                    <MapPinIcon size={16} className="text-neutral-400" />
                                    {ev.local.nome}
                                </span>
                            </>
                        )}
                    </div>
                    {ev.categorias?.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-1">
                            {ev.categorias.map((c) => (
                                <span
                                    key={c}
                                    className="rounded-full bg-neutral-100 border border-neutral-200 px-3 py-0.5 text-xs font-semibold text-neutral-600"
                                >
                                    {c}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-[1fr_320px] gap-8 items-start">
                    <div className="flex flex-col gap-8">
                        {ev.descricao && (
                            <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm flex flex-col gap-3">
                                <h2 className="font-bold text-neutral-800 text-lg">Sobre o evento</h2>
                                <p className="text-sm text-neutral-600 leading-relaxed whitespace-pre-line">{ev.descricao}</p>
                            </section>
                        )}
                        {grupos.length > 0 && (
                            <section className="flex flex-col gap-4">
                                <h2 className="font-bold text-neutral-800 text-lg">Programação</h2>
                                {grupos.map((grupo) => (
                                    <div key={grupo.label} className="flex flex-col gap-3">
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1">
                                                {grupo.label}
                                            </span>
                                            <div className="flex-1 h-px bg-neutral-200" />
                                        </div>
                                        <div className="flex flex-col gap-3">
                                            {grupo.items.map((a) => (
                                                <AtividadeCard key={a.id} atividade={a} />
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </section>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="flex flex-col gap-4 md:sticky md:top-20">
                        {/* Card de inscrição */}
                        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm flex flex-col gap-5">
                            <div className="flex flex-col gap-1">
                                <span className="text-xs font-medium text-neutral-400 uppercase tracking-wide">Inscrição</span>
                                <span className="text-2xl font-extrabold text-emerald-600">Gratuita</span>
                            </div>

                            {ev.limite_inscricoes && (
                                <div className="flex flex-col gap-1.5">
                                    <div className="flex justify-between text-xs text-neutral-500">
                                        <span>{ev.total_inscricoes ?? 0} inscritos</span>
                                        <span>{ev.limite_inscricoes} vagas</span>
                                    </div>
                                    <div className="h-2 rounded-full bg-neutral-100 overflow-hidden">
                                        <div
                                            className="h-full rounded-full bg-emerald-500 transition-all"
                                            style={{ width: `${inscritosPercent}%` }}
                                        />
                                    </div>
                                    <p className="text-xs text-neutral-400">{100 - inscritosPercent}% das vagas disponíveis</p>
                                </div>
                            )}

                            <InscricaoButton evento={ev} onAbrirModal={() => setModalAberto(true)} />

                            {/* ── Inscrições do usuário ── */}
                            <MinhasInscricoes
                                evento={ev}
                                atividadesInscritas={atvsInscritas}
                                inscritoNoEvento={inscritoEvento}
                                onAbrirModal={() => setModalAberto(true)}
                            />

                            {ev.data_fim_inscricoes && (
                                <p className="text-xs text-neutral-400 text-center">
                                    Inscrições até {formatDateTime(ev.data_fim_inscricoes)}
                                </p>
                            )}
                        </div>

                        {/* Card de detalhes */}
                        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm flex flex-col gap-4">
                            <h3 className="font-semibold text-neutral-800 text-sm">Detalhes</h3>
                            <div className="flex flex-col gap-3">
                                {ev.data_inicio && (
                                    <InfoRow icon={CalendarBlankIcon}>
                                        {formatDate(ev.data_inicio)}
                                        {ev.data_fim && <> – {formatDate(ev.data_fim)}</>}
                                    </InfoRow>
                                )}
                                {ev.data_inicio && (
                                    <InfoRow icon={ClockIcon}>
                                        {formatTime(ev.data_inicio)} – {formatTime(ev.data_fim)}
                                    </InfoRow>
                                )}
                                {ev.local && (
                                    <InfoRow icon={MapPinIcon}>
                                        {ev.local.nome}
                                        {ev.local.endereco && (
                                            <span className="block text-xs text-neutral-400 mt-0.5">{ev.local.endereco}</span>
                                        )}
                                    </InfoRow>
                                )}
                                {ev.atividades?.length > 0 && (
                                    <InfoRow icon={CalendarCheckIcon}>
                                        {ev.atividades.filter((a) => !a.is_cancelada).length} atividades na programação
                                    </InfoRow>
                                )}
                                {ev.categorias?.length > 0 && <InfoRow icon={TagIcon}>{ev.categorias.join(", ")}</InfoRow>}
                            </div>
                        </div>

                        {ev.is_cancelado && (
                            <div className="rounded-2xl border border-red-200 bg-red-50 p-4 flex items-start gap-3">
                                <InfoIcon size={16} weight="fill" className="shrink-0 text-red-500 mt-0.5" />
                                <p className="text-sm text-red-700">Este evento foi cancelado.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <ModalInscricao evento={evento} show={modalAberto} onClose={() => setModalAberto(false)} center />
        </div>
    );
}

function ModalInscricao({ evento = {}, show, onClose }) {
    const { user = {} } = usePage().props.auth;

    const action = useAction({
        actionFn: actionErrorHandlingDecorator(store),
        onSuccess: () => {
            onClose();
            router.visit(route("meus_eventos"));
        },
    });

    const disabled = !user || action.loading;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (disabled) return;

        const payload = {
            id_evento: evento.id,
        };

        await action.execute(routes.inscricoes.store(), payload);
    };

    return (
        <Modal show={show} onClose={onClose} center>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="mb-6">
                    <h2 className="text-2xl font-semibold text-neutral-800">Inscrever-se no evento</h2>

                    <p className="mt-2 text-sm text-neutral-500">
                        Garanta sua participação e tenha acesso aos certificados disponibilizados pelo evento.
                    </p>
                </div>

                {user ? (
                    <div className="space-y-5">
                        <div className="grid gap-4">
                            <div>
                                <InputLabel value="Nome" />

                                <Input value={user.nome} disabled />
                            </div>

                            <div>
                                <InputLabel value="E-mail" />

                                <Input value={user.email} disabled />
                            </div>
                        </div>

                        <div className="rounded-sm border border-emerald-300 bg-emerald-50 p-4">
                            <div className="flex items-start gap-3">
                                <input type="checkbox" checked readOnly className="mt-1" />

                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <p className="font-medium text-neutral-800">Inscrição geral</p>

                                        <span className="text-sm font-semibold text-emerald-700">Gratuita</span>
                                    </div>

                                    <p className="mt-1 text-sm text-neutral-600">
                                        Acesso às atividades disponíveis no evento e emissão de certificados conforme as regras
                                        estabelecidas.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-neutral-200 pt-5">
                            <PrimaryButton className="w-full">Confirmar inscrição</PrimaryButton>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col gap-5">
                        <div className="rounded-sm border border-neutral-200 bg-neutral-50 p-4">
                            <p className="font-medium text-neutral-800">É necessário acessar sua conta</p>

                            <p className="mt-1 text-sm text-neutral-600">
                                Faça login ou crie uma conta para concluir sua inscrição no evento.
                            </p>
                        </div>

                        <div className="flex flex-col gap-3 py-2">
                            <a
                                href={route("login", { redirect: route("eventos.publico.show", { id: evento.id }) })}
                                className="w-full text-center rounded-sm bg-emerald-600 px-4 py-2 font-medium text-white transition-colors hover:bg-emerald-700"
                            >
                                Entrar
                            </a>

                            <a
                                href={route("register", { redirect: route("eventos.publico.show", { id: evento.id }) })}
                                className="w-full text-center rounded-sm border border-neutral-300 px-4 py-2 font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
                            >
                                Criar conta
                            </a>
                        </div>
                    </div>
                )}
            </form>
        </Modal>
    );
}
