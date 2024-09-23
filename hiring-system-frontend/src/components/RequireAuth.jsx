import React from 'react';
import { Navigate } from 'react-router-dom';
import * as JWT from 'jwt-decode';


const RequireAuth = ({ children, allowedRoles }) => {
    const token = localStorage.getItem('token');
    if(!token){
        if(allowedRoles.length === 0) return children;
        return <Navigate to="/"/>;
    }
    const { user } = JWT.jwtDecode(token);
    const role = user.role;
    if(!allowedRoles.includes(role) || allowedRoles.length === 0) return <Navigate to={`/${role}`} />;
    return children;
};

export default RequireAuth;