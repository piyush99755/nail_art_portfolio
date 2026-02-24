import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface Props {
    children: ReactNode;
}

const AdminLayout = ({ children }: Props) => {
    return (
        <div>
            <div className='flex gap-4 mb-6 border-b pb-4'>
                <Link 
                to='/dashboard'
                className='px-4 py-2 rounded-lg bg-pink-500 text-white'
                >
                    Manage Nail Arts
                </Link>

                <Link 
                to="/dashboard/bookings"
                className='px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300'
                >
                    View Bookings
                </Link>

            </div>

            {children}
        </div>
    );
};

export default AdminLayout;

