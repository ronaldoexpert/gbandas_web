import axios from "axios";

 const URL = "http://localhost:3001"
 
 //const URL = "https://gbandas-4708607da739.herokuapp.com"

const api = axios.create({
    baseURL: URL,
    timeout: 5000
});

api.interceptors.request.use((req) => {
    if (localStorage.getItem("sessionToken"))
        req.headers.Authorization = "Bearer " + localStorage.getItem("sessionToken");
    
    if (localStorage.getItem("cnpj")) {
        // Para requisições que já têm body (POST, PUT, PATCH)
        if (req.data) {
            req.data = {
                ...req.data,
                cnpj: localStorage.getItem("cnpj")
            };
        } else {
            // Para requisições que não têm body inicialmente
            req.data = {
                cnpj: localStorage.getItem("cnpj")
            };
        }
    }

    return req;
}, (err) => {
    console.log(err);
});

api.interceptors.response.use((res) => {
    return res;
}, (error) => {
    if (error.response.status === 401 || error.response.status === 403){
        localStorage.removeItem("sessionToken");

        if (!document.location.href.includes('/', 1)){
            document.location = "/";
        }
    }

    return Promise.reject(error);
});

function HandleErros(err){
    if (err.response?.data.error)
        return err.response?.data.error
    else   
        return "Ocorreu um erro. Tente novamente mais tarde!" + err;
}

export {api, HandleErros};