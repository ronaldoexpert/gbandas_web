import { Link, useNavigate } from "react-router-dom";

import "./home.css";
import Navbar from "../../components/navbar/navbar";
import { useEffect, useState } from "react";
import { api, HandleErros } from "../../constants/api";

function Home(){
    const navigate = useNavigate();
    const [totalAlunos, setTotalAlunos] = useState(0);
    const [totalInstrumentos, setTotalInstrumentos] = useState(0);
    const [instrumentosDisponiveis, setInstrumentosDisponiveis] = useState(0);

    function AbrirListaAlunos(){
        navigate("/alunos");
    }

    function AbrirListaInstrumentos(){
        navigate("/instrumentos");
    }

    async function GetTotalAlunos(){
        await api.get("/alunos/qtd").then((response) => {
            setTotalAlunos(response.data.qtd_alunos);
        }).catch((err) => {
            console.log(HandleErros(err));
        })
    }

    async function GetTotalinstrumento(){
        await api.get("/instrumentos/qtd").then((response) => {
            setTotalInstrumentos(response.data.qtd_instrumentos);
            setInstrumentosDisponiveis(response.data.qtd_instrumentos_ativos);
        }).catch((err) => {
            console.log(HandleErros(err));
        })
    }

    useEffect(() => {
            GetTotalAlunos();
            GetTotalinstrumento();
        }, []);

    return <div>
                <Navbar />

                <div className="min-vh-100">
                    {/* Header */}
                    <nav className="navbar navbar-expand-lg">
                        <div className="container">
                        <span className="navbar-brand text-white fw-bold fs-3">
                            📚 Sistema de Controle Escolar
                        </span>
                        </div>
                    </nav>

                    {/* Main Content */}
                    <div className="container py-5">
                        {/* Welcome Section */}
                        <div className="row mb-5">
                        <div className="col-12">
                            <div className="text-center">
                            <h1 className="display-4 fw-bold mb-3 text">
                                Bem-vindo ao Sistema
                            </h1>
                            <p className="lead text-muted">
                                Gerencie alunos, instrumentos e informações escolares de forma prática e eficiente!
                            </p>
                            </div>
                        </div>
                        </div>

                        {/* Stats Cards - Totais */}
                        <div className="row mb-5">
                        <div className="col-12">
                            <h2 className="mb-4 text">📊 Resumo Geral</h2>
                        </div>
                        
                        {/* Total de Alunos */}
                        <div className="col-md-6 mb-4">
                            <div className="card h-100 shadow-sm border-0" style={{ borderLeft: '5px solid #2c5aa0' }}>
                            <div className="card-body d-flex align-items-center">                                
                                <div className="rounded-circle p-3 me-4">
                                    <i className="bi bi-person-vcard"></i>
                                </div>
                                <div>
                                    <h5 className="card-title text-muted mb-1">Total de Alunos</h5>
                                    <h2 className="fw-bold mb-0 text">{totalAlunos}</h2>
                                </div>
                            </div>
                            </div>
                        </div>

                        {/* Total de Instrumentos */}
                        <div className="col-md-6 mb-4">
                            <div className="card h-100 shadow-sm border-0">
                            <div className="card-body d-flex align-items-center">
                                <div className="rounded-circle p-3 me-4">
                                    <i className="bi bi-box-seam-fill"></i>
                                </div>
                                <div>
                                <h5 className="card-title text-muted mb-1">Total de Instrumentos</h5>
                                <h2 className="fw-bold mb-0 text">{totalInstrumentos}</h2>
                                <small className="text-info">
                                    <i className="bi bi-info-circle"></i> Disponíveis: {instrumentosDisponiveis}
                                </small>
                                </div>
                            </div>
                            </div>
                        </div>
                        </div>

                        {/* Action Cards - Navegação */}
                        <div className="row">
                            <div className="col-12">
                                <h2 className="mb-4 text">⚡ Ações Rápidas</h2>
                            </div>

                            {/* Lista de Alunos */}
                                <div className="col-md-6 mb-4">
                                    <Link to="/alunos">
                                    <div className="card h-100 shadow-sm border-0 hover-card" 
                                        style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
                                        onMouseEnter={(e) => e.target.closest('.card').style.transform = 'translateY(-5px)'}
                                        onMouseLeave={(e) => e.target.closest('.card').style.transform = 'translateY(0)'}>
                                        <div className="card-body text-center p-4">
                                            <div className="rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center" 
                                                style={{ width: '80px', height: '80px', backgroundColor: '#1976d2' }}>
                                                <i className="bi bi-person-vcard text-white"></i>
                                            </div>
                                            <h4 className="card-title fw-bold mb-3" style={{ color: '#1976d2' }}>Listar Alunos</h4>
                                            <p className="card-text text-muted mb-4">Visualize, pesquise e gerencie todos os alunos cadastrados no sistema</p>
                                            <button className="btn btn-lg px-4 btn-purple"  onClick={AbrirListaAlunos}>Ver Lista</button>
                                        </div>
                                    </div>
                                    </Link>
                                </div>                       

                            {/* Gerenciar Instrumentos */}
                            <div className="col-md-6 mb-4">
                                <Link to="/instrumentos">
                                <div className="card h-100 shadow-sm border-0 hover-card" 
                                    style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
                                    onMouseEnter={(e) => e.target.closest('.card').style.transform = 'translateY(-5px)'}
                                    onMouseLeave={(e) => e.target.closest('.card').style.transform = 'translateY(0)'}>
                                    <div className="card-body text-center p-4">
                                        <div className="rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center" 
                                            style={{ width: '80px', height: '80px', backgroundColor: '#1565c0' }}>
                                            <i className="bi bi-music-note-list text-white"></i>
                                        </div>
                                        <h4 className="card-title fw-bold mb-3 text">Listar Instrumentos</h4>
                                        <p className="card-text text-muted mb-4">Visualize, pesquise e gerencie todos os instrumentos cadastrados no sistema!</p>
                                        <button className="btn btn-lg px-4 btn-purple"  onClick={AbrirListaInstrumentos}>Ver Lista</button>
                                    </div>
                                </div>
                                </Link>
                            </div>
                        </div>

                        {/* Quick Stats Footer */}
                        {/* <div className="row mt-5">
                            <div className="col-12">
                                <div className="card shadow-sm border-0" style={{ backgroundColor: '#2c5aa0' }}>
                                <div className="card-body text-white text-center py-4">
                                    <div className="row">
                                    <div className="col-md-4">
                                        <h3 className="fw-bold">15</h3>
                                        <p className="mb-0">Turmas Ativas</p>
                                    </div>
                                    <div className="col-md-4">
                                        <h3 className="fw-bold">32</h3>
                                        <p className="mb-0">Professores</p>
                                    </div>
                                    <div className="col-md-4">
                                        <h3 className="fw-bold">95%</h3>
                                        <p className="mb-0">Taxa de Frequência</p>
                                    </div>
                                    </div>
                                </div>
                                </div>
                            </div>
                        </div> */}
                    </div>
      </div>
    </div>
}


export default Home;