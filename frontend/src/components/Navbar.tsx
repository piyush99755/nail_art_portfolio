import { Link } from "react-router-dom";

const Navbar = () => {
    

    return (
        <nav className="bg-white shadow-md">
            <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
                <Link to="/gallery" className="flex items-center gap-2">
                    <img 
                        src="/logo.png" 
                        alt="Opal Nails" 
                        className="h-10 object-contain"
                    />

                    <span className="text-lg font-semibold tracking-wide text-[#2B2B2B]">
                        Opal Nails
                    </span>
                </Link>

                <div className="hidden md:flex gap-6 items-center">
                    <Link to="/gallery" className="hover:text-brand-primary">
                       Gallery
                    </Link>

                    <Link to='/book' className="hover:text-brand-primary">
                        Book
                    </Link>

                    <Link
                        to="/login"
                        className="bg-brand-primary text-white px-4 py-2 rounded-lg hover:bg-black transition"
                    >
                        Admin Login
                    </Link>

                </div>
            </div>
        </nav>
    )
}


export default Navbar;