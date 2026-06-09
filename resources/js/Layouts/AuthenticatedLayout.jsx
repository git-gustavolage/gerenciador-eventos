import { Head } from "@inertiajs/react";
import Navbar from "./Common/Navbar";

export default function AuthenticatedLayout({ titulo = "", children }) {
    return (
        <>
            <Head title={titulo} />
            <div className="min-h-screen bg-gray-50">
                <Navbar />

                <main>{children}</main>
            </div>
        </>
    );
}
