import { BrowserRouter, Routes, Route } from "react-router-dom";

import PrivateRoute from "../components/private-route/private-route.jsx";

import Login from "../pages/login/login.jsx";
import Register from "../pages/register/register.jsx";
import Home from "../pages/home/home.jsx";
import Aluno from "../pages/aluno/aluno.jsx";
import Instrumento from "../pages/instrumentos/instrumento.jsx";
import Chamada from "../pages/chamada/chamada.jsx";

function AppRoutes(){
    return  <BrowserRouter>
                <Routes>
                    <Route exact path="/" element={<Login />} />
                    <Route exact path="/register" element={<Register />} />
                    <Route exact path="/home" element={<PrivateRoute> <Home /> </PrivateRoute>} />
                    <Route exact path="/alunos" element={<PrivateRoute> <Aluno /> </PrivateRoute>} />
                    <Route exact path="/instrumentos" element={<PrivateRoute> <Instrumento /> </PrivateRoute>} />
                    <Route exact path="/chamada" element={<PrivateRoute> <Chamada /> </PrivateRoute>} />
                </Routes>    
            </BrowserRouter>
}

export default AppRoutes;