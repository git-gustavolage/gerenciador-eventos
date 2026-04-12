import {
    GraduationCapIcon,
    BookOpenIcon,
    UsersIcon,
} from "@phosphor-icons/react";

export default function AcademicEventsSection() {
    return (
        <section className="w-full bg-gray-50 py-16 px-4">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-4xl font-bold text-neutral-800">
                    Eventos Acadêmicos
                </h2>
                <p className="mt-2 text-neutral-500">
                    Participe de congressos, workshops e encontros científicos que impulsionam o conhecimento e a inovação.
                </p>

                <div className="mt-10 grid gap-8 md:grid-cols-3">

                    <div className="flex flex-col gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200 text-neutral-700">
                            <GraduationCapIcon size={22} />
                        </div>

                        <h3 className="text-lg font-semibold text-neutral-800">
                            Formação Acadêmica
                        </h3>

                        <p className="text-sm text-neutral-500 leading-relaxed">
                            Amplie seus conhecimentos com eventos voltados ao ensino, pesquisa e extensão, promovendo o desenvolvimento acadêmico contínuo.
                        </p>
                    </div>

                    <div className="flex flex-col gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200 text-neutral-700">
                            <BookOpenIcon size={22} />
                        </div>

                        <h3 className="text-lg font-semibold text-neutral-800">
                            Produção Científica
                        </h3>

                        <p className="text-sm text-neutral-500 leading-relaxed">
                            Apresente trabalhos, participe de debates e compartilhe pesquisas com a comunidade acadêmica em ambientes colaborativos.
                        </p>
                    </div>

                    <div className="flex flex-col gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200 text-neutral-700">
                            <UsersIcon size={22} />
                        </div>

                        <h3 className="text-lg font-semibold text-neutral-800">
                            Networking Acadêmico
                        </h3>

                        <p className="text-sm text-neutral-500 leading-relaxed">
                            Conecte-se com pesquisadores, professores e estudantes, criando oportunidades para parcerias e crescimento profissional.
                        </p>
                    </div>

                </div>
            </div>
        </section>
    );
}
