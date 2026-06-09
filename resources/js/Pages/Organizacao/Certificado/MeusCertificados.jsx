import { Head, usePage } from "@inertiajs/react";
import { Certificate, DownloadSimple, CalendarBlank, WarningCircle, GraduationCap } from "@phosphor-icons/react";
import Navbar from "@/Layouts/Common/Navbar";

export default function MeusCertificados({ certificates }) {
    const listaCertificados = certificates?.data || certificates || [];

    return (
        <div className="min-h-screen bg-neutral-50">
            <Head title="Meus Certificados" />

            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-neutral-900 flex items-center gap-3">
                            <GraduationCap size={36} className="text-emerald-600" weight="duotone" />
                            Meus Certificados
                        </h1>
                        <p className="text-neutral-500 mt-2 text-lg">
                            Visualize e baixe os certificados das suas participações nos eventos.
                        </p>
                    </div>
                    
                    <div className="bg-white px-4 py-2 rounded-xl border border-neutral-200 shadow-sm flex items-center gap-3 w-fit">
                        <span className="bg-emerald-100 text-emerald-700 p-1.5 rounded-lg">
                            <Certificate size={20} weight="fill" />
                        </span>
                        <span className="font-medium text-neutral-700">
                            Total: <span className="font-bold text-emerald-600">{listaCertificados.length}</span>
                        </span>
                    </div>
                </div>

                {listaCertificados.length === 0 ? (
                    <div className="bg-white border border-neutral-200 border-dashed rounded-3xl p-16 text-center flex flex-col items-center shadow-sm">
                        <div className="bg-neutral-100 p-6 rounded-full mb-5">
                            <WarningCircle size={48} className="text-neutral-400" />
                        </div>
                        <h3 className="text-xl font-bold text-neutral-800 mb-2">Nenhum certificado ainda</h3>
                        <p className="text-neutral-500 max-w-md">
                            Você ainda não possui certificados emitidos. Participe de eventos e atividades para começar a construir o seu portfólio.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {listaCertificados.map((cert) => (
                            <div 
                                key={cert.id} 
                                className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all duration-300 flex flex-col h-full group"
                            >
                                <div className="flex-1">
                                    <div className="flex items-start justify-between mb-5">
                                        <div className="bg-emerald-50 group-hover:bg-emerald-100 transition-colors p-3 rounded-xl text-emerald-600 border border-emerald-100">
                                            <Certificate size={28} weight="fill" />
                                        </div>
                                        <span className="text-xs font-semibold bg-neutral-100 text-neutral-600 px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-neutral-200">
                                            <CalendarBlank size={14} weight="bold" />
                                            {cert.issued_at || cert.created_at}
                                        </span>
                                    </div>
                                    
                                    <h3 className="font-bold text-xl text-neutral-900 leading-tight mb-3">
                                        {cert.atividade?.titulo || 'Certificado de Participação'}
                                    </h3>
                                    
                                    <div className="bg-neutral-50 rounded-lg p-3 border border-neutral-100 mb-4">
                                        <p className="text-xs text-neutral-500 font-medium uppercase tracking-wider mb-1">Evento</p>
                                        <p className="text-sm font-medium text-neutral-800 line-clamp-2">
                                            {cert.evento?.titulo}
                                        </p>
                                    </div>
                                </div>

                                <div className="pt-4 mt-auto">
                                    <a
                                        href={route("eventos.organizacao.certificados.download", cert.id)}
                                        download
                                        className="w-full flex items-center justify-center gap-2 bg-neutral-900 hover:bg-emerald-600 text-white font-semibold py-3 rounded-xl transition-all shadow-sm hover:shadow-emerald-200">
                                        <DownloadSimple size={20} weight="bold" />
                                        Baixar PDF
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}