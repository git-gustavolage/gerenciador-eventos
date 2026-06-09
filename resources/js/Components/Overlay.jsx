export default function Overlay({ value, setValue }) {

    return (
        <div
            className={`${value ? "visible" : "invisible"} fixed inset-0 scrollbar-hide md:hidden z-30 bg-black/30`}
            tabIndex={-1}
            onClick={() => setValue(false)}
            onWheel={() => setValue(false)}
        ></div>
    )
}
