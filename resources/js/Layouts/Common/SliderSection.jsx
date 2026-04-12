import Slide from "@/Components/Slider/Slide";
import Slider from "@/Components/Slider/Slider";
import { CalendarIcon } from "@phosphor-icons/react";

export default function SliderSection({ eventos = [] }) {

    const slides = [];

    eventos.forEach(event => {
        slides.push(<EventSlide key={event.uuid} event={event} />)
    })

    return (
        <div className="w-full py-16 flex flex-col items-start justify-center p-4">
            <div className="max-w-6xl m-auto">
                <h2 className="text-4xl font-bold text-neutral-800 mb-4">Eventos em Destaque:</h2>
                <Slider slides={slides} />
            </div>
        </div>
    );
}

function EventSlide({ event }) {

    return (
        <Slide>
            <div className="flex flex-col items-center justify-center gap-2">
                <div className="min-w-full">
                    <img src={event.image_url} draggable={false} alt="imagem do event" className="bg-white min-w-full" />
                </div>

                <div className="w-full space-y-2">
                    <h2 className="text-xl font-semibold text-neutral-800">{event.title}</h2>

                    <div className="space-x-4 inline-flex">
                        <div className="inline-flex items-center gap-2 text-neutral-500">
                            <CalendarIcon />
                            <p>{event.date}</p>
                        </div>
                        <div className="inline-flex items-center gap-2 text-neutral-500">
                            <span className="bg-emerald-400 w-[9px] h-[9px] rounded-full" />
                            <p>{event.format}</p>
                        </div>
                    </div>
                </div>
            </div>
        </Slide>
    )
}
