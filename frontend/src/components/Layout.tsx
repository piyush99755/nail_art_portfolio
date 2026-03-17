import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';



const Layout = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-6xl mx-auto px-4 py-8">
                <Outlet />
            </div>
        </div>
    );
};

export default Layout;

