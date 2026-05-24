import { CertificateIcon, ShareNetworkIcon, StarIcon, TicketIcon } from "@phosphor-icons/react";

export default function ActionsSection() {
    return (
        <section className="border-y border-gray-300 py-8 w-full flex items-center justify-center max-md:hidden">
            <div className="inline-flex items-center justify-between max-lg:grid max-lg:grid-cols-2 gap-8">
                <Item Icon={TicketIcon} title="Inscreva-se" description="Inscreva-se e participe" />
                <Item Icon={ShareNetworkIcon} title="Compartilhe" description="Compartilhe em suas redes sociais" />
                <Item Icon={StarIcon} title="Avalie" description="Deixe avaliações nos eventos" />
                <Item Icon={CertificateIcon} title="Certificados" description="Emita certificado de participação" />
            </div>
        </section>
    );
}

function Item({ Icon, title = "", description = "" }) {
    return (
        <div className="inline-flex gap-4 items-center min-w-[300px]">
            <div className="size-16 min-w-16 min-h-16 bg-emerald-100 rounded-2xl text-emerald-800 flex items-center justify-center">
                <Icon size={32} />
            </div>
            <div>
                <h2 className="text-xl font-bold text-neutral-800">{title}</h2>
                <p className="font-medium text-neutral-500 text-sm">{description}</p>
            </div>
        </div>
    );
}
