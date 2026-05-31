import {
    CalendarBlankIcon,
    MapPinIcon,
    UsersIcon,
    ChalkboardTeacherIcon,
    PencilSimpleIcon,
    TrashIcon,
    ClockIcon,
} from "@phosphor-icons/react";

export default function AtividadeCard({ atividade, onEdit, onDestroy }) {
    const fmt = (date) =>
        date
            ? new Date(date).toLocaleString("pt-BR", {
                  day: "2-digit", month: "2-digit", year: "numeric",
                  hour: "2-digit", minute: "2-digit",
              })
            : "—";

    return (
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex min-w-0 flex-col gap-3">
                    <div>
                        <h3 className="text-base font-semibold text-neutral-900">{atividade.titulo}</h3>
                        {atividade.descricao && (
                            <p className="mt-1 text-sm leading-relaxed text-neutral-500">{atividade.descricao}</p>
                        )}
                    </div>
                    <div className="flex flex-wrap gap-3 text-sm text-neutral-500">
                        <span className="inline-flex items-center gap-1.5">
                            <CalendarBlankIcon size={14} className="shrink-0" />
                            {fmt(atividade.data_inicio)}
                        </span>
                        <span className="text-neutral-300">→</span>
                        <span className="inline-flex items-center gap-1.5">
                            <ClockIcon size={14} className="shrink-0" />
                            {fmt(atividade.data_fim)}
                        </span>
                        {atividade.ambiente && (
                            <span className="inline-flex items-center gap-1.5">
                                <MapPinIcon size={14} className="shrink-0" />
                                {atividade.ambiente.nome}
                            </span>
                        )}
                        {atividade.limite_participantes && (
                            <span className="inline-flex items-center gap-1.5">
                                <UsersIcon size={14} className="shrink-0" />
                                {atividade.limite_participantes} vagas
                            </span>
                        )}
                    </div>
                    {atividade.ministrantes?.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {atividade.ministrantes.map((m) => (
                                <span key={m.id} className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                                    <ChalkboardTeacherIcon size={11} />
                                    {m.nome}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
                <div className="flex shrink-0 items-center gap-2">
                    <button onClick={onEdit} className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100">
                        <PencilSimpleIcon size={15} />
                        Editar
                    </button>
                    <button onClick={onDestroy} className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50">
                        <TrashIcon size={15} />
                        Excluir
                    </button>
                </div>
            </div>
        </div>
    );
}