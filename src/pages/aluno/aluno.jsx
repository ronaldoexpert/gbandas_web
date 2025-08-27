import "./aluno.css";
import Navbar from "../../components/navbar/navbar";
import { useEffect, useState, useCallback } from "react";
import { api, HandleErros } from "../../constants/api";
import Select from "react-select";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Garanta que o CSS do toast seja importado
import logo from "../../assets/nao_encontrado.png";
import { formatarDataParaInput } from "../../constants/functions.jsx";

// Componente para a mensagem de "Nenhum aluno encontrado"
const EmptyState = () => (
    <div className="d-flex flex-column justify-content-center align-items-center py-5 text-center" style={{ minHeight: '400px' }}>
        <img src={logo} alt="Nenhum registro encontrado" className="img-login mb-4" style={{ width: '120px' }} />
        <h4 className="text-dark mb-3 fw-bold">Nenhum aluno encontrado!</h4>
        <p className="text-muted mb-4 lead">
            Não existem alunos para a turma selecionada.<br />
            Comece clicando em "Adicionar Aluno".
        </p>
    </div>
);

function Aluno() {
    // --- ESTADOS ---
    const [alunos, setAlunos] = useState([]);
    const [instrumentos, setInstrumentos] = useState([]);
    const [instrumentoSelect, setinstrumentoSelect] = useState({});
    const [turmas, setTurmas] = useState([]);
    const [turmaSelecionada, setTurmaSelecionada] = useState(null);
    const [busca, setBusca] = useState("");
    const [loading, setLoading] = useState(false);
    const [alunoParaExcluir, setAlunoParaExcluir] = useState(null);
    const [excluindoAluno, setExcluindoAluno] = useState(false);

    const [isNovo, setIsNovo] = useState(true);
    const [formData, setFormData] = useState({
        id: 0,
        nome: "",
        id_instrumento: "",
        nascimento: "",
        nome_responsavel: "",
        rg_responsavel: "",
        cpf_responsavel: "",
        grau_parentesco: "",
        endereco_responsavel: "",
        situacao: "Ativo",
        id_turma: "",
        turma_cadastro: ""
    });

    // --- FUNÇÕES DE NOTIFICAÇÃO ---
    const notifySuccess = useCallback((message) => {
        toast.success(message, {
            position: "top-right",
            autoClose: 3000,
            style:{width: "100%"}
        });
    }, []);

    // --- FUNÇÕES DE MODAL ---
    const getModalInstance = (modalId) => {
        const modalElement = document.getElementById(modalId);
        return window.bootstrap.Modal.getInstance(modalElement) || new window.bootstrap.Modal(modalElement);
    };

    const closeModal = (modalId) => getModalInstance(modalId).hide();
    const openModal = (modalId) => getModalInstance(modalId).show();

    // --- FUNÇÕES DE API ---
    const listarTurmas = useCallback(async () => {
        try {
            const response = await api.post("/turmas");
            setTurmas(response.data);
            if (response.data.length > 0) {
                setTurmaSelecionada(response.data[0]);
            }
        } catch (err) {
            console.error(HandleErros(err));
        }
    }, []);

    const listarInstrumentos = useCallback(async () => {
        try {
            const response = await api.post("/instrumentos");
            setInstrumentos(response.data);
        } catch (err) {
            console.error(HandleErros(err));
        }
    }, []);

    const listarAlunos = useCallback(async () => {
        if (!turmaSelecionada) return;
        setLoading(true);
        try {
            const response = await api.post("/alunos", { turma: turmaSelecionada.label });
            setAlunos(response.data);
        } catch (err) {
            console.error(HandleErros(err));
        } finally {
            setLoading(false);
        }
    }, [turmaSelecionada]);

    // Excluir aluno
    const confirmarExclusao = useCallback((aluno) => {
        setAlunoParaExcluir(aluno);
        const modalElement = document.getElementById('confirmarExclusao');
        const modalInstance = new window.bootstrap.Modal(modalElement);
        modalInstance.show();
    }, []);

    const excluirAluno = useCallback(async () => {
        if (!alunoParaExcluir) return;      

         await api.delete(`/alunos/registro/${alunoParaExcluir.id}`, {}).then((response) => {
            if (response.status === 200 || response.status === 204) {
                closeModal('confirmarExclusao');
                listarAlunos();
                notifySuccess(`Aluno "${alunoParaExcluir.nome}" foi excluído com sucesso!`);
                setAlunoParaExcluir(null);
            }
        }).catch((err) => {
            console.error(HandleErros(err));
            toast.error("Erro ao excluir aluno. Tente novamente.");
        });

    }, [alunoParaExcluir, listarAlunos]);

    // --- EFEITOS (useEffect) ---
    useEffect(() => {
        listarTurmas();
        listarInstrumentos();
    }, [listarTurmas, listarInstrumentos]);

    useEffect(() => {
        listarAlunos();
    }, [listarAlunos]);

    // --- MANIPULADORES DE EVENTOS ---
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleInstrumentoChange = (selectedOption) => {
        setFormData(prev => ({
            ...prev,
            id_instrumento: selectedOption.value
        }));

        setinstrumentoSelect(selectedOption)
    };

    const limpaCampos = () => {
        setFormData({
            id: 0,
            nome: "",
            id_instrumento: "",
            nascimento: "",
            nome_responsavel: "",
            rg_responsavel: "",
            cpf_responsavel: "",
            grau_parentesco: "",
            endereco_responsavel: "",
            situacao: "Ativo",
            id_turma: turmaSelecionada?.value || "",
            turma_cadastro: turmaSelecionada?.label || ""
        });
    };
    
    const abrirCadastro = (novo, aluno = null) => {
        setIsNovo(novo);
        limpaCampos();
        if (novo) {

        } else if (aluno) {
            const instrumentoAtual = instrumentos.find(i => i.value === Number(aluno.id_instrumento));
            setinstrumentoSelect(instrumentoAtual);

            setFormData({
                id: aluno.id,
                nome: aluno.nome || "",
                id_instrumento: aluno.id_instrumento || "",
                nascimento: formatarDataParaInput(aluno.nascimento) || "",
                nome_responsavel: aluno.nome_responsavel || "",
                rg_responsavel: aluno.rg_responsavel || "",
                cpf_responsavel: aluno.cpf_responsavel || "",
                grau_parentesco: aluno.grau_parentesco || "",
                endereco_responsavel: aluno.endereco_responsavel || "",
                situacao: aluno.situacao || "Ativo",
                id_turma: aluno.id_turma  || "",
                turma_cadastro: aluno.turma  || ""
            });
        }
        openModal('adicionarAluno');
    };

    // Função para sanitizar os dados antes do envio
    const sanitizeFormData = useCallback((data) => {
        const sanitized = {};
        
        Object.keys(data).forEach(key => {
            const value = data[key];
            // Converte undefined para null ou string vazia conforme apropriado
            if (value === undefined || value === '') {
                sanitized[key] = null;
            } else if (typeof value === 'string') {
                sanitized[key] = value.trim();
            } else {
                sanitized[key] = value;
            }
        });
        
        return sanitized;
    }, []);

    const salvarAluno = async () => {
        setLoading(true);
        const endpoint = "/alunos/registro";        
        const sanitizedData = sanitizeFormData(formData);

        if (isNovo){
            await api.post(endpoint, {   
                    nome: sanitizedData.nome || null,
                    turma: sanitizedData.turma_cadastro || turmaSelecionada,
                    id_instrumento: sanitizedData.id_instrumento || null,
                    nascimento: sanitizedData.nascimento || null,
                    nome_responsavel: sanitizedData.nome_responsavel || null,
                    rg_responsavel: sanitizedData.rg_responsavel || null,
                    cpf_responsavel: sanitizedData.cpf_responsavel || null,
                    grau_parentesco: sanitizedData.grau_parentesco || null,
                    endereco_responsavel: sanitizedData.endereco_responsavel || null,
                    situacao: sanitizedData.situacao || "Ativo",
                    id_turma: sanitizedData.id_turma || null
            }).then((response) => {
                if (response.data.id) {
                    closeModal('adicionarAluno');
                    listarAlunos();
                    notifySuccess(`Aluno ${isNovo ? 'Cadastrado' : 'Alterado'} com Sucesso!`);
                }
            }).catch((err) => {
                console.log(HandleErros(err));
            });
        }else{
            await api.put(endpoint, {                
                    id: sanitizedData.id,
                    nome: sanitizedData.nome || null,
                    turma: sanitizedData.turma_cadastro || turmaSelecionada,
                    id_instrumento: sanitizedData.id_instrumento || null,
                    nascimento: sanitizedData.nascimento || null,
                    nome_responsavel: sanitizedData.nome_responsavel || null,
                    rg_responsavel: sanitizedData.rg_responsavel || null,
                    cpf_responsavel: sanitizedData.cpf_responsavel || null,
                    grau_parentesco: sanitizedData.grau_parentesco || null,
                    endereco_responsavel: sanitizedData.endereco_responsavel || null,
                    situacao: sanitizedData.situacao || "Ativo",
                    id_turma: sanitizedData.id_turma || null
            }).then((response) => {
                if (response.data.id) {
                    closeModal('adicionarAluno');
                    listarAlunos();
                    notifySuccess(`Aluno ${isNovo ? 'Cadastrado' : 'Alterado'} com Sucesso!`);
                }
            }).catch((err) => {
                console.log(HandleErros(err));
            });               
        }
    };

    const alunosFiltrados = alunos.filter(aluno =>
        aluno.nome.toLowerCase().includes(busca.toLowerCase())
    );

    return <>
        <Navbar />
        <div className="container-fluid m-container">
            <div className="row mb-4 align-items-center">
                <div className="col-md-4">
                    <h3>Cadastro de Alunos</h3>
                </div>
                <div className="col-md-8 d-flex justify-content-end align-items-center gap-3">
                    <div className="input-group" style={{ maxWidth: '300px' }}>
                        <span className="input-group-text bg-white border-end-0"><i className="bi bi-search"></i></span>
                        <input
                            className="form-control border-start-0 shadow-none"
                            type="text"
                            placeholder="Busca por Nome..."
                            value={busca}
                            onChange={(e) => setBusca(e.target.value)}
                        />
                    </div>
                    {turmas.length > 0 && turmaSelecionada && (
                        <Select
                            options={turmas}
                            value={turmaSelecionada}
                            isSearchable={false}
                            onChange={(e) => setTurmaSelecionada(e)}
                            styles={{ container: (base) => ({ ...base, width: '200px' }) }}
                        />
                    )}
                    <button type="button" className="btn btn-purple" onClick={() => abrirCadastro(true)}>
                        <i className="bi bi-plus-lg me-2"></i>Adicionar Aluno
                    </button>
                </div>
            </div>

            {loading && alunos.length === 0 ? (
                <div className="text-center p-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Carregando...</span>
                    </div>
                </div>
            ) : alunosFiltrados.length === 0 ? (
                <EmptyState />
            ) : (
                <div className="table-responsive">
                    <table className="table table-hover align-middle">
                        <thead>
                            <tr>
                                <th scope="col">Código</th>
                                <th scope="col">Nome</th>
                                <th scope="col">Instrumento</th>
                                <th scope="col">Turma</th>
                                <th scope="col" className="text-end">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {alunosFiltrados.map((aluno) => (
                                <tr key={aluno.id}>
                                    <td>{aluno.id}</td>
                                    <td>{aluno.nome}</td>
                                    <td>{aluno.instrumento}</td>
                                    <td>{aluno.turma}</td>
                                    <td className="text-end">
                                        <button className="btn btn-sm btn-outline-primary" onClick={() => abrirCadastro(false, aluno)}>
                                            <i className="bi bi-pencil-square"></i>
                                        </button>
                                        <button className="btn btn-sm btn-outline-danger ms-2" onClick={() => confirmarExclusao(aluno)}>
                                            <i className="bi bi-trash3"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>

        {/* Modal */}
        <div className="modal fade" id="adicionarAluno" tabIndex="-1" aria-labelledby="modalLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5" id="modalLabel">{isNovo ? 'Adicionar Aluno' : 'Editar Aluno'}</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <div className="row g-3">
                            <div className="col-md-8">
                                <div className="form-floating">
                                    <input className="form-control shadow-none" type="text" name="nome" id="nome" placeholder="Nome do Aluno" value={formData.nome} onChange={handleInputChange} />
                                    <label htmlFor="nome">Nome do Aluno</label>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="form-floating">
                                    <input className="form-control shadow-none" type="text" name="turma_cadastro" id="turma" placeholder="Turma" disabled readOnly value={formData.turma_cadastro} />
                                    <label htmlFor="turma">Turma</label>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-floating">
                                    <input className="form-control shadow-none" type="date" name="nascimento" id="nascimento" placeholder="Nascimento" value={formData.nascimento} onChange={handleInputChange} />
                                    <label htmlFor="nascimento">Nascimento</label>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <Select
                                    options={instrumentos}
                                    value={instrumentoSelect}
                                    onChange={handleInstrumentoChange}
                                    placeholder="Selecione um Instrumento"
                                    styles={{
                                        control: (base) => ({ ...base, minHeight: '58px' }),
                                    }}
                                />
                            </div>
                            <div className="col-md-8">
                                <div className="form-floating">
                                    <input className="form-control shadow-none" type="text" name="nome_responsavel" id="responsavel" placeholder="Nome do Responsável" value={formData.nome_responsavel} onChange={handleInputChange} />
                                    <label htmlFor="responsavel">Responsável</label>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="form-floating">
                                    <input className="form-control shadow-none" type="text" name="cpf_responsavel" id="cpfResp" placeholder="CPF do Responsável" value={formData.cpf_responsavel} onChange={handleInputChange} />
                                    <label htmlFor="cpfResp">CPF Resp.</label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" className="btn btn-purple" onClick={salvarAluno} disabled={loading}>
                            {loading && <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>}
                            {loading ? 'Salvando...' : 'Salvar'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
        
         {/* Modal de Confirmação de Exclusão */}
            <div className="modal fade" id="confirmarExclusao" tabIndex="-1" aria-labelledby="confirmarExclusaoLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content border-0 shadow">
                        <div className="modal-header bg-danger text-white">
                            <h5 className="modal-title d-flex align-items-center gap-2">
                                <i className="bi bi-exclamation-triangle"></i>
                                Confirmar Exclusão
                            </h5>
                            <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        
                        <div className="modal-body p-4">
                            {alunoParaExcluir && (
                                <div className="text-center">
                                    <div className="mb-3">
                                        <i className="bi bi-person-x display-1 text-danger opacity-50"></i>
                                    </div>
                                    <h6 className="mb-3">
                                        Tem certeza que deseja excluir o aluno?
                                    </h6>
                                    <div className="alert alert-light border">
                                        <div className="d-flex align-items-center gap-3">
                                            <div className="flex-shrink-0">
                                                <span className="badge bg-light text-dark">#{alunoParaExcluir.id}</span>
                                            </div>
                                            <div className="flex-grow-1 text-start">
                                                <div className="fw-semibold">{alunoParaExcluir.nome}</div>
                                                <small className="text-muted">
                                                    {alunoParaExcluir.instrumento} • {alunoParaExcluir.turma}
                                                </small>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-muted small mb-0">
                                        <i className="bi bi-info-circle me-1"></i>
                                        Esta ação não pode ser desfeita.
                                    </p>
                                </div>
                            )}
                        </div>
                        
                        <div className="modal-footer bg-light">
                            <button 
                                type="button" 
                                className="btn btn-secondary" 
                                data-bs-dismiss="modal"
                                disabled={excluindoAluno}
                            >
                                <i className="bi bi-x-circle me-2"></i>
                                Cancelar
                            </button>
                            <button 
                                type="button" 
                                className="btn btn-danger d-flex align-items-center gap-2" 
                                onClick={excluirAluno}
                                disabled={excluindoAluno}
                            >
                                {excluindoAluno ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                        Excluindo...
                                    </>
                                ) : (
                                    <>
                                        <i className="bi bi-trash3"></i>
                                        Confirmar Exclusão
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>    
        <ToastContainer />
    </>;
}

export default Aluno;