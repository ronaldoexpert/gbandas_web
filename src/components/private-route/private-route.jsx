import { Navigate } from "react-router-dom";

function PrivateRoute(props){
    const isUserAuth = localStorage.getItem("sessionToken") ? true : false;

    return isUserAuth ? props.children : <Navigate to="/" />
}

export default PrivateRoute;