import { createContext, useContext, useState } from "react";

export const SidebarContext = createContext({ open: false, setOpen: () => { } });

export const useSidebarContext = () => {
    const { open, setOpen } = useContext(SidebarContext);

    return { open, setOpen };
}

export default function SidebarContextProvider({ open = false, setOpen = () => { }, children }) {

    return (
        <SidebarContext.Provider value={{ open, setOpen }}>
            {children}
        </SidebarContext.Provider>
    )
}
