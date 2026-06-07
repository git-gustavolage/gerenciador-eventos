import Slide from "@/Components/Slider/Slide";
import Slider from "@/Components/Slider/Slider";
import { formatDate } from "@/util/formatDate";
import { CalendarIcon } from "@phosphor-icons/react";

export default function SliderSection({ eventos = [] }) {
    if (!eventos.length) return;

    return (
        <div className="w-full py-16 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-6xl m-auto">
                <h2 className="text-4xl font-bold text-neutral-800 mb-4">Eventos em Destaque:</h2>
                <Slider
                    slides={eventos.map((evento) => (
                        <EventSlide key={evento.id} evento={evento} />
                    ))}
                />
            </div>
        </div>
    );
}

function EventSlide({ evento = {} }) {
    return (
        <Slide href={route("eventos.publico.show", { id: evento.id })}>
            <div className="w-full flex flex-col items-center justify-center gap-3">
                <div className="w-full relative overflow-hidden rounded-sm">
                    {evento.banner_path ? (
                        <img
                            src={`/midia/${evento.banner_path}`}
                            draggable={false}
                            alt={evento.titulo}
                            className="w-full h-auto max-h-[384px] max-md:max-h-[220px] object-cover"
                        />
                    ) : (
                        <div className="w-full h-[384px] max-md:h-[220px] bg-gradient-to-br from-emerald-700 to-neutral-800 flex items-center justify-center text-white/10 font-bold text-2xl tracking-widest select-none">
                            E-IFRO
                        </div>
                    )}
                </div>

                <div className="w-full space-y-2 px-1">
                    <h2 className="text-xl max-md:text-lg font-semibold text-neutral-800">{evento.titulo}</h2>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                        <div className="inline-flex items-center gap-2 text-neutral-500">
                            <CalendarIcon />

                            <p className="text-sm">{formatDate(evento.data_inicio, "YYYY-MM-DD HH:ii:ss", "DD/MM/YYYY")}</p>
                        </div>

                        <div className="inline-flex items-center gap-2 text-neutral-500">
                            <span className="w-[9px] h-[9px] rounded-full bg-emerald-400" />

                            <p className="text-sm">{evento.formato}</p>
                        </div>
                    </div>
                </div>
            </div>
        </Slide>
    );
}
