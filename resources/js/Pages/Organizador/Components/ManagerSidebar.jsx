import Overlay from "@/Components/Overlay";
import SideBarLink from "@/Layouts/Common/Sidebar/SidebarLink";
import {
    CalendarIcon,
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
        <aside>
            <div
                className={`min-h-[calc(100%-56px)] h-full bg-white border-r border-neutral-300 transition-all duration-300 overflow-hidden z-10 md:relative md:h-full fixed left-0 ${open ? "w-[290px] min-w-[290px]" : "w-0"}`}
            >
                <div className="w-[290px] min-w-[310px] h-full p-4">
                    <div className="flex flex-col gap-8">
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
    return (
        <SidebarModule title="Gerenciamento">
            <SideBarLink href={route("organizador.index")} active={route().current("organizador.index")}>
                <HouseIcon size={18} />
                <span>Início</span>
            </SideBarLink>

            <SideBarLink
                href={route("organizador.evento.general")}
                active={route().current("organizador.evento.general")}
            >
                <LayoutIcon size={18} />
                <span>Informações do Evento</span>
            </SideBarLink>

            <SideBarLink href="/manager/people">
                <UserIcon size={18} />
                <span>Pessoal</span>
            </SideBarLink>
        </SidebarModule>
    );
}

function BeforeEvent() {
    return (
        <SidebarModule title="Pré-evento">
            <SideBarLink href="/manager/registration">
                <TicketIcon size={18} />
                <span>Inscrições</span>
            </SideBarLink>

            <SideBarLink href="/preview" target="_blank">
                <LaptopIcon size={18} />
                <span>Página do Evento</span>
            </SideBarLink>

            <SideBarLink href="#">
                <CalendarIcon size={18} />
                <span>Programação</span>
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

            <SideBarLink href="#">
                <UsersIcon size={18} />
                <span>Organizadores</span>
            </SideBarLink>
        </SidebarModule>
    );
}
