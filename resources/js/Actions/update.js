import axios from "axios";

export async function update(url, payload) {
    const response = await axios.put(url, payload);
    return response.data;
}
