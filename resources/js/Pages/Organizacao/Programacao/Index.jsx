import ManagerLayout from "@/Layouts/ManagerLayout";
import { AtividadeCard } from "./Components/AtividadeCard";
import SecondaryButton from "@/Components/SecondaryButton";
import { PlusIcon } from "@phosphor-icons/react";
import { useState } from "react";
import { router } from "@inertiajs/react";
import ModalNewAtividade from "./Components/ModalNewAtividade";

export default function Index({ atividades = [] }) {
    const [open, setOpen] = useState(false);

    const groups = atividades.reduce((acc, atividade) => {
        const key = atividade.data_inicio.slice(0, 10);

        if (!acc[key]) {
            acc[key] = [];
        }

        acc[key].push(atividade);

        return acc;
    }, {});

    const keys = Object.keys(groups).sort((a, b) => {
        const [diaA, mesA, anoA] = a.split("/");
        const [diaB, mesB, anoB] = b.split("/");

        return new Date(anoA, mesA - 1, diaA) - new Date(anoB, mesB - 1, diaB);
    });

    const handleClose = () => {
        setOpen(false);
    };

    const handleSuccess = () => {
        router.reload({ only: ["atividades", "ambientes"] });
    };

    return (
        <>
            <ManagerLayout title="Programação" defaultSidebarOpen>
                <div className="p-8 flex flex-col gap-8 max-md:p-2">
                    <div className="p-4 border border-neutral-300 rounded-sm bg-white">
                        <SecondaryButton onClick={() => setOpen(true)}>
                            Adicionar atividade
                            <PlusIcon size={20} />
                        </SecondaryButton>
                    </div>

                    <div className="max-w-full overflow-x-auto inline-flex gap-4">
                        <div className="w-full overflow-x-auto">
                            <div className="flex gap-4 min-w-max">
                                {keys.map((key) => (
                                    <div key={key} className="w-[350px] shrink-0 overflow-hidden">
                                        <div className="sticky top-0 bg-white border border-neutral-300 px-5 py-4 flex items-center justify-between">
                                            <div className="w-full inline-flex justify-between items-center">
                                                <h2 className="font-bold text-neutral-800">{key}</h2>

                                                <p className="text-sm text-neutral-500">{groups[key].length} atividade(s)</p>
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-4 my-4">
                                            {groups[key].map((atividade) => (
                                                <AtividadeCard
                                                    key={atividade.id}
                                                    atividade={atividade}
                                                    onSuccess={handleSuccess}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </ManagerLayout>

            <ModalNewAtividade open={open} onClose={handleClose} onSuccess={handleSuccess} />
        </>
    );
}
