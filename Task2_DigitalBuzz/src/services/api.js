import axios from "axios";

const API = "http://localhost:4000/messages";

export const getMessages = () => axios.get(API);
export const postMessage = (msg) => axios.post(API, msg);
export const uploadImage = (formData) =>
  axios.post(API + "/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
