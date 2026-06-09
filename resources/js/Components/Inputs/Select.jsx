export function Select({ invalid = false, className = "", children, ...props }) {
    return (
        <select
            {...props}
            aria-invalid={invalid}
            className={[
                "w-full rounded-sm border px-3 py-3 pr-6 outline-none focus:ring-1",
                "text-sm leading-5",
                "transition-colors",
                "disabled:bg-neutral-100 disabled:text-neutral-400",
                "*:text-medium",

                invalid
                    ? "border-red-500 focus:border-red-500 focus:ring-red-200 bg-red-50/10"
                    : "border-neutral-300 focus:border-emerald-500 focus:ring-emerald-300",

                className,
            ].join(" ")}
        >
            {children}
        </select>
    );
}
