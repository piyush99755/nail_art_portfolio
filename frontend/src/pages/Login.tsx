import { useState } from "react";
import api from '../api/axios';
import type { LoginResponse } from "../types";
import { useNavigate } from "react-router-dom";


const Login = () => {

    //set initial states
    const [identifier, setIdentifier] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const navigate = useNavigate();

    const handleLogin = async() => {
        try{
            const formData = new URLSearchParams();

            //field must be called 'username' as required by OAuthPasswordRequestForm
            formData.append("username", identifier);
            formData.append("password", password);

            const response = await api.post<LoginResponse>(
                '/auth/login',
                formData,
                {
                    headers: {
                        "Content-Type" : "application/x-www-form-urlencoded",
                    },
                    
                }
            );
            //storing access token for future requests.
            localStorage.setItem("token", response.data.access_token);
            navigate('/dashboard');
        }
        catch(error){
            alert("Invalid Credentials");
        }

    };

    return (
        <div>
            <h2>
                Admin Login
            </h2>
            <input type="username"
                   placeholder="username or email"
                   onChange={(e) => setIdentifier(e.target.value)} //setting up email or username value entered in placeholder
            />
            <input type="password"
                   placeholder="password"
                   onChange={(e) => setPassword(e.target.value)} //setting up password value entered in placeholder
            />
            <button onClick={handleLogin}>Login</button>
        </div>
    )

}

export default Login;