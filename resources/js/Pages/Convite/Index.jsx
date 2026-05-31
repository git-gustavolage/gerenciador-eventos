import GuestLayout from "@/Layouts/GuestLayout";
import ApplicationLogo from "@/Components/ApplicationLogo";
import ApplicationIdentity from "@/Components/ApplicationIdentity";
import PrimaryButton from "@/Components/PrimaryButton";
import { Link, router } from "@inertiajs/react";
import { useAction } from "@/Hooks/useAction";
import { store } from "@/Actions/store";
import { toast } from "sonner";
import { convitesRoutes } from "@/api/routes";

export default function Index({ convite, authenticated }) {
    const action = useAction({
        actionFn: store,
        onSuccess: (res) => {
            toast.success("Convite aceito com sucesso!");

            setTimeout(() => {
                router.visit(route("organizador.index"));
            }, 1000);
        },
        onError: (err) => {
            toast.error(err?.message || "Ocorreu um erro ao aceitar o convite. Tente novamente ou solicite um novo link.");
        },
    });

    const accept = async () => {
        if (action.loading) return;

        await action.execute(convitesRoutes.accept({ token: convite.token }));
    };

    return (
        <GuestLayout title="Convite para organização">
            <div className="w-full min-h-full flex items-center justify-center py-10">
                <div className="w-full max-w-xl">
                    <div className="overflow-hidden rounded-sm border border-neutral-300 bg-white">
                        <div className="p-8 sm:p-10">
                            <div className="flex flex-col items-center text-center">
                                <div className="flex items-center gap-3">
                                    <ApplicationLogo />

                                    <div className="flex flex-col items-start">
                                        <span className="text-2xl font-bold text-neutral-900">E-IFRO</span>

                                        <span className="text-sm text-neutral-500">Plataforma de eventos</span>
                                    </div>
                                </div>

                                <div className="mt-8">
                                    <h1 className="text-3xl font-bold text-neutral-900">Convite para organização</h1>

                                    <p className="mt-4 text-sm leading-relaxed text-neutral-500">
                                        Você foi convidado para participar da organização do evento:
                                    </p>

                                    <div className="mt-4 rounded-sm border border-neutral-200 bg-neutral-50 px-4 py-3">
                                        <span className="font-medium text-neutral-900">{convite.evento}</span>
                                    </div>

                                    <p className="mt-4 text-sm text-neutral-500">Convite destinado a:</p>

                                    <p className="font-medium text-neutral-700">{convite.email}</p>
                                </div>
                            </div>

                            {authenticated ? (
                                <div className="mt-8">
                                    <PrimaryButton className="w-full justify-center" onClick={accept}>
                                        Aceitar convite
                                    </PrimaryButton>
                                </div>
                            ) : (
                                <div className="mt-8 flex flex-col gap-3">
                                    <Link href={route("login")}>
                                        <PrimaryButton className="w-full">Entrar para aceitar</PrimaryButton>
                                    </Link>

                                    <Link
                                        href={route("register")}
                                        className="text-center text-sm text-neutral-500 underline underline-offset-2 hover:text-neutral-800"
                                    >
                                        Criar conta
                                    </Link>
                                </div>
                            )}

                            <ApplicationIdentity />
                        </div>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}
