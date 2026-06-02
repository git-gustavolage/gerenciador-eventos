import GuestLayout from "@/Layouts/GuestLayout";
import Navbar from "@/Layouts/Common/Navbar";
import { router, usePage } from "@inertiajs/react";
import {
    CalendarBlankIcon,
    CheckCircleIcon,
    XCircleIcon,
    ClockIcon,
    MapPinIcon,
    XIcon,
} from "@phosphor-icons/react";
import { useEffect, useState } from "react";

function Toast({ message, onClose }) {
    useEffect(() => {
        const t = setTimeout(onClose, 3500);
        return () => clearTimeout(t);
    }, []);
    return (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-white px-5 py-4 shadow-lg">
            <CheckCircleIcon size={20} weight="fill" className="shrink-0 text-emerald-500" />
            <span className="text-sm font-medium text-neutral-800">{message}</span>
            <button onClick={onClose} className="ml-2 text-neutral-400 hover:text-neutral-600">
                <XIcon size={14} weight="bold" />
            </button>
        </div>
    );
}

const STATUS = {
    pendente:   { label: "Aguardando resposta", className: "bg-amber-50 text-amber-700 border-amber-200" },
    confirmado: { label: "Confirmado",           className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    recusado:   { label: "Recusado",             className: "bg-red-50 text-red-600 border-red-200" },
};

export default function Convites() {
    const { ministrante } = usePage().props;
    const [toast, setToast] = useState(null);

    function fmt(date) {
        if (!date) return "—";
        return new Date(date).toLocaleString("pt-BR", {
            day: "2-digit", month: "2-digit", year: "numeric",
            hour: "2-digit", minute: "2-digit",
        });
    }

    function confirmar(atividadeId) {
        router.post(route("ministrantes.confirmar", atividadeId), {}, {
            onSuccess: () => {
                setToast("Participação confirmada!");
                router.reload({ only: ["ministrante"] });
            },
            preserveScroll: true,
        });
    }

    function recusar(atividadeId) {
        if (!confirm("Tem certeza que deseja recusar este convite?")) return;
        router.post(route("ministrantes.recusar", atividadeId), {}, {
            onSuccess: () => {
                setToast("Convite recusado.");
                router.reload({ only: ["ministrante"] });
            },
            preserveScroll: true,
        });
    }

    const atividades = ministrante?.atividades ?? [];
    const pendentes   = atividades.filter((a) => a.pivot.status === "pendente");
    const confirmadas = atividades.filter((a) => a.pivot.status === "confirmado");

    return (
        <GuestLayout title="Meus Convites">
            <Navbar />
            <div className="min-h-screen bg-neutral-50">
                {/* HEADER */}
                <div className="border-b border-neutral-200 bg-white">
                    <div className="mx-auto max-w-4xl px-6 py-8 max-md:px-4">
                        <h1 className="text-3xl font-bold tracking-tight text-neutral-900">Meus Convites</h1>
                        <p className="mt-1 text-sm text-neutral-500">
                            Atividades nas quais você foi convidado a ministrar
                        </p>
                    </div>
                </div>

                <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-8 max-md:px-4">

                    {/* PENDENTES */}
                    {pendentes.length > 0 && (
                        <section className="flex flex-col gap-4">
                            <h2 className="text-base font-semibold text-neutral-800">
                                Aguardando sua resposta
                                <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                                    {pendentes.length}
                                </span>
                            </h2>

                            {pendentes.map((atividade) => (
                                <div key={atividade.id} className="rounded-2xl border border-amber-200 bg-white p-5 shadow-sm">
                                    <div className="flex flex-wrap items-start justify-between gap-4">
                                        <div className="flex flex-col gap-2">
                                            <div>
                                                <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">
                                                    {atividade.evento?.titulo}
                                                </p>
                                                <h3 className="mt-0.5 text-base font-semibold text-neutral-900">
                                                    {atividade.titulo}
                                                </h3>
                                                {atividade.descricao && (
                                                    <p className="mt-1 text-sm text-neutral-500">{atividade.descricao}</p>
                                                )}
                                            </div>
                                            <div className="flex flex-wrap gap-3 text-sm text-neutral-500">
                                                <span className="inline-flex items-center gap-1.5">
                                                    <CalendarBlankIcon size={14} />
                                                    {fmt(atividade.data_inicio)}
                                                </span>
                                                <span className="text-neutral-300">→</span>
                                                <span className="inline-flex items-center gap-1.5">
                                                    <ClockIcon size={14} />
                                                    {fmt(atividade.data_fim)}
                                                </span>
                                                {atividade.local && (
                                                    <span className="inline-flex items-center gap-1.5">
                                                        <MapPinIcon size={14} />
                                                        {atividade.local}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex shrink-0 gap-2">
                                            <button
                                                onClick={() => confirmar(atividade.id)}
                                                className="inline-flex items-center gap-2 rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-100"
                                            >
                                                <CheckCircleIcon size={16} weight="fill" />
                                                Confirmar
                                            </button>
                                            <button
                                                onClick={() => recusar(atividade.id)}
                                                className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                                            >
                                                <XCircleIcon size={16} weight="fill" />
                                                Recusar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </section>
                    )}

                    {/* CONFIRMADAS */}
                    {confirmadas.length > 0 && (
                        <section className="flex flex-col gap-4">
                            <h2 className="text-base font-semibold text-neutral-800">
                                Participações confirmadas
                                <span className="ml-2 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
                                    {confirmadas.length}
                                </span>
                            </h2>

                            {confirmadas.map((atividade) => (
                                <div key={atividade.id} className="rounded-2xl border border-emerald-200 bg-white p-5 shadow-sm">
                                    <div className="flex flex-wrap items-start justify-between gap-4">
                                        <div className="flex flex-col gap-2">
                                            <div>
                                                <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">
                                                    {atividade.evento?.titulo}
                                                </p>
                                                <h3 className="mt-0.5 text-base font-semibold text-neutral-900">
                                                    {atividade.titulo}
                                                </h3>
                                            </div>
                                            <div className="flex flex-wrap gap-3 text-sm text-neutral-500">
                                                <span className="inline-flex items-center gap-1.5">
                                                    <CalendarBlankIcon size={14} />
                                                    {fmt(atividade.data_inicio)}
                                                </span>
                                                <span className="text-neutral-300">→</span>
                                                <span className="inline-flex items-center gap-1.5">
                                                    <ClockIcon size={14} />
                                                    {fmt(atividade.data_fim)}
                                                </span>
                                                {atividade.local && (
                                                    <span className="inline-flex items-center gap-1.5">
                                                        <MapPinIcon size={14} />
                                                        {atividade.local}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                                            <CheckCircleIcon size={13} weight="fill" />
                                            Confirmado
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </section>
                    )}

                    {/* VAZIO */}
                    {atividades.length === 0 && (
                        <div className="rounded-2xl border border-dashed border-neutral-300 bg-white py-16 text-center shadow-sm">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-neutral-100 text-neutral-400">
                                <CalendarBlankIcon size={30} weight="duotone" />
                            </div>
                            <h3 className="text-lg font-semibold text-neutral-800">Nenhum convite ainda</h3>
                            <p className="mt-1 text-sm text-neutral-500">
                                Quando um organizador te convidar para uma atividade, aparecerá aqui.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {toast && <Toast message={toast} onClose={() => setToast(null)} />}
        </GuestLayout>
    );
}