import { CertificateIcon, DownloadSimpleIcon } from "@phosphor-icons/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { usePage } from "@inertiajs/react";

export default function MeusCertificados() {
    const { certificates } = usePage().props;

    return (
        <AuthenticatedLayout titulo="Meus Certificados">
            <div className="mx-auto max-w-3xl px-4 py-8 flex flex-col gap-8">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold text-neutral-800">Meus Certificados</h1>
                    <p className="text-sm text-neutral-500">Histórico de certificados emitidos para você.</p>
                </div>

                {!certificates?.length && (
                    <div className="flex flex-col items-center gap-4 rounded-sm border border-dashed border-neutral-300 py-16 text-center">
                        <CertificateIcon size={40} className="text-neutral-300" />
                        <p className="text-sm text-neutral-500">Você ainda não possui certificados emitidos.</p>
                    </div>
                )}

                <div className="flex flex-col gap-4">
                    {(certificates ?? []).map((cert) => (
                        <div key={cert.id} className="flex items-center gap-4 rounded-sm border border-neutral-300 bg-white px-4 py-4 max-sm:flex-col max-sm:items-start">
                            <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-emerald-50 text-emerald-600 shrink-0">
                                <CertificateIcon size={22} />
                            </div>
                            <div className="flex flex-1 flex-col gap-0.5">
                                <span className="text-sm font-medium text-neutral-700">
                                    {cert.evento?.titulo ?? `Evento #${cert.id_evento}`}
                                </span>
                                <span className="text-xs text-neutral-500">
                                    Emitido em {cert.issued_at}
                                    {cert.sent_at && ` · E-mail enviado em ${cert.sent_at}`}
                                </span>
                            </div>
                            {cert.download_url && (
                                <a href={cert.download_url} target="_blank" rel="noreferrer"
                                    className="flex items-center gap-2 rounded-sm bg-emerald-500 px-3 py-2 text-xs font-medium text-white transition hover:bg-emerald-600">
                                    <DownloadSimpleIcon size={14} />Baixar
                                </a>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}