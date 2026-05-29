import axios from "axios";

export async function store(url, payload) {
    const response = await axios.post(url, payload);
    return response.data;
}
