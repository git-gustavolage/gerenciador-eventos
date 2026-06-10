import { useState, useRef, useCallback } from "react";

export default function useData(initialValues) {
    const [_data, _setData] = useState(initialValues);

    const dataRef = useRef(initialValues);

    const clear = () => {
        _setData(initialValues);
        dataRef.current = initialValues;
    };

    const setData = useCallback(
        (key, value) => {
            if (typeof key === "function") {
                const updater = key;
                const newData = updater(dataRef.current);
                dataRef.current = newData;
                _setData(newData);
                return;
            }

            if (value === undefined) {
                const newData = key;
                _setData(newData);
                dataRef.current = newData;
                return;
            }

            if (typeof key === "string") {
                const k = key;
                if (dataRef.current[k] !== value) {
                    dataRef.current = {
                        ...dataRef.current,
                        [k]: value,
                    };

                    _setData((prev) => ({
                        ...prev,
                        [k]: value,
                    }));
                }
                return;
            }

            throw new Error("Invalid arguments");
        },
        [_setData, dataRef]
    );

    return [_data, setData, clear, _setData];
}
