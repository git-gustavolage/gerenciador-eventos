import { Input } from "@/Components/Inputs/Input";
import PrimaryButton from "@/Components/PrimaryButton";
import useData from "@/Hooks/useData";
import { router, usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";

import GuestLayout from "@/Layouts/GuestLayout";
import Navbar from "@/Layouts/Common/Navbar";

import {
    PlusIcon,
    CalendarBlankIcon,
    MapPinIcon,
    UsersIcon,
    PencilSimpleIcon,
    TrashIcon,
    ChalkboardTeacherIcon,
    ClockIcon,
    CheckCircleIcon,
    XIcon,
} from "@phosphor-icons/react";

const EMPTY_FORM = {
    titulo: "",
    descricao: "",
    local: "",
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

// ── Field — Input com label e erro (Input do projeto não tem isso) ─────────────
function Field({ label, error, ...props }) {
    return (
        <div className="flex flex-col gap-1.5">
            {label && (
                <label className="text-sm font-medium text-neutral-700">{label}</label>
            )}
            <Input {...props} />
            {error && (
                <span className="text-xs text-red-500">{error}</span>
            )}
        </div>
    );
}

// ── Toast ─────────────────────────────────────────────────────────────────────
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

// ── Modal ─────────────────────────────────────────────────────────────────────
function AtividadeModal({ editingId, initialData, ministrantes, onClose, onSuccess }) {
    const [data, setData] = useData(initialData);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    function toggleMinistrante(id) {
        const current = data.ministrantes ?? [];
        const next = current.includes(id)
            ? current.filter((m) => m !== id)
            : [...current, id];
        setData("ministrantes", next);
    }

    function handleSubmit() {
        setLoading(true);
        setErrors({});

        const payload = {
            ...data,
            limite_participantes: data.limite_participantes || null,
        };

        const isEditing = editingId !== null;
        const url    = isEditing ? route("atividades.update", editingId) : route("atividades.store");
        const method = isEditing ? "put" : "post";

        router[method](url, payload, {
            onSuccess: () => onSuccess(isEditing ? "Atividade atualizada!" : "Atividade criada com sucesso!"),
            onError:   (e) => setErrors(e),
            onFinish:  () => setLoading(false),
            preserveScroll: true,
        });
    }

    return (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />

            <div className="relative z-10 flex w-full max-w-2xl flex-col gap-6 rounded-2xl border border-neutral-200 bg-white p-6 shadow-2xl max-h-[90vh] overflow-y-auto">

                {/* Cabeçalho */}
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h2 className="text-lg font-semibold text-neutral-800">
                            {editingId ? "Editar atividade" : "Nova atividade"}
                        </h2>
                        <p className="mt-0.5 text-sm text-neutral-500">
                            Preencha as informações da atividade
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600"
                    >
                        <XIcon size={18} weight="bold" />
                    </button>
                </div>

                {/* Campos */}
                <div className="flex flex-col gap-5">
                    <Field
                        label="Título"
                        value={data.titulo}
                        onChange={(e) => setData("titulo", e.target.value)}
                        error={errors.titulo}
                    />

                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-neutral-700">Descrição</label>
                        <textarea
                            value={data.descricao}
                            onChange={(e) => setData("descricao", e.target.value)}
                            rows={3}
                            className="w-full rounded-sm border border-neutral-300 px-3 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-emerald-300 text-neutral-700"
                        />
                        {errors.descricao && (
                            <span className="text-xs text-red-500">{errors.descricao}</span>
                        )}
                    </div>

                    <Field
                        label="Local"
                        value={data.local}
                        onChange={(e) => setData("local", e.target.value)}
                        error={errors.local}
                    />

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <Field
                            label="Data de início"
                            type="datetime-local"
                            value={data.data_inicio}
                            onChange={(e) => setData("data_inicio", e.target.value)}
                            error={errors.data_inicio}
                        />
                        <Field
                            label="Data de fim"
                            type="datetime-local"
                            value={data.data_fim}
                            onChange={(e) => setData("data_fim", e.target.value)}
                            error={errors.data_fim}
                        />
                    </div>

                    <Field
                        label="Limite de participantes"
                        type="number"
                        min={1}
                        value={data.limite_participantes}
                        onChange={(e) => setData("limite_participantes", e.target.value)}
                        error={errors.limite_participantes}
                    />

                    {/* Ministrantes */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-neutral-700">Ministrantes</label>
                        {ministrantes.length === 0 ? (
                            <div className="rounded-sm border border-dashed border-neutral-300 p-4 text-sm text-neutral-500">
                                Nenhum ministrante cadastrado ainda.
                            </div>
                        ) : (
                            <div className="flex flex-wrap gap-2">
                                {ministrantes.map((m) => {
                                    const selected = (data.ministrantes ?? []).includes(m.id);
                                    return (
                                        <button
                                            key={m.id}
                                            type="button"
                                            onClick={() => toggleMinistrante(m.id)}
                                            className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition-all ${
                                                selected
                                                    ? "border-emerald-500 bg-emerald-500 text-white"
                                                    : "border-neutral-200 bg-white text-neutral-600 hover:border-emerald-300 hover:bg-emerald-50"
                                            }`}
                                        >
                                            <ChalkboardTeacherIcon size={14} />
                                            {m.nome}
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                        {errors.ministrantes && (
                            <span className="text-xs text-red-500">{errors.ministrantes}</span>
                        )}
                    </div>
                </div>

                {/* Rodapé */}
                <div className="flex justify-end gap-3 border-t border-neutral-100 pt-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-xl border border-neutral-200 px-5 py-2.5 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-100"
                    >
                        Cancelar
                    </button>
                    <PrimaryButton onClick={handleSubmit} disabled={loading}>
                        {loading ? "Salvando..." : editingId ? "Salvar alterações" : "Criar atividade"}
                    </PrimaryButton>
                </div>
            </div>
        </div>
    );
}

// ── Página principal ──────────────────────────────────────────────────────────
export default function Index() {
    const { evento, ministrantes } = usePage().props;

    const [modal, setModal] = useState(null);
    const [toast, setToast] = useState(null);

    function openNew() {
        setModal({
            editingId: null,
            initialData: {
                ...EMPTY_FORM,
                id_evento: evento.id, // ✅ id_evento incluso no criar também
            },
        });
    }

    function openEdit(atividade) {
        setModal({
            editingId: atividade.id,
            initialData: {
                id_evento:            evento.id,
                titulo:               atividade.titulo ?? "",
                descricao:            atividade.descricao ?? "",
                local:                atividade.local ?? "",
                data_inicio:          formatDateForInput(atividade.data_inicio),
                data_fim:             formatDateForInput(atividade.data_fim),
                limite_participantes: atividade.limite_participantes ?? "",
                ministrantes:         atividade.ministrantes?.map((m) => m.id) ?? [],
            },
        });
    }

    function handleModalSuccess(message) {
        setModal(null);
        setToast(message);
        router.reload({ only: ["evento"] });
    }

    function handleDestroy(id) {
        if (!confirm("Tem certeza que deseja excluir esta atividade?")) return;
        router.delete(route("atividades.destroy", id), {
            onSuccess: () => {
                setToast("Atividade excluída.");
                router.reload({ only: ["evento"] });
            },
            preserveScroll: true,
        });
    }

    return (
        <GuestLayout title="Gerenciar Atividades">
            <Navbar />

            <div className="min-h-screen bg-neutral-50">
                {/* HEADER */}
                <div className="border-b border-neutral-200 bg-white">
                    <div className="mx-auto max-w-6xl px-6 py-8 max-md:px-4">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <div>
                                <h1 className="text-3xl font-bold tracking-tight text-neutral-900">
                                    {evento.titulo}
                                </h1>
                                <p className="mt-1 text-sm text-neutral-500">
                                    Gerencie atividades, horários e ministrantes
                                </p>
                            </div>
                            <button
                                onClick={openNew}
                                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700"
                            >
                                <PlusIcon size={16} weight="bold" />
                                Nova atividade
                            </button>
                        </div>
                    </div>
                </div>

                {/* CONTENT */}
                <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-8 max-md:px-4">
                    {/* STATS */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <StatCard icon={CalendarBlankIcon} label="Total de atividades" value={evento.atividades?.length || 0}                                  accent="emerald" />
                        <StatCard icon={UsersIcon}         label="Ministrantes"         value={ministrantes.length}                                            accent="blue"    />
                        <StatCard icon={ClockIcon}         label="Atividades ativas"    value={evento.atividades?.filter((a) => !a.is_cancelada)?.length || 0} accent="violet"  />
                    </div>

                    {/* LISTA */}
                    <div className="flex flex-col gap-4">
                        {evento.atividades?.length === 0 && (
                            <div className="rounded-2xl border border-dashed border-neutral-300 bg-white py-16 text-center shadow-sm">
                                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-500">
                                    <CalendarBlankIcon size={30} weight="duotone" />
                                </div>
                                <h3 className="text-lg font-semibold text-neutral-800">Nenhuma atividade ainda</h3>
                                <p className="mt-1 text-sm text-neutral-500">Clique em "Nova atividade" para começar.</p>
                                <button
                                    onClick={openNew}
                                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
                                >
                                    <PlusIcon size={14} weight="bold" />
                                    Nova atividade
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

            {modal && (
                <AtividadeModal
                    key={modal.editingId ?? "new"}
                    editingId={modal.editingId}
                    initialData={modal.initialData}
                    ministrantes={ministrantes}
                    onClose={() => setModal(null)}
                    onSuccess={handleModalSuccess}
                />
            )}

            {toast && <Toast message={toast} onClose={() => setToast(null)} />}
        </GuestLayout>
    );
}

// ── StatCard ──────────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, accent }) {
    const styles = {
        emerald: { icon: "bg-emerald-50 text-emerald-600", value: "text-emerald-700", bar: "bg-emerald-500" },
        blue:    { icon: "bg-blue-50 text-blue-600",       value: "text-blue-700",    bar: "bg-blue-500"    },
        violet:  { icon: "bg-violet-50 text-violet-600",   value: "text-violet-700",  bar: "bg-violet-500"  },
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

// ── AtividadeCard ─────────────────────────────────────────────────────────────
function AtividadeCard({ atividade, onEdit, onDestroy }) {
    const fmt = (date) =>
        date
            ? new Date(date).toLocaleString("pt-BR", {
                  day: "2-digit", month: "2-digit", year: "numeric",
                  hour: "2-digit", minute: "2-digit",
              })
            : "—";

    return (
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex min-w-0 flex-col gap-3">
                    <div>
                        <h3 className="text-base font-semibold text-neutral-900">{atividade.titulo}</h3>
                        {atividade.descricao && (
                            <p className="mt-1 text-sm leading-relaxed text-neutral-500">{atividade.descricao}</p>
                        )}
                    </div>
                    <div className="flex flex-wrap gap-3 text-sm text-neutral-500">
                        <span className="inline-flex items-center gap-1.5">
                            <CalendarBlankIcon size={14} className="shrink-0" />
                            {fmt(atividade.data_inicio)}
                        </span>
                        <span className="text-neutral-300">→</span>
                        <span className="inline-flex items-center gap-1.5">
                            <ClockIcon size={14} className="shrink-0" />
                            {fmt(atividade.data_fim)}
                        </span>
                        {atividade.local && (
                            <span className="inline-flex items-center gap-1.5">
                                <MapPinIcon size={14} className="shrink-0" />
                                {atividade.local}
                            </span>
                        )}
                        {atividade.limite_participantes && (
                            <span className="inline-flex items-center gap-1.5">
                                <UsersIcon size={14} className="shrink-0" />
                                {atividade.limite_participantes} vagas
                            </span>
                        )}
                    </div>
                    {atividade.ministrantes?.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {atividade.ministrantes.map((m) => (
                                <span key={m.id} className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                                    <ChalkboardTeacherIcon size={11} />
                                    {m.nome}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
                <div className="flex shrink-0 items-center gap-2">
                    <button onClick={onEdit} className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100">
                        <PencilSimpleIcon size={15} />
                        Editar
                    </button>
                    <button onClick={onDestroy} className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50">
                        <TrashIcon size={15} />
                        Excluir
                    </button>
                </div>
            </div>
        </div>
    );
}
