import ApplicationLogo from "@/Components/ApplicationLogo";
import Dropdown from "@/Components/Dropdown";
import NavLink from "@/Components/NavLink";
import Overlay from "@/Components/Overlay";
import ResponsiveNavLink from "@/Components/ResponsiveNavLink";
import { ChalkboardTeacherIcon } from "@phosphor-icons/react";
import { Link, usePage } from "@inertiajs/react";
import {
    CalendarBlankIcon,
    CalendarCheckIcon,
    HouseIcon,
    ListIcon,
    PlusIcon,
    SignOutIcon,
    UserCircleIcon,
    UserIcon,
    XIcon,
} from "@phosphor-icons/react";
import { CaretDownIcon, PlusCircleIcon } from "@phosphor-icons/react/dist/ssr";
import { useState } from "react";

export default function Navbar() {
    const user = usePage().props.auth.user;
    const { isMinistrante } = usePage().props;
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

    return (
        <>
            <nav className="sticky top-0 z-40 border-b border-neutral-200 bg-white/90 backdrop-blur max-h-14">
                <div className="px-6 max-md:px-4">
                    <div className="flex h-14 items-center justify-between">
                        <div className="w-full flex items-center gap-10">
                            <Link href="/" className="flex items-center gap-3">
                                <ApplicationLogo className="block h-9 w-auto fill-current text-gray-800" />
                            </Link>

                            <div className="w-full flex items-center justify-between">
                                <div className="hidden md:flex gap-8 h-14">
                                    <NavLink href={route("home")} active={route().current("home")} className="h-14">
                                        Início
                                    </NavLink>

                                    <NavLink href={route("eventos.publico.index")} active={route().current("eventos.publico.index")} className="h-14">
                                      Eventos
                                    </NavLink>
                                </div>

                                {user && (
                                    <div className="hidden md:flex gap-8 h-14 me-4">
                                        <NavLink href={route("eventos.create")} active={route().current("eventos.create")}>
                                            <span className="inline-flex gap-2 items-center">
                                                <PlusIcon size={20} />
                                                Criar
                                            </span>
                                        </NavLink>

                                        <NavLink
                                            href={route("dashboard")}
                                            active={route().current("dashboard")}
                                            className="h-14"
                                        >
                                            Meus Eventos
                                        </NavLink>

                                        {isMinistrante && (
                                            <NavLink
                                                href={route("ministrante.minhas-atividades")}
                                                active={route().current("ministrante.minhas-atividades")}
                                                className="h-14"
                                            >
                                                Ministrante
                                            </NavLink>
                                        )}
                                    </div>
                                )}

                                {!user && (
                                    <div className="hidden md:flex gap-8 h-14 me-4">
                                        <NavLink href={route("login")}>Entrar</NavLink>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            {user && (
                                <div className="hidden md:flex">
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

                            <button
                                onClick={() => setShowingNavigationDropdown((prev) => !prev)}
                                className="flex md:hidden items-center justify-center rounded-xl border border-neutral-200 p-2 text-neutral-600 transition-colors hover:bg-neutral-100"
                            >
                                {showingNavigationDropdown ? <XIcon size={22} /> : <ListIcon size={22} />}
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <Overlay value={showingNavigationDropdown} setValue={setShowingNavigationDropdown} />

            <div
                className={`
                    fixed inset-y-0 right-0 z-50 w-[88%] max-w-sm bg-white shadow-2xl
                    transition-all duration-300 ease-in-out
                    border-l border-neutral-200
                    flex flex-col
                    ${showingNavigationDropdown ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}
                `}
            >
                <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-4">
                    <div className="flex items-center gap-3">
                        <ApplicationLogo className="h-9 w-auto" />

                        <div className="flex flex-col">
                            <span className="font-semibold text-neutral-900">E-IFRO</span>
                            <span className="text-xs text-neutral-500">Plataforma de eventos</span>
                        </div>
                    </div>

                    <button
                        onClick={() => setShowingNavigationDropdown(false)}
                        className="rounded-lg p-2 text-neutral-500 hover:bg-neutral-100"
                    >
                        <XIcon size={20} />
                    </button>
                </div>

                {user && (
                    <Link href={route("profile.edit")} className="border-b border-neutral-200">
                        <div className="flex items-center gap-3 p-5 hover:bg-neutral-50 transition-colors">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-2xl font-bold text-emerald-700 border border-emerald-100">
                                {user?.nome?.charAt(0)?.toUpperCase()}
                            </div>

                            <div className="flex flex-col">
                                <span className="font-medium text-neutral-900">{user.nome}</span>
                                <span className="text-sm text-neutral-500">{user.email}</span>
                            </div>
                        </div>
                    </Link>
                )}

                <div className="flex-1 overflow-y-auto px-3 py-4">
                    <div className="flex flex-col gap-1">
                        <ResponsiveNavLink href={route("home")} active={route().current("home")}>
                            <div className="flex items-center gap-3">
                                <HouseIcon size={20} />
                                Início
                            </div>
                        </ResponsiveNavLink>

                        <ResponsiveNavLink href={route("eventos.publico.index")} active={route().current("eventos.publico.index")}>
                            <div className="flex items-center gap-3">
                                <CalendarBlankIcon size={20} />
                                Eventos
                            </div>
                        </ResponsiveNavLink>

                        {user && (
                            <ResponsiveNavLink href={route("dashboard")} active={route().current("dashboard")}>
                                <div className="flex items-center gap-3">
                                    <CalendarCheckIcon size={20} />
                                    Meus Eventos
                                </div>
                            </ResponsiveNavLink>
                        )}

                        {isMinistrante && (
                            <ResponsiveNavLink
                                href={route("ministrante.minhas-atividades")}
                                active={route().current("ministrante.minhas-atividades")}
                            >
                                <div className="flex items-center gap-3">
                                    <ChalkboardTeacherIcon size={20} />
                                    Ministrante
                                </div>
                            </ResponsiveNavLink>
                        )}

                        <ResponsiveNavLink href={route("profile.edit")} active={route().current("profile.edit")}>
                            <div className="flex items-center gap-3">
                                <UserCircleIcon size={20} />
                                Perfil
                            </div>
                        </ResponsiveNavLink>
                    </div>
                </div>

                <div className="border-t border-neutral-200 p-3">
                    <ResponsiveNavLink method="post" href={route("logout")} as="button">
                        <div className="flex items-center gap-3 text-red-500">
                            <SignOutIcon size={20} />
                            Sair
                        </div>
                    </ResponsiveNavLink>
                </div>
            </div>
        </>
    );
}
