import axios from "axios";

export async function update(url, payload) {
    if (payload instanceof FormData) {
        payload.append("_method", "PUT");

        const response = await axios.post(url, payload);

        return response.data;
    }

    const response = await axios.put(url, payload);

    return response.data;
}
