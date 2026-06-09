import { useState, useEffect, useCallback } from "react";
import { usePage } from "@inertiajs/react";
import axios from "axios";


interface Atividade {
    id: number;
    titulo: string;
    descricao: string | null;
    data_inicio: string;
    data_fim: string;
    ambiente: string | null;
    ministrantes: string[];
    limite_participantes: number | null;
    vagas_restantes: number | null;
    inscrito: boolean;
    status_inscricao: string | null;
}

interface EventoResumo {
    id: number;
    titulo: string;
    data_inicio: string;
    data_fim: string;
    local: string | null;
    limite_inscricoes: number | null;
    inscrito_no_evento: boolean;
    status_inscricao_evento: string | null;
}

interface DadosInscricao {
    evento: EventoResumo;
    atividades: Atividade[];
}

interface Props {
    eventoId: number;
    open: boolean;
    onClose: () => void;
    onSucesso?: (result: { inscritoNoEvento: boolean; novasAtividades: number[] }) => void;
}


function fmtHorario(inicio: string, fim: string): string {
    const fmt = (s: string) =>
        new Date(s).toLocaleString("pt-BR", {
            weekday: "short",
            day: "2-digit",
            month: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        });
    return `${fmt(inicio)} – ${fmt(fim).split(" ").slice(-1)[0]}`;
}

function telMask(v: string): string {
    return v
        .replace(/\D/g, "")
        .replace(/^(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{5})(\d{1,4})$/, "$1-$2")
        .slice(0, 15);
}


function StepBar({ step }: { step: number }) {
    const steps = ["Dados", "Atividades", "Confirmar"];
    
    return (
        <div className="relative flex items-center justify-between w-full mb-8 px-4">
            {}
            <div className="absolute top-4 left-10 right-10 h-0.5 bg-neutral-100 -z-10" />
            <div 
                className="absolute top-4 left-10 h-0.5 bg-emerald-500 transition-all duration-300 -z-10" 
                style={{ width: step === 0 ? "0%" : step === 1 ? "50%" : "100%" }}
            />

            {steps.map((label, i) => {
                const isActive = i === step;
                const isCompleted = i < step;

                return (
                    <div key={i} className="flex flex-col items-center gap-1.5 bg-white px-2 shrink-0">
                        <div
                            className={`w-8 h-8 rounded-full border flex items-center justify-center text-xs font-bold transition-all ${
                                isCompleted || isActive
                                    ? "bg-emerald-600 border-emerald-600 text-white shadow-sm shadow-emerald-500/20"
                                    : "border-neutral-200 bg-white text-neutral-400"
                            }`}
                        >
                            {isCompleted ? "✓" : i + 1}
                        </div>
                        <span
                            className={`text-xs font-semibold tracking-wide transition-colors ${
                                isActive ? "text-emerald-700" : isCompleted ? "text-emerald-600" : "text-neutral-400"
                            }`}
                        >
                            {label}
                        </span>
                    </div>
                );
            })}
        </div>
    );
}


function StepLogin({ eventoId }: { eventoId: number }) {
    return (
        <div className="flex flex-col gap-5">
            <div className="text-center md:text-left">
                <p className="text-lg font-bold text-neutral-900">Acesse sua conta</p>
                <p className="text-sm text-neutral-500 mt-1">
                    Para se inscrever no evento, você precisa estar conectado.
                </p>
            </div>
            <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 text-sm text-neutral-600 leading-relaxed">
                Faça login ou crie uma conta gratuita para continuar com a inscrição de forma segura.
            </div>
            <div className="flex flex-col gap-3">
                <a
                    href={`/login?redirect=/eventos/${eventoId}`}
                    className="w-full text-center rounded-xl bg-emerald-600 text-white text-sm font-semibold px-4 py-3 hover:bg-emerald-700 transition-all shadow-sm active:scale-[.99]"
                >
                    Entrar na minha conta
                </a>
                <a
                    href={`/register?redirect=/eventos/${eventoId}`}
                    className="w-full text-center rounded-xl border border-neutral-200 text-neutral-700 text-sm font-semibold px-4 py-3 hover:bg-neutral-50 hover:text-neutral-900 transition-all active:scale-[.99]"
                >
                    Criar conta gratuita
                </a>
            </div>
        </div>
    );
}


interface DadosForm {
    nome: string;
    telefone: string;
}

interface DadosErrors {
    nome?: string;
    telefone?: string;
}

function StepDados({
    form,
    errors,
    onChange,
}: {
    form: DadosForm;
    errors: DadosErrors;
    onChange: (f: DadosForm) => void;
}) {
    return (
        <div className="flex flex-col gap-5">
            <div>
                <p className="text-lg font-bold text-neutral-900">Dados do participante</p>
                <p className="text-sm text-neutral-500 mt-1">
                    Informe seus dados atualizados para a emissão correta do credenciamento.
                </p>
            </div>

            <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-neutral-700 uppercase tracking-wide">
                    Nome completo *
                </label>
                <input
                    type="text"
                    value={form.nome}
                    onChange={(e) => onChange({ ...form, nome: e.target.value })}
                    placeholder="Seu nome completo"
                    className={`rounded-xl border px-4 py-3 text-sm text-neutral-800 outline-none transition-all ${
                        errors.nome
                            ? "border-red-400 ring-4 ring-red-500/10"
                            : "border-neutral-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                    }`}
                />
                {errors.nome && (
                    <p className="text-xs font-medium text-red-500 mt-0.5">{errors.nome}</p>
                )}
            </div>

            <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-neutral-700 uppercase tracking-wide">
                    Telefone *
                </label>
                <input
                    type="tel"
                    value={form.telefone}
                    onChange={(e) =>
                        onChange({ ...form, telefone: telMask(e.target.value) })
                    }
                    placeholder="(00) 00000-0000"
                    className={`rounded-xl border px-4 py-3 text-sm text-neutral-800 outline-none transition-all ${
                        errors.telefone
                            ? "border-red-400 ring-4 ring-red-500/10"
                            : "border-neutral-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                    }`}
                />
                {errors.telefone && (
                    <p className="text-xs font-medium text-red-500 mt-0.5">{errors.telefone}</p>
                )}
            </div>
        </div>
    );
}


