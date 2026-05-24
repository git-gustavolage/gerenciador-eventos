import { Head } from "@inertiajs/react";
import SidebarContextProvider from "@/Context/SidebarContext";
import { useState } from "react";
import Navbar from "./Common/Navbar";
import ManagerSidebar from "@/Pages/Manager/Organization/Components/ManagerSidebar";

export default function DefaultLayout({ title = '', children }) {

    const [open, setOpen] = useState(true);

    return (
        <SidebarContextProvider open={open} setOpen={setOpen}>
            <Head title={title} />

            <div className="h-dvh flex flex-col bg-white font-figtree overflow-hidden">
                <Navbar />

                <div className="flex flex-1 overflow-hidden relative">
                    <ManagerSidebar />

                    <main className="flex-1 block overflow-auto p-4 max-md:p-2">
                        {children}
                    </main>
                </div>
            </div>
        </SidebarContextProvider>
    );
}
