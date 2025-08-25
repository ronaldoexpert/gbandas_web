import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/logoLateral.png";
import "./navbar.css";

function Navbar(){
    const location = useLocation();

    return <nav className="navbar bg-blue fixed-top navbar-expand-lg ps-2 pe-2" data-bs-theme="dark">
                <div className="container-fluid">
                    <Link className="navbar-brand" to="/home"> 
                        <img className="img-logo" src={logo} alt="" /> 
                    </Link>

                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="navbarText">
                        <ul className="navbar-nav ms-3 me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <Link className={location.pathname === '/home' ? 'nav-link active' : 'nav-link'}  to="/home">Home</Link>
                            </li>
                            <li className="nav-item">
                                <Link className={location.pathname === '/alunos' ? 'nav-link active' : 'nav-link'} to="/alunos">Alunos</Link>
                            </li>
                            <li className="nav-item">
                                <Link className={location.pathname === '/instrumentos' ? 'nav-link active' : 'nav-link'} to="/instrumentos">Instrumentos</Link>
                            </li>
                            <li className="nav-item">
                                <Link className={location.pathname === '/chamada' ? 'nav-link active' : 'nav-link'} to="/chamada">Chamada</Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <div className="dropdown dropdown-menu-blue">
                            <a className="btn dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                José Ronaldo Silveira Miguel
                            </a>
                            <ul className="dropdown-menu bg-blue">
                                <li><a className="dropdown-item" href="#">Meu Perfil</a></li>
                                <li><a className="dropdown-item" href="#">Alterar Senha</a></li>
                                <li><hr className="dropdown-divider" /></li>
                                <li><a className="dropdown-item" href="#">Desconectar</a></li>
                            </ul>
                        </div>
                    </div>
                </div>  
           </nav>
}


export default Navbar;