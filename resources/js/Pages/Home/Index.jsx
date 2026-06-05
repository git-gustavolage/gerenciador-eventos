import { useEffect, useState } from "react";
import Footer from "@/Layouts/Common/Footer";
import GuestLayout from "@/Layouts/GuestLayout";
import Navbar from "@/Layouts/Common/Navbar";
import ActionsSection from "./Components/ActionsSection";
import SliderSection from "./Components/SliderSection";
import NewEventSection from "./Components/NewEventSection";
import JoinEventsSection from "./Components/JoinEventsSection";
import AcademicEventsSection from "./Components/AcademicEventsSection";
import CategoriesSection from "./Components/CategoriesSection";
import EventSearch from "@/Components/EventSearch";

export default function Index() {
    const [eventos, setEventos] = useState([]);

    useEffect(() => {
        fetch(route("api.eventos.publicos"))
            .then((r) => r.json())
            .then(setEventos);
    }, []);

    return (
        <GuestLayout title="Início">
            <Navbar />

            <div className="w-full p-16 py-32 bg-gradient-to-r from-emerald-600 to-emerald-800 text-white flex items-center justify-center flex-col gap-6">
                <div className="text-center">
                    <h2 className="text-6xl font-bold mb-4">E-IFRO</h2>
                    <p>Encontre eventos, inscreva-se e ajuda a comunidade a crescer</p>
                </div>

                <EventSearch eventos={eventos} />
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