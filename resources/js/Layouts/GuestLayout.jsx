import { Head } from "@inertiajs/react";

export default function GuestLayout({ title = "", children }) {
    return (
        <>
            <Head title={title} />

            <div className="min-h-dvh w-full font-figtree text-neutral-900 bg-zinc-50">
                <div className="flex min-h-dvh flex-col">
                    <main className="flex w-full flex-1 justify-center">
                        <div className="w-full min-h-[calc(100%-64px-290px)] flex-1 max-md:px-4 max-md:py-5">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
}
