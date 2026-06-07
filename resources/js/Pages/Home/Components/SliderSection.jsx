import Slide from "@/Components/Slider/Slide";
import Slider from "@/Components/Slider/Slider";
import { CalendarIcon } from "@phosphor-icons/react";

const EVENTOS_PLACEHOLDER = [
    {
        uuid: "placeholder-1",
        image_url: "/images/placeholder/eventos/banner.png",
        title: "IX Congresso Brasileiro de Fisioterapia e Oncologia",
        date: "06/05/2025",
        format: "Híbrido",
    },
    {
        uuid: "placeholder-2",
        image_url: "/images/placeholder/eventos/banner3.png",
        title: "I Semana Nacional de Ciência e Tecnologia",
        date: "13/13/1313",
        format: "Online",
    },
];

export default function SliderSection({ eventos = [] }) {
    const slides =
        eventos.length === 0 ? EVENTOS_PLACEHOLDER : eventos.length === 1 ? [...eventos, EVENTOS_PLACEHOLDER[0]] : eventos;

    return (
        <div className="w-full py-16 flex flex-col items-center justify-center p-4 max-md:hidden">
            <div className="max-w-6xl m-auto">
                <h2 className="text-4xl font-bold text-neutral-800 mb-4">Eventos em Destaque:</h2>
                <Slider
                    slides={slides.map((event) => (
                        <EventSlide key={event.uuid ?? event.id} event={event} />
                    ))}
                />
            </div>
        </div>
    );
}

function EventSlide({ event }) {
    const isPlaceholder = !!event.uuid?.startsWith("placeholder");

    return (
        <Slide>
            <div className="flex flex-col items-center justify-center gap-2">
                <div className="min-w-full h-96 relative">
                    {isPlaceholder ? (
                        <img src={event.image_url} draggable={false} alt={event.title} className="w-full h-full object-cover" />
                    ) : event.banner_path ? (
                        <img
                            src={`/midia/${event.banner_path}`}
                            draggable={false}
                            alt={event.titulo}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-emerald-700 to-neutral-800 flex items-center justify-center text-white/10 font-bold text-2xl tracking-widest select-none">
                            E-IFRO
                        </div>
                    )}
                </div>

                <div className="w-full space-y-2">
                    <h2 className="text-xl font-semibold text-neutral-800">{isPlaceholder ? event.title : event.titulo}</h2>

                    <div className="space-x-4 inline-flex">
                        <div className="inline-flex items-center gap-2 text-neutral-500">
                            <CalendarIcon />
                            <p>
                                {isPlaceholder
                                    ? event.date
                                    : event.data_inicio
                                      ? new Date(event.data_inicio).toLocaleDateString("pt-BR")
                                      : "—"}
                            </p>
                        </div>
                        <div className="inline-flex items-center gap-2 text-neutral-500">
                            <span className="bg-emerald-400 w-[9px] h-[9px] rounded-full" />
                            <p>{isPlaceholder ? event.format : (event.formato?.value ?? event.formato)}</p>
                        </div>
                    </div>
                </div>
            </div>
        </Slide>
    );
}
