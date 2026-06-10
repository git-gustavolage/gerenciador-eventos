import Dropdown from "@/Components/Dropdown";
import NavLink from "@/Components/NavLink";
import ManagerSidebar from "@/Layouts/Common/ManagerSidebar";
import { Head, usePage } from "@inertiajs/react";
import { CaretDownIcon, PlusIcon, UserIcon } from "@phosphor-icons/react";
import { ListIcon } from "@phosphor-icons/react/dist/ssr";
import { useState } from "react";

export default function ManagerLayout({ title = "Gerenciamento", defaultSidebarOpen = true, children }) {
    const auth = usePage().props.auth;
    const { user, is_organizador } = auth;

    const [sidebarOpen, setSidebarOpen] = useState(defaultSidebarOpen);

    return (
        <>
            <Head title={title} />

            <div className="w-full min-h-screen bg-neutral-50">
                <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white/90 backdrop-blur h-14">
                    <div className="w-full flex items-center justify-between h-14">
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

                        <div className="flex gap-8 max-md:gap-2 h-14 me-4">
                            {is_organizador && (
                                <NavLink
                                    href={route("dashboard")}
                                    prefetch
                                    active={route().current("dashboard")}
                                    className="h-14"
                                >
                                    Organizador
                                </NavLink>
                            )}

                            <div className="flex items-center gap-3">
                                {user && (
                                    <div className="flex">
                                        <Dropdown>
                                            <Dropdown.Trigger>
                                                <button
                                                    type="button"
                                                    className="inline-flex items-center gap-2 rounded-sm px-4 py-2 text-sm font-medium text-neutral-600 transition-all hover:border-neutral-300 hover:text-neutral-900"
                                                >
                                                    <UserIcon size={20} />
                                                    <CaretDownIcon size={12} weight="bold" />
                                                </button>
                                            </Dropdown.Trigger>
    
                                            <Dropdown.Content>
                                                <Dropdown.Link href={route("profile.edit")}>Perfil</Dropdown.Link>
                                                <Dropdown.Link href={route("logout")} method="post" as="button">
                                                    Sair
                                                </Dropdown.Link>
                                            </Dropdown.Content>
                                        </Dropdown>
                                    </div>
                                )}
                            </div>
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
