import ManagerLayout from "@/Layouts/ManagerLayout";
import { EventGeneralForm } from "./Components/EventGeneralForm";
import { EventDivulgationForm } from "./Components/EventDivulgationForm";
import { EventLocationForm } from "./Components/EventLocationForm";
import { EventDateForm } from "./Components/EventDateForm";

export default function Index({ evento }) {
    return (
        <ManagerLayout title="Geral">
            <section className="w-full h-full flex items-center justify-center py-6 px-4 pb-64 flex-col gap-16 max-w-3xl mx-auto">
                <EventGeneralForm evento={evento} />

                <EventDivulgationForm evento={evento} />

                <EventLocationForm evento={evento} />

                <EventDateForm evento={evento} />
            </section>
        </ManagerLayout>
    );
}
