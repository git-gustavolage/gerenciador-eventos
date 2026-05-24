import { useState, useCallback } from "react";

export function useAction({ actionFn, onSuccess, onError, onFinally, withErrorHandling = true }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const execute = useCallback(
        async (payload) => {
            if (loading) return;

            try {
                setLoading(true);
                setError(null);

                const res = await actionFn(payload);
                onSuccess?.(res);
                return res;
            } catch (err) {
                setError(err);
                onError?.(err);

                if (withErrorHandling) return;

                throw err;
            } finally {
                setLoading(false);
                onFinally?.();
            }
        },
        [loading, actionFn, onSuccess, onError, onFinally]
    );

    return {
        execute,
        loading,
        error,
    };
}
