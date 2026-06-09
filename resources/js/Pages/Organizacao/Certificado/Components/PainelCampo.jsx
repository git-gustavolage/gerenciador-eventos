import { Input } from "@/Components/Inputs/Input";
import { VARS, CANVAS_W, CANVAS_H } from "../svgBuilder";

export default function PainelCampo({ campo, aoMudar, aoDeletar, ePadrao, pegarTextarea }) {
    const inserirVariavel = (chave) => {
        const elemento = pegarTextarea();
        if (!elemento) { aoMudar(campo.id, "content", campo.content + chave); return; }
        const inicio = elemento.selectionStart, fim = elemento.selectionEnd;
        aoMudar(campo.id, "content", campo.content.slice(0, inicio) + chave + campo.content.slice(fim));
        setTimeout(() => { elemento.selectionStart = elemento.selectionEnd = inicio + chave.length; elemento.focus(); }, 0);
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                    <label className="text-xs text-neutral-500">Texto</label>
                    {!ePadrao && (
                        <button type="button" onClick={() => aoDeletar(campo.id)}
                            className="text-xs text-neutral-400 hover:text-red-500 transition-colors">
                            Remover campo
                        </button>
                    )}
                </div>
                <textarea
                    ref={(el) => { if (el) pegarTextarea._set?.(el); }}
                    rows={3}
                    value={campo.content || ''}
                    onChange={(e) => aoMudar(campo.id, "content", e.target.value)}
                    className="w-full rounded-sm border border-neutral-300 px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-emerald-300 focus:border-emerald-500 resize-none leading-relaxed"
                />
                <div className="flex flex-wrap gap-1.5">
                    {VARS.map((v) => (
                        <button key={v.key} type="button" onClick={() => inserirVariavel(v.key)}
                            className="px-2 py-0.5 rounded-sm border border-neutral-200 bg-neutral-50 text-xs text-neutral-500 hover:border-emerald-400 hover:text-emerald-700 hover:bg-emerald-50 transition-all">
                            {v.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex gap-3">
                <div className="flex flex-col gap-1 flex-1">
                    <label className="text-xs text-neutral-500">Posição X</label>
                    <Input type="number" min={0} max={CANVAS_W} value={campo.x} onChange={(e) => aoMudar(campo.id, "x", Number(e.target.value))} />
                </div>
                <div className="flex flex-col gap-1 flex-1">
                    <label className="text-xs text-neutral-500">Posição Y</label>
                    <Input type="number" min={0} max={CANVAS_H} value={campo.y} onChange={(e) => aoMudar(campo.id, "y", Number(e.target.value))} />
                </div>
            </div>

            <div className="flex gap-3 flex-wrap">
                <div className="flex flex-col gap-1" style={{ minWidth: 72 }}>
                    <label className="text-xs text-neutral-500">Tamanho</label>
                    <Input type="number" min={8} max={80} value={campo.fontSize} onChange={(e) => aoMudar(campo.id, "fontSize", Number(e.target.value))} />
                </div>
                <div className="flex flex-col gap-1 flex-1" style={{ minWidth: 96 }}>
                    <label className="text-xs text-neutral-500">Peso</label>
                    <select value={campo.fontWeight} onChange={(e) => aoMudar(campo.id, "fontWeight", e.target.value)} className="w-full rounded-sm border border-neutral-300 px-3 py-3 text-sm outline-none focus:ring-1 focus:ring-emerald-300 focus:border-emerald-500">
                        <option value="normal">Normal</option>
                        <option value="medium">Médio</option>
                        <option value="bold">Negrito</option>
                    </select>
                </div>
                <div className="flex flex-col gap-1 flex-1" style={{ minWidth: 96 }}>
                    <label className="text-xs text-neutral-500">Alinhamento</label>
                    <select value={campo.align} onChange={(e) => aoMudar(campo.id, "align", e.target.value)} className="w-full rounded-sm border border-neutral-300 px-3 py-3 text-sm outline-none focus:ring-1 focus:ring-emerald-300 focus:border-emerald-500">
                        <option value="left">Esquerda</option>
                        <option value="center">Centro</option>
                        <option value="right">Direita</option>
                    </select>
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-xs text-neutral-500">Cor</label>
                    <input type="color" value={campo.color} onChange={(e) => aoMudar(campo.id, "color", e.target.value)} className="w-11 h-[46px] rounded-sm border border-neutral-300 cursor-pointer p-0.5" />
                </div>
            </div>
        </div>
    );
}