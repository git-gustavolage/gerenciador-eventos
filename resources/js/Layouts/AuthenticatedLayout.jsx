import ApplicationLogo from "@/Components/ApplicationLogo";
import Dropdown from "@/Components/Dropdown";
import NavLink from "@/Components/NavLink";
import Overlay from "@/Components/Overlay";
import ResponsiveNavLink from "@/Components/ResponsiveNavLink";
import { Link, usePage } from "@inertiajs/react";
import { UserIcon } from "@phosphor-icons/react";
import { CaretDownIcon, XIcon } from "@phosphor-icons/react/dist/ssr";
import { useState } from "react";

export default function AuthenticatedLayout({ children }) {
    const user = usePage().props.auth.user;

    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="border-b border-neutral-300 bg-white">
                <div className="px-6 max-md:px-4">
                    <div className="flex h-14 justify-between">
                        <div className="flex">
                            <div className="flex shrink-0 items-center">
                                <Link href="/">
                                    <ApplicationLogo className="block h-9 w-auto fill-current text-gray-800" />
                                </Link>
                            </div>

                            <div className="flex max-md:hidden space-x-8 -my-px ms-10">
                                <NavLink href={route("home")} active={route().current("home")}>
                                    Início
                                </NavLink>
                                <NavLink href={route("home")} active={route().current("home")}>
                                    Eventos
                                </NavLink>
                            </div>
                        </div>

                        <div className="flex ms-6 items-center max-md:hidden">
                            <div className="relative ms-3">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center gap-2 rounded-md border border-transparent bg-white px-3 py-2 text-sm font-medium leading-4 text-neutral-400 transition duration-150 ease-in-out hover:text-neutral-800 focus:outline-none"
                                            >
                                                <UserIcon size={24} />
                                                <CaretDownIcon size={12} weight="bold" />
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <Dropdown.Link href={route("profile.edit")}>Perfil</Dropdown.Link>
                                        <Dropdown.Link href={route("logout")} method="post" as="button">
                                            Sair
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        <div className="hidden -me-2 max-md:flex items-center">
                            <button
                                onClick={() => setShowingNavigationDropdown((previousState) => !previousState)}
                                className="inline-flex items-center justify-center rounded-md p-2 text-neutral-400 transition duration-150 ease-in-out hover:bg-gray-100 hover:text-neutral-800 focus:bg-gray-100 focus:text-neutral-500 focus:outline-none"
                            >
                                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                    <path
                                        className={!showingNavigationDropdown ? "inline-flex" : "hidden"}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    {showingNavigationDropdown && <XIcon size={24} />}
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <Overlay value={showingNavigationDropdown} setValue={setShowingNavigationDropdown} />

                <div
                    className={`fixed bottom-0 left-0 w-full bg-white z-50 rounded-t-2xl shadow-2xl border-t border-neutral-200 transition-all duration-300 ease-in-out overflow-hidden ${showingNavigationDropdown ? "translate-y-0 opacity-100 visible" : "translate-y-full opacity-0 invisible"}`}
                >
                    <Link href={route("profile.edit")}>
                        <div className="p-4 flex flex-row justify-between border-b border-neutral-300 hover:bg-neutral-50 rounded-sm">
                            <div className="flex flex-row gap-2">
                                <div className="w-11 h-11 bg-emerald-50 border border-emerald-4 mt 00 rounded-sm flex items-center justify-center font-bold text-2xl text-emerald-800">
                                    {user.nome.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <div className="text-base font-medium text-neutral-800">{user.nome}</div>
                                    <div className="text-sm font-medium text-neutral-400">{user.email}</div>
                                </div>
                            </div>
                            <div className="text-end flex items-center justify-end text-neutral-800">
                                <UserIcon size={24} />
                            </div>
                        </div>
                    </Link>

                    <div className="space-y-1 pb-3 pt-2">
                        <ResponsiveNavLink href={route("home")} active={route().current("home")}>
                            Início
                        </ResponsiveNavLink>
                        <ResponsiveNavLink href={route("home")} active={route().current("home")}>
                            Meus eventos
                        </ResponsiveNavLink>
                    </div>

                    <div className="border-t border-neutral-200 py-2">
                        <ResponsiveNavLink method="post" href={route("logout")} as="button">
                            Sair
                        </ResponsiveNavLink>
                    </div>
                </div>
            </nav>

            <main>{children}</main>
        </div>
    );
}
