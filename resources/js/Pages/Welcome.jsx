import { MagnifyingGlassIcon } from "@phosphor-icons/react";
import { Head } from "@inertiajs/react";
import { useEffect, useState } from "react";
import EventsApi from "@/api/EventsApi";
import CategoriesSection from "@/Layouts/Common/CategoriesSection";
import Footer from "@/Layouts/Common/Footer";
import AcademicEventsSection from "@/Layouts/Common/AcademicEventsSection";
import ActionsSection from "@/Layouts/Common/ActionsSection";
import SliderSection from "@/Layouts/Common/SliderSection";
import JoinEventsSection from "@/Layouts/Common/JoinEventsSection";

export default function Welcome() {

    const { getEvents } = EventsApi();

    const [eventos, setEventos] = useState([]);

    useEffect(() => {
        const get = async () => {
            const res = await getEvents();
            setEventos(res);
        };

        get();
    }, []);

    return (
        <div>
            <Head title="Início" />

            <div className="w-full p-16 bg-gradient-to-r from-emerald-600 to-emerald-800 text-white flex items-center justify-center flex-col gap-6">
                <div className="text-center">
                    <h2 className="text-6xl font-bold mb-4">Eventos lalala</h2>
                    <p>Encontre eventos, inscreva-se e ajuda a comunidade a crescer</p>
                </div>

                <div className="relative max-w-2xl w-full mt-8 text-center">
                    <input
                        type="text"
                        className="rounded-2xl py-4 pl-12 text-neutral-800 w-full shadow-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500"
                        placeholder="Buscar eventos, categorias..."
                    />

                    <MagnifyingGlassIcon weight="bold" className="absolute top-[19px] left-5 text-neutral-600" size={20} />

                    <div className="absolute right-2 top-[10px]">
                        <button className="bg-emerald-700 px-6 py-2 rounded-xl font-medium hover:bg-emerald-800 duration-200">Buscar</button>
                    </div>
                </div>
            </div>

            <ActionsSection />
            <SliderSection eventos={eventos} />
            <CategoriesSection />
            <JoinEventsSection />
            <AcademicEventsSection />
            <Footer />

        </div>
    );
}
