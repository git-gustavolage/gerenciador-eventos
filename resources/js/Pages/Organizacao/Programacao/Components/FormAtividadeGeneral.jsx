import DateTimeInput from "@/Components/Inputs/DateTimeInput";
import { Input } from "@/Components/Inputs/Input";
import InputError from "@/Components/Inputs/InputError";
import InputLabel from "@/Components/Inputs/InputLabel";
import Textarea from "@/Components/Inputs/Textarea";
import { useMenu } from "@/Components/Menu";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";

export function FormAtividadeGeneral({ data = {}, setData, errors = {}, editing = false, loading = false, onClose, onSubmit }) {
    const { setMenuIndex } = useMenu();

    const disabled = loading || !data.titulo || !data.data_inicio || !data.data_fim;

    const handleSubmit = (e) => {
        e.preventDefault();

        if (editing) {
            onSubmit(e);
            return;
        }

        if (disabled) return;

        setMenuIndex(1);
    };

    const handleClose = () => {
        onClose();
    };

    return (
        <form onSubmit={handleSubmit} className="max-h-full space-y-4">
            <div className="space-y-1">
                <InputLabel htmlFor="titulo" value="Título" />

                <Input
                    id="titulo"
                    value={data.titulo}
                    onChange={(e) => setData("titulo", e.target.value)}
                    invalid={!!errors?.titulo}
                />

                <InputError message={errors?.titulo} />
            </div>

            <div className="space-y-1">
                <InputLabel htmlFor="descricao" value="Descrição" />

                <Textarea id="descricao" rows={4} value={data.descricao} onChange={(e) => setData("descricao", e.target.value)} />

                <InputError message={errors?.descricao} />
            </div>

            <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
                <div>
                    <DateTimeInput
                        id="data_inicio"
                        label="Data de início"
                        value={data.data_inicio}
                        onChange={(e) => setData("data_inicio", e.target.value)}
                    />

                    <InputError message={errors?.data_inicio} />
                </div>

                <div>
                    <DateTimeInput
                        id="data_fim"
                        label="Data de fim"
                        value={data.data_fim}
                        onChange={(e) => setData("data_fim", e.target.value)}
                    />

                    <InputError message={errors?.data_fim} />
                </div>
            </div>

            {editing ? (
                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={disabled}>{loading ? "Salvando..." : "Salvar"}</PrimaryButton>
                    <SecondaryButton onClick={handleClose}>Cancelar</SecondaryButton>
                </div>
            ) : (
                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={disabled}>Próximo</PrimaryButton>
                    <SecondaryButton onClick={handleClose}>Cancelar</SecondaryButton>
                </div>
            )}
        </form>
    );
}
