import ResponsiveSidebar from "@/Layouts/Common/Sidebar/ResponsiveSidebar"
import SideBarLink from "@/Layouts/Common/Sidebar/SidebarLink"
import { CalendarIcon, CertificateIcon, GearIcon, HouseIcon, LaptopIcon, LayoutIcon, StarIcon, TargetIcon, TicketIcon, UserIcon, UsersIcon } from "@phosphor-icons/react"

export default function ManagerSidebar() {

    return (
        <ResponsiveSidebar>
            <div className="flex flex-col gap-8">
                <Manage />
                <BeforeEvent />
                <AfterEvent />
                <Configuration />
            </div>
        </ResponsiveSidebar>
    )
}

function SidebarModule({ title = "", children }) {
    return (
        <div className="flex flex-col gap-1">
            <p className="mb-1 text-sm text-neutral-500 font-medium">{title}</p>
            <div className="flex flex-col gap-3">{children}</div>
        </div>
    )
}

function Manage() {
    return (
        <SidebarModule title="Gerenciamento">
            <SideBarLink active href="/manager">
                <HouseIcon size={18} />
                <span>Início</span>
            </SideBarLink>

            <SideBarLink href="/manager/general">
                <LayoutIcon size={18} />
                <span>Informações do Evento</span>
            </SideBarLink>

            <SideBarLink href="/manager/people">
                <UserIcon size={18} />
                <span>Pessoal</span>
            </SideBarLink>
        </SidebarModule>
    )
}

function BeforeEvent() {

    return (
        <SidebarModule title="Pré-evento">
            <SideBarLink href="/manager/registration">
                <TicketIcon size={18} />
                <span>Inscrições</span>
            </SideBarLink>

            <SideBarLink href="/preview" target="_blank" >
                <LaptopIcon size={18} />
                <span>Página do Evento</span>
            </SideBarLink>

            <SideBarLink href="#">
                <CalendarIcon size={18} />
                <span>Programação</span>
            </SideBarLink>
        </SidebarModule>
    )
}

function AfterEvent() {

    return (
        <SidebarModule title="Pós-evento">
            <SideBarLink href="#">
                <CertificateIcon size={18} />
                <span>Certificados</span>
            </SideBarLink>

            <SideBarLink href="#">
                <StarIcon size={18} />
                <span>Avaliações</span>
            </SideBarLink>
        </SidebarModule>
    )
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

            <SideBarLink href="#">
                <TargetIcon size={18} />
                <span>Avaliadores</span>
            </SideBarLink>
        </SidebarModule>
    )
}
