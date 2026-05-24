import { router } from "@inertiajs/react";

export default function NewEventSection() {
    const handleNewEvent = () => {
        router.visit(route("events.create"));
    };

    return (
        <section className="w-full py-32 max-md:py-16 bg-white overflow-hidden">
            <div className="w-full max-w-6xl mx-auto px-6 max-md:px-4">
                <div className="grid grid-cols-2 gap-24 items-center max-lg:grid-cols-1">
                    <div className="relative">
                        <div className="absolute top-0 left-0 w-20 h-20 bg-emerald-100 rounded-full blur-2xl opacity-70" />

                        <div className="relative z-10 flex flex-col gap-7">
                            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2">
                                <div className="w-2 h-2 rounded-full bg-emerald-500" />

                                <span className="text-sm font-medium text-emerald-700">
                                    Plataforma de gerenciamento de eventos
                                </span>
                            </div>

                            <div className="flex flex-col gap-5">
                                <h2 className="text-5xl leading-tight font-bold text-neutral-900 max-md:text-4xl">
                                    Organize eventos de forma simples
                                </h2>

                                <p className="text-lg leading-relaxed text-neutral-600 max-w-xl">
                                    Centralize inscrições, divulgação, gerenciamento e participação em uma única
                                    plataforma intuitiva, responsiva e acessível.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-10">
                        <div className="border-l-4 border-emerald-500 pl-6">
                            <h3 className="text-2xl font-semibold text-neutral-900">Gerencie tudo em um único lugar</h3>

                            <p className="mt-3 text-neutral-600 leading-relaxed">
                                Crie eventos acadêmicos, culturais, institucionais ou tecnológicos utilizando uma
                                interface clara e objetiva.
                            </p>
                        </div>

                        <div className="flex items-center gap-3 pt-2 max-sm:flex-col max-sm:items-stretch">
                            <button
                                onClick={handleNewEvent}
                                className="px-8 py-3 rounded-sm bg-emerald-500 hover:bg-emerald-600 text-white font-semibold transition-colors shadow-sm"
                            >
                                Criar evento
                            </button>

                            <button className="px-8 py-3 rounded-sm border border-neutral-300 hover:border-neutral-400 hover:bg-neutral-50 text-neutral-700 font-medium transition-colors">
                                Explorar eventos
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
