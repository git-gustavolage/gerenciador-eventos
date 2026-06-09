import { useState, useRef, useCallback, useEffect } from "react";
import { router, usePage } from "@inertiajs/react";
import ManagerLayout from "@/Layouts/ManagerLayout";
import PrimaryButton from "@/Components/PrimaryButton";
import InputImage from "@/Components/Inputs/InputImage";
import { toast } from "sonner";
import { VARS, DEFAULT_FIELDS, buildInlineSvg, buildPreviewData } from "./svgBuilder";
import { exportPdf } from "./pdfExporter";

import PainelCampo from "./Components/PainelCampo";

export default function Formulario() {
    const { evento = null, template = null } = usePage().props;

    const templateData = template?.data ?? template;
    const dadosPrevia  = buildPreviewData(evento);

    const [campos, setCampos]         = useState(templateData?.fields ?? DEFAULT_FIELDS);
    const [campoAtivo, setCampoAtivo] = useState((templateData?.fields ?? DEFAULT_FIELDS)[0]?.id ?? "titulo");
    const [salvando, setSalvando]     = useState(false);
    const [exportando, setExportando] = useState(false);

    const urlFundoInicial = templateData?.bgUrl ?? null;
    const [arquivoFundo, setArquivoFundo] = useState(null);
    const [urlFundo, setUrlFundo] = useState(null);
    const [fundoRemovido, setFundoRemovido] = useState(false);

    const referenciasTextArea = useRef({});

    useEffect(() => {
        if (urlFundoInicial && !urlFundoInicial.startsWith("data:")) {
            fetch(urlFundoInicial)
                .then((res) => res.blob())
                .then((blob) => {
                    const leitor = new FileReader();
                    leitor.onloadend = () => setUrlFundo(leitor.result);
                    leitor.readAsDataURL(blob);
                })
                .catch((err) => console.error("Erro ao converter imagem do banco:", err));
        } else if (urlFundoInicial) {
            setUrlFundo(urlFundoInicial);
        }
    }, [urlFundoInicial]);

    const atualizarCampo = useCallback((id, chave, valor) => {
        setCampos((prev) => prev.map((c) => (c.id === id ? { ...c, [chave]: valor } : c)));
    }, []);

    const removerCampo = useCallback((id) => {
        setCampos((prev) => {
            const proximos = prev.filter((c) => c.id !== id);
            setCampoAtivo(proximos[0]?.id ?? "");
            return proximos;
        });
    }, []);

    const adicionarCampo = () => {
        const id = `campo_${Date.now()}`;
        setCampos((prev) => [...prev, {
            id, label: "Novo campo", content: "Texto aqui...",
            x: 561, y: 400, fontSize: 14, fontWeight: "normal",
            color: "#374151", align: "center", width: 700,
        }]);
        setCampoAtivo(id);
    };

    const mudarFundo = (e) => {
        const arquivo = e.target.files?.[0];
        if (!arquivo) return;

        setArquivoFundo(arquivo);
        setFundoRemovido(false);

        const leitor = new FileReader();
        leitor.onloadend = () => setUrlFundo(leitor.result);
        leitor.readAsDataURL(arquivo);
    };

    const removerFundo = () => {
        setArquivoFundo(null);
        setUrlFundo(null);
        setFundoRemovido(true);
    };

    const salvarConfiguracao = () => {
        setSalvando(true);
        const payload = { fields: campos, remove_background: fundoRemovido ? 1 : 0 };
        if (arquivoFundo) payload.background = arquivoFundo;

        router.post(
            route("eventos.organizacao.certificados.store"),
            payload,
            {
                forceFormData: true,
                onSuccess: () => {
                    toast.success("Configuração salva com sucesso!");
                    setSalvando(false);
                },
                onError: () => {
                    toast.error("Erro ao salvar configuração.");
                    setSalvando(false);
                },
            },
        );
    };

    const nomeArquivo = "certificado_modelo_preview";
    const ativo       = campos.find((c) => c.id === campoAtivo);
    const idsPadroes  = new Set(DEFAULT_FIELDS.map((c) => c.id));

    return (
        <ManagerLayout title="Configuração de Certificado">
            <div className="w-full flex justify-center py-8 px-4">
                <div className="w-full max-w-7xl flex flex-col gap-8">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div className="flex flex-col gap-1">
                            <h1 className="text-3xl font-bold text-neutral-800">
                                Configuração de Certificado
                            </h1>
                            <p className="text-sm text-neutral-500">
                                Este modelo será usado para emitir todos os certificados deste evento. 
                                A prévia abaixo exibe dados de exemplo.
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <PrimaryButton onClick={salvarConfiguracao} disabled={salvando}>
                                {salvando ? "Salvando…" : "Salvar Configurações"}
                            </PrimaryButton>
                        </div>
                    </div>

                    <div className="flex gap-8 items-start max-md:flex-col">
                        <div className="flex flex-col gap-4 w-72 max-md:w-full shrink-0">
                            <div className="rounded-sm border border-neutral-300 bg-white overflow-hidden">
                                <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-300 bg-neutral-50">
                                    <span className="text-sm font-medium text-neutral-600">Campos de texto</span>
                                    <button type="button" onClick={adicionarCampo}
                                        className="text-xs font-medium text-emerald-600 hover:text-emerald-800 transition-colors">
                                        + Adicionar
                                    </button>
                                </div>
                                <div className="flex flex-col divide-y divide-neutral-100">
                                    {campos.map((c) => (
                                        <button key={c.id} type="button" onClick={() => setCampoAtivo(c.id)}
                                            className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                                                campoAtivo === c.id
                                                    ? "bg-emerald-50 text-emerald-800 font-medium"
                                                    : "text-neutral-600 hover:bg-neutral-50"
                                            }`}>
                                            {c.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {ativo && (
                                <div className="rounded-sm border border-neutral-300 bg-white p-4">
                                    <p className="text-sm font-medium text-neutral-700 mb-4">{ativo.label}</p>
                                    <PainelCampo
                                        key={ativo.id}
                                        campo={ativo}
                                        aoMudar={atualizarCampo}
                                        aoDeletar={removerCampo}
                                        ePadrao={idsPadroes.has(ativo.id)}
                                        pegarTextarea={Object.assign(
                                            () => referenciasTextArea.current[ativo.id],
                                            { _set: (el) => { referenciasTextArea.current[ativo.id] = el; } },
                                        )}
                                    />
                                </div>
                            )}

                            <div className="rounded-sm border border-neutral-300 bg-white p-4 flex flex-col gap-3">
                                <p className="text-sm font-medium text-neutral-600">Imagem de fundo</p>
                                <InputImage preview={urlFundo} onChange={mudarFundo} />
                                <p className="text-center text-xs text-neutral-400">Recomendado: A4 (1122 × 794 px)</p>
                                {urlFundo && (
                                    <button type="button" onClick={removerFundo}
                                        className="text-xs text-red-400 hover:text-red-600 transition-colors">
                                        Remover imagem
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col gap-4 flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-neutral-600">Pré-visualização — A4 horizontal</span>
                            </div>

                            <div
                                className="w-full rounded-sm border border-neutral-300 overflow-hidden bg-white shadow-sm"
                                dangerouslySetInnerHTML={{ __html: buildInlineSvg(campos, dadosPrevia, urlFundo) }}
                            />

                            <div className="flex gap-3 flex-wrap pt-1">
                                <button type="button" disabled={exportando}
                                    onClick={async () => {
                                        setExportando(true);
                                        try { await exportPdf(campos, dadosPrevia, urlFundo, `${nomeArquivo}.pdf`); }
                                        catch { toast.error("Não foi possível gerar o PDF."); }
                                        finally { setExportando(false); }
                                    }}
                                    className="py-2.5 px-8 bg-white border border-neutral-300 hover:border-neutral-400 text-neutral-600 duration-150 rounded-sm font-medium text-sm whitespace-nowrap cursor-pointer disabled:opacity-50">
                                    {exportando ? "Gerando PDF…" : "Exportar prévia (PDF)"}
                                </button>
                            </div>

                            <details className="rounded-sm border border-neutral-300 bg-white overflow-hidden">
                                <summary className="px-4 py-3 text-sm font-medium text-neutral-600 cursor-pointer select-none list-none flex items-center justify-between hover:bg-neutral-50 transition-colors">
                                    <span>Variáveis disponíveis</span>
                                </summary>
                                <div className="px-4 pb-4 pt-3 flex flex-wrap gap-3 border-t border-neutral-100">
                                    {VARS.map((v) => (
                                        <div key={v.key} className="flex flex-col gap-0.5">
                                            <code className="text-xs text-neutral-500 bg-neutral-50 border border-neutral-200 px-2 py-0.5 rounded-sm">{v.key}</code>
                                            <span className="text-xs text-neutral-400 px-0.5">{v.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </details>
                        </div>
                    </div>
                </div>
            </div>
        </ManagerLayout>
    );
}