import { Input } from "@/Components/Inputs/Input";
import PrimaryButton from "@/Components/PrimaryButton";
import useData from "@/Hooks/useData";
import ManagerLayout from "@/Layouts/ManagerLayout";

import { router, usePage } from "@inertiajs/react";
import {
    PlusIcon,
    PencilSimpleIcon,
    TrashIcon,
    UserIcon,
    CheckCircleIcon,
    XIcon,
    EnvelopeIcon,
    PhoneIcon,
    BriefcaseIcon,
    BuildingOfficeIcon,
} from "@phosphor-icons/react";
import { useEffect, useState } from "react";

const EMPTY_FORM = { nome: "", email: "", telefone: "", cargo: "", instituicao: "" };

function Field({ label, error, ...props }) {
    return (
        <div className="flex flex-col gap-1.5">
            {label && <label className="text-sm font-medium text-neutral-700">{label}</label>}
            <Input {...props} />
            {error && <span className="text-xs text-red-500">{error}</span>}
        </div>
    );
}

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

function MinistranteModal({ editingId, initialData, onClose, onSuccess }) {
    const [data, setData] = useData(initialData);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    function handleSubmit() {
        setLoading(true);
        setErrors({});

        const isEditing = editingId !== null;
        const url    = isEditing ? route("ministrantes.update", editingId) : route("ministrantes.store");
        const method = isEditing ? "put" : "post";

        router[method](url, data, {
            onSuccess: () => onSuccess(isEditing ? "Ministrante atualizado!" : "Ministrante cadastrado!"),
            onError:   (e) => setErrors(e),
            onFinish:  () => setLoading(false),
            preserveScroll: true,
        });
    }

    return (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
            <div className="relative z-10 flex w-full max-w-lg flex-col gap-6 rounded-2xl border border-neutral-200 bg-white p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h2 className="text-lg font-semibold text-neutral-800">
                            {editingId ? "Editar ministrante" : "Novo ministrante"}
                        </h2>
                        <p className="mt-0.5 text-sm text-neutral-500">Preencha os dados do ministrante</p>
                    </div>
                    <button onClick={onClose} className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100">
                        <XIcon size={18} weight="bold" />
                    </button>
                </div>

                <div className="flex flex-col gap-4">
                    <Field label="Nome *" value={data.nome} onChange={(e) => setData("nome", e.target.value)} error={errors.nome} />
                    <Field label="E-mail" type="email" value={data.email} onChange={(e) => setData("email", e.target.value)} error={errors.email} />
                    <Field label="Telefone" value={data.telefone} onChange={(e) => setData("telefone", e.target.value)} error={errors.telefone} />
                    <Field label="Cargo" value={data.cargo} onChange={(e) => setData("cargo", e.target.value)} error={errors.cargo} />
                    <Field label="Instituição" value={data.instituicao} onChange={(e) => setData("instituicao", e.target.value)} error={errors.instituicao} />
                </div>

                <div className="flex justify-end gap-3 border-t border-neutral-100 pt-4">
                    <button type="button" onClick={onClose} className="rounded-xl border border-neutral-200 px-5 py-2.5 text-sm font-medium text-neutral-600 hover:bg-neutral-100">
                        Cancelar
                    </button>
                    <PrimaryButton onClick={handleSubmit} disabled={loading}>
                        {loading ? "Salvando..." : editingId ? "Salvar alterações" : "Cadastrar"}
                    </PrimaryButton>
                </div>
            </div>
        </div>
    );
}

export default function Index() {
    const { ministrantes } = usePage().props;
    const [modal, setModal] = useState(null);
    const [toast, setToast] = useState(null);

    function openNew() {
        setModal({ editingId: null, initialData: { ...EMPTY_FORM } });
    }

    function openEdit(m) {
        setModal({
            editingId: m.id,
            initialData: {
                nome:        m.nome ?? "",
                email:       m.email ?? "",
                telefone:    m.telefone ?? "",
                cargo:       m.cargo ?? "",
                instituicao: m.instituicao ?? "",
            },
        });
    }

    function handleSuccess(message) {
        setModal(null);
        setToast(message);
        router.reload({ only: ["ministrantes"] });
    }

    function handleDestroy(id) {
        if (!confirm("Remover este ministrante?")) return;
        router.delete(route("ministrantes.destroy", id), {
            onSuccess: () => {
                setToast("Ministrante removido.");
                router.reload({ only: ["ministrantes"] });
            },
            preserveScroll: true,
        });
    }

    return (
        <ManagerLayout title="Ministrantes">
            
            <div className="min-h-screen bg-neutral-50">
                {/* HEADER */}
                <div className="border-b border-neutral-200 bg-white">
                    <div className="mx-auto max-w-4xl px-6 py-8 max-md:px-4">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <div>
                                <h1 className="text-3xl font-bold tracking-tight text-neutral-900">Ministrantes</h1>
                                <p className="mt-1 text-sm text-neutral-500">Gerencie os ministrantes dos seus eventos</p>
                            </div>
                            <button onClick={openNew} className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700">
                                <PlusIcon size={16} weight="bold" />
                                Novo ministrante
                            </button>
                        </div>
                    </div>
                </div>

                {/* LISTA */}
                <div className="mx-auto max-w-4xl px-6 py-8 max-md:px-4">
                    {ministrantes.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-neutral-300 bg-white py-16 text-center shadow-sm">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-500">
                                <UserIcon size={30} weight="duotone" />
                            </div>
                            <h3 className="text-lg font-semibold text-neutral-800">Nenhum ministrante ainda</h3>
                            <p className="mt-1 text-sm text-neutral-500">Cadastre ministrantes para vinculá-los às atividades.</p>
                            <button onClick={openNew} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700">
                                <PlusIcon size={14} weight="bold" />
                                Novo ministrante
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {ministrantes.map((m) => (
                                <div key={m.id} className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-xl font-bold text-emerald-700">
                                            {m.nome?.charAt(0)?.toUpperCase()}
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <span className="font-semibold text-neutral-900">{m.nome}</span>
                                            <div className="flex flex-wrap gap-3 text-xs text-neutral-500">
                                                {m.email && (
                                                    <span className="inline-flex items-center gap-1">
                                                        <EnvelopeIcon size={12} />{m.email}
                                                    </span>
                                                )}
                                                {m.telefone && (
                                                    <span className="inline-flex items-center gap-1">
                                                        <PhoneIcon size={12} />{m.telefone}
                                                    </span>
                                                )}
                                                {m.cargo && (
                                                    <span className="inline-flex items-center gap-1">
                                                        <BriefcaseIcon size={12} />{m.cargo}
                                                    </span>
                                                )}
                                                {m.instituicao && (
                                                    <span className="inline-flex items-center gap-1">
                                                        <BuildingOfficeIcon size={12} />{m.instituicao}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => openEdit(m)} className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100">
                                            <PencilSimpleIcon size={15} />
                                            Editar
                                        </button>
                                        <button onClick={() => handleDestroy(m.id)} className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50">
                                            <TrashIcon size={15} />
                                            Remover
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {modal && (
                <MinistranteModal
                    key={modal.editingId ?? "new"}
                    editingId={modal.editingId}
                    initialData={modal.initialData}
                    onClose={() => setModal(null)}
                    onSuccess={handleSuccess}
                />
            )}

            {toast && <Toast message={toast} onClose={() => setToast(null)} />}
        </ManagerLayout>

        
    );
}