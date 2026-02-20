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
            console.error("Invalid Credentials", error);
        }

    };

    return (
        <div className="flex items-center justify-center min-h-[70vh]">
            <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold text-center mb-6">
                Admin Login
                </h2>

                <input
                type="text"
                placeholder="Username or Email"
                className="w-full border rounded-lg px-4 py-2 mb-4"
                onChange={(e) => setIdentifier(e.target.value)}
                />

                <input
                type="password"
                placeholder="Password"
                className="w-full border rounded-lg px-4 py-2 mb-4"
                onChange={(e) => setPassword(e.target.value)}
                />

                <button
                onClick={handleLogin}
                className="w-full bg-pink-500 text-white py-2 rounded-lg hover:bg-pink-600 transition"
                >
                Login
                </button>

                <button
                onClick={() => navigate('/gallery')}
                className="w-full mt-4 border border-pink-500 text-pink-500 py-2 rounded-lg hover:bg-pink-50 transition "
                >
                    Continue as guest
                </button>
            </div>
        </div>
    );
}

export default Login;