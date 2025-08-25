import "./instrumento.css";
import Navbar from "../../components/navbar/navbar";
import { useEffect, useState } from "react";
import { api, HandleErros } from "../../constants/api";
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";
import { OpenModal, CloseModal } from "../../constants/functions";

function Instrumento(){
    const [textToast, setTextToast] = useState("Instrumento Cadastrado com Sucesso!");

    const [instrumentos, setInstrumentos] = useState([]);
    const [novo, setNovo] = useState(true);
    const [isActive, setIsActive] = useState(true);
    const [filter, setFilter] = useState("all");
    const [familia, setFamilia] = useState("");

    //dados Instrumento
    const [idInstrumento, setIdInstrumento] = useState(0);
    const [descricao, setDescricao] = useState("");
    const [marca, setMarca] = useState("");
    const [modelo, setModelo] = useState("");
    const [numSerie, setNumSerie] = useState("");
    const [acessorios, setAcessorios] = useState("");
    const [familiaSelect, setFamiliaSelect] = useState("");
    const [cnpjEmpresa, setCnpjEmpresa] = useState("21.180.666/0001-49");
    const [situacao, setSituacao] = useState("Ativo");


    // function CloseModal(idModal){
    //     const modalElement = document.getElementById(idModal);
    //     const modalInstance = window.bootstrap.Modal.getInstance(modalElement) || new window.bootstrap.Modal(modalElement);
    //     modalInstance.hide();
    // }

    // function OpenModal(idModal){
    //     const modalElement = document.getElementById(idModal);
    //     const modalInstance = window.bootstrap.Modal.getInstance(modalElement) || new window.bootstrap.Modal(modalElement);
    //     modalInstance.show();
    // }

    
    const [familias, setFamilias] = useState([
                                                {
                                                    "value": 1,
                                                    "label": "METAIS"
                                                },
                                                {
                                                    "value": 2,
                                                    "label": "MADEIRAS"
                                                },
                                                {
                                                    "value": 3,
                                                    "label": "CORDAS"
                                                },
                                                {
                                                    "value": 4,
                                                    "label": "PERCUSSAO"
                                                }
                                            ]);
                                            
    function limpaCampos(){
        setIdInstrumento(0);
        setDescricao("");
        setMarca("");
        setModelo("");
        setNumSerie("");
        setAcessorios("");
        setFamilia(familias[0].label);
        setCnpjEmpresa("21.180.666/0001-49");
        setSituacao("Ativo");
        setIsActive(true);
    }

    const getFilteredInstruments = () => {
        switch(filter) {
            case 'ativos':
            return instrumentos.filter(instrument => instrument.situacao === 'Ativo');
            case 'inativos':
            return instrumentos.filter(instrument => instrument.situacao === 'Inativo');
            default:
            return instrumentos;
        }
    };
    const filteredInstruments = getFilteredInstruments();

    async function salvarInstrumento(){                     
        if (novo) {
            setTextToast("Instrumento Cadastrado com Sucesso!");
            await api.post("/instrumentos/registro", {                
                descricao,
                marca,
                modelo,
                numero_serie: numSerie,
                acessorios,
                familia,
                cnpj_empresa : cnpjEmpresa,
                situacao,
            }).then((response) => {
                if (response.data.id) {
                    CloseModal('adicionarInstrumento');
                    listarInstrumentos();
                    notify();
                }
            }).catch((err) => {
                console.log(HandleErros(err));
            });
        }else{
            setTextToast("Instrumento Alterado com Sucesso!");
            await api.put("/instrumentos/registro",{     
                id : idInstrumento,           
                descricao,
                marca,
                modelo,
                numero_serie: numSerie,
                acessorios,
                familia,
                cnpj_empresa : cnpjEmpresa,
                situacao,
            }).then((response) => {
                console.log(response.data);
                if (response.data.id) {
                    CloseModal('adicionarInstrumento');
                    listarInstrumentos();
                    notify();
                }
            }).catch((err) => {
                console.log(HandleErros(err));
            });
        }
    }

    const notify = () => toast.success(textToast,{
                                           position: "top-right",
                                           autoClose: 3000,
                                           style:{
                                            width: "100%"
                                           }
                                           });

    function handleChangeFamilia(e){
        setFamilia(e.label);
    }

    async function listarInstrumentos(){
        await api.post("/instrumentos/geral",).then((response) => {
            setInstrumentos(response.data);
        }).catch((err) => {
            console.log(HandleErros(err));
        })
    }

    function abrirCadastro(novo, instrumento){
        limpaCampos();
        setNovo(novo);
          
        if (!novo){
            setIdInstrumento(instrumento.id);
            setDescricao(instrumento.descricao || "");
            setMarca(instrumento.marca || "");
            setModelo(instrumento.modelo || "");
            setNumSerie(instrumento.numero_serie || "");
            setAcessorios(instrumento.acessorios || "");            
            setFamilia(instrumento.familia || "");
            
            const valorPadrao = familias.find(fam => fam.label === instrumento.familia);
            setFamiliaSelect(valorPadrao);

            setCnpjEmpresa(instrumento.cnpjEmpresa || "");
            setSituacao(instrumento.situacao);
            setIsActive(instrumento.situacao == 'Ativo' ? true : false);
        }

        OpenModal('adicionarInstrumento');  
    }

    const toggleInstrument = () => {
        setIsActive(!isActive);

        !isActive ? setSituacao("Ativo") : setSituacao("Inativo");
    };

    useEffect(() => {
        listarInstrumentos();
    }, []);

    return <>
                <Navbar />
                <div className="container-fluid m-container">
                    <div className="row">
                        <div className="col-md-3">
                            <h3>Cadastro de Instrumentos</h3>                        
                        </div>

                        <div className="col-md-9 d-flex justify-content-end align-items-center gap-4">
                            {/* <div className="border p-3 rounded-5 d-flex align-items-center">
                                <button type="button" className="btn btn-light rounded-circle"><i className="bi bi-arrow-left-circle"></i></button>
                                <span className="px-4">2022</span>
                                <button type="button" className="btn btn-light rounded-circle"><i className="bi bi-arrow-right-circle"></i></button>
                            </div> */}
                            <div>
                                <h5 className="card-title">Filtros</h5>
                                <div className="btn-group" role="group" aria-label="Filtros de instrumento">
                                    <input type="radio" 
                                    className="btn-check" 
                                    name="filter" 
                                    id="filter-all" 
                                    checked={filter === 'all'} 
                                    onChange={() => setFilter('all')}/>
                                    <label className="btn btn-outline-primary" htmlFor="filter-all">
                                    Todos ({instrumentos.length})
                                    </label>

                                    <input type="radio" 
                                    className="btn-check" 
                                    name="filter" 
                                    id="filter-active" 
                                    checked={filter === 'ativos'} 
                                    onChange={() => setFilter('ativos')} />
                                    <label className="btn btn-outline-success" htmlFor="filter-active">
                                        Ativos ({instrumentos.filter(i => i.situacao == 'Ativo').length})
                                    </label>

                                    <input type="radio" 
                                    className="btn-check" 
                                    name="filter" 
                                    id="filter-inactive" 
                                    checked={filter === 'inativos'} 
                                    onChange={() => setFilter('inativos')} />
                                    <label className="btn btn-outline-danger" htmlFor="filter-inactive">
                                    Inativos ({instrumentos.filter(i => i.situacao == 'Inativo').length})
                                    </label>
                                </div>
                            </div>

                            <div className="border w-200 p-3 rounded-5">
                                <input className="form-control border-0 shadow-none" type="text" name="busca" id="busca" placeholder="Busca por Nome..." />
                            </div>
                                

                            <button type="button" className="btn btn-purple" onClick={() => abrirCadastro(true)}>Adicionar Instrumento</button>
                        </div>
                    </div>

                    <div className="row p-3">
                        <table className="table table-hover">
                            <thead>
                                <tr>
                                    <th scope="col">Código</th>
                                    <th scope="col">Nome</th>
                                    <th scope="col">Familia</th>
                                    <th scope="col">Nº Série</th>
                                    <th scope="col"></th>
                                </tr>
                            </thead>                        
                            <tbody>
                                    {
                                        filteredInstruments.map((instrumento) => {
                                            return <tr key={instrumento.id} className={
                                                                                        instrumento.situacao != "Ativo" 
                                                                                            ? 'table-danger' : null  // Linha vermelha para inativos
                                                                                        }>
                                                    <td>{instrumento.id}</td>
                                                    <td>{instrumento.descricao}</td>
                                                    <td>{instrumento.familia}</td>
                                                    <td>{instrumento.numero_serie}</td>
                                                    <td className="text-end">
                                                        <button className="btn btn-sm btn-purple" onClick={() => abrirCadastro(false, instrumento)}><i className="bi bi-pencil-square"></i></button>
                                                        <button className="btn btn-sm btn-danger ms-3"><i className="bi bi-trash3"></i></button>
                                                    </td>
                                                </tr>   
                                        })
                                    }
                            </tbody>
                        </table>
                    </div>
                    
                </div>

                {/* <!-- Modal --> */}
                <div className="modal fade" id="adicionarInstrumento" tabIndex="-1" aria-labelledby="adicionarInstrumento" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="exampleModalLabel">Novo Instrumento</h1>
                                <button type="button" className="btn-close btn-close-color" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3 gap-2 d-flex">
                                    <div className="form-floating">
                                        <input className="form-control form-control-lg border-1 shadow-none" type="text" name="instrumento" id="instrumento" placeholder="Instrumento" onChange={(e) => setDescricao(e.target.value)} value={descricao} />
                                        <label htmlFor="floatingInput">Instrumento</label>
                                    </div>        

                                    <div className="form-check form-switch">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            role="switch"
                                            id="instrumentSwitch"
                                            checked={isActive}
                                            onChange={toggleInstrument}
                                        />
                                        <label className="form-check-label" htmlFor="instrumentSwitch">
                                            {isActive ? 'Ativo' : 'Inativo'}
                                        </label> 
                                    </div>                       
                                </div>

                                <div className="mb-3 d-flex gap-2">
                                    <div className="form-floating mb-3">
                                        <input className="form-control border-1 shadow-none" type="text" name="marca" id="marca" placeholder="Marca" onChange={(e) => setMarca(e.target.value)} value={marca} />  
                                        <label htmlFor="floatingInput">Marca</label>
                                    </div>

                                    <div className="form-floating mb-3">
                                        <input className="form-control border-1 shadow-none" type="text" name="modelo" id="modelo" placeholder="Modelo" onChange={(e) => setModelo(e.target.value)} value={modelo} />
                                        <label htmlFor="floatingInput">Modelo</label>
                                    </div>
                                </div>

                                <div className="mb-3 d-flex gap-2">
                                    <div className="form-floating mb-3">
                                        <input className="form-control border-1 shadow-none" type="text" name="numero_serie" id="numero_serie" placeholder="Nº Série" onChange={(e) => setNumSerie(e.target.value)} value={numSerie} />  
                                        <label htmlFor="floatingInput">Nº Série</label>
                                    </div> 

                                    <div className="form-floating w-50">
                                        {
                                            familias.length > 0 && <Select options={familias} defaultValue={familias[0]} value={familiaSelect} onChange={(e) => handleChangeFamilia(e)} />
                                        }                                    
                                    </div>
                                </div>

                                <div className="mb-3 d-flex gap-2">
                                    <div className="form-floating">
                                        <textarea className="form-control" placeholder="Leave a comment here" id="floatingTextarea2" value={acessorios} onChange={(e) => setAcessorios(e.target.value)}  />
                                        <label htmlFor="floatingTextarea2">Acessórios</label>
                                    </div>
                                </div>

                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                                <button type="button" className="btn btn-purple" onClick={salvarInstrumento}>Salvar</button>
                            </div>
                        </div>
                    </div>
                </div>
                <ToastContainer />
            </>
}


export default Instrumento;