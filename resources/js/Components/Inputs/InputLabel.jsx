export function InputLabel({ ...props }) {
  return (
    <label {...props} className={"text-neutral-800 text-sm font-normal select-none " + props.className}>{props.children}</label>
  )
}
