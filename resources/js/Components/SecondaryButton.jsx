export default function PrimaryButton({ className = "", disabled, children, ...props }) {
    return (
        <button
            type="submit"
            {...props}
            className={
                `w-fit max-sm:w-full max-sm:text-center inline-flex items-center justify-center rounded-sm  bg-white px-8 py-2 text-sm font-medium tracking-wide text-neutral-600 transition duration-150 ease-in-out hover:bg-neutral-50 hover:text-neutral-800 focus:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-neutral-500 ring-1 ring-neutral-300 hover:ring-neutral-400 focus:ring-offset-2 disabled:bg-neutral-200 ${
                    disabled && "opacity-90"
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
