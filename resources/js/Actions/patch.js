import axios from "axios";

export async function patch(url, payload) {
    const response = await axios.patch(url, payload);

    return response.data;
}
