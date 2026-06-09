import { Info } from "@phosphor-icons/react";

export default function DialogoConfirmacao({ dialogo, aoFechar, aoConfirmar }) {
    if (!dialogo) return null;

    return (
        <div className="fixed inset-0 bg-neutral-900/70 z-50 flex items-center justify-center p-4 backdrop-blur-md transition-opacity">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 text-center transform transition-all scale-100">
                <div className="mx-auto w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-5 border-4 border-white shadow-sm">
                    <Info size={32} className="text-blue-500" weight="fill" />
                </div>
                
                <h3 className="text-xl font-bold text-neutral-800 mb-2">
                    Confirmar Emissão
                </h3>
                
                <p className="text-neutral-500 mb-1">
                    Você está prestes a emitir certificados para:
                </p>
                
                <div className="bg-neutral-50 rounded-lg py-3 px-4 border border-neutral-100 mb-6 inline-block text-left w-full">
                    <p className="text-sm text-neutral-500 flex justify-between mb-1">
                        <span>Alvo:</span> 
                        <span className="font-bold text-neutral-800 truncate max-w-[200px]">{dialogo.titulo}</span>
                    </p>
                    <p className="text-sm text-neutral-500 flex justify-between">
                        <span>Participantes:</span> 
                        <span className="font-bold text-emerald-600">{dialogo.pendentes} pendentes</span>
                    </p>
                </div>

                <div className="flex items-center gap-3 w-full">
                    <button 
                        onClick={aoFechar}
                        className="flex-1 px-4 py-2.5 bg-white border border-neutral-300 text-neutral-700 rounded-lg font-semibold hover:bg-neutral-50 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button 
                        onClick={aoConfirmar}
                        className="flex-1 px-4 py-2.5 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors shadow-sm shadow-emerald-200"
                    >
                        Sim, Emitir
                    </button>
                </div>
            </div>
        </div>
    );
}