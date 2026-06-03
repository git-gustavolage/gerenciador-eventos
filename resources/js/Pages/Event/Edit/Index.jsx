import { useEffect, useState } from "react";
import { router, usePage } from "@inertiajs/react";
import ManagerLayout from "@/Layouts/ManagerLayout";
import { PlusIcon, CalendarBlankIcon, UsersIcon, ClockIcon, CheckCircleIcon, XIcon } from "@phosphor-icons/react";

import AtividadeCard from "../Components/AtividadeCard";
import AtividadeModal from "../Components/AtividadeModal";

const EMPTY_FORM = {
    titulo: "",
    descricao: "",
    id_ambiente: "",
    data_inicio: "",
    data_fim: "",
    limite_participantes: "",
    ministrantes: [],
};

function formatDateForInput(date) {
    if (!date) return "";
    const d = new Date(date);
    const pad = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function Toast({ message, onClose }) {
    useEffect(() => {
        const t = setTimeout(onClose, 3500);
        return () => clearTimeout(t);
    }, [onClose]);

    return (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-white px-5 py-4 shadow-lg animate-in slide-in-from-top-5">
            <CheckCircleIcon size={20} weight="fill" className="shrink-0 text-emerald-500" />
            <span className="text-sm font-medium text-neutral-800">{message}</span>
            <button onClick={onClose} className="ml-2 text-neutral-400 hover:text-neutral-600">
                <XIcon size={14} weight="bold" />
            </button>
        </div>
    );
}

function StatCard({ icon: Icon, label, value, accent }) {
    const styles = {
        emerald: { icon: "bg-emerald-50 text-emerald-600", value: "text-emerald-700", bar: "bg-emerald-500" },
        blue: { icon: "bg-blue-50 text-blue-600", value: "text-blue-700", bar: "bg-blue-500" },
        violet: { icon: "bg-violet-50 text-violet-600", value: "text-violet-700", bar: "bg-violet-500" },
    };
    const s = styles[accent];
    return (
        <div className="relative overflow-hidden rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
            <div className={`absolute left-0 top-0 h-full w-1 ${s.bar}`} />
            <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl ${s.icon}`}>
                <Icon size={20} weight="duotone" />
            </div>
            <div>
                <p className={`text-3xl font-bold ${s.value}`}>{value}</p>
                <p className="text-sm text-neutral-500">{label}</p>
            </div>
        </div>
    );
}

// ── Página principal ──────────────────────────────────────────────────────────
export default function Index() {
    const { evento, ministrantes, ambientes = [] } = usePage().props;

    const [modalAtividade, setModalAtividade] = useState(null);
    const [toast, setToast] = useState(null);

    function openNew() {
            console.log("id_local:", evento.id_local); // <-- adiciona isso

        setModalAtividade({
            editingId: null,
            initialData: { ...EMPTY_FORM, id_evento: evento.id, id_local: evento.id_local },
        });
    }

    function openEdit(atividade) {
        setModalAtividade({
            editingId: atividade.id,
            initialData: {
                id_evento: evento.id,
                id_local: evento.id_local,
                titulo: atividade.titulo ?? "",
                descricao: atividade.descricao ?? "",
                id_ambiente: atividade.id_ambiente ?? "",
                data_inicio: (atividade.data_inicio),
                data_fim: formatDateForInput(atividade.data_fim),
                limite_participantes: atividade.limite_participantes ?? "",
                ministrantes: atividade.ministrantes?.map((m) => m.id) ?? [],
            },
        });
    }

    function handleDestroy(id) {
        if (!confirm("Tem certeza que deseja excluir esta atividade?")) return;
        router.delete(route("atividades.destroy", id), {
            onSuccess: () => setToast("Atividade excluída."),
            preserveScroll: true,
        });
    }

    return (
        <ManagerLayout title="Gerenciar Atividades">
            <div className="w-full h-full bg-neutral-50">
                <div className="border-b border-neutral-200 bg-white">
                    <div className="mx-auto max-w-6xl px-6 py-8 max-md:px-4">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <div>
                                <h1 className="text-3xl font-bold tracking-tight text-neutral-900">{evento.titulo}</h1>
                                <p className="mt-1 text-sm text-neutral-500">
                                    Gerencie atividades, horários e ministrantes
                                </p>
                            </div>
                            <button
                                onClick={openNew}
                                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700"
                            >
                                <PlusIcon size={16} weight="bold" /> Nova atividade
                            </button>
                        </div>
                    </div>
                </div>

                <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-8 max-md:px-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <StatCard
                            icon={CalendarBlankIcon}
                            label="Total de atividades"
                            value={evento.atividades?.length || 0}
                            accent="emerald"
                        />
                        <StatCard icon={UsersIcon} label="Ministrantes" value={ministrantes.length} accent="blue" />
                        <StatCard
                            icon={ClockIcon}
                            label="Atividades ativas"
                            value={evento.atividades?.filter((a) => !a.is_cancelada)?.length || 0}
                            accent="violet"
                        />
                    </div>

                    <div className="flex flex-col gap-4">
                        {evento.atividades?.length === 0 && (
                            <div className="rounded-2xl border border-dashed border-neutral-300 bg-white py-16 text-center shadow-sm">
                                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-500">
                                    <CalendarBlankIcon size={30} weight="duotone" />
                                </div>
                                <h3 className="text-lg font-semibold text-neutral-800">Nenhuma atividade ainda</h3>
                                <p className="mt-1 text-sm text-neutral-500">
                                    Clique em "Nova atividade" para começar.
                                </p>
                                <button
                                    onClick={openNew}
                                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
                                >
                                    <PlusIcon size={14} weight="bold" /> Nova atividade
                                </button>
                            </div>
                        )}

                        {evento.atividades?.map((atividade) => (
                            <AtividadeCard
                                key={atividade.id}
                                atividade={atividade}
                                onEdit={() => openEdit(atividade)}
                                onDestroy={() => handleDestroy(atividade.id)}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {modalAtividade && (
                <AtividadeModal
                    key={modalAtividade.editingId ?? "new"}
                    editingId={modalAtividade.editingId}
                    initialData={modalAtividade.initialData}
                    ministrantes={ministrantes}
                    ambientes={ambientes}
                    onClose={() => setModalAtividade(null)}
                    onSuccess={(msg) => {
                        setModalAtividade(null);
                        setToast(msg);
                        router.reload({ only: ["evento"] });
                    }}
                />
            )}

            {toast && <Toast message={toast} onClose={() => setToast(null)} />}
        </ManagerLayout>
    );
}
