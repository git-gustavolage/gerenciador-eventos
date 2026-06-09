import ApplicationIdentity from "@/Components/ApplicationIdentity";
import ApplicationLogo from "@/Components/ApplicationLogo";
import { Link } from "@inertiajs/react";
import { EnvelopeIcon, MapPinIcon } from "@phosphor-icons/react";

export default function Footer() {
    return (
        <footer className="w-full border-t border-neutral-200 bg-white">
            <div className="mx-auto max-w-6xl py-12 max-md:px-4 max-md:py-6">
                <div className="grid gap-10 grid-cols-3 max-md:grid-cols-1">
                    <div>
                        <div className="flex items-center gap-3 max-md:justify-center">
                            <ApplicationLogo className="h-10 w-auto" />

                            <div>
                                <h2 className="font-semibold text-neutral-900">E-IFRO</h2>

                                <p className="text-sm text-neutral-500">Plataforma de eventos</p>
                            </div>
                        </div>

                        <p className="mt-4 text-sm leading-relaxed text-neutral-600 max-md:text-center">
                            Participe de eventos acadêmicos, institucionais e científicos em um único lugar.
                        </p>
                    </div>

                    <div>
                        <h3 className="mb-4 font-semibold text-neutral-900">Navegação</h3>

                        <ul className="space-y-2 text-sm text-neutral-600">
                            <li>
                                <Link href={route("home")}>Início</Link>
                            </li>

                            <li>
                                <Link href={route("eventos.explorar")}>Eventos</Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="mb-4 font-semibold text-neutral-900">Contato</h3>

                        <ul className="space-y-3 text-sm text-neutral-600">
                            <li className="flex items-start gap-2">
                                <MapPinIcon size={18} />
                                <span>Porto Velho - RO</span>
                            </li>

                            <li className="flex items-start gap-2">
                                <EnvelopeIcon size={18} />
                                <span>ifro.eventos@gmail.com</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="border-t border-gray-200 py-4 px-4">
                <div className="flex flex-col items-center justify-center text-sm text-neutral-500">
                    <p>&copy; {new Date().getFullYear()} Todos os direitos reservados.</p> <ApplicationIdentity />
                </div>
            </div>
        </footer>
    );
}
