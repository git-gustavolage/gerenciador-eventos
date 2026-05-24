export function Input({ ...props }) {
    return (
        <input
            {...props}
            id={props.id}
            className={
                "w-full text-sm rounded-sm border border-neutral-300 px-3 py-3 outline-none focus:ring-emerald-300 focus:border-emerald-500 text-medium leading-5 placeholder:text-neutral-500 disabled:bg-neutral-100 disabled:text-neutral-300 " +
                props.className
            }
        />
    );
}
