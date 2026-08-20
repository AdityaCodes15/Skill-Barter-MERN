import axios from "axios";

const api = axios.create({
    baseURL: "https://skill-barter-mern.onrender.com/api"
});

export default api;