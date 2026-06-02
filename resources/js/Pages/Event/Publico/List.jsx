import { useState, useMemo } from "react";
import { Link } from "@inertiajs/react";
import Navbar from "@/Layouts/Common/Navbar";
import { 
    CalendarBlankIcon, 
    MapPinIcon, 
    MonitorIcon, 
    HouseLineIcon, 
    TelevisionIcon,
    ArrowRightIcon,
    WarningIcon,
    MagnifyingGlassIcon,
    FunnelIcon,
    SmileySadIcon
} from "@phosphor-icons/react";

/* ─── Helpers de Formatação ─────────────────────────── */
function formatDate(dateStr) {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}

function checkEncerrado(evento) {
    if (evento.is_encerrado) return true;
    
    // Verifica se a data fim das inscrições já passou
    if (evento.data_fim_inscricoes && new Date(evento.data_fim_inscricoes) < new Date()) {
        return true;
    }
    // Verifica se o próprio evento já terminou
    if (evento.data_fim && new Date(evento.data_fim) < new Date()) {
        return true;
    }
    return false;
}

function FormatoBadge({ formato }) {
    const icones = {
        presencial: <HouseLineIcon size={14} />,
        remoto: <MonitorIcon size={14} />,
        hibrido: <TelevisionIcon size={14} />
    };
    
    const valor = formato?.value ?? formato;

    return (
        <span className="inline-flex items-center gap-1 text-xs font-medium text-neutral-600 bg-neutral-100 border border-neutral-200 rounded-full px-2.5 py-0.5 capitalize">
            {icones[valor] || <TelevisionIcon size={14} />}
            {valor?.replace("_", " ")}
        </span>
    );
}

