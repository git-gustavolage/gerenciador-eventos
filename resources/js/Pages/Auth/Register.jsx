import ApplicationIdentity from "@/Components/ApplicationIdentity";
import ApplicationLogo from "@/Components/ApplicationLogo";
import InputError from "@/Components/Inputs/InputError";
import InputLabel from "@/Components/Inputs/InputLabel";
import { Input } from "@/Components/Inputs/Input";
import PrimaryButton from "@/Components/PrimaryButton";
import GuestLayout from "@/Layouts/GuestLayout";
import { Link, useForm } from "@inertiajs/react";

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        nome: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    const submit = (e) => {
        e.preventDefault();

        post(route("register"), {
            onFinish: () => reset("password", "password_confirmation"),
        });
    };

    return (
        <GuestLayout title="Registrar-se">
            <div className="w-full min-h-full flex max-md:flex-col">
                <div className="hidden md:flex w-1/2 relative overflow-hidden border-r border-neutral-200 bg-gradient-to-br from-emerald-50/50 via-white to-emerald-100/30">
                    <img
                        src="/images/mash.jpg"
                        alt="Background"
                        className="absolute inset-0 w-full h-full object-cover"
                    />

                    <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-white backdrop-blur-[1px]" />

                    <div className="relative z-10 flex h-full w-full flex-col justify-between p-12">
                        <div>
                            <div className="inline-flex items-center gap-3">
                                <ApplicationLogo />

                                <div className="flex flex-col">
                                    <span className="text-2xl font-bold text-neutral-900">E-IFRO</span>

                                    <span className="text-sm text-neutral-500">
                                        Plataforma de gerenciamento de eventos
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col items-start gap-4">
                            <h1 className="text-5xl font-bold leading-tight text-neutral-900">
                                Participe e organize eventos
                            </h1>

                            <p className="text-base leading-relaxed text-neutral-600">
                                Centralize seus eventos em uma plataforma moderna, acessível e intuitiva.
                            </p>

                            <ApplicationIdentity />
                        </div>
                    </div>
                </div>

                <div className="flex w-full md:w-1/2 items-center justify-center px-6 py-10 sm:px-10">
                    <form onSubmit={submit} className="w-full max-w-xl">
                        <div className="flex md:hidden items-center justify-center gap-3 mb-10">
                            <div className="flex h-12 w-12 items-center justify-center rounded-sm bg-emerald-500 text-xl font-bold text-white">
                                IF
                            </div>

                            <div className="flex flex-col">
                                <span className="text-xl font-bold text-neutral-900">E-IFRO</span>

                                <span className="text-sm text-neutral-500">Plataforma de eventos</span>
                            </div>
                        </div>

                        <div className="mb-8">
                            <h2 className="text-3xl font-bold text-neutral-900">Criar conta</h2>

                            <p className="mt-2 text-sm text-neutral-500">Cadastre-se para ter acesso ao sistema.</p>
                        </div>

                        <div>
                            <InputLabel htmlFor="nome" value="Nome" />

                            <Input
                                id="nome"
                                name="nome"
                                value={data.nome}
                                className="mt-1 block w-full"
                                autoComplete="nome"
                                isFocused={true}
                                onChange={(e) => setData("nome", e.target.value)}
                                required
                            />

                            <InputError message={errors.nome} className="mt-2" />
                        </div>

                        <div className="mt-4">
                            <InputLabel htmlFor="email" value="Email" />

                            <Input
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="mt-1 block w-full"
                                autoComplete="username"
                                isFocused={true}
                                onChange={(e) => setData("email", e.target.value)}
                            />

                            <InputError message={errors.email} className="mt-2" />
                        </div>

                        <div className="mt-4">
                            <InputLabel htmlFor="password" value="Senha" />

                            <Input
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                className="mt-1 block w-full"
                                autoComplete="new-password"
                                onChange={(e) => setData("password", e.target.value)}
                                required
                            />

                            <InputError message={errors.password} className="mt-2" />
                        </div>

                        <div className="mt-4">
                            <InputLabel htmlFor="password_confirmation" value="Confirme sua senha" />

                            <Input
                                id="password_confirmation"
                                type="password"
                                name="password_confirmation"
                                value={data.password_confirmation}
                                className="mt-1 block w-full"
                                autoComplete="new-password"
                                onChange={(e) => setData("password_confirmation", e.target.value)}
                                required
                            />

                            <InputError message={errors.password_confirmation} className="mt-2" />
                        </div>

                        <div className="mt-6 flex flex-col gap-3">
                            <PrimaryButton className="w-full justify-center" disabled={processing}>
                                Enviar
                            </PrimaryButton>

                            <p className="text-center text-sm text-neutral-500">
                                Já possui cadastro?{" "}
                                <Link
                                    href={route("login")}
                                    className="font-medium text-emerald-600 underline underline-offset-2 hover:text-emerald-700"
                                >
                                    Entrar
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </GuestLayout>
    );
}
