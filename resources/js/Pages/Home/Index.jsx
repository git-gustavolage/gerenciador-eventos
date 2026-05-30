import { MagnifyingGlassIcon } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import EventsApi from "@/api/EventsApi";
import Footer from "@/Layouts/Common/Footer";
import GuestLayout from "@/Layouts/GuestLayout";
import Navbar from "@/Layouts/Common/Navbar";
import ActionsSection from "./Components/ActionsSection";
import SliderSection from "./Components/SliderSection";
import NewEventSection from "./Components/NewEventSection";
import JoinEventsSection from "./Components/JoinEventsSection";
import AcademicEventsSection from "./Components/AcademicEventsSection";
import CategoriesSection from "./Components/CategoriesSection";

export default function Index() {
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
        <GuestLayout title="Início">
            <Navbar />

            <div className="w-full p-16 py-32 bg-gradient-to-r from-emerald-600 to-emerald-800 text-white flex items-center justify-center flex-col gap-6">
                <div className="text-center">
                    <h2 className="text-6xl font-bold mb-4">E-IFRO</h2>
                    <p>Encontre eventos, inscreva-se e ajuda a comunidade a crescer</p>
                </div>

                <div className="relative max-w-2xl w-full mt-8 text-center">
                    <input
                        type="text"
                        className="rounded-sm py-4 pl-12 text-neutral-800 w-full shadow-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500"
                        placeholder="Buscar eventos, categorias..."
                    />

                    <MagnifyingGlassIcon
                        weight="bold"
                        className="absolute top-[19px] left-5 text-neutral-600"
                        size={20}
                    />

                    <div className="absolute right-2 top-[10px]">
                        <button className="bg-emerald-700 px-6 py-2 rounded-sm font-medium hover:bg-emerald-800 duration-200">
                            Buscar
                        </button>
                    </div>
                </div>
            </div>

            <ActionsSection />
            <SliderSection eventos={eventos} />
            <NewEventSection />
            <CategoriesSection />
            <JoinEventsSection />
            <AcademicEventsSection />
            <Footer />
        </GuestLayout>
    );
}
