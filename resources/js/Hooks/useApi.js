import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";

export default function useApi(url, initialFilters = {}) {
    const [data, setData] = useState(null);
    const [filters, setFilters] = useState(initialFilters);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const abortControllerRef = useRef(null);
    const mountedRef = useRef(true);

    const fetchData = useCallback(async () => {
        if (!url) return;

        abortControllerRef.current?.abort();

        const controller = new AbortController();
        abortControllerRef.current = controller;

        setLoading(true);

        try {
            const response = await axios.get(url, {
                params: filters,
                signal: controller.signal,
            });

            if (!mountedRef.current) return;

            setData(response.data);
            setError(null);
        } catch (err) {
            if (
                err?.name === "CanceledError" ||
                err?.code === "ERR_CANCELED"
            ) {
                return;
            }

            if (!mountedRef.current) return;

            setError(err);
        } finally {
            if (!mountedRef.current) return;

            setLoading(false);
        }
    }, [url, filters]);

    useEffect(() => {
        mountedRef.current = true;

        fetchData();

        return () => {
            mountedRef.current = false;
            abortControllerRef.current?.abort();
        };
    }, [fetchData]);

    return {
        data,
        loading,
        error,
        reload: fetchData,
        filters,
        setFilters,
    };
}
