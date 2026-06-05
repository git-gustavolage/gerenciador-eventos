import { MagnifyingGlassIcon, CalendarBlankIcon, MapPinIcon, ArrowRightIcon, XIcon } from "@phosphor-icons/react";
import { useEffect, useRef, useState, useCallback } from "react";
import { router } from "@inertiajs/react";

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
    if (evento.data_fim_inscricoes && new Date(evento.data_fim_inscricoes) < new Date()) return true;
    if (evento.data_fim && new Date(evento.data_fim) < new Date()) return true;
    return false;
}

export default function EventSearch({ eventos = [] }) {
    const [query, setQuery] = useState("");
    const [aberto, setAberto] = useState(false);
    const [indiceAtivo, setIndiceAtivo] = useState(-1);
    const inputRef = useRef(null);
    const containerRef = useRef(null);

    const sugestoes = query.trim().length >= 2
        ? eventos
            .filter((e) => {
                const q = query.toLowerCase();
                return (
                    e.titulo?.toLowerCase().includes(q) ||
                    e.descricao?.toLowerCase().includes(q) ||
                    e.categorias?.some((c) => c.toLowerCase().includes(q))
                );
            })
            .slice(0, 6)
        : [];

    const irParaEvento = useCallback((id) => {
        router.visit(route("eventos.publico.show", id));
    }, []);

    const irParaBusca = useCallback(() => {
        if (!query.trim()) return;
        router.visit(route("eventos.publico.index"), {
            data: { q: query.trim() },
        });
    }, [query]);

    // Fecha ao clicar fora
    useEffect(() => {
        function handleClickOutside(e) {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setAberto(false);
                setIndiceAtivo(-1);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    function handleKeyDown(e) {
        if (!aberto || sugestoes.length === 0) {
            if (e.key === "Enter") irParaBusca();
            return;
        }

        if (e.key === "ArrowDown") {
            e.preventDefault();
            setIndiceAtivo((prev) => Math.min(prev + 1, sugestoes.length - 1));
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setIndiceAtivo((prev) => Math.max(prev - 1, -1));
        } else if (e.key === "Enter") {
            e.preventDefault();
            if (indiceAtivo >= 0 && sugestoes[indiceAtivo]) {
                irParaEvento(sugestoes[indiceAtivo].id);
            } else {
                irParaBusca();
            }
        } else if (e.key === "Escape") {
            setAberto(false);
            setIndiceAtivo(-1);
            inputRef.current?.blur();
        }
    }

    function handleChange(e) {
        setQuery(e.target.value);
        setIndiceAtivo(-1);
        setAberto(true);
    }

    const mostrarDropdown = aberto && query.trim().length >= 2;

    return (
        <div ref={containerRef} className="relative max-w-2xl w-full mt-8 text-center">
            {/* Input */}
            <div className="relative">
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setAberto(true)}
                    className={`rounded-sm py-4 pl-12 pr-28 text-neutral-800 w-full shadow-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500 outline-none transition-all ${
                        mostrarDropdown ? "rounded-b-none" : ""
                    }`}
                    placeholder="Buscar eventos..."
                    autoComplete="off"
                />

                <MagnifyingGlassIcon
                    weight="bold"
                    className="absolute top-[19px] left-5 text-neutral-600 pointer-events-none"
                    size={20}
                />

                {/* Botão limpar */}
                {query && (
                    <button
                        onClick={() => {
                            setQuery("");
                            setAberto(false);
                            inputRef.current?.focus();
                        }}
                        className="absolute right-[100px] top-[14px] text-neutral-400 hover:text-neutral-600 transition-colors p-1"
                        tabIndex={-1}
                    >
                        <XIcon size={16} weight="bold" />
                    </button>
                )}

                <div className="absolute right-2 top-[10px]">
                    <button
                        onClick={irParaBusca}
                        className="bg-emerald-700 px-6 py-2 rounded-sm font-medium hover:bg-emerald-800 duration-200 text-white"
                    >
                        Buscar
                    </button>
                </div>
            </div>

            {/* Dropdown de sugestões */}
            {mostrarDropdown && (
                <div className="absolute left-0 right-0 bg-white border border-t-0 border-neutral-200 rounded-b-sm shadow-xl z-50 overflow-hidden text-left">
                    {sugestoes.length > 0 ? (
                        <>
                            <div className="px-4 pt-2.5 pb-1">
                                <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                                    Sugestões
                                </span>
                            </div>

                            {sugestoes.map((evento, i) => {
                                const encerrado = checkEncerrado(evento);
                                const ativo = i === indiceAtivo;

                                return (
                                    <button
                                        key={evento.id}
                                        onMouseDown={(e) => {
                                            e.preventDefault(); // evita blur no input antes do click
                                            irParaEvento(evento.id);
                                        }}
                                        onMouseEnter={() => setIndiceAtivo(i)}
                                        className={`w-full flex items-center gap-3 px-4 py-3 transition-colors text-left ${
                                            ativo ? "bg-emerald-50" : "hover:bg-neutral-50"
                                        }`}
                                    >
                                        {/* Mini banner */}
                                        <div className="w-12 h-12 rounded-md overflow-hidden shrink-0 bg-gradient-to-br from-emerald-700 to-neutral-800">
                                            {evento.banner_path ? (
                                                <img
                                                    src={`/midia/${evento.banner_path}`}
                                                    alt={evento.titulo}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-white/20 text-[9px] font-bold">
                                                    E-IFRO
                                                </div>
                                            )}
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <p className={`font-semibold text-sm truncate ${ativo ? "text-emerald-700" : "text-neutral-800"}`}>
                                                {realcarTexto(evento.titulo, query)}
                                            </p>
                                            <div className="flex items-center gap-3 mt-0.5">
                                                {evento.data_inicio && (
                                                    <span className="flex items-center gap-1 text-xs text-neutral-400">
                                                        <CalendarBlankIcon size={11} />
                                                        {formatDate(evento.data_inicio)}
                                                    </span>
                                                )}
                                                {evento.local?.nome && (
                                                    <span className="flex items-center gap-1 text-xs text-neutral-400 truncate">
                                                        <MapPinIcon size={11} />
                                                        {evento.local.nome}
                                                    </span>
                                                )}
                                                {encerrado && (
                                                    <span className="text-[10px] font-semibold text-amber-600 bg-amber-50 border border-amber-200 rounded-full px-1.5 py-0.5">
                                                        Encerrado
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <ArrowRightIcon
                                            size={14}
                                            weight="bold"
                                            className={`shrink-0 transition-colors ${ativo ? "text-emerald-600" : "text-neutral-300"}`}
                                        />
                                    </button>
                                );
                            })}

                            {/* Ver todos os resultados */}
                            <button
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    irParaBusca();
                                }}
                                className="w-full flex items-center justify-center gap-2 px-4 py-3 border-t border-neutral-100 text-sm font-semibold text-emerald-700 hover:bg-emerald-50 transition-colors"
                            >
                                <MagnifyingGlassIcon size={14} weight="bold" />
                                Ver todos os resultados para "{query}"
                            </button>
                        </>
                    ) : (
                        /* Nenhum resultado */
                        <div className="px-4 py-5 text-center">
                            <p className="text-sm text-neutral-500">
                                Nenhum evento encontrado para{" "}
                                <span className="font-semibold text-neutral-700">"{query}"</span>
                            </p>
                            <p className="text-xs text-neutral-400 mt-0.5">
                                Tente outra palavra-chave ou navegue por categorias
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

// Realça o texto que bate com a busca
function realcarTexto(texto, query) {
    if (!query.trim() || !texto) return texto;
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
    const partes = texto.split(regex);

    return (
        <>
            {partes.map((parte, i) =>
                regex.test(parte) ? (
                    <mark key={i} className="bg-emerald-100 text-emerald-800 rounded-sm not-italic font-bold">
                        {parte}
                    </mark>
                ) : (
                    parte
                )
            )}
        </>
    );
}