import "./aluno.css";
import Navbar from "../../components/navbar/navbar";
import { useEffect, useState } from "react";
import { api, HandleErros } from "../../constants/api";
import Select from "react-select";
import { ToastContainer, toast } from 'react-toastify';
import logo from "../../assets/nao_encontrado.png";

import { formatarDataParaInput } from "../../constants/functions.jsx";

function Aluno(){
    const [textToast, setTextToast] = useState("");

    // const notify = (message) => toast.success(message,{
    //                                 position: "top-right",
    //                                 autoClose: 3000,
    //                                 });
                                    
    
    const [alunos, setAlunos] = useState([]);
    const [instrumentos, setInstrumentos] = useState([]);
    const [turmas, setTurmas] = useState([]);
    const [turma, setTurma] = useState("");    
    const [instrumentoSelect, setInstrumentoSelect] = useState([]);    
    
    const [novo, setNovo] = useState(true);

    /* CamposCadastro */    
    const [id_aluno, setIdAluno] = useState(0);
    const [nome, setNomeAluno] = useState("");
    const [id_instrumento, setIdInstrumento] = useState("");
    const [nascimento, setNascimento] = useState("");
    const [nome_responsavel, setNomeResp] = useState("");
    const [rg_responsavel, setRGResp] = useState("");
    const [cpf_responsavel, setCPF] = useState("");
    const [grau_parentesco, setGrauParent] = useState("");
    const [endereco_responsavel, setEndResp] = useState("");
    const [situacao, setSituacao] = useState("Ativo");
    const [id_turma, setIdTurma] = useState("");
    const [turma_cadastro, setTurmaCad] = useState("");


    function CloseModal(idModal){
        const modalElement = document.getElementById(idModal);
        const modalInstance = window.bootstrap.Modal.getInstance(modalElement) || new window.bootstrap.Modal(modalElement);
        modalInstance.hide();
    }

    function OpenModal(idModal){
        const modalElement = document.getElementById(idModal);
        const modalInstance = window.bootstrap.Modal.getInstance(modalElement) || new window.bootstrap.Modal(modalElement);
        modalInstance.show();
    }

    function limpaCampos(){
        setIdAluno(0);
        setNomeAluno("");
        setIdInstrumento("");
        setNascimento("");
        setNomeResp("");
        setRGResp("");
        setCPF("");
        setGrauParent("");
        setEndResp("");
        setSituacao("Ativo");
        setTurmaCad("");
        setInstrumentoSelect("");
    }

    async function listarAlunos(){
        await api.post("/alunos", {
            turma: turma
        }).then((response) => {
            setAlunos(response.data);

            // setAlunos({
            //     ...response.data,
            //     nascimento: formatarDataParaInput(response.data.nascimento)
            // });
        }).catch((err) => {
            console.log(HandleErros(err));
        })
    }

    async function listarInstrumentos(){
        await api.post("/instrumentos").then((response) => {
            setInstrumentos(response.data);
        }).catch((err) => {
            console.log(HandleErros(err));
        })
    }

    async function listarTurmas(){        
        await api.post("/turmas").then((response) => {
            setTurmas(response.data);
            setTurma(response.data[0].label);
            listarAlunos;
        }).catch((err) => {
            console.log(HandleErros(err));
        })
    }

    async function salvarAluno(){   
        setTextToast("");        
        if (novo) {
            await api.post("/alunos/registro", {                
                nome: nome,
                turma: turma_cadastro,
                id_instrumento: id_instrumento,
                nascimento: nascimento,
                nome_responsavel: nome_responsavel,
                rg_responsavel: rg_responsavel,
                cpf_responsavel: cpf_responsavel,
                grau_parentesco: grau_parentesco,
                endereco_responsavel: endereco_responsavel,
                situacao: situacao,
                id_turma: id_turma
            }).then((response) => {
                if (response.data.id) {
                    CloseModal('adicionarAluno');
                    listarAlunos();
                    setTextToast("Aluno Cadastrado com Sucesso!");
                    // notify(textToast);
                }
            }).catch((err) => {
                console.log(HandleErros(err));
            });
        }else{
            await api.put("/alunos/registro",{
                id: id_aluno,
                nome: nome,
                turma: turma_cadastro,
                id_instrumento: id_instrumento,
                nascimento: nascimento,
                nome_responsavel: nome_responsavel,
                rg_responsavel: rg_responsavel,
                cpf_responsavel: cpf_responsavel,
                grau_parentesco: grau_parentesco,
                endereco_responsavel: endereco_responsavel,
                situacao: situacao,
                id_turma: id_turma

            }).then((response) => {
                if (response.data.id) {
                    CloseModal('adicionarAluno');
                    listarAlunos();
                    setTextToast("Aluno Alterado com Sucesso!");
                    // notify(textToast);
                }
            }).catch((err) => {
                console.log(HandleErros(err));
            });
        }
    }

    function handleChangeTurma(e){
        setTurma(e.label);
        setIdTurma(e.value);

        console.log(e);
    }

    const handleChangeInstrumento = (e) => {
        setIdInstrumento(e.value);
        setInstrumentoSelect(e);
    }

    function abrirCadastro(novo, aluno){
        limpaCampos();
        setNovo(novo);
        setTurmaCad(turma);

        if (!novo){
            setIdAluno(aluno.id);
            setNomeAluno(aluno.nome);
            
            setIdInstrumento(aluno.id_instrumento);
            
            const valorPadrao = instrumentos.find(fam => fam.value === Number(aluno.id_instrumento));
            setInstrumentoSelect(valorPadrao);

            setNascimento(formatarDataParaInput(aluno.nascimento));
            setNomeResp(aluno.nome_responsavel);
            setRGResp(aluno.rg_responsavel);
            setCPF(aluno.cpf_responsavel);
            setGrauParent(aluno.grau_parentesco);
            setEndResp(aluno.endereco_responsavel);
            setSituacao("Ativo");
            setTurmaCad(aluno.turma);
            setIdTurma(aluno.id_turma);
        }        
        
        OpenModal('adicionarAluno');        
    }

    useEffect(() => {
        listarTurmas();
        listarInstrumentos();
    }, []);

    useEffect(() => {
        listarAlunos(turma);
    }, [turma]);

    useEffect(() => {
        const notify = () => toast.success(textToast, {
            position: "top-right",
            autoClose: 3000,
        });
        textToast != '' ? notify() : null;
    
    // Salvar a função no estado ou ref se necessário
    }, [textToast]);

    return <>
                <Navbar />
                <div className="container-fluid m-container">
                    <div className="row">
                        <div className="col-md-3">
                            <h3>Cadastro de Alunos</h3>                        
                        </div>

                        <div className="col-md-9 d-flex justify-content-end align-items-center gap-3">
                            <div className="border p-3 rounded-5">
                                <input className="form-control border-0 w-auto shadow-none" type="text" name="busca" id="busca" placeholder="Busca por Nome..." />
                            </div>

                            <div className="border p-3 rounded-5 d-flex align-items-center">
                                {
                                    turmas.length > 0 && turma && (<Select options={turmas}
                                                                           defaultValue={turmas[0]}
                                                                           isSearchable={false}
                                                                           onChange={(e) => handleChangeTurma(e)} />)
                                }                                
                            </div>

                            <button type="button" className="btn btn-purple" onClick={() => abrirCadastro(true)} >Adicionar Aluno</button>
                        </div>
                    </div>

                    <div>
                        {
                            alunos.length === 0 ? (
                                <div className="d-flex flex-column justify-content-center align-items-center py-5" style={{ minHeight: '400px' }}>
                                    <div className="text-center">
                                    <div className="p-4 d-inline-block mb-4">
                                        <img src={logo} alt="Logotipo GBandas" className="img-login" />
                                    </div>
                                    <h4 className="text-dark mb-3 fw-bold">Nenhum registro encontrado!</h4>
                                        <p className="text-muted mb-4 lead">
                                            Não existem registros para exibir no momento.<br/>
                                            Comece clicando em "Adicionar Aluno".
                                        </p>
                                    </div>
                                </div>
                            ):( <div className="row p-3">
                                <table className="table table-hover">
                                    <thead>
                                        <tr>
                                            <th scope="col">Código</th>
                                            <th scope="col">Nome</th>
                                            <th scope="col">Instrumento</th>
                                            <th scope="col">Turma</th>
                                            <th scope="col"></th>
                                        </tr>
                                    </thead>                        
                                    <tbody>
                                            {
                                                alunos.map((aluno) => {
                                                    return <tr key={aluno.id}>
                                                            <td>{aluno.id}</td>
                                                            <td>{aluno.nome}</td>
                                                            <td>{aluno.instrumento}</td>
                                                            <td>{aluno.turma}</td>
                                                            <td className="text-end">
                                                                <button className="btn btn-sm btn-purple" onClick={() => abrirCadastro(false, aluno)}><i className="bi bi-pencil-square"></i></button>
                                                                <button className="btn btn-sm btn-danger ms-3"><i className="bi bi-trash3"></i></button>
                                                            </td>
                                                        </tr>   
                                                })
                                            }
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                    
                </div>

                {/* <!-- Modal --> */}
                <div className="modal fade" id="adicionarAluno" tabIndex="-1" aria-labelledby="adicionarAluno" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">Novo Aluno</h1>
                            <button type="button" className="btn-close btn-close-color" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="mb-3 d-flex gap-2">
                                <div className="form-floating">
                                    <input className="form-control border-1 w-auto shadow-none" type="text" name="nome" id="nome" placeholder="Nome" onChange={(e) => setNomeAluno(e.target.value)} value={nome} />
                                    <label htmlFor="floatingInput">Nome Aluno</label>
                                </div>

                                <div className="form-floating">
                                    <input className="form-control border-1 w-2 shadow-none" type="text" name="turma" id="turma" placeholder="Turma" disabled value={turma_cadastro} />
                                    <label htmlFor="floatingInput">Turma</label>
                                </div>
                            </div>

                            <div className="mb-3">
                                <div className="form-floating">
                                    <input className="form-control border-1 shadow-none" type="date" name="nascimento" id="nascimento" placeholder="Nascimento" onChange={(e) => setNascimento(e.target.value)} value={nascimento || ""} />  
                                    <label htmlFor="floatingInput">Nascimento</label>
                                </div>
                            </div>

                            <div className="mb-3 d-flex gap-2">
                                <div className="form-floating mb-3">
                                    <input className="form-control border-1 w-auto shadow-none" type="text" name="responsavel" id="responsavel" placeholder="Nome Responsável" onChange={(e) => setNomeResp(e.target.value)} value={nome_responsavel} />  
                                    <label htmlFor="floatingInput">Responsável</label>
                                </div>

                                <div className="form-floating mb-3">
                                    <input className="form-control border-1 w-2 shadow-none" type="text" name="cpfResp" id="cpfResp" placeholder="CPF" onChange={(e) => setCPF(e.target.value)} value={cpf_responsavel} />
                                    <label htmlFor="floatingInput">CPF Resp.</label>
                                </div>
                            </div>

                            <div className="mb-3">
                                <div className="form-floating">
                                    {    
                                        instrumentos.length > 0 && <Select options={instrumentos} defaultValue={instrumentos[0]} value={instrumentoSelect} onChange={handleChangeInstrumento} />
                                    }
                                    
                                </div>                                
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                            <button type="button" className="btn btn-purple" onClick={salvarAluno}>Salvar</button>
                        </div>
                        </div>
                    </div>
                </div>
                <ToastContainer />
            </>
}


export default Aluno;

    {/* <input 
    type="text" 
    value={aluno.nome} 
    onChange={(e) => setAluno({...aluno, nome: e.target.value})}
    placeholder="Nome"
/>

<input 
    type="date" 
    value={aluno.nascimento} 
    onChange={(e) => setAluno({...aluno, nascimento: e.target.value})}
/> */}