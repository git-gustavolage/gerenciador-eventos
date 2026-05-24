import { useSidebarContext } from "@/Context/SidebarContext";
import ToggleSidebarOpen from "./Sidebar/ToggleSidebarOpen";

export default function Navbar({ toggleSidebar = () => { } }) {

    const { open } = useSidebarContext();
    return (
        <nav className="h-[56px] border-b border-gray-300 w-full bg-white sticky top-0 z-20">
            <div className="w-full h-full flex justify-between items-center flex-row">
                <div className="pl-4">
                    <ToggleSidebarOpen>
                        {open ? "fechar" : "abrir"}
                    </ToggleSidebarOpen>
                </div>

                <div>

                </div>
            </div>
        </nav>
    )
}
