export function Select({ children, ...props }) {
    return (
        <select
            {...props}
            className={
                props?.className +
                " w-full rounded-sm border border-neutral-300 px-3 pr-6 py-3 outline-none focus:ring-emerald-300 focus:border-emerald-500 text-sm *:text-medium leading-5"
            }
        >
            {children}
        </select>
    );
}
