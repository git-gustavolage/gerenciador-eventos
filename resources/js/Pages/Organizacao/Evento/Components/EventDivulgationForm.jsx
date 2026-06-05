import { toFormData } from "@/Actions/toFormData";
import { update } from "@/Actions/update";
import { getCategorias } from "@/api/getCategorias";
import { eventosRoutes } from "@/api/routes";
import { CategoryOption } from "@/Components/Inputs/CategoryOption";
import InputError from "@/Components/Inputs/InputError";
import InputImage from "@/Components/Inputs/InputImage";
import InputLabel from "@/Components/Inputs/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import { useAction } from "@/Hooks/useAction";
import useData from "@/Hooks/useData";
import { actionErrorHandlingDecorator } from "@/util/actionErrorHandlingDecorator";
import { TrendUpIcon } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function EventDivulgationForm({ evento = {} }) {
    const [data, setData] = useData({
        banner: null,
        categorias: evento.categorias ?? [],
    });

    const [preview, setPreview] = useState(evento.banner ?? null);

    const action = useAction({
        actionFn: actionErrorHandlingDecorator(update),
        onSuccess: (res) => {
            if (res.success) {
                toast.success("Alterações salvas com sucesso!");
            } else {
                toast.error("Erro ao salvar as alterações. Tente novamente.");
            }
        },
    });

    const disabled = action.loading || !data.categorias || data.categorias?.length < 1;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (disabled) return;

        const payload = {
            categorias: data.categorias,
            banner: data.banner,
        };

        await action.execute(eventosRoutes.update(), toFormData(payload));
    };

    const handleBannerChange = (e) => {
        const file = e.target.files?.[0];

        if (!file) return;

        setData("banner", file);

        const url = URL.createObjectURL(file);

        setPreview((old) => {
            if (old) {
                URL.revokeObjectURL(old);
            }

            return url;
        });

        action.clearError("banner");
    };

    useEffect(() => {
        return () => {
            if (preview) {
                URL.revokeObjectURL(preview);
            }
        };
    }, [preview]);

    const categorias = getCategorias();

    const toggleCategory = (category) => {
        const alreadySelected = data.categorias.includes(category);
        action.clearError("categorias");

        if (alreadySelected) {
            setData(
                "categorias",
                data.categorias.filter((item) => item !== category)
            );

            return;
        }

        setData("categorias", [...data.categorias, category]);
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="w-full flex flex-col items-center justify-center gap-4 border-t border-t-neutral-300 pt-8"
        >
            <div className="w-full text-start">
                <h1 className="w-full font-medium text-3xl text-neutral-800 tracking-tight inline-flex gap-1 items-center">
                    <TrendUpIcon size={32} />
                    Divulgação
                </h1>
            </div>

            <div className="w-full flex flex-col gap-4">
                <div className="space-y-2">
                    <InputLabel htmlFor="banner" value="Imagem de capa do evento" />
                    <div className="space-y-1">
                        <InputImage preview={preview} onChange={handleBannerChange} />
                        <p className="w-full text-end text-xs text-neutral-500">Dimensões recomendadas: 1900x380px</p>
                    </div>
                    <InputError message={action?.error?.errors?.banner} />
                </div>

                <div className="space-y-1">
                    <InputLabel value="Categoria do evento" />

                    <div className="flex flex-wrap gap-3">
                        {categorias.map((category) => {
                            const selected = data.categorias.includes(category);

                            return (
                                <CategoryOption
                                    key={category}
                                    value={category}
                                    onSelect={() => toggleCategory(category)}
                                    selected={selected}
                                />
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="w-full">
                <PrimaryButton disabled={disabled}>{action.loading ? "Enviando..." : "Salvar"}</PrimaryButton>
            </div>
        </form>
    );
}
