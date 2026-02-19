import axios from 'axios'; //import axios library

//a pre-configured HTTP  client
const api = axios.create({
    baseURL: "http://127.0.0.1:8000",
});

//interceptors centralizes authentication logic 
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token"); // reads the JWT token stored after login ... 

    if(token && config.headers){
        config.headers.Authorization = `Bearer ${token}`;

    }
    return config; // interceptors must return modified config so request continuos 
});

export default api;
