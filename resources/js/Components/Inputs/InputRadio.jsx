export function InputRadio({ selected = false, label = "", ...props}) {

  const selectedStyle = selected ? "border-emerald-500 ring-1 ring-emerald-200 text-emerald-800 bg-emerald-50 font-bold " : "  hover:ring-1 hover:ring-emerald-500 text-neutral-500";

  return (
    <div className="w-full">
      <label
        className={"w-full px-6 py-3 bg-white border border-neutral-300 rounded-sm select-none block cursor-pointer " + selectedStyle}
        htmlFor={props.id}
      >
        <p className="whitespace-nowrap">{label}</p>
      </label>
      <input
        {...props}
        className="hidden"
        type="radio"
      />
    </div>
  )
}
