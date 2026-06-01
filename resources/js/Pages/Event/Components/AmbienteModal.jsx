import { Input } from "@/Components/Inputs/Input";
import PrimaryButton from "@/Components/PrimaryButton";
import { useAction } from "@/Hooks/useAction";
import { store } from "@/Actions/store";
import { toast } from "sonner";
import { ambientesRoutes } from "@/api/routes";
import useData from "@/Hooks/useData";
import InputError from "@/Components/Inputs/InputError";
import InputLabel from "@/Components/Inputs/InputLabel";

export default function AmbienteModal({ id_local, onClose, onSuccess }) {
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
            id_local,
        };

        await action.execute(ambientesRoutes.store(), payload);
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <form onSubmit={handleSubmit} className="relative z-10 w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
                <h3 className="text-lg font-semibold text-neutral-800">Cadastrar Ambiente</h3>
                <p className="mb-4 mt-1 text-sm text-neutral-500">Cadastre um novo ambiente para o evento.</p>

                <div className="space-y-2">
                    <InputLabel htmlFor="ambiente" value="Nome do ambiente" />
                    <Input
                        id="ambiente"
                        value={data.nome}
                        onChange={(e) => setData("nome", e.target.value)}
                        invalid={!!action?.error?.errors?.nome}
                    />
                    <InputError message={action.error?.errors?.nome} />
                </div>

                <div className="space-y-2">
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

                <div className="mt-6 flex justify-end gap-3 border-t border-neutral-100 pt-4">
                    <PrimaryButton disabled={disabled}>{action.loading ? "Salvando..." : "Salvar"}</PrimaryButton>

                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"
                    >
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
}
