import { createContext, useContext, useState } from "react";

export const SidebarContext = createContext({ open: false, setOpen: () => { } });

export const useSidebarContext = () => {
    const { open, setOpen } = useContext(SidebarContext);

    return { open, setOpen };
}

export default function SidebarContextProvider({ open = false, children }) {

    const [_open, setOpen] = useState < boolean > (open);

    return (
        <SidebarContext.Provider value={{ open: _open, setOpen }}>
            {children}
        </SidebarContext.Provider>
    )
}
