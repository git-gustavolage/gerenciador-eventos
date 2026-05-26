export default function Textarea({ label = "", ...props }) {
    return (
        <textarea
            {...props}
            className="resize-none w-full border border-neutral-300 rounded-sm text-sm px-3 py-2 outline-none focus:ring-1 focus:ring-emerald-300 focus:border-emerald-500 focus:text-neutral-800 text-medium leading-5 placeholder:text-neutral-500"
        ></textarea>
    );
}
