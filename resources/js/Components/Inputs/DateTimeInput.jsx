import { CalendarBlankIcon, ClockIcon } from "@phosphor-icons/react";
import InputLabel from "@/Components/Inputs/InputLabel";

export default function DateTimeInput({
    id = "datetime",
    label = "Data e horário",
    value = "",
    onChange,
    disabled = false,
    min = "",
    withTime = true,
}) {
    const [dateValue = "", timeValue = ""] = value?.split(" ") ?? " ";

    function handleDateChange(e) {
        const date = e.target.value;

        const nextValue = date ? `${date} ${timeValue || "00:00"}` : "";

        onChange?.({
            ...e,
            target: {
                ...e.target,
                value: nextValue,
            },
        });
    }

    function handleTimeChange(e) {
        const time = e.target.value;

        const nextValue = time ? `${dateValue || new Date().toISOString().split("T")[0]} ${time}` : `${dateValue || ""}`.trim();

        onChange?.({
            ...e,
            target: {
                ...e.target,
                value: nextValue,
            },
        });
    }

    return (
        <div className="w-full space-y-2">
            <InputLabel htmlFor={`${id}_date`} value={label} />

            <div
                className={`group flex items-center overflow-hidden rounded-sm border border-neutral-300 bg-white transition-all focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-300 ${disabled ? "bg-neutral-100 opacity-70" : ""}`}
            >
                <label htmlFor={`${id}_date`} className="flex flex-1 items-center px-3">
                    <CalendarBlankIcon size={18} className="text-neutral-400" />

                    <input
                        id={`${id}_date`}
                        type="date"
                        value={dateValue}
                        min={min}
                        onChange={handleDateChange}
                        disabled={disabled}
                        className="w-full border-0 bg-transparent py-3 text-sm text-neutral-700 outline-none focus:ring-0"
                    />
                </label>

                {withTime && (
                    <>
                        <div className="h-6 w-px bg-neutral-200" />

                        <label htmlFor={`${id}_time`} className="flex w-[140px] items-center gap-3 px-3">
                            <ClockIcon size={18} className="text-neutral-400 min-w-[18px]" />

                            <input
                                id={`${id}_time`}
                                type="time"
                                value={timeValue}
                                onChange={handleTimeChange}
                                disabled={disabled}
                                className="w-full border-0 bg-transparent py-3 text-sm text-neutral-700 outline-none focus:ring-0"
                            />
                        </label>
                    </>
                )}
            </div>
        </div>
    );
}
