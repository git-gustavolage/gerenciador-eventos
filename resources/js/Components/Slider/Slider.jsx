import { createContext, useEffect, useState } from "react";

const SliderContext = createContext(undefined);

export default function Slider({ slides = [] }) {
    const [index, setIndex] = useState(0);

    function next() {
        const isLastSlide = index === slides.length - 1;
        setIndex(isLastSlide ? 0 : index + 1);
    }

    function previous() {
        const isFirstSlide = index === 0;
        setIndex(isFirstSlide ? slides.length - 1 : index - 1);
    }

    function goTo(slideIndex) {
        setIndex(slideIndex);
    }

    useEffect(() => {
        if (slides.length <= 1) return;

        const timer = setInterval(() => {
            next();
        }, 5000);

        return () => clearInterval(timer);
    }, [index, slides.length]);

    return (
        <SliderContext.Provider value={{ slides, next, previous, goTo, currentIndex: index }}>
            <div className="w-full flex flex-col items-center justify-center gap-4 select-none">
                <div className="w-full flex items-center justify-center gap-4 max-md:gap-2">
                    {slides.length > 1 && <Button orientation="left" onClick={previous} className="max-md:hidden" />}

                    <div className="w-full overflow-hidden">
                        <div
                            className="flex transition-transform duration-500 ease-in-out"
                            style={{
                                transform: `translateX(-${index * 100}%)`,
                            }}
                        >
                            {slides.map((slide, slideIndex) => (
                                <div key={slideIndex} className="w-full min-w-full">
                                    {slide}
                                </div>
                            ))}
                        </div>
                    </div>

                    {slides.length > 1 && <Button orientation="right" onClick={next} className="max-md:hidden" />}
                </div>

                {slides.length > 1 && (
                    <div className="flex items-center justify-center gap-2 max-md:gap-1">
                        {slides.map((_, slideIndex) => (
                            <button
                                key={slideIndex}
                                type="button"
                                onClick={() => goTo(slideIndex)}
                                className={`rounded-full transition-all duration-300 ${slideIndex === index ? "bg-emerald-400 w-4 h-4 max-md:w-3 max-md:h-3" : "bg-zinc-300 w-3 h-3 max-md:w-2 max-md:h-2"}`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </SliderContext.Provider>
    );
}

function Button({ orientation, className = "", ...props }) {
    return (
        <button
            {...props}
            type="button"
            className={`size-8 min-w-8 min-h-8 flex items-center justify-center rounded-full border border-gray-300 text-emerald-400 text-2xl hover:bg-neutral-100 transition-colors cursor-pointer max-md:size-7 max-md:min-w-7 max-md:min-h-7 max-md:text-xl ${className}`}
        >
            {orientation === "left" ? "‹" : "›"}
        </button>
    );
}

export { SliderContext };
