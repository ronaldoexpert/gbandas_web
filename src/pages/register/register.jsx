import "./register.css";
import logo from "../../assets/logo.png";
import bg from "../../assets/background.png";
import { Link } from "react-router-dom";

function Register(){
    return <div className="row">
                <div className="col-sm-6 d-flex justify-content-center align-items-center text-center flex-column justify-content-between">
                    <div className="signin">
                        <img src={logo} alt="Logotipo GBandas" className="img-logo" />
                        <h2>Crie sua conta agora mesmo!</h2>                        
                    </div>
                    
                    <form className="form-signin">
                        <h6 className="mb-5">Preencha os campos abaixo</h6>
                        <div className="form-floating mb-3">
                            <input type="text" className="form-control" id="floatingInput" placeholder="nome@example.com" />
                            <label htmlFor="floatingInput">Nome</label>
                        </div>
                        <div className="form-floating mb-3">
                            <input type="email" className="form-control" id="floatingPassword" placeholder="Senha" />
                            <label htmlFor="floatingPassword">Email</label>
                        </div>
                        <div className="form-floating mb-3">
                            <input type="password" className="form-control" id="floatingPassword" placeholder="Senha" />
                            <label htmlFor="floatingPassword">Senha</label>
                        </div>
                        <div className="form-floating mb-3">
                            <input type="password" className="form-control" id="floatingPassword" placeholder="Senha" />
                            <label htmlFor="floatingPassword">Confirme sua Senha</label>
                        </div>

                        <button type="button" className="btn btn-purple btn-lg w-100">Criar Minha Conta</button>
                    </form>                    

                    <div className="mb-3">
                        <h6>Já tenho uma conta. <Link to="/login">Acessar agora!</Link></h6>
                    </div>
                </div>

                <div className="col-sm-6 px-0 d-none d-sm-block">
                    <img src={bg} alt="Background GBandas" className="img-background" />
                </div>
            </div>
}


export default Register;