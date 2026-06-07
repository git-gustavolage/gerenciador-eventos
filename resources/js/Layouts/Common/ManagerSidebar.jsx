import Overlay from "@/Components/Overlay";
import SideBarLink from "@/Layouts/Common/Sidebar/SidebarLink";
import { usePage } from "@inertiajs/react";
import {
    CalendarBlankIcon,
    CertificateIcon,
    GearIcon,
    HouseIcon,
    LaptopIcon,
    LayoutIcon,
    TicketIcon,
    UserIcon,
    UsersIcon,
} from "@phosphor-icons/react";

export default function ManagerSidebar({ open, setOpen }) {
    return (
        <aside className="max-md:z-50">
            <div
                className={`min-h-[calc(100%-56px)] max-md:top-0 h-full bg-white border-r border-neutral-300 transition-all duration-300 overflow-hidden max-md:z-50 md:relative md:h-full fixed left-0 ${open ? "w-[290px]" : "w-0"}`}
            >
                <div className="w-[290px] min-w-[290px] h-full">
                    <div className="flex flex-col gap-8 p-4">
                        <Manage />
                        <BeforeEvent />
                        <AfterEvent />
                        <Configuration />
                    </div>
                </div>
            </div>

            <Overlay value={open} setValue={setOpen} />
        </aside>
    );
}

function SidebarModule({ title = "", children }) {
    return (
        <div className="flex flex-col gap-1">
            <p className="mb-1 text-sm text-neutral-500 font-medium">{title}</p>
            <div className="flex flex-col gap-3">{children}</div>
        </div>
    );
}

function Manage() {
    const { evento } = usePage().props;

    return (
        <SidebarModule title="Gerenciamento">
            <SideBarLink href={route("eventos.organizacao.view")} active={route().current("eventos.organizacao.view")}>
                <HouseIcon size={18} />
                <span>Início</span>
            </SideBarLink>

            <SideBarLink href={route("eventos.organizacao.evento")} active={route().current("eventos.organizacao.evento")}>
                <LayoutIcon size={18} />
                <span>Informações do Evento</span>
            </SideBarLink>

            <SideBarLink href={evento?.id ? route("eventos.publico.show", evento.id) : "#"} target="_blank">
                <LaptopIcon size={18} />
                <span>Página do Evento</span>
            </SideBarLink>
        </SidebarModule>
    );
}

function BeforeEvent() {
    return (
        <SidebarModule title="Pré-evento">
            <SideBarLink
                href={route("eventos.organizacao.programacao")}
                active={route().current("eventos.organizacao.programacao")}
            >
                <CalendarBlankIcon size={18} />
                <span>Programação</span>
            </SideBarLink>

            <SideBarLink
                href={route("eventos.organizacao.ministrantes")}
                active={route().current("eventos.organizacao.ministrantes")}
                prefetch
            >
                <UserIcon size={18} />
                <span>Cadastrar Ministrante</span>
            </SideBarLink>

            <SideBarLink 
                href={route("eventos.organizacao.inscricoes")} 
                active={route().current("eventos.organizacao.inscricoes")}
            >
                <TicketIcon size={18} />
                <span>Inscrições</span>
            </SideBarLink>
        </SidebarModule>
    );
}

function AfterEvent() {
    return (
        <SidebarModule title="Pós-evento">
            <SideBarLink href="#">
                <CertificateIcon size={18} />
                <span>Certificados</span>
            </SideBarLink>
        </SidebarModule>
    );
}

function Configuration() {
    return (
        <SidebarModule title="Configuração">
            <SideBarLink href="#">
                <GearIcon size={18} />
                <span>Configurações</span>
            </SideBarLink>

            <SideBarLink
                href={route("eventos.organizacao.organizadores")}
                active={route().current("eventos.organizacao.organizadores")}
                prefetch
            >
                <UsersIcon size={18} />
                <span>Organizadores</span>
            </SideBarLink>
        </SidebarModule>
    );
}
