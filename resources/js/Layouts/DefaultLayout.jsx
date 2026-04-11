import { Head } from "@inertiajs/react";
import Navbar from "./Common/Navbar";

export default function DefaultLayout({ title = '', children }) {

    return (
        <div className="w-full min-h-screen bg-gray-50 flex flex-col">
            <Head title={title} />

            <Navbar />

            <main className="flex flex-row w-full min-h-[calc(100%-70px)]">
                {children}
            </main>
        </div>
    );
}
