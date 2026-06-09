export function Input({ invalid = false, className = "", ...props }) {
    return (
        <input
            {...props}
            aria-invalid={invalid}
            className={[
                "w-full rounded-sm border px-3 py-3 outline-none focus:ring-1",
                "text-sm leading-5",
                "transition-colors placeholder:text-neutral-500",
                "disabled:bg-neutral-50 disabled:text-neutral-400",

                invalid
                    ? "border-red-500 focus:border-red-500 focus:ring-red-200 bg-red-50/10"
                    : "border-neutral-300 focus:border-emerald-500 focus:ring-emerald-300",

                className,
            ].join(" ")}
        />
    );
}
