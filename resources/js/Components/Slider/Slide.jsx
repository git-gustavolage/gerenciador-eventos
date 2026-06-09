import { router } from "@inertiajs/react";

export default function Slide({ children, href = "" }) {
    const handleClick = () => {
        router.visit(href);
    };

    return (
        <div onClick={handleClick} className="min-w-full animate-fade-in-500 p-1 hover:scale-100 scale-[0.99] transition-all duration-200 ease-in-out cursor-pointer">
            {children}
        </div>
    );
}
