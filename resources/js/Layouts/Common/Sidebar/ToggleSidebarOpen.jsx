import { useSidebarContext } from "@/Context/SidebarContext";

export default function ToggleSidebarOpen({ children, ...props }) {

    const { open, setOpen } = useSidebarContext();
    console.log(open);


    return (
        <button
            {...props}
            className={"bg-transparent flex items-center p-1 justify-center text-dark rounded-md focus:outline-none hover:bg-secondary " + props.className}
            onClick={() => setOpen(prev => !prev)}
        >
            {children}
        </button>
    )
}
