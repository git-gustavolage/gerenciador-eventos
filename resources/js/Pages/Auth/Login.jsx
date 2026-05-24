import ApplicationIdentity from "@/Components/ApplicationIdentity";
import ApplicationLogo from "@/Components/ApplicationLogo";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import { Input } from "@/Components/Inputs/Input";
import PrimaryButton from "@/Components/PrimaryButton";
import GuestLayout from "@/Layouts/GuestLayout";
import { Link, useForm } from "@inertiajs/react";

export default function Login() {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route("login"), {
            onFinish: () => reset("password"),
        });
    };

    return (
        <GuestLayout title="Entrar">
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
                            <ApplicationLogo />

                            <div className="flex flex-col">
                                <span className="text-xl font-bold text-neutral-900">E-IFRO</span>

                                <span className="text-sm text-neutral-500">Plataforma de eventos</span>
                            </div>
                        </div>

                        <div className="mb-8">
                            <h2 className="text-3xl font-bold text-neutral-900">Acesse sua conta</h2>

                            <p className="mt-2 text-sm text-neutral-500">
                                Entre para continuar gerenciando seus eventos.
                            </p>
                        </div>

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
                                isFocused={true}
                                onChange={(e) => setData("email", e.target.value)}
                            />

                            <InputError message={errors.email} className="mt-2" />
                        </div>

                        <div className="mt-5">
                            <InputLabel htmlFor="password" value="Senha" />

                            <Input
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                className="mt-1 block w-full"
                                autoComplete="current-password"
                                onChange={(e) => setData("password", e.target.value)}
                            />

                            <InputError message={errors.password} className="mt-2" />
                        </div>

                        <div className="mt-3 flex items-center justify-between gap-4 max-sm:flex-col max-sm:items-start">
                            <div className="flex items-center gap-2 select-none">
                                <input
                                    id="showpassword"
                                    type="checkbox"
                                    className="rounded border-neutral-300 text-emerald-500 focus:ring-emerald-400"
                                />

                                <label htmlFor="showpassword" className="text-sm text-neutral-600 cursor-pointer">
                                    Mostrar senha
                                </label>
                            </div>

                            <Link
                                href={route("password.request")}
                                className="text-sm text-neutral-500 underline underline-offset-2 hover:text-neutral-800"
                            >
                                Esqueceu sua senha?
                            </Link>
                        </div>

                        <div className="mt-6 flex flex-col gap-3">
                            <PrimaryButton className="w-full justify-center" disabled={processing}>
                                Entrar
                            </PrimaryButton>

                            <p className="text-center text-sm text-neutral-500">
                                Não possui cadastro?{" "}
                                <Link
                                    href={route("register")}
                                    className="font-medium text-emerald-600 underline underline-offset-2 hover:text-emerald-700"
                                >
                                    Criar conta
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </GuestLayout>
    );
}
