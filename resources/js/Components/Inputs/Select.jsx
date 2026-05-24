import {InputLabel} from "./InputLabel";

export function Select({ label = "", children, ...props }) {

    return (
        <div className="w-full flex flex-col items-start gap-1">
            <InputLabel htmlFor={props.id}>{label}</InputLabel>

            <select
                {...props}
                className={props?.className + " w-full rounded-sm border border-neutral-300 px-3 pr-6 py-3 outline-none focus:ring-emerald-300 focus:border-emerald-500 text-sm *:text-medium leading-5"}
            >
                {children}
            </select>
        </div>
    )
}
