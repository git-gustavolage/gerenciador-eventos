import {
    InstagramLogoIcon,
    FacebookLogoIcon,
    TwitterLogoIcon,
    YoutubeLogoIcon,
    MapPinIcon,
    EnvelopeIcon,
} from "@phosphor-icons/react";

export default function Footer() {
    return (
        <footer className="w-full border-t border-gray-200 bg-white">
            <div className="max-w-6xl mx-auto px-4 py-12 grid gap-10 grid-cols-4 max-lg:grid-cols-2 max-md:grid-cols-1">
                <div className="space-y-4">
                    <h2 className="text-xl font-bold text-neutral-800">Eventos</h2>
                    <p className="text-sm text-neutral-500">Descubra, crie e participe de eventos.</p>

                    <div className="flex gap-3">
                        <button className="p-2 border rounded-full hover:bg-neutral-100">
                            <InstagramLogoIcon size={18} />
                        </button>
                        <button className="p-2 border rounded-full hover:bg-neutral-100">
                            <FacebookLogoIcon size={18} />
                        </button>
                        <button className="p-2 border rounded-full hover:bg-neutral-100">
                            <TwitterLogoIcon size={18} />
                        </button>
                        <button className="p-2 border rounded-full hover:bg-neutral-100">
                            <YoutubeLogoIcon size={18} />
                        </button>
                    </div>
                </div>

                <div>
                    <h3 className="font-semibold text-neutral-800 mb-3">Navegação</h3>
                    <ul className="space-y-2 text-sm text-neutral-500">
                        <li>
                            <a href="#" className="hover:text-neutral-800">
                                Início
                            </a>
                        </li>
                        <li>
                            <a href="#" className="hover:text-neutral-800">
                                Eventos
                            </a>
                        </li>
                        <li>
                            <a href="#" className="hover:text-neutral-800">
                                Categorias
                            </a>
                        </li>
                        <li>
                            <a href="#" className="hover:text-neutral-800">
                                Contato
                            </a>
                        </li>
                    </ul>
                </div>

                <div>
                    <h3 className="font-semibold text-neutral-800 mb-3">Contato</h3>
                    <ul className="space-y-3 text-sm text-neutral-500">
                        <li className="flex items-center gap-2">
                            <MapPinIcon size={16} />
                            Porto Velho, RO
                        </li>
                        <li className="flex items-center gap-2">
                            <EnvelopeIcon size={16} />
                            contato@eventos.com
                        </li>
                    </ul>
                </div>

                <div>
                    <h3 className="font-semibold text-neutral-800 mb-3">Fique por dentro</h3>
                    <p className="text-sm text-neutral-500 mb-3">Receba novidades e eventos perto de você.</p>

                    <div className="flex gap-2">
                        <input
                            type="email"
                            placeholder="Seu email"
                            className="w-full rounded-sm border border-gray-300 px-3 py-2 text-sm focus:outline-none focus-within:border-transparent focus:ring-2 focus:ring-emerald-500"
                        />
                        <button className="bg-emerald-600 text-white px-3 py-2 rounded-sm text-sm hover:bg-emerald-700">
                            OK
                        </button>
                    </div>
                </div>
            </div>

            <div className="border-t border-gray-200 py-4 px-4">
                <div className="flex items-center justify-center text-sm text-neutral-500">
                    <p>&copy; {new Date().getFullYear()} Eventos. Todos os direitos reservados.</p>
                </div>
            </div>
        </footer>
    );
}
