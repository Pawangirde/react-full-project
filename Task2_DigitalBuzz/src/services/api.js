import axios from "axios";

const API_BASE = "http://localhost:4000";
const API = `${API_BASE}/messages`;

export const getMessages = () => axios.get(API);
export const postMessage = (msg) => axios.post(API, msg);
export const uploadImage = (formData) => axios.post(`${API}/upload`, formData);
