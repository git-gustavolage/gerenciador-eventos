import InputError from "@/Components/Inputs/InputError";
import InputLabel from "@/Components/Inputs/InputLabel";
import { useMenu } from "@/Components/Menu";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import { router, usePage } from "@inertiajs/react";
import { ChalkboardTeacherIcon } from "@phosphor-icons/react";

export function FormAtividadeMinistrantes({ errors = {}, editing = false, loading = false, onClose, onSubmit, ...props }) {
    const { data = {}, setData } = props;
    const { ministrantes = [] } = usePage().props;

    const { setMenuIndex } = useMenu();

    const disabled = loading;

    const handleSubmit = (e) => {
        e.preventDefault();

        if (disabled) return;

        onSubmit(e);
    };

    const handleClose = () => {
        setMenuIndex(1);
    };

    const toggleMinistrante = (id) => {
        const current = data.ministrantes ?? [];

        setData("ministrantes", current.includes(id) ? current.filter((m) => m !== id) : [...current, id]);
    };

    return (
        <form onSubmit={handleSubmit} className="max-h-full space-y-4">
            <div className="flex items-center justify-between">
                <InputLabel value="Ministrantes" />

                <button
                    type="button"
                    className="text-sm text-emerald-600 hover:underline"
                    onClick={() => router.visit(route("eventos.organizacao.ministrantes"))}
                >
                    Cadastrar novo ministrante
                </button>
            </div>

            <div className="flex flex-wrap gap-2">
                {ministrantes.map((ministrante) => {
                    const selected = (data.ministrantes ?? []).includes(ministrante.id);

                    return (
                        <button
                            key={ministrante.id}
                            type="button"
                            onClick={() => toggleMinistrante(ministrante.id)}
                            className={`inline-flex items-center gap-2 rounded-sm border px-3 py-2 text-sm ${
                                selected ? "bg-primary text-white border-primary" : "bg-white border-neutral-300"
                            }`}
                        >
                            <ChalkboardTeacherIcon size={14} />
                            {ministrante.nome}
                        </button>
                    );
                })}
                <InputError message={errors?.ministrantes} />
            </div>

            {editing ? (
                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={disabled}>{loading ? "Salvando..." : "Salvar"}</PrimaryButton>
                    <SecondaryButton onClick={onClose}>Cancelar</SecondaryButton>
                </div>
            ) : (
                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={disabled}>Enivar</PrimaryButton>
                    <SecondaryButton onClick={handleClose}>Voltar</SecondaryButton>
                </div>
            )}
        </form>
    );
}
