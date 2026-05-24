import axios from "axios";

export async function store(payload) {
    const url = route("events.store");

    const response = await axios.post(url, payload);
    return response.data;
}
