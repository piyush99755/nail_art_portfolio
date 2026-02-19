import { Navigate } from 'react-router-dom';

interface Props{
    children: React.ReactNode;
}

const ProtectedRoutes = ({ children }: Props) => {
    const token = localStorage.getItem("token");
    //if token is not valid navigate back to login page
    if(!token) {
        return <Navigate to="/login" />;
    }
    //return all children, means all the pages included in protected routes can be rendered on valid token
    return <>{children}</>
};

export default ProtectedRoutes;