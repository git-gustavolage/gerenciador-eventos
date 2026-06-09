import { useState, useMemo } from "react";
import { MagnifyingGlass, XIcon, Users, CheckCircle } from "@phosphor-icons/react";

export default function ModalParticipantes({ atividade, mapaEmitidos, aoFechar, aoEmitir, processando }) {
    const [busca, setBusca] = useState("");
    const [filtroStatus, setFiltroStatus] = useState("todos");

    const participantesFiltrados = useMemo(() => {
        return atividade.participantes.filter(p => {
            const matchTexto = p.nome.toLowerCase().includes(busca.toLowerCase()) || 
                               p.email.toLowerCase().includes(busca.toLowerCase());
            
            const certEmitido = mapaEmitidos[`${p.id_user}-${atividade.id}`];
            
            if (filtroStatus === 'emitidos' && !certEmitido) return false;
            if (filtroStatus === 'pendentes' && certEmitido) return false;
            
            return matchTexto;
        });
    }, [atividade, busca, filtroStatus, mapaEmitidos]);

    return (
        <div className="fixed inset-0 bg-neutral-900/60 z-40 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
                <div className="bg-neutral-50 px-6 py-5 border-b border-neutral-200 flex justify-between items-start">
                    <div className="w-full mr-4">
                        <h2 className="font-bold text-2xl text-neutral-800 mb-1">{atividade.titulo}</h2>
                        <div className="flex flex-col sm:flex-row gap-3 mt-4">
                            <div className="relative flex-1">
                                <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={20} />
                                <input 
                                    type="text" 
                                    placeholder="Buscar por nome ou e-mail..."
                                    value={busca}
                                    onChange={(e) => setBusca(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-white border border-neutral-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                                />
                            </div>
                            <div className="flex bg-neutral-200/50 p-1 rounded-lg">
                                {['todos', 'pendentes', 'emitidos'].map((status) => (
                                    <button
                                        key={status}
                                        onClick={() => setFiltroStatus(status)}
                                        className={`px-3 py-1.5 text-sm font-medium rounded-md capitalize transition-colors ${
                                            filtroStatus === status 
                                            ? 'bg-white text-neutral-900 shadow-sm' 
                                            : 'text-neutral-600 hover:text-neutral-900'
                                        }`}
                                    >
                                        {status}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                    <button onClick={aoFechar} className="p-2 hover:bg-neutral-200 rounded-full transition-colors text-neutral-500 shrink-0">
                        <XIcon size={24} />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto flex-1 bg-neutral-50/30">
                    {participantesFiltrados.length === 0 ? (
                        <div className="text-center py-16">
                            <Users size={56} className="mx-auto text-neutral-300 mb-4" />
                            <h3 className="text-lg font-bold text-neutral-700">Nenhum resultado</h3>
                            <p className="text-neutral-500 mt-1">Tente ajustar seus filtros ou termos de busca.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {participantesFiltrados.map((p) => {
                                const cert = mapaEmitidos[`${p.id_user}-${atividade.id}`];
                                return (
                                    <div key={p.id_user} className="flex items-center justify-between p-4 bg-white border border-neutral-200 rounded-xl shadow-sm hover:border-emerald-300 transition-colors">
                                        <div className="flex items-center gap-4 overflow-hidden">
                                            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-lg shrink-0 border border-emerald-100">
                                                {p.nome.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="truncate">
                                                <p className="text-base font-bold text-neutral-800 truncate">{p.nome}</p>
                                                <p className="text-sm text-neutral-500 truncate">{p.email}</p>
                                            </div>
                                        </div>
                                        <div className="shrink-0 ml-3">
                                            {cert ? (
                                                <span className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-sm font-bold px-3 py-2 rounded-lg border border-emerald-100">
                                                    <CheckCircle weight="fill" size={20} /> Emitido
                                                </span>
                                            ) : (
                                                <button 
                                                    disabled={processando}
                                                    onClick={() => aoEmitir(p.id_user, atividade.id)}
                                                    className="px-4 py-2 bg-neutral-900 text-white text-sm font-semibold rounded-lg hover:bg-neutral-700 transition-colors disabled:opacity-50"
                                                >
                                                    Emitir
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}