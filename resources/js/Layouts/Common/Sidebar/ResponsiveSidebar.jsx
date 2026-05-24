import React from "react"
import { useSidebarContext } from "@/Context/SidebarContext";
import ToggleSidebarOpen from "./ToggleSidebarOpen";
import { ListIcon, XIcon } from "@phosphor-icons/react";
import Overlay from "@/Components/Overlay";
import LayoutLeft from "@/Components/Icons/LayoutLeft";

export default function ResponsiveSidebar({ children }) {

    const { open, setOpen } = useSidebarContext();

    return (
        <>
            <aside className={`bg-white border-r border-zinc-300 transition-all duration-300 overflow-hidden z-50 lg:relative lg:h-full fixed left-0 h-[calc(100dvh-56px)] ${open ? "w-[260px]" : "w-0"}`}>
                <div className="w-[260px] h-full p-2">
                    {children}
                </div>
            </aside>

            <Overlay value={open} setValue={setOpen}  />
        </>
    )
}