function StepAtividades({
    dados,
    selecionadas,
    inscricaoEvento,
    onChange,
    onToggleEvento,
}: {
    dados: DadosInscricao;
    selecionadas: number[];
    inscricaoEvento: boolean;
    onChange: (ids: number[]) => void;
    onToggleEvento: (v: boolean) => void;
}) {
    const toggle = (id: number, atv: Atividade) => {
        if (atv.inscrito || atv.vagas_restantes === 0) return;
        const next = selecionadas.includes(id)
            ? selecionadas.filter((x) => x !== id)
            : [...selecionadas, id];
        onChange(next);
    };

    return (
        <div className="flex flex-col gap-5">
            <div>
                <p className="text-lg font-bold text-neutral-900">Escolha as atividades</p>
                <p className="text-sm text-neutral-500 mt-1">
                    Você pode se inscrever no evento geral, em atividades específicas ou em ambos.
                </p>
            </div>

            {/* Inscrição no evento geral */}
            <div
                onClick={() => !dados.evento.inscrito_no_evento && onToggleEvento(!inscricaoEvento)}
                className={`rounded-xl border p-4 flex gap-3.5 transition-all select-none ${
                    dados.evento.inscrito_no_evento
                        ? "border-neutral-200 bg-neutral-50 opacity-70 cursor-not-allowed"
                        : inscricaoEvento
                        ? "border-emerald-500 bg-emerald-50/60 cursor-pointer shadow-sm"
                        : "border-neutral-200 cursor-pointer hover:border-emerald-400 hover:bg-neutral-50/50"
                }`}
            >
                <div
                    className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center transition-all shrink-0 ${
                        dados.evento.inscrito_no_evento || inscricaoEvento
                            ? "bg-emerald-600 border-emerald-600 shadow-sm"
                            : "border-neutral-300 bg-white"
                    }`}
                >
                    {(dados.evento.inscrito_no_evento || inscricaoEvento) && (
                        <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 12 12">
                            <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-neutral-800">
                            Inscrição no evento geral
                        </span>
                        {dados.evento.inscrito_no_evento && (
                            <span className="text-[10px] font-bold tracking-wide uppercase px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                                Já inscrito
                            </span>
                        )}
                    </div>
                    <p className="text-xs text-neutral-500 mt-1 font-medium">
                        {dados.evento.local} · {new Date(dados.evento.data_inicio).toLocaleDateString("pt-BR")} a {new Date(dados.evento.data_fim).toLocaleDateString("pt-BR")}
                    </p>
                </div>
            </div>

            {/* Divisor */}
            <div className="flex items-center gap-3 py-1">
                <div className="flex-1 h-px bg-neutral-100" />
                <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">
                    atividades da programação
                </span>
                <div className="flex-1 h-px bg-neutral-100" />
            </div>

            {/* Lista de atividades */}
            <div className="flex flex-col gap-2.5 max-h-[280px] overflow-y-auto pr-1">
                {dados.atividades.map((atv) => {
                    const lotado = atv.vagas_restantes === 0 && !atv.inscrito;
                    const checked = atv.inscrito || selecionadas.includes(atv.id);
                    const disabled = atv.inscrito || lotado;

                    return (
                        <div
                            key={atv.id}
                            onClick={() => toggle(atv.id, atv)}
                            className={`rounded-xl border p-4 flex gap-3.5 transition-all select-none ${
                                disabled
                                    ? "border-neutral-100 bg-neutral-50/50 opacity-60 cursor-not-allowed"
                                    : checked
                                    ? "border-emerald-500 bg-emerald-50/60 cursor-pointer shadow-sm"
                                    : "border-neutral-200 cursor-pointer hover:border-emerald-400 hover:bg-neutral-50/50"
                            }`}
                        >
                            <div
                                className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center transition-all shrink-0 ${
                                    atv.inscrito
                                        ? "bg-neutral-400 border-neutral-400 text-white"
                                        : checked
                                        ? "bg-emerald-600 border-emerald-600 shadow-sm"
                                        : "border-neutral-300 bg-white"
                                }`}
                            >
                                {checked && (
                                    <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 12 12">
                                        <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap mb-1">
                                    <span className="text-sm font-semibold text-neutral-800 leading-snug">
                                        {atv.titulo}
                                    </span>
                                    {atv.inscrito && (
                                        <span className="text-[10px] font-bold tracking-wide uppercase px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60 shrink-0">
                                            Já inscrito
                                        </span>
                                    )}
                                    {lotado && (
                                        <span className="text-[10px] font-bold tracking-wide uppercase px-2 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200/60 shrink-0">
                                            Lotado
                                        </span>
                                    )}
                                    {!atv.inscrito && !lotado && atv.vagas_restantes !== null && (
                                        <span className="text-[10px] font-bold tracking-wide uppercase px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600 border border-neutral-200/60 shrink-0">
                                            {atv.vagas_restantes} vagas
                                        </span>
                                    )}
                                </div>
                                <p className="text-xs text-neutral-500 font-medium">
                                    {fmtHorario(atv.data_inicio, atv.data_fim)}
                                </p>
                                {atv.ambiente && (
                                    <p className="text-xs text-neutral-400 mt-0.5 truncate">
                                        {atv.ambiente}
                                        {atv.ministrantes.length > 0 && ` · ${atv.ministrantes.join(", ")}`}
                                    </p>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {dados.atividades.length === 0 && (
                <p className="text-sm text-neutral-400 text-center py-6 font-medium">
                    Nenhuma atividade complementar disponível.
                </p>
            )}
        </div>
    );
}


function StepConfirmar({
    form,
    dados,
    selecionadas,
    inscricaoEvento,
}: {
    form: DadosForm;
    dados: DadosInscricao;
    selecionadas: number[];
    inscricaoEvento: boolean;
}) {
    const atvsNovas = dados.atividades.filter(
        (a) => selecionadas.includes(a.id) && !a.inscrito
    );

    return (
        <div className="flex flex-col gap-5">
            <div>
                <p className="text-lg font-bold text-neutral-900">Confirme sua inscrição</p>
                <p className="text-sm text-neutral-500 mt-1">
                    Revise seus dados e seleções antes de finalizar o procedimento.
                </p>
            </div>

            <div className="rounded-xl border border-neutral-200 bg-white overflow-hidden shadow-sm divide-y divide-neutral-100">
                {[
                    { label: "Nome", value: form.nome },
                    { label: "Telefone", value: form.telefone },
                    {
                        label: "Evento geral",
                        value: inscricaoEvento || dados.evento.inscrito_no_evento ? "✓ Confirmado" : "—",
                    },
                ].map((row) => (
                    <div key={row.label} className="flex justify-between items-center px-4 py-3.5 text-sm">
                        <span className="text-neutral-500 font-medium">{row.label}</span>
                        <span className="text-neutral-800 font-semibold">{row.value}</span>
                    </div>
                ))}
                
                {atvsNovas.length > 0 && (
                    <div className="px-4 py-3.5 bg-neutral-50/50">
                        <p className="text-xs font-bold text-neutral-400 uppercase tracking-wide mb-2">
                            Novas atividades selecionadas
                        </p>
                        <ul className="flex flex-col gap-1.5 pl-1">
                            {atvsNovas.map((a) => (
                                <li key={a.id} className="text-sm text-neutral-800 font-medium flex items-start gap-2">
                                    <span className="text-emerald-500 font-bold">•</span>
                                    <span>{a.titulo}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-4 text-sm text-amber-800 flex gap-3 leading-relaxed">
                <span className="text-base shrink-0">⚠️</span>
                <span className="font-medium">
                    Após confirmar, sua vaga será reservada de imediato. Certifique-se de que todas as informações acima estão corretas.
                </span>
            </div>
        </div>
    );
}


function StepSucesso({
    dados,
    atividadesInscritas,
    onClose,
}: {
    dados: DadosInscricao;
    atividadesInscritas: number[];
    onClose: () => void;
}) {
    const atvsInscritas = dados.atividades.filter((a) => atividadesInscritas.includes(a.id));

    return (
        <div className="flex flex-col items-center gap-5 py-4 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center shadow-sm">
                <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24">
                    <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>
            <div>
                <p className="text-xl font-black text-neutral-900 tracking-tight">Inscrição Confirmada!</p>
                <p className="text-sm text-neutral-500 mt-2 max-w-sm mx-auto leading-relaxed">
                    Você agora faz parte do evento <strong>{dados.evento.titulo}</strong>. Um e-mail com o comprovante foi enviado.
                </p>
            </div>

            {atvsInscritas.length > 0 && (
                <div className="w-full rounded-xl border border-neutral-200 text-left overflow-hidden bg-white shadow-sm divide-y divide-neutral-100 mt-2">
                    <p className="px-4 py-2.5 bg-neutral-50 text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                        Atividades garantidas
                    </p>
                    {atvsInscritas.map((a) => (
                        <div key={a.id} className="px-4 py-3 text-sm font-medium text-neutral-700 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                            <span className="truncate">{a.titulo}</span>
                        </div>
                    ))}
                </div>
            )}

            <button
                onClick={onClose}
                className="w-full mt-4 rounded-xl bg-emerald-600 text-white text-sm font-semibold px-4 py-3.5 hover:bg-emerald-700 transition-all shadow-sm active:scale-[.99]"
            >
                Fechar e retornar
            </button>
        </div>
    );
}


export default function ModalInscricao({ eventoId, open, onClose, onSucesso }: Props) {
    const { auth } = usePage<{ auth: { user: { nome: string } | null } }>().props;
    const isLoggedIn = !!auth?.user;

    const [step, setStep] = useState(isLoggedIn ? 0 : -1);
    const [loading, setLoading] = useState(false);
    const [dados, setDados] = useState<DadosInscricao | null>(null);
    const [form, setForm] = useState<DadosForm>({
        nome: auth?.user?.nome ?? "",
        telefone: "",
    });
    const [formErrors, setFormErrors] = useState<DadosErrors>({});
    const [selecionadas, setSelecionadas] = useState<number[]>([]);
    const [inscricaoEvento, setInscricaoEvento] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);
    const [atividadesInscritas, setAtividadesInscritas] = useState<number[]>([]);
    const [sucesso, setSucesso] = useState(false);

    const carregarDados = useCallback(async () => {
        setLoading(true);
        try {
            const { data } = await axios.get<DadosInscricao>(`/eventos/${eventoId}/inscricao/dados`);
            setDados(data);
            setSelecionadas(data.atividades.filter((a) => a.inscrito).map((a) => a.id));
            setInscricaoEvento(data.evento.inscrito_no_evento);
        } catch {
            setServerError("Não foi possível carregar as atividades disponíveis.");
        } finally {
            setLoading(false);
        }
    }, [eventoId]);

    useEffect(() => {
        if (open && isLoggedIn && step === 0) {
            carregarDados();
        }
    }, [open, isLoggedIn, step, carregarDados]);

    useEffect(() => {
        if (!open) {
            setStep(isLoggedIn ? 0 : -1);
            setSucesso(false);
            setServerError(null);
        }
    }, [open, isLoggedIn]);

    const validateDados = (): boolean => {
        const errs: DadosErrors = {};
        if (!form.nome.trim()) errs.nome = "Nome obrigatório";
        if (!form.telefone.trim()) errs.telefone = "Telefone obrigatório";
        else if (!/^\(\d{2}\) \d{4,5}-\d{4}$/.test(form.telefone))
            errs.telefone = "Formato de telefone inválido";
        setFormErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleDadosNext = () => {
        if (validateDados()) setStep(1);
    };

    const podeAvancarSelecao = (() => {
        if (!dados) return false;
        if (dados.evento.inscrito_no_evento) return true;
        if (inscricaoEvento) return true;
        const atvsNovas = selecionadas.filter(
            (id) => !dados.atividades.find((a) => a.id === id)?.inscrito
        );
        return atvsNovas.length > 0;
    })();

    const handleSubmit = async () => {
        if (!dados) return;
        setLoading(true);
        setServerError(null);

        const atvsNovas = selecionadas.filter(
            (id) => !dados.atividades.find((a) => a.id === id)?.inscrito
        );

        try {
            const { data } = await axios.post(`/eventos/${eventoId}/inscricao`, {
                nome: form.nome,
                telefone: form.telefone,
                inscrever_evento: inscricaoEvento && !dados.evento.inscrito_no_evento,
                atividades: atvsNovas,
            });

            setAtividadesInscritas(data.atividades_inscritas ?? []);
            setSucesso(true);
            onSucesso?.({
                inscritoNoEvento: !!data.inscrito_no_evento,
                novasAtividades: data.atividades_inscritas ?? [],
            });
        } catch (err: any) {
            const msg = err?.response?.data?.errors
                ? Object.values(err.response.data.errors).flat().join(" ")
                : "Erro ao processar a inscrição.";
            setServerError(msg);
        } finally {
            setLoading(false);
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-neutral-900/40 backdrop-blur-sm p-4 transition-all animate-fade-in">
            <div className="w-full max-w-lg bg-white rounded-2xl border border-neutral-100 shadow-2xl max-h-[92dvh] flex flex-col overflow-hidden transform transition-all">
                
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 bg-neutral-50/50">
                    <span className="text-sm font-bold text-neutral-800 tracking-wide uppercase">
                        Inscrição no evento
                    </span>
                    <button
                        onClick={onClose}
                        className="w-7 h-7 flex items-center justify-center rounded-full text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 transition-colors"
                        aria-label="Fechar"
                    >
                        ✕
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto px-6 py-6">
                    {!isLoggedIn ? (
                        <StepLogin eventoId={eventoId} />
                    ) : sucesso && dados ? (
                        <StepSucesso
                            dados={dados}
                            atividadesInscritas={atividadesInscritas}
                            onClose={onClose}
                        />
                    ) : (
                        <>
                            <StepBar step={step} />

                            {loading && !dados ? (
                                <div className="py-12 flex flex-col items-center justify-center gap-3 text-sm text-neutral-400 font-medium">
                                    <div className="w-5 h-5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                                    Carregando informações...
                                </div>
                            ) : (
                                <>
                                    {step === 0 && <StepDados form={form} errors={formErrors} onChange={setForm} />}
                                    {step === 1 && dados && (
                                        <StepAtividades
                                            dados={dados}
                                            selecionadas={selecionadas}
                                            inscricaoEvento={inscricaoEvento}
                                            onChange={setSelecionadas}
                                            onToggleEvento={setInscricaoEvento}
                                        />
                                    )}
                                    {step === 2 && dados && (
                                        <StepConfirmar
                                            form={form}
                                            dados={dados}
                                            selecionadas={selecionadas}
                                            inscricaoEvento={inscricaoEvento}
                                        />
                                    )}
                                </>
                            )}

                            {serverError && (
                                <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
                                    {serverError}
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Footer – botões de navegação */}
                {isLoggedIn && !sucesso && (
                    <div className="px-6 py-4 border-t border-neutral-100 bg-neutral-50/50 flex justify-between gap-3">
                        {step > 0 ? (
                            <button
                                onClick={() => setStep((s) => s - 1)}
                                disabled={loading}
                                className="rounded-xl border border-neutral-200 text-neutral-700 bg-white text-sm font-semibold px-4 py-2.5 hover:bg-neutral-50 transition-all disabled:opacity-50 active:scale-[.98]"
                            >
                                ← Voltar
                            </button>
                        ) : (
                            <div />
                        )}

                        {step === 0 && (
                            <button
                                onClick={handleDadosNext}
                                className="rounded-xl bg-emerald-600 text-white text-sm font-semibold px-5 py-2.5 hover:bg-emerald-700 shadow-sm transition-all active:scale-[.98]"
                            >
                                Continuar →
                            </button>
                        )}

                        {step === 1 && (
                            <button
                                onClick={() => setStep(2)}
                                disabled={!podeAvancarSelecao}
                                className="rounded-xl bg-emerald-600 text-white text-sm font-semibold px-5 py-2.5 hover:bg-emerald-700 shadow-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-[.98]"
                            >
                                Continuar →
                            </button>
                        )}

                        {step === 2 && (
                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="rounded-xl bg-emerald-600 text-white text-sm font-semibold px-5 py-2.5 hover:bg-emerald-700 shadow-sm transition-all disabled:opacity-50 active:scale-[.98] flex items-center gap-2"
                            >
                                {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                                {loading ? "Processando..." : "Confirmar inscrição"}
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}