import { Input } from "./Input";

export default function InputWithLabel({ label = "", className = "", ...props }) {
    return (
        <div className="group inline-flex items-stretch w-full rounded-sm focus-within:ring-1 focus-within:ring-emerald-300">
            <Input
                {...props}
                className={`rounded-r-none focus:ring-0 focus:border-emerald-500 ${className}`}
            />

            <span className="flex items-center justify-center min-w-[100px] px-3 text-sm leading-5 bg-neutral-100 text-neutral-600 border border-l-0 border-neutral-300 rounded-r-sm select-none transition-colors group-focus-within:border-emerald-500">
                {label}
            </span>
        </div>
    );
}
