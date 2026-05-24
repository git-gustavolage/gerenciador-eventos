import { Head, Link } from "@inertiajs/react";

export default function GuestLayout({ title = "", children }) {
    return (
        <>
            <Head title={title} />

            <div className="min-h-dvh w-full font-figtree text-neutral-900">
                <div className="flex min-h-dvh flex-col">
                    <header className="sticky top-0 z-50 w-full border-b border-neutral-200 bg-white/80 backdrop-blur">
                        <nav className="mx-auto flex h-14 w-full items-center justify-between px-6 max-md:px-4">
                            <div>
                                <Link
                                    href="/"
                                    className="rounded-sm px-4 py-2 text-sm font-medium text-neutral-500 transition-colors hover:text-neutral-900"
                                >
                                    Início
                                </Link>
                            </div>

                            <div className="flex items-center gap-2">
                                <Link
                                    href="/login"
                                    className="rounded-sm px-4 py-2 text-sm font-medium text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
                                >
                                    Entrar
                                </Link>

                                <Link
                                    href="/register"
                                    className="rounded-sm px-4 py-2 text-sm font-medium text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
                                >
                                    Criar conta
                                </Link>
                            </div>
                        </nav>
                    </header>

                    <main className="flex w-full flex-1 justify-center">
                        <div className="w-full min-h-[calc(100%-64px-290px)] max-w-7xl flex-1 px-6 py-8 max-md:px-4 max-md:py-5">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
}
