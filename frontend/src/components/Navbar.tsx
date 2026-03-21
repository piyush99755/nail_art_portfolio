import { Link } from "react-router-dom";
import { useState } from "react";


const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    

    return (
        <>
            <nav className="flex justify-between items-center px-6 py-4 shadow-md bg-white">
                {/* Logo */}
                <h1 className="text-xl font-bold">Opal Nails</h1>

                {/* Desktop Menu */}
                <div className="hidden md:flex gap-6 items-center">
                    <Link to="/gallery">Gallery</Link>
                    <Link to="/book">Book</Link>
                    <Link
                        to="/login"
                        className="bg-brand-primary text-white px-4 py-2 rounded-lg"
                    >
                        Admin Login
                    </Link>
                </div>

                {/* Mobile Hamburger */}
                <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="md:hidden text-2xl"
                >
                ☰
                </button>
            </nav>
            {/* Mobile Dropdown */}
            {menuOpen && (
                <div className="absolute right-4 top-16 md:hidden bg-white shadow-md px-4 py-4 flex flex-col gap-4 w-max rounded-lg">
                <Link to="/gallery" onClick={() => setMenuOpen(false)}>
                    Gallery
                </Link>

                <Link to="/book" onClick={() => setMenuOpen(false)}>
                    Book
                </Link>

                <Link
                    to="/login"
                    onClick={() => setMenuOpen(false)}
                    className="bg-brand-primary text-white px-4 py-2 rounded-lg text-center"
                >
                    Admin Login
                </Link>
                </div>
            )}
        </>
    )
}


export default Navbar;