import { Link, useNavigate } from "react-router-dom";

import "./login.css";
import logo from "../../assets/logo.png";
import bg from "../../assets/background.png";
import {api, HandleErros } from "../../constants/api.js";
import { useState } from "react";


function Login(){
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [msg, setMsg] = useState("");
    const [loading, setLoading] = useState(false);

    function ProcessarLogin(){
        setLoading(true);
        api.post("usuarios/login", {
            email,
            senha
        }).then((response) => {
            localStorage.setItem("sessionToken", response.data.token);
            localStorage.setItem("sessionId", response.data.id_usuario);
            localStorage.setItem("sessionNome", response.data.nome);
            localStorage.setItem("sessionEmail", response.data.email);

            setLoading(false);
            
            navigate("/home");            
        }).catch((err) => {
            setLoading(false);
            setMsg(HandleErros(err));
        })
    }

    return <div className="row">
                <div className="col-sm-6 d-flex justify-content-center align-items-center text-center flex-column justify-content-between">
                    <div className="signin">
                        <img src={logo} alt="Logotipo GBandas" className="img-login" />
                        <h2>Gerenciar sua Banda nunca foi tão fácil!</h2>       
                    </div>
                    
                    <form className="form-signin">
                        <h6 className="mb-5">Acesse sua conta</h6>
                        <div className="form-floating mb-3">
                            <input type="email" className="form-control" id="floatingInput" placeholder="nome@example.com" 
                            onChange={(e) => setEmail(e.target.value)} />
                            <label htmlFor="floatingInput">Email</label>
                        </div>
                        <div className="form-floating mb-3">
                            <input type="password" className="form-control" id="floatingPassword" placeholder="Senha" 
                            onChange={(e) => setSenha(e.target.value)} />
                            <label htmlFor="floatingPassword">Senha</label>
                        </div>

                        <button type="button" className="btn btn-purple btn-lg w-100 " disabled={loading} onClick={ProcessarLogin}>
                           { !loading ? "Acessar Conta" : "Relizando Login..." } 
                        </button>

                        {
                            msg.length > 0 && <div className="alert alert-danger mt-2" role="start"> {msg} </div>
                        }
                        
                    </form>    
                    
                    <div className="mb-3">
                        <h6>Não tenho uma conta. <Link to="/register">Criar agora!</Link></h6>
                    </div>
                </div>

                <div className="col-sm-6 px-0 d-none d-sm-block">
                    <img src={bg} alt="Background GBandas" className="img-background" />
                </div>
            </div>
}


export default Login;