import { useState, useEffect, createContext } from "react";

const SliderContext = createContext(undefined);

export default function Slider({ slides }) {

    const [index, setIndex] = useState(0);

    function next() {
        const isLastSlide = index === slides.length - 1;
        const newIndex = isLastSlide ? 0 : index + 1;
        setIndex(newIndex);
    }

    function previous() {
        const isFirstSlide = index === 0;
        const newIndex = isFirstSlide ? 0 : index - 1;
        setIndex(newIndex);
    }

    function goTo(index) {
        setIndex(index);
    }

    useEffect(() => {
        const timer = setInterval(() => {
            next();
        }, 5000)

        return () => clearInterval(timer);
    }, [index])


    return (
        <SliderContext.Provider value={{ slides, next, previous, goTo }}>
            <div className="flex flex-col items-center justify-center gap-4 select-none">

                <div className="flex items-center justify-between gap-4">
                    <Button orientation="left" onClick={previous} />

                    <div className="overflow-hidden w-[1100px]">
                        <div className="w-full flex transition-transform duration-500" style={{ transform: `translateX(-${index * 100}%)` }}>

                            {slides.map(slide => slide)}

                        </div>
                    </div>

                    <Button orientation="right" onClick={next} />
                </div>

                <div className="flex space-x-1 sm:space-x-2">
                    {slides.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => goTo(i)}
                            className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${i === index ? "bg-emerald-400 animate-fade-in-400" : "bg-zinc-300"}`}
                        ></button>
                    ))}
                </div>

            </div>
        </SliderContext.Provider>
    )

}

function Button({ orientation, ...props }) {

    return (
        <button
            {...props}
            type="button"
            className="size-[32px] max-w-[32px] max-h-[32px] min-w-[32px] min-h-[32px] p-2 flex items-center justify-center border border-gray-300 text-emerald-400 text-2xl rounded-full hover:bg-neutral-100 duration-200 ease-in-out cursor-pointer"
        >
            {orientation === "left" ? <>&#8249;</> : <>&#8250;</>}
        </button>
    )
}
