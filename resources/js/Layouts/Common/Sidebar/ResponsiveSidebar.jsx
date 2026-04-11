import React from "react"
import { useSidebarContext } from "@/Context/SidebarContext";
import ToggleSidebarOpen from "./ToggleSidebarOpen";
import { ListIcon, XIcon } from "@phosphor-icons/react";
import Overlay from "@/Components/Overlay";
import LayoutLeft from "@/Components/Icons/LayoutLeft";

export default function ResponsiveSidebar({ children }) {

    const { open, setOpen } = useSidebarContext();

    return (
        <div className="flex flex-col max-md:w-full w-[260px]">

            <div className='min-w-[260px] inset-0 h-full py-6 max-sm:p-2 pl-6 pr-3 border-r border-gray-300 flex flex-col max-md:hidden'>
                {children}
            </div>

            <div className="hidden max-md:flex w-full">

                <div className="flex w-full h-[56px] border-b border-gray-300 items-center px-4">
                    <ToggleSidebarOpen>
                        <ListIcon weight="bold" className={open ? "hidden" : "block"} />
                        <XIcon weight="bold" className={open ? "block" : "hidden"} />
                    </ToggleSidebarOpen>

                    {open ? (
                        <div className="fixed inset-y-0 w-full left-0 top-[calc(56px)] z-40 flex flex-row backdrop-brightness-80">

                            <div className="max-sm:w-full w-[300px] border-r border-gray-300 h-full z-30 px-4 py-6 relative ">
                                <div className="relative">
                                    <div className="absolute top-0 right-0 p-1 hover:bg-secondary rounded-md">
                                        <LayoutLeft onClick={() => setOpen(false)} />
                                    </div>
                                    {children}
                                </div>
                            </div>
                            <Overlay value={open} setValue={setOpen} />
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    )
}
