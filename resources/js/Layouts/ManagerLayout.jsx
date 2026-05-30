import ManagerSidebar from "@/Pages/Organizador/Components/ManagerSidebar";
import { Head } from "@inertiajs/react";
import { ListIcon } from "@phosphor-icons/react/dist/ssr";
import { useState } from "react";

export default function ManagerLayout({ title = "Gerenciamento", defaultSidebarOpen = true, children }) {
    const [sidebarOpen, setSidebarOpen] = useState(defaultSidebarOpen);

    return (
        <>
            <Head title={title} />

            <div className="w-full min-h-screen bg-neutral-50">
                <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white/90 backdrop-blur h-14">
                    <div className="w-full flex items-center h-full px-4">
                        <button
                            onClick={() => setSidebarOpen((prev) => !prev)}
                            className="p-2 rounded-sm text-neutral-600 hover:bg-neutral-200 hover:text-neutral-800 outline-none focus:bg-neutral-200 focus:text-neutral-800"
                        >
                            <ListIcon size={20} />
                        </button>
                    </div>
                </header>

                <main className="inline-flex w-full h-full flex-1">
                    <ManagerSidebar open={sidebarOpen} setOpen={setSidebarOpen} />

                    <div className="w-full">{children}</div>
                </main>
            </div>
        </>
    );
}
