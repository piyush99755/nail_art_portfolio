import Navbar from './Navbar';

interface Props {
    children: React.ReactNode;
}

const Layout = ({children}: Props) => {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-6xl mx-auto px-4 py-8">
                {children}
            </div>
        </div>
    );
};

export default Layout;

