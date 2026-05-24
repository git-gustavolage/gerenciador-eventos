import { Head } from "@inertiajs/react";
import Navbar from "./Common/Navbar";

export default function DefaultLayout({ title = "", children }) {
    return (
        <>
            <Head title={title} />

            <div className="h-dvh flex flex-col bg-white font-figtree overflow-hidden">
                <Navbar />

                <div className="flex flex-1 overflow-hidden relative">
                    <main className="flex-1 block overflow-auto p-4 max-md:p-2">{children}</main>
                </div>
            </div>
        </>
    );
}
