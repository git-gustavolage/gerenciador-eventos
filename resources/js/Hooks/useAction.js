import { useState, useCallback, useRef } from "react";
import axios from "axios";

export function useAction({ actionFn, onSuccess, onError, onFinally, withErrorHandling = true }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const loadingRef = useRef(false);

    const execute = useCallback(
        async (...args) => {
            if (loadingRef.current) return;

            try {
                loadingRef.current = true;

                setLoading(true);
                setError(null);

                const response = await actionFn(...args);

                onSuccess?.(response);

                return response;
            } catch (err) {
                let normalizedError;

                if (axios.isAxiosError(err)) {
                    normalizedError = {
                        type: "http",
                        status: err.response?.status ?? 500,
                        message: err.response?.data?.message ?? err.message ?? "Erro na requisição.",
                        errors: err.response?.data?.errors ?? null,
                        data: err.response?.data ?? null,
                    };
                } else if (err instanceof Error) {
                    normalizedError = {
                        type: "unknown",
                        status: 500,
                        message: err.message,
                        errors: null,
                        data: null,
                    };
                } else {
                    normalizedError = {
                        type: "unknown",
                        status: 500,
                        message: "Erro inesperado.",
                        errors: null,
                        data: null,
                    };
                }

                setError(normalizedError);

                onError?.(normalizedError);

                if (!withErrorHandling) {
                    throw normalizedError;
                }

                return null;
            } finally {
                loadingRef.current = false;

                setLoading(false);

                onFinally?.();
            }
        },
        [actionFn, onSuccess, onError, onFinally, withErrorHandling]
    );

    const clearError = useCallback((field) => {
        setError((current) => {
            if (!current?.errors?.[field]) {
                return current;
            }

            const errors = {
                ...current.errors,
            };

            delete errors[field];

            return {
                ...current,
                errors,
            };
        });
    }, []);

    return {
        execute,
        loading,
        error,
        clearError
    };
}
