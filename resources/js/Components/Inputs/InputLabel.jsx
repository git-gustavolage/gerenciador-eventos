export default function InputLabel({ value, ...props }) {
  return (
    <label {...props} className={"text-neutral-800 text-sm font-normal select-none " + props.className}>{props.children ?? value}</label>
  )
}
