export default function DangerButton({ className = "", disabled, children, ...props }) {
    return (
        <button
            type="submit"
            {...props}
            className={
                `w-fit max-sm:w-full max-sm:text-center inline-flex items-center justify-center gap-2 rounded-sm  bg-red-600 px-8 py-2 text-sm font-medium tracking-wide text-white transition duration-150 ease-in-out hover:bg-red-700 focus:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 active:bg-red-900 disabled:bg-red-200 ${
                    disabled && "opacity-90"
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
