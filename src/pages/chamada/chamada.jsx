import "./chamada.css";
import Navbar from "../../components/navbar/navbar";
import { useEffect, useState } from "react";

function Chamada(){
    const [turmaSelecionada, setTurmaSelecionada] = useState('');
    const [dataAula, setDataAula] = useState(new Date().toISOString().split('T')[0]);
    const [presencas, setPresencas] = useState({});

    // Dados mockados - substitua pela sua API
    const turmas = [
        { id: 1, nome: "2022"},
        { id: 2, nome: "2024"},
    ];

    const alunosPorTurma = {
        1: [
        { id: 1, nome: "AGATHA ESTELA FELICIANO OLIVEIRA", instrumento: "Percursão" },
        { id: 2, nome: "ANA CAROLINA BRAZ SOUZA", instrumento: "Clarinete" },
        { id: 3, nome: "DAVI LUCAS CARDOSO DE CASTRO", instrumento: "Percursão" },
        { id: 4, nome: "ISABELA CAETANO MAURICIO", instrumento: "Flauta" },
        { id: 5, nome: "ISADORA KAESER SILVA", instrumento: "Clarinete" }
        ],
        2: [
        { id: 6, nome: "Fernanda Alves", instrumento: "Violino" },
        { id: 7, nome: "Gabriel Rocha", instrumento: "Trompete" },
        { id: 8, nome: "Helena Martins", instrumento: "Clarinete" },
        { id: 9, nome: "Igor Pereira", instrumento: "Baixo" },
        { id: 10, nome: "Julia Ferreira", instrumento: "Piano" }
        ]
    };

    const alunos = turmaSelecionada ? alunosPorTurma[turmaSelecionada] || [] : [];

    const marcarPresenca = (alunoId, status) => {
        setPresencas(prev => ({
        ...prev,
        [alunoId]: status
        }));
    };

    const salvarChamada = () => {
        console.log('dadosChamada');
        
        if (!turmaSelecionada) {
        alert('Por favor, selecione uma turma!');
        return;
        }

        const turma = turmas.find(t => t.id === parseInt(turmaSelecionada));
        const dadosChamada = {
        turma_id: turmaSelecionada,
        turma_nome: turma.nome,
        data: dataAula,
        presencas: presencas
        };

        console.log(dadosChamada);
    }

    const marcarTodosPresentes = () => {
    const novasPresencas = {};
    alunos.forEach(aluno => {
      novasPresencas[aluno.id] = 'presente';
    });
    setPresencas(novasPresencas);
  };

  const marcarTodosAusentes = () => {
    const novasPresencas = {};
    alunos.forEach(aluno => {
      novasPresencas[aluno.id] = 'ausente';
    });
    setPresencas(novasPresencas);
  };

  const contarPresencas = () => {
    const total = alunos.length;
    const presentes = Object.values(presencas).filter(p => p === 'presente').length;
    const ausentes = Object.values(presencas).filter(p => p === 'ausente').length;
    return { total, presentes, ausentes };
  };

  const stats = contarPresencas();

    return <>
                <Navbar />
                <div className="container-fluid m-container">
                    <div className="row">
                        <div className="col-md-3">
                            <h3 className="text">Cadastro de Chamada</h3>                        
                        </div>
                    </div>

                    <div className="container py-4">
                        {/* Formulário de Seleção */}
                        <div className="row mb-4">
                        <div className="col-12">
                            <div className="card shadow-sm border-0">
                            <div className="card-body">
                                <h5 className="card-title mb-4" style={{ color: '#2c5aa0' }}>
                                <i className="fas fa-calendar-check me-2"></i>
                                Informações da Aula
                                </h5>
                                
                                <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label className="form-label fw-bold">Data da Aula</label>
                                    <input 
                                    type="date" 
                                    className="form-control"
                                    value={dataAula}
                                    onChange={(e) => setDataAula(e.target.value)}
                                    />
                                </div>
                                
                                <div className="col-md-6 mb-3">
                                    <label className="form-label fw-bold">Selecionar Turma</label>
                                    <select 
                                    className="form-select"
                                    value={turmaSelecionada}
                                    onChange={(e) => {
                                        setTurmaSelecionada(e.target.value);
                                        setPresencas({});
                                    }}
                                    >
                                    <option value="">Escolha uma turma...</option>
                                    {turmas.map(turma => (
                                        <option key={turma.id} value={turma.id}>
                                            {turma.nome}
                                        </option>
                                    ))}
                                    </select>
                                </div>
                                </div>

                                {turmaSelecionada && (
                                <div className="mt-3">
                                    <div className="d-flex gap-2 mb-3">
                                    <button 
                                        className="btn btn-success btn-sm"
                                        onClick={marcarTodosPresentes}>
                                        <i className="bi bi-check-all me-1"></i>
                                        Marcar Todos Presentes
                                    </button>
                                    <button 
                                        className="btn btn-danger btn-sm"
                                        onClick={marcarTodosAusentes}>
                                        <i className="bi bi-x-circle me-1"></i>
                                        Marcar Todos Ausentes
                                    </button>
                                    </div>

                                    {/* Estatísticas */}
                                    <div className="row text-center">
                                    <div className="col-4">
                                        <div className="bg-light rounded p-2">
                                        <h6 className="mb-1 text-muted">Total</h6>
                                        <h4 className="mb-0" style={{ color: '#2c5aa0' }}>{stats.total}</h4>
                                        </div>
                                    </div>
                                    <div className="col-4">
                                        <div className="bg-success bg-opacity-10 rounded p-2">
                                        <h6 className="mb-1 text-success">Presentes</h6>
                                        <h4 className="mb-0 text-success">{stats.presentes}</h4>
                                        </div>
                                    </div>
                                    <div className="col-4">
                                        <div className="bg-danger bg-opacity-10 rounded p-2">
                                        <h6 className="mb-1 text-danger">Ausentes</h6>
                                        <h4 className="mb-0 text-danger">{stats.ausentes}</h4>
                                        </div>
                                    </div>
                                    </div>
                                </div>
                                )}
                            </div>
                            </div>
                        </div>
                        </div>

                        {/* Lista de Alunos */}
                        {turmaSelecionada && alunos.length > 0 && (
                        <div className="row">
                            <div className="col-12">
                            <div className="card shadow-sm border-0">
                                <div className="card-body">
                                <h5 className="card-title mb-4" style={{ color: '#2c5aa0' }}>
                                    <i className="bi bi-people-fill me-2"></i>
                                    Lista de Presença Turma - {turmas.find(t => t.id === parseInt(turmaSelecionada))?.nome}
                                </h5>

                                <div className="row">
                                    {alunos.map(aluno => (
                                    <div key={aluno.id} className="col-md-6 mb-3">
                                        <div className={`card h-100 ${
                                        presencas[aluno.id] === 'presente' ? 'border-success bg-success bg-opacity-10' :
                                        presencas[aluno.id] === 'ausente' ? 'border-danger bg-danger bg-opacity-10' :
                                        'border-light'
                                        }`}>
                                        <div className="card-body">
                                            <div className="d-flex justify-content-between align-items-start mb-3">
                                            <div>
                                                <h6 className="card-title mb-1 fw-bold">{aluno.nome}</h6>
                                                <p className="text-muted mb-0">
                                                {aluno.instrumento}
                                                </p>
                                            </div>
                                            {presencas[aluno.id] && (
                                                <span className={`badge ${
                                                presencas[aluno.id] === 'presente' ? 'bg-success' : 'bg-danger'
                                                }`}>
                                                <i className={`fas ${
                                                    presencas[aluno.id] === 'presente' ? 'bi bi-check-all' : 'bi bi-x-circle'
                                                } me-1`}></i>
                                                {presencas[aluno.id] === 'presente' ? 'Presente' : 'Ausente'}
                                                </span>
                                            )}
                                            </div>

                                            <div className="d-grid gap-2 d-md-flex">
                                            <button 
                                                className={`btn flex-fill ${
                                                presencas[aluno.id] === 'presente' ? 'btn-success' : 'btn-outline-success'
                                                }`}
                                                onClick={() => marcarPresenca(aluno.id, 'presente')}>
                                                <i className="bi bi-check-all me-1"></i>
                                                Presente
                                            </button>
                                            <button 
                                                className={`btn flex-fill ${
                                                presencas[aluno.id] === 'ausente' ? 'btn-danger' : 'btn-outline-danger'
                                                }`}
                                                onClick={() => marcarPresenca(aluno.id, 'ausente')}>
                                                <i className="bi bi-x-circle me-1"></i>
                                                Ausente
                                            </button>
                                            </div>
                                        </div>
                                        </div>
                                    </div>
                                    ))}
                                </div>

                                {/* Botão Salvar */}
                                <div className="text-center mt-4">
                                    <button 
                                    className="btn btn-lg px-5"
                                    style={{ backgroundColor: '#2c5aa0', color: 'white', border: 'none' }}
                                    onClick = {salvarChamada}>
                                        <i className="fas fa-save me-2"></i>
                                        Salvar Chamada
                                    </button>
                                </div>
                                </div>
                            </div>
                            </div>
                        </div>
                        )}

                        {/* Mensagem quando nenhuma turma está selecionada */}
                        {!turmaSelecionada && (
                        <div className="row">
                            <div className="col-12">
                            <div className="text-center py-5">
                                <i className="fas fa-users-slash fa-3x text-muted mb-3"></i>
                                <h4 className="text-muted">Selecione uma turma para começar</h4>
                                <p className="text-muted">Escolha a turma acima para visualizar a lista de alunos e fazer a chamada.</p>
                            </div>
                            </div>
                        </div>
                        )}
                    </div>
                </div>
            </>
}


export default Chamada;