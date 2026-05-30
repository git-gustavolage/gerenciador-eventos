import React from "react";
import Overlay from "@/Components/Overlay";

export default function ResponsiveSidebar({ open, setOpen, children }) {
    return (
        <>
            <aside
                className={`min-h-[calc(100dvh-56px)] h-full bg-white border-r border-neutral-300 transition-all duration-300 overflow-hidden z-10 md:relative md:h-full fixed left-0 ${open ? "w-[290px] min-w-[290px]" : "w-0"}`}
            >
                <div className="w-[290px] min-w-[310px] h-full p-4">{children}</div>
            </aside>

            <Overlay value={open} setValue={setOpen} />
        </>
    );
}
