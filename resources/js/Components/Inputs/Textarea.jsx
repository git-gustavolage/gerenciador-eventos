export default function Textarea({ invalid = false, className = "", ...props }) {
    const counter =
        props.maxLength && typeof props.value === "string" ? `${props.value.length}/${props.maxLength} caracteres` : "";

    return (
        <div
            data-counter={counter}
            className={[
                "flex flex-col gap-1 w-full",
                props.maxLength
                    ? "after:text-xs after:text-neutral-500 after:self-end after:content-[attr(data-counter)]"
                    : "",
            ].join(" ")}
        >
            <textarea
                {...props}
                aria-invalid={invalid}
                className={[
                    "resize-none w-full border rounded-sm text-sm px-3 py-2 outline-none focus:ring-1",
                    "text-medium leading-5",
                    "transition-colors placeholder:text-neutral-500",
                    "disabled:bg-neutral-100 disabled:text-neutral-400",

                    invalid
                        ? "border-red-500 focus:border-red-500 focus:ring-red-200 bg-red-50/10"
                        : "border-neutral-300 focus:ring-emerald-300 focus:border-emerald-500 focus:text-neutral-800",

                    className,
                ].join(" ")}
            />
        </div>
    );
}
