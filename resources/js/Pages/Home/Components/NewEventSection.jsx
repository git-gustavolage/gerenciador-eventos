import { Link, usePage } from "@inertiajs/react";
import { ArrowSquareOutIcon } from "@phosphor-icons/react";

export default function NewEventSection() {
    const { user } = usePage().props.auth;
    const admin = user?.admin ?? false;

    return (
        <section className="w-full py-32 max-md:py-16 bg-white overflow-hidden">
            <div className="w-full max-w-6xl mx-auto px-6 max-md:px-4">
                <div className="grid grid-cols-2 gap-24 items-center max-lg:grid-cols-1">
                    <div className="relative">
                        <div className="absolute top-0 left-0 w-20 h-20 bg-emerald-100 rounded-full blur-2xl opacity-70" />

                        <div className="relative z-10 flex flex-col gap-7">
                            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2">
                                <div clais_adminssName="w-2 h-2 rounded-full bg-emerald-500" />

                                <span className="text-sm font-medium text-emerald-700">
                                    {admin ? "Plataforma de gerenciamento de eventos" : "Plataforma de participação em eventos"}
                                </span>
                            </div>

                            <div className="flex flex-col gap-5">
                                <h2 className="text-5xl leading-tight font-bold text-neutral-900 max-md:text-4xl">
                                    {admin
                                        ? "Organize eventos de forma simples"
                                        : "Descubra eventos e participe de novas experiências"}
                                </h2>

                                <p className="text-lg leading-relaxed text-neutral-600 max-w-xl">
                                    {admin
                                        ? "Centralize inscrições, divulgação, gerenciamento e participação em uma única plataforma intuitiva, responsiva e acessível."
                                        : "Encontre eventos acadêmicos, culturais e institucionais, acompanhe sua programação e participe de atividades organizadas pela comunidade."}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-10">
                        <div className="border-l-4 border-emerald-500 pl-6">
                            <h3 className="text-2xl font-semibold text-neutral-900">
                                {admin ? "Gerencie tudo em um único lugar" : "Explore oportunidades e atividades"}
                            </h3>

                            <p className="mt-3 text-neutral-600 leading-relaxed">
                                {admin
                                    ? "Crie eventos acadêmicos, culturais, institucionais ou tecnológicos utilizando uma interface clara e objetiva."
                                    : "Acesse eventos disponíveis, acompanhe informações importantes e encontre atividades alinhadas aos seus interesses."}
                            </p>
                        </div>

                        <div className="flex items-center gap-3 pt-2 max-sm:flex-col max-sm:items-stretch">
                            {admin && (
                                <Link
                                    href={route("eventos.create")}
                                    className="px-8 py-3 rounded-sm bg-emerald-500 hover:bg-emerald-600 text-white font-semibold transition-colors shadow-sm"
                                >
                                    Criar evento
                                </Link>
                            )}

                            <Link
                                href={route("eventos.explorar")}
                                prefetch
                                className="px-8 py-3 rounded-sm border border-neutral-300 hover:border-neutral-400 hover:bg-neutral-50 text-neutral-700 font-medium transition-colors inline-flex items-center gap-2 justify-center"
                            >
                                Explorar eventos
                                <ArrowSquareOutIcon size={18} />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
