import { toast } from "sonner";

export function actionErrorHandlingDecorator(targetFn) {
    return async function (...args) {
        try {
            return await targetFn(...args);
        } catch (err) {
            if (err?.response?.data?.message) {
                const message = err.response.data.message;
                toast.error(message || "Erro ao processar requisição");
            } else {
                toast.error(err?.message || "Erro inesperado");
            }

            throw err;
        }
    };
}
