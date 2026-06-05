import { store } from "@/Actions/store";
import { routes } from "@/api/routes";
import { Input } from "@/Components/Inputs/Input";
import InputError from "@/Components/Inputs/InputError";
import InputLabel from "@/Components/Inputs/InputLabel";
import { Select } from "@/Components/Inputs/Select";
import { useMenu } from "@/Components/Menu";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import { useAction } from "@/Hooks/useAction";
import useData from "@/Hooks/useData";
import { router, usePage } from "@inertiajs/react";
import { PlusIcon, XIcon } from "@phosphor-icons/react";
import { useState } from "react";
import { toast } from "sonner";

export function FormAtividadeAmbiente({ data = {}, setData, errors = {}, editing = false, loading = false, onClose, onSubmit }) {
    const { ambientes = [] } = usePage().props;
    const { setMenuIndex } = useMenu();

    const [showAmbienteForm, setShowAmbienteForm] = useState(false);

    const ambienteSelecionado = ambientes.find((ambiente) => ambiente.id == data.id_ambiente);
    const maxParticipantes = ambienteSelecionado ? (ambienteSelecionado?.capacidade ?? null) : null;

    const disabled = loading || !data.id_ambiente;

    const handleSubmit = (e) => {
        e.preventDefault();

        if (editing) {
            onSubmit(e);
            return;
        }

        if (disabled) return;

        setMenuIndex(2);
    };

    const handleClose = () => {
        setMenuIndex(0);
    };

    return (
        <form onSubmit={handleSubmit} className="max-h-full space-y-4">
            <div className="space-y-1">
                <InputLabel value="Ambiente" />

                <div className="flex gap-2">
                    <Select value={data.id_ambiente} onChange={(e) => setData("id_ambiente", e.target.value)}>
                        <option value="">Selecione um ambiente</option>
                        {ambientes.map((ambiente) => (
                            <option key={ambiente.id} value={ambiente.id}>
                                {ambiente.nome}
                            </option>
                        ))}
                    </Select>

                    <PrimaryButton type="button" onClick={() => setShowAmbienteForm(true)}>
                        <PlusIcon size={18} />
                    </PrimaryButton>
                </div>

                <InputError message={errors?.id_ambiente} />
            </div>

            {showAmbienteForm && (
                <NewAmbienteForm
                    onClose={() => setShowAmbienteForm(false)}
                    onSuccess={(ambiente) => {
                        router.reload();

                        setData("id_ambiente", ambiente.id);

                        setShowAmbienteForm(false);
                    }}
                />
            )}

            <div className="space-y-1">
                <InputLabel value={`Limite participantes ${maxParticipantes ? `(Máx: ${maxParticipantes})` : ""}`} />

                <Input
                    type="number"
                    min={1}
                    value={data.limite_participantes}
                    onChange={(e) => setData("limite_participantes", e.target.value)}
                    invalid={!!errors?.limite_participantes}
                />

                <InputError message={errors?.limite_participantes} />
            </div>

            {editing ? (
                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={disabled}>{loading ? "Salvando..." : "Salvar"}</PrimaryButton>
                    <SecondaryButton onClick={onClose}>Cancelar</SecondaryButton>
                </div>
            ) : (
                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={disabled}>Próximo</PrimaryButton>
                    <SecondaryButton onClick={handleClose}>Voltar</SecondaryButton>
                </div>
            )}
        </form>
    );
}

function NewAmbienteForm({ onClose, onSuccess }) {
    const [data, setData, clear] = useData({
        nome: "",
        capacidade: 0,
    });

    const action = useAction({
        actionFn: store,
        onSuccess: (res) => {
            if (res?.success) {
                toast.success("Ambiente cadastrado com sucesso!");
                onSuccess(res.ambiente);
                onClose();
                clear();
            } else {
                toast.error("Ocorreu um erro ao cadastrar o ambiente. Tente novamente.");
            }
        },
        onError: (err) => {
            toast.error(err.message || "Ocorreu um erro ao cadastrar o ambiente. Tente novamente.");
        },
    });

    const disabled = action.loading || !data.nome;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (disabled) return;

        const payload = {
            nome: data.nome,
            capacidade: data.capacidade,
        };

        await action.execute(routes.ambientes.store(), payload);
    };

    const handleClose = () => {
        onClose();
        clear();
    };

    return (
        <section className="w-full rounded-sm bg-neutral-50 p-4 border border-neutral-300 space-y-4 relative">
            <div>
                <h3 className="text-lg font-semibold text-neutral-800">Cadastrar Ambiente</h3>
                <p className="mb-4 mt-1 text-sm text-neutral-500">Cadastre um novo ambiente para o evento.</p>

                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 text-neutral-600 hover:text-neutral-800 cursor-pointer"
                >
                    <XIcon size={20} />
                </button>
            </div>

            <div className="space-y-1">
                <InputLabel htmlFor="ambiente" value="Nome do ambiente" />
                <Input
                    id="ambiente"
                    value={data.nome}
                    onChange={(e) => setData("nome", e.target.value)}
                    invalid={!!action?.error?.errors?.nome}
                />
                <InputError message={action.error?.errors?.nome} />
            </div>

            <div className="space-y-1">
                <InputLabel htmlFor="ambiente" value="Capacidade do ambiente (opcional)" />
                <Input
                    id="ambiente"
                    type="number"
                    inputMode="numeric"
                    min={0}
                    value={data.capacidade}
                    onChange={(e) => setData("capacidade", e.target.value)}
                    invalid={!!action?.error?.errors?.capacidade}
                />
                <InputError message={action.error?.errors?.capacidade} />
            </div>

            <div className="flex items-center gap-4">
                <PrimaryButton onClick={handleSubmit} disabled={disabled}>
                    {action.loading ? "Salvando..." : "Salvar"}
                </PrimaryButton>

                <SecondaryButton onClick={onClose}>Cancelar</SecondaryButton>
            </div>
        </section>
    );
}
