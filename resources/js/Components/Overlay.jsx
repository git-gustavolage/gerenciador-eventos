export default function Overlay({ value, setValue }) {

    return (
        <div
            className={`${value ? "visible" : "invisible"} fixed inset-0 z-10 scrollbar-hide`}
            tabIndex={-1}
            onClick={() => setValue(false)}
            onWheel={() => setValue(false)}
        ></div>
    )
}
