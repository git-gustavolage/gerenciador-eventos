import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { twMerge } from "tailwind-merge";

const MenuContext = createContext({
    tabs: [],
    menuIndex: 0,
    setMenuIndex: () => {},
});

export const useMenu = () => {
    const ctx = useContext(MenuContext);

    if (!ctx) {
        throw new Error("useMenu must be used within a Menu");
    }

    return ctx;
};

const isMenuTab = (node) => React.isValidElement(node) && node.type === MenuTab;

const Menu = ({ className = "", children }) => {
    const tabs = useMemo(
        () =>
            React.Children.toArray(children)
                .filter(isMenuTab)
                .filter((tab) => !tab.props.disabled),
        [children]
    );

    const getInitialIndex = () => {
        const params = new URLSearchParams(window.location.search);

        const tabIndex = params.get("tabIndex");

        if (!tabIndex) return 0;

        const parsedIndex = Number(tabIndex);

        if (Number.isNaN(parsedIndex) || parsedIndex < 0 || parsedIndex >= tabs.length) {
            return 0;
        }

        return parsedIndex;
    };

    const [activeIndex, setActiveIndex] = useState(getInitialIndex);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);

        params.set("tabIndex", String(activeIndex));

        window.history.replaceState({}, "", `${window.location.pathname}?${params.toString()}`);

        return () => {
            const params = new URLSearchParams(window.location.search);

            params.delete("tabIndex");

            const query = params.toString();

            window.history.replaceState({}, "", query ? `${window.location.pathname}?${query}` : window.location.pathname);
        };
    }, [activeIndex]);

    const activeStyle =
        "after:content-[''] after:w-full after:mt-4 after:h-[4px] after:flex after:bg-emerald-500 after:rounded-[20px] rounded-t-sm text-neutral-800 font-bold";

    const defaultStyle = "pb-3 text-neutral-400 hover:text-neutral-600 border-none";

    return (
        <MenuContext.Provider
            value={{
                menuIndex: activeIndex,
                setMenuIndex: setActiveIndex,
                tabs,
            }}
        >
            <div className="w-full">
                <div
                    className={twMerge(
                        "w-full flex flex-wrap items-end overflow-x-auto border-b border-neutral-300 gap-x-2",
                        className
                    )}
                >
                    {tabs.map((tab, index) => (
                        <button
                            key={index}
                            type="button"
                            onClick={() => setActiveIndex(index)}
                            className={twMerge(
                                "min-w-[100px] px-2 pt-2 focus:outline-none transition duration-200 ease-in-out capitalize whitespace-nowrap",
                                activeIndex === index ? activeStyle : defaultStyle
                            )}
                        >
                            {tab.props.label || "-"}
                        </button>
                    ))}
                </div>

                <div className={twMerge("py-4", tabs[activeIndex]?.props.className)}>{tabs[activeIndex]?.props.children}</div>
            </div>
        </MenuContext.Provider>
    );
};

const MenuTab = ({ children }) => {
    return <div>{children}</div>;
};

Menu.Tab = MenuTab;

export { Menu };
