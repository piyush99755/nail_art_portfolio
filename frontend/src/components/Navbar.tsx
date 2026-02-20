import { Link } from "react-router-dom";

const Navbar = () => {
    const token = localStorage.getItem('token');

    return (
        <nav className="bg-white shadow-md">
            <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
                <Link to='/gallery' className="text-xl font-bold text-pink-600">
                  Opal Nails Studio
                </Link>

                <div className="hidden md:flex gap-6 items-center">
                    <Link to="/gallery" className="hover:text-pink-500">
                       Gallery
                    </Link>

                    <Link to='/book' className="hover:text-pink-500">
                        Book
                    </Link>

                    {!token ? (
                        <Link
                            to='/login'
                            className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 transition"
                        >
                            Admin Login
                        </Link>
                    ) : (
                        <>
                        <Link to='/dashboard' className="hover:text-pink-500">
                            Dashboard
                        </Link>
                        <button onClick = {() =>{
                            localStorage.removeItem('token');
                            window.location.href ='/';

                        }}
                        className="bg-gray-200 px-4 py-2 rounded-lg"
                        >
                            Logout
                        </button>
                        </>
                    )}

                </div>
            </div>
        </nav>
    )
}


export default Navbar;