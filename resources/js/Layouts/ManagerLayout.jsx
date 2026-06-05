import NavLink from "@/Components/NavLink";
import ManagerSidebar from "@/Layouts/Common/ManagerSidebar";
import { Head, usePage } from "@inertiajs/react";
import { ListIcon } from "@phosphor-icons/react/dist/ssr";
import { useState } from "react";

export default function ManagerLayout({ title = "Gerenciamento", defaultSidebarOpen = true, children }) {
    
    const user = usePage().props.auth.user;
    
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

                        <div className="hidden md:flex gap-8 h-14 ps-8">
                            <NavLink href={route("home")} active={route().current("home")} className="h-14">
                                Início
                            </NavLink>
                        </div>
                    </div>
                </header>

                <main className="flex min-h-[calc(100dvh-56px)] overflow-hidden">
                    <ManagerSidebar open={sidebarOpen} setOpen={setSidebarOpen} />
                
                    <div className="flex-1 min-w-0 overflow-hidden">{children}</div>
                </main>
            </div>
        </>
    );
}
