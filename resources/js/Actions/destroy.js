import axios from "axios";

export async function destroy(url, payload) {
    const response = await axios.delete(url, payload);
    return response.data;
}
