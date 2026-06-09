import { CheckCircle, Users } from "@phosphor-icons/react";

export default function CartaoAtividade({ ativ, processando, aoAbrirModal, aoEmitirEmLote }) {
    return (
        <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex-1 w-full">
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-lg text-neutral-800">{ativ.titulo}</h3>
                        {ativ.finalizado && (
                            <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                                <CheckCircle weight="fill" /> Concluído
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-neutral-500 mt-2 mb-3">
                        <span className="flex items-center gap-1.5"><Users size={16} /> {ativ.total} inscritos</span>
                        <span className="flex items-center gap-1.5 text-emerald-600"><CheckCircle size={16} /> {ativ.emitidos} emitidos</span>
                    </div>
                    <div className="w-full md:max-w-md bg-neutral-100 rounded-full h-2.5 overflow-hidden">
                        <div 
                            className={`h-2.5 rounded-full transition-all duration-500 ${ativ.finalizado ? 'bg-emerald-500' : 'bg-blue-500'}`} 
                            style={{ width: `${ativ.progresso}%` }}
                        ></div>
                    </div>
                </div>
                <div className="flex flex-wrap items-center gap-2 w-full md:w-auto mt-2 md:mt-0">
                    <button 
                        onClick={() => aoAbrirModal(ativ)} 
                        className="px-4 py-2 bg-white border border-neutral-300 text-neutral-700 rounded-lg font-medium text-sm hover:bg-neutral-50 transition-colors flex-1 md:flex-none text-center"
                    >
                        Ver Lista Completa
                    </button>
                    <button 
                        disabled={processando || ativ.finalizado || ativ.total === 0}
                        onClick={() => aoEmitirEmLote(ativ)} 
                        className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors flex-1 md:flex-none text-center ${
                            ativ.finalizado 
                            ? 'bg-neutral-100 text-neutral-400 border border-neutral-200 cursor-not-allowed' 
                            : 'bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100'
                        }`}
                    >
                        Emitir Pendentes
                    </button>
                </div>
            </div>
        </div>
    );
}