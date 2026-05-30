import { useState } from "react";
import {
    GraduationCapIcon,
    MonitorIcon,
    PaletteIcon,
    WaveTriangleIcon,
    CaretLeftIcon,
    CaretRightIcon,
    HardHatIcon,
} from "@phosphor-icons/react";
import { useVisibleItems } from "@/Hooks/useVisibleItens";

const categories = [
    { name: "Engenharia", icon: HardHatIcon, count: 0 },
    { name: "Tecnologia", icon: MonitorIcon, count: 0 },
    { name: "Esporte", icon: WaveTriangleIcon, count: 0 },
    { name: "Arte", icon: PaletteIcon, count: 0 },
    { name: "Educação", icon: GraduationCapIcon, count: 0 },
];

export default function CategoriesSection() {
    const VISIBLE = useVisibleItems();

    const [start, setStart] = useState(0);
    const [offset, setOffset] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    const total = categories.length;

    const getItem = (index) => {
        return categories[(index + total) % total];
    };

    const windowItems = [
        getItem(start - 1),
        ...Array.from({ length: VISIBLE }, (_, i) => getItem(start + i)),
        getItem(start + VISIBLE),
    ];

    const next = () => {
        if (isAnimating) return;

        setIsAnimating(true);
        setOffset(1);

        setTimeout(() => {
            setIsAnimating(false);
            setOffset(0);
            setStart((prev) => (prev + 1) % total);
        }, 300);
    };

    const prev = () => {
        if (isAnimating) return;

        setIsAnimating(true);
        setOffset(-1);

        setTimeout(() => {
            setIsAnimating(false);
            setOffset(0);
            setStart((prev) => (prev - 1 + total) % total);
        }, 300);
    };

    return (
        <section className="w-full py-32 max-md:py-16 mx-auto bg-gray-50 max-md:px-4">
            <div className="mx-auto max-w-6xl">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-4xl font-bold text-neutral-800">Categorias</h2>
                        <p className="mt-1 text-sm text-neutral-500">Explore eventos por categoria</p>
                    </div>

                    <div className="flex gap-2">
                        <button onClick={prev} className="rounded-full border p-2 hover:bg-neutral-100 bg-white">
                            <CaretLeftIcon size={20} />
                        </button>
                        <button onClick={next} className="rounded-full border p-2 hover:bg-neutral-100 bg-white">
                            <CaretRightIcon size={20} />
                        </button>
                    </div>
                </div>

                <div className="mt-6 overflow-hidden">
                    <div
                        className={`flex ${isAnimating ? "transition-transform duration-300" : ""}`}
                        style={{
                            transform: `translateX(-${(1 + offset) * (100 / VISIBLE)}%)`,
                        }}
                    >
                        {windowItems.map((cat, i) => (
                            <div
                                key={`${cat.name}-${i}`}
                                style={{ width: `${100 / VISIBLE}%` }}
                                className="flex-shrink-0 px-2"
                            >
                                <button className="group flex w-full flex-col items-center gap-4 rounded-xl border border-border bg-white p-4 transition-all hover:border-emerald-600 hover:shadow-sm">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-200 text-neutral-800 transition-colors group-hover:bg-emerald-600 group-hover:text-white">
                                        <cat.icon className="h-5 w-5" />
                                    </div>
                                    <div className="flex flex-col items-center justify-center">
                                        <span className="text-sm font-medium text-neutral-800">{cat.name}</span>
                                        <span className="text-xs text-neutral-500">{cat.count} eventos</span>
                                    </div>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
