import { CalendarBlankIcon, ClockIcon } from "@phosphor-icons/react";
import InputLabel from "@/Components/InputLabel";

export default function DateTimeInput({
    id = "datetime",
    label = "Data e horário",
    dateValue = "",
    timeValue = "",
    onDateChange,
    onTimeChange,
    disabled = false,
}) {
    return (
        <div className="w-full space-y-2">
            <InputLabel htmlFor={`${id}_date`} value={label} />

            <div
                className={`group flex items-center  overflow-hidden rounded-sm border border-neutral-300 bg-white transition-all focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-300 ${disabled ? "bg-neutral-100 opacity-70" : ""}`}
            >
                <div className="flex flex-1 items-center px-3">
                    <CalendarBlankIcon size={18} className="text-neutral-400" />

                    <input
                        id={`${id}_date`}
                        type="date"
                        value={dateValue}
                        onChange={onDateChange}
                        disabled={disabled}
                        className="w-full border-0 bg-transparent py-3 text-sm text-neutral-700 outline-none focus:ring-0"
                    />
                </div>

                <div className="h-6 w-px bg-neutral-200" />

                <div className="flex w-[140px] items-center gap-3 px-3">
                    <ClockIcon size={18} className="text-neutral-400" />

                    <input
                        id={`${id}_time`}
                        type="time"
                        value={timeValue}
                        onChange={onTimeChange}
                        disabled={disabled}
                        className="w-full border-0 bg-transparent py-3 text-sm text-neutral-700 outline-none focus:ring-0"
                    />
                </div>
            </div>
        </div>
    );
}
