import { useEffect, useState } from "react";

export function useVisibleItems() {
    const [visible, setVisible] = useState(6);

    useEffect(() => {
        const update = () => {
            if (window.innerWidth < 640) setVisible(2);
            else if (window.innerWidth < 1024) setVisible(4);
            else setVisible(6);
        };

        update();
        window.addEventListener("resize", update);
        return () => window.removeEventListener("resize", update);
    }, []);

    return visible;
}
