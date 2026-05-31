import { useState } from "react";
import { router } from "@inertiajs/react";
import { Input } from "@/Components/Inputs/Input";
import PrimaryButton from "@/Components/PrimaryButton";

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

// ── Modal de Criação de Ambiente ─────────────────────────────────────────────
export default function AmbienteModal({ eventoId, onClose, onSuccess }) {
    const [nome, setNome] = useState("");
    const [capacidade, setCapacidade] = useState("");
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    function handleSubmit() {
        setLoading(true);
        setErrors({});

        router.post(`/eventos/${eventoId}/ambientes`, { nome, capacidade }, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: (page) => {
                const novoId = page.props.flash?.novo_ambiente_id;
                onSuccess(novoId);
            },
            onError: (err) => setErrors(err),
            onFinish: () => setLoading(false),
        });
    }

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative z-10 w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
                <h3 className="text-lg font-semibold text-neutral-800">Cadastrar Ambiente</h3>
                <p className="mb-4 mt-1 text-sm text-neutral-500">
                    Cadastre um novo ambiente para o evento.
                </p>

                <div className="flex flex-col gap-4">
                    <Field 
                        label="Nome do ambiente" 
                        value={nome} 
                        onChange={(e) => setNome(e.target.value)} 
                        error={errors.nome}
                    />
                    <Field 
                        label="Capacidade (Opcional)" 
                        type="number" 
                        min={1} 
                        value={capacidade} 
                        onChange={(e) => setCapacidade(e.target.value)} 
                        error={errors.capacidade}
                    />
                </div>

                <div className="mt-6 flex justify-end gap-3 border-t border-neutral-100 pt-4">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors">Cancelar</button>
                    <PrimaryButton onClick={handleSubmit} disabled={loading}>
                        {loading ? "Salvando..." : "Salvar"}
                    </PrimaryButton>
                </div>
            </div>
        </div>
    );
}