export function CategoryOption({ value = "", selected = false, onSelect = () => {} }) {
    return (
        <button
            type="button"
            onClick={() => onSelect(value)}
            className={`
                px-6 py-2 rounded-full border text-sm font-medium transition-all duration-200
                ${
                    selected
                        ? "bg-emerald-50 ring-1 ring-emerald-200 border-emerald-500 text-emerald-800"
                        : "bg-white border-neutral-300 text-neutral-700 hover:border-emerald-400 hover:text-emerald-600"
                }
            `}
        >
            {value}
        </button>
    );
}
