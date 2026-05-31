import ApplicationIdentity from "@/Components/ApplicationIdentity";
import ApplicationLogo from "@/Components/ApplicationLogo";
import InputError from "@/Components/Inputs/InputError";
import InputLabel from "@/Components/Inputs/InputLabel";
import { Input } from "@/Components/Inputs/Input";
import PrimaryButton from "@/Components/PrimaryButton";
import GuestLayout from "@/Layouts/GuestLayout";
import { Link, useForm } from "@inertiajs/react";

export default function ResetPassword({ token, email }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: "",
        password_confirmation: "",
    });

    const submit = (e) => {
        e.preventDefault();

        post(route("password.store"), {
            onFinish: () => reset("password", "password_confirmation"),
        });
    };

    return (
        <GuestLayout title="Redefinir senha">
            <div className="w-full min-h-full flex items-center justify-center py-10">
                <div className="w-full max-w-xl">
                    <div className="relative overflow-hidden rounded-sm border border-neutral-300 bg-white">
                        <div className="absolute inset-0 bg-white" />

                        <div className="relative z-10 p-8 sm:p-10">
                            <div className="flex flex-col items-center text-center">
                                <div className="flex items-center gap-3">
                                    <ApplicationLogo />

                                    <div className="flex flex-col items-start">
                                        <span className="text-2xl font-bold text-neutral-900">E-IFRO</span>

                                        <span className="text-sm text-neutral-500">Plataforma de eventos</span>
                                    </div>
                                </div>

                                <div className="mt-8">
                                    <h1 className="text-3xl font-bold text-neutral-900">Redefinir senha</h1>

                                    <p className="mt-3 text-sm leading-relaxed text-neutral-500 max-w-md">
                                        Defina uma nova senha para acessar sua conta com segurança.
                                    </p>
                                </div>
                            </div>

                            <form onSubmit={submit} className="mt-8">
                                <div>
                                    <InputLabel htmlFor="email" value="Email" />

                                    <Input
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={data.email}
                                        className="mt-1 block w-full"
                                        autoComplete="username"
                                        placeholder="exemplo@email.com"
                                        onChange={(e) => setData("email", e.target.value)}
                                    />

                                    <InputError message={errors.email} className="mt-2" />
                                </div>

                                <div className="mt-5">
                                    <InputLabel htmlFor="password" value="Nova senha" />

                                    <Input
                                        id="password"
                                        type="password"
                                        name="password"
                                        value={data.password}
                                        className="mt-1 block w-full"
                                        autoComplete="new-password"
                                        placeholder="Digite sua nova senha"
                                        isFocused={true}
                                        onChange={(e) => setData("password", e.target.value)}
                                    />

                                    <InputError message={errors.password} className="mt-2" />
                                </div>

                                <div className="mt-5">
                                    <InputLabel htmlFor="password_confirmation" value="Confirmar senha" />

                                    <Input
                                        id="password_confirmation"
                                        type="password"
                                        name="password_confirmation"
                                        value={data.password_confirmation}
                                        className="mt-1 block w-full"
                                        autoComplete="new-password"
                                        placeholder="Confirme sua nova senha"
                                        onChange={(e) => setData("password_confirmation", e.target.value)}
                                    />

                                    <InputError message={errors.password_confirmation} className="mt-2" />
                                </div>

                                <div className="mt-6 flex flex-col gap-3">
                                    <PrimaryButton className="w-full justify-center" disabled={processing}>
                                        Redefinir senha
                                    </PrimaryButton>

                                    <Link
                                        href={route("login")}
                                        className="text-center text-sm text-neutral-500 underline underline-offset-2 hover:text-neutral-800"
                                    >
                                        Voltar para o login
                                    </Link>
                                </div>
                            </form>

                            <ApplicationIdentity />
                        </div>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}
