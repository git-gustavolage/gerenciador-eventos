import { Link } from "@inertiajs/react";

export default function SideBarLink({ href = "/", active = false, className = "", target = "_self", prefetch = false, children }) {

    const activeStyle = active ? "text-neutral-900 font-semibold font-medium" : "text-neutral-500 hover:text-neutral-900";

    return (
        <Link
            target={target}
            className={`inline-flex gap-3 p-1 items-center focus:text-neutral-900 focus:font-medium focus:outline-none ${activeStyle} ${className}`}
            href={href}
            prefetch={prefetch}
        >
            {children}
        </Link>
    )
}