/* ─── Componente Principal ───────────────────────────── */
export default function ListagemEventos({ eventos = [] }) {
    // Estados dos filtros
    const [busca, setBusca] = useState("");
    const [filtroFormato, setFiltroFormato] = useState("todos");
    const [filtroStatus, setFiltroStatus] = useState("todos");

    // Filtragem reativa instantânea
    const eventosFiltrados = useMemo(() => {
        return eventos.filter((evento) => {
            // 1. Filtro de Texto (Título ou Descrição)
            const termoBusca = busca.toLowerCase();
            const bateTexto = 
                evento.titulo?.toLowerCase().includes(termoBusca) || 
                evento.descricao?.toLowerCase().includes(termoBusca);

            // 2. Filtro de Formato
            const valorFormato = evento.formato?.value ?? evento.formato;
            const bateFormato = filtroFormato === "todos" || valorFormato === filtroFormato;

            // 3. Filtro de Status
            const encerrado = checkEncerrado(evento);
            const bateStatus = 
                filtroStatus === "todos" || 
                (filtroStatus === "abertos" && !encerrado) || 
                (filtroStatus === "encerrados" && encerrado);

            return bateTexto && bateFormato && bateStatus;
        });
    }, [eventos, busca, filtroFormato, filtroStatus]);

    return (
        <div className="min-h-screen bg-neutral-50 font-sans flex flex-col">
            <Navbar />

            <main className="mx-auto w-full max-w-6xl px-6 py-10 max-md:px-4 flex-1 flex flex-col gap-8">
                {/* Cabeçalho da Página */}
                <div className="flex flex-col gap-2 border-b border-neutral-200 pb-5">
                    <h1 className="text-3xl font-black text-neutral-900 tracking-tight">
                        Eventos Disponíveis
                    </h1>
                    <p className="text-sm text-neutral-500">
                        Explore, participe e amplie seus conhecimentos na plataforma de eventos do E-IFRO.
                    </p>
                </div>

                {/* Barra de Pesquisa e Filtros */}
                <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-2xl border border-neutral-200 shadow-sm">
                    {/* Input de Busca */}
                    <div className="flex-1 relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                            <MagnifyingGlassIcon size={20} className="text-neutral-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Buscar eventos por título ou descrição..."
                            value={busca}
                            onChange={(e) => setBusca(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 outline-none transition-all placeholder:text-neutral-400"
                        />
                    </div>

                    {/* Selects de Filtros */}
                    <div className="flex flex-wrap md:flex-nowrap items-center gap-3">
                        {/* Filtro Formato */}
                        <div className="flex-1 md:flex-none flex items-center gap-2 bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2.5 focus-within:ring-2 focus-within:ring-emerald-600 transition-all">
                            <FunnelIcon size={18} className="text-neutral-400 shrink-0" />
                            <select
                                value={filtroFormato}
                                onChange={(e) => setFiltroFormato(e.target.value)}
                                className="bg-transparent border-none p-0 m-0 w-full outline-none text-sm text-neutral-700 cursor-pointer focus:ring-0"
                            >
                                <option value="todos">Qualquer Formato</option>
                                <option value="presencial">Presencial</option>
                                <option value="remoto">Remoto</option>
                                <option value="hibrido">Híbrido</option>
                            </select>
                        </div>

                        {/* Filtro Status */}
                        <div className="flex-1 md:flex-none flex items-center gap-2 bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2.5 focus-within:ring-2 focus-within:ring-emerald-600 transition-all">
                            <CalendarBlankIcon size={18} className="text-neutral-400 shrink-0" />
                            <select
                                value={filtroStatus}
                                onChange={(e) => setFiltroStatus(e.target.value)}
                                className="bg-transparent border-none p-0 m-0 w-full outline-none text-sm text-neutral-700 cursor-pointer focus:ring-0"
                            >
                                <option value="todos">Qualquer Status</option>
                                <option value="abertos">Inscrições Abertas</option>
                                <option value="encerrados">Encerrados</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Grid de Eventos */}
                {eventos.length === 0 ? (
                    // Caso 1: O banco de dados está vazio e não tem NENHUM evento publicado
                    <div className="flex flex-col items-center justify-center text-center py-20 bg-white border border-neutral-200 rounded-3xl p-8 shadow-sm">
                        <CalendarBlankIcon size={48} className="text-neutral-300 mb-3" weight="duotone" />
                        <h3 className="font-semibold text-neutral-700 text-lg">Nenhum evento publicado</h3>
                        <p className="text-sm text-neutral-400 max-w-sm mt-1">
                            Não existem eventos ativos ou publicados no momento. Volte a acompanhar em breve!
                        </p>
                    </div>
                ) : eventosFiltrados.length === 0 ? (
                    // Caso 2: Existem eventos, mas nenhum bate com os filtros aplicados
                    <div className="flex flex-col items-center justify-center text-center py-20 bg-transparent p-8">
                        <SmileySadIcon size={48} className="text-neutral-300 mb-3" weight="duotone" />
                        <h3 className="font-semibold text-neutral-700 text-lg">Nenhum resultado encontrado</h3>
                        <p className="text-sm text-neutral-500 mt-1">
                            Não achamos nenhum evento com esses filtros. Tente buscar de outra forma.
                        </p>
                        <button 
                            onClick={() => { setBusca(""); setFiltroFormato("todos"); setFiltroStatus("todos"); }}
                            className="mt-4 text-emerald-600 font-semibold text-sm hover:text-emerald-700 underline"
                        >
                            Limpar filtros
                        </button>
                    </div>
                ) : (
                    // Caso 3: Renderiza os eventos filtrados
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {eventosFiltrados.map((evento) => {
                            const encerrado = checkEncerrado(evento);
                            
                            return (
                                <Link 
                                    key={evento.id} 
                                    href={route("eventos.publico.show", evento.id)}
                                    className="group flex flex-col bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-neutral-300 transition-all duration-200 relative"
                                >
                                    {/* Imagem do Banner reduzida */}
                                    <div className="w-full aspect-[16/7] bg-neutral-100 relative overflow-hidden shrink-0 border-b border-neutral-100">
                                        {evento.banner_path ? (
                                            <img
                                                src={`/midia/${evento.banner_path}`}
                                                alt={evento.titulo}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-emerald-700 to-neutral-800 flex items-center justify-center text-white/10 font-bold text-2xl tracking-widest select-none">
                                                E-IFRO
                                            </div>
                                        )}

                                        {/* Status Flutuante de Encerrado */}
                                        {encerrado && (
                                            <div className="absolute inset-0 bg-neutral-900/40 backdrop-blur-[1px] flex items-center justify-center p-3">
                                                <span className="inline-flex items-center gap-1.5 rounded-xl bg-amber-50 border border-amber-300 px-3 py-1.5 text-xs font-bold text-amber-800 shadow-md">
                                                    <WarningIcon size={14} weight="fill" />
                                                    Inscrições Encerradas
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Corpo do Card */}
                                    <div className="p-5 flex-1 flex flex-col gap-3">
                                        {/* Categorias e Formato */}
                                        <div className="flex flex-wrap items-center gap-2">
                                            <FormatoBadge formato={evento.formato} />
                                            {evento.categorias?.[0] && (
                                                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-full px-2.5 py-0.5">
                                                    {evento.categorias[0]}
                                                </span>
                                            )}
                                        </div>

                                        {/* Título e Resumo */}
                                        <div className="flex flex-col gap-1">
                                            <h2 className="font-bold text-neutral-900 leading-tight group-hover:text-emerald-700 transition-colors line-clamp-2">
                                                {evento.titulo}
                                            </h2>
                                            {evento.descricao && (
                                                <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                                                    {evento.descricao}
                                                </p>
                                            )}
                                        </div>

                                        {/* Detalhes rápidos de rodapé */}
                                        <div className="mt-auto pt-4 border-t border-neutral-100 flex flex-col gap-2 text-xs text-neutral-500 font-medium">
                                            <div className="flex items-center gap-2">
                                                <CalendarBlankIcon size={14} className="text-neutral-400" />
                                                <span>{formatDate(evento.data_inicio)}</span>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <MapPinIcon size={14} className="text-neutral-400" />
                                                <span className="truncate">
                                                    {evento.local?.nome ?? "Local não definido"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Link invisível/Ação do card */}
                                    <div className="px-5 pb-4 pt-1 flex items-center justify-between text-xs font-semibold group-hover:text-emerald-600 text-neutral-400 transition-colors">
                                        <span>Ver detalhes do evento</span>
                                        <ArrowRightIcon size={14} weight="bold" className="transform group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </main>
        </div>
    );
}