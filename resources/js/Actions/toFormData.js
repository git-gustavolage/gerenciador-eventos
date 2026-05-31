export function toFormData(data) {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
        if (value === null || value === undefined) {
            return;
        }

        if (Array.isArray(value)) {
            value.forEach((item) => {
                formData.append(`${key}[]`, item);
            });

            return;
        }

        if (typeof value === "boolean") {
            formData.append(key, value ? "1" : "0");
            return;
        }

        formData.append(key, value);
    });

    return formData;
}
