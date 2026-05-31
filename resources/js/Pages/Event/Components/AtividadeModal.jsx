import { useState } from "react";
import { router } from "@inertiajs/react";
import { Input } from "@/Components/Inputs/Input";
import PrimaryButton from "@/Components/PrimaryButton";
import useData from "@/Hooks/useData";
import { PlusIcon, XIcon, ChalkboardTeacherIcon } from "@phosphor-icons/react";
import Select from "react-select";
import AmbienteModal from "./AmbienteModal";
import DateTimeInput from "@/Components/Inputs/DateTimeInput";

function Field({ label, error, ...props }) {
    return (
        <div className="flex flex-col gap-1.5">
            {label && <label className="text-sm font-medium text-neutral-700">{label}</label>}
            <Input {...props} />
            {error && <span className="text-xs text-red-500">{error}</span>}
        </div>
    );
}

export default function AtividadeModal({ editingId, initialData, ministrantes, ambientes, onClose, onSuccess }) {
    const [ambientesOptions, setAmbientesOptions] = useState(ambientes);
    const [data, setData] = useData(initialData);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const [showAmbienteModal, setShowAmbienteModal] = useState(false);

    const ambienteSelecionado = ambientesOptions.find((a) => a.id === Number(data.id_ambiente));
    const maxParticipantes = ambienteSelecionado?.capacidade || undefined;

    const ambienteOptions = ambientesOptions.map((amb) => ({
        value: amb.id,
        label: `${amb.nome} ${amb.capacidade ? `(Cap: ${amb.capacidade})` : ""}`,
    }));

    const currentAmbienteOption = ambienteOptions.find((opt) => opt.value === Number(data.id_ambiente)) || null;

    function toggleMinistrante(id) {
        const current = data.ministrantes ?? [];
        const next = current.includes(id) ? current.filter((m) => m !== id) : [...current, id];
        setData("ministrantes", next);
    }

    function handleSubmit() {
        setLoading(true);
        setErrors({});

        if (maxParticipantes && data.limite_participantes && Number(data.limite_participantes) > maxParticipantes) {
            setErrors({
                limite_participantes: `O limite não pode exceder a capacidade do ambiente (${maxParticipantes}).`,
            });
            setLoading(false);
            return;
        }

        const payload = { ...data, limite_participantes: data.limite_participantes || null };
        const isEditing = editingId !== null;
        const url = isEditing ? route("atividades.update", editingId) : route("atividades.store");
        const method = isEditing ? "put" : "post";

        router[method](url, payload, {
            onSuccess: () => onSuccess(isEditing ? "Atividade atualizada!" : "Atividade criada com sucesso!"),
            onError: (e) => setErrors(e),
            onFinish: () => setLoading(false),
            preserveScroll: true,
        });
    }

    return (
        <>
            <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
                <div className="relative z-10 flex w-full max-w-2xl flex-col gap-6 rounded-2xl border border-neutral-200 bg-white p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <h2 className="text-lg font-semibold text-neutral-800">
                                {editingId ? "Editar atividade" : "Nova atividade"}
                            </h2>
                            <p className="mt-0.5 text-sm text-neutral-500">Preencha as informações da atividade</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600"
                        >
                            <XIcon size={18} weight="bold" />
                        </button>
                    </div>

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
                            {errors.descricao && <span className="text-xs text-red-500">{errors.descricao}</span>}
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <DateTimeInput
                                id="data_inicio"
                                label="Data de início"
                                value={data.data_inicio}
                                onChange={(e) => setData("data_inicio", e.target.value)}
                            />
                        </div>
                        
                        <div className="flex flex-col gap-1.5">
                            <DateTimeInput
                                id="data_fim"
                                label="Data de fim"
                                value={data.data_fim}
                                onChange={(e) => setData("data_fim", e.target.value)}
                            />
                        </div>

                        <div className="flex flex-col gap-5">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-medium text-neutral-700">Ambiente (Local)</label>
                                <div className="flex gap-2">
                                    <div className="flex-1">
                                        <Select
                                            options={ambienteOptions}
                                            value={currentAmbienteOption}
                                            onChange={(selectedOption) =>
                                                setData("id_ambiente", selectedOption ? selectedOption.value : "")
                                            }
                                            placeholder="Selecione..."
                                            isClearable
                                            noOptionsMessage={() => "Nenhum ambiente encontrado"}
                                            styles={{
                                                control: (base, state) => ({
                                                    ...base,
                                                    borderColor: state.isFocused ? "#10b981" : "#d4d4d8",
                                                    boxShadow: state.isFocused ? "0 0 0 1px #6ee7b7" : "none",
                                                    borderRadius: "0.125rem",
                                                    minHeight: "46px",
                                                    fontSize: "0.875rem",
                                                    backgroundColor: "white",
                                                    "&:hover": {
                                                        borderColor: state.isFocused ? "#10b981" : "#d4d4d8",
                                                    },
                                                }),
                                                menu: (base) => ({
                                                    ...base,
                                                    fontSize: "0.875rem",
                                                    zIndex: 50,
                                                }),
                                                option: (base, state) => ({
                                                    ...base,
                                                    backgroundColor: state.isSelected
                                                        ? "#10b981"
                                                        : state.isFocused
                                                          ? "#ecfdf5"
                                                          : "white",
                                                    color: state.isSelected ? "white" : "#3f3f46",
                                                    cursor: "pointer",
                                                    "&:active": {
                                                        backgroundColor: "#10b981",
                                                        color: "white",
                                                    },
                                                }),
                                            }}
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setShowAmbienteModal(true)}
                                        className="flex shrink-0 items-center justify-center rounded-sm bg-emerald-50 px-3 text-emerald-600 hover:bg-emerald-100 border border-emerald-200 transition-colors"
                                        title="Cadastrar novo ambiente"
                                    >
                                        <PlusIcon size={18} weight="bold" />
                                    </button>
                                </div>
                                {errors.id_ambiente && (
                                    <span className="text-xs text-red-500">{errors.id_ambiente}</span>
                                )}
                            </div>

                            <Field
                                label={`Limite participantes ${maxParticipantes ? `(Máx: ${maxParticipantes})` : ""}`}
                                type="number"
                                min={1}
                                max={maxParticipantes}
                                value={data.limite_participantes}
                                onChange={(e) => setData("limite_participantes", e.target.value)}
                                error={errors.limite_participantes}
                            />
                        </div>

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
                                                className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition-all ${selected ? "border-emerald-500 bg-emerald-500 text-white" : "border-neutral-200 bg-white text-neutral-600 hover:border-emerald-300 hover:bg-emerald-50"}`}
                                            >
                                                <ChalkboardTeacherIcon size={14} /> {m.nome}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                            {errors.ministrantes && <span className="text-xs text-red-500">{errors.ministrantes}</span>}
                        </div>
                    </div>

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

            {showAmbienteModal && (
                <AmbienteModal
                    id_local={data.id_local}
                    onClose={() => setShowAmbienteModal(false)}
                    onSuccess={(ambiente) => {
                        setAmbientesOptions((prev) => {
                            const novoAmbiente = {
                                id: ambiente.id,
                                nome: ambiente.nome,
                                capacidade: ambiente.capacidade,
                            };
                            return [...prev, novoAmbiente];
                        });
                        setData("id_ambiente", ambiente.id);
                        setShowAmbienteModal(false);
                    }}
                />
            )}
        </>
    );
}
