export default function PrimaryButton({ className = "", disabled, children, ...props }) {
    return (
        <button
            type="submit"
            {...props}
            className={
                `w-fit max-sm:w-full max-sm:text-center inline-flex items-center justify-center rounded-sm  bg-emerald-500 px-8 py-2 text-sm font-medium tracking-wide text-white transition duration-150 ease-in-out hover:bg-emerald-700 focus:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2 active:bg-emerald-900 disabled:bg-emerald-200 ${
                    disabled && "opacity-90"
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
