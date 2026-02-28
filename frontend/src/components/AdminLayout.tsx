import type { ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";

interface Props {
  children: ReactNode;
}

const AdminLayout = ({ children }: Props) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/gallery");
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Admin Navigation Bar */}
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <div className="flex gap-4">
          <Link
            to="/dashboard"
            className="px-4 py-2 rounded-lg bg-pink-500 text-white hover:bg-pink-600 transition"
          >
            Manage Nail Arts
          </Link>

          <Link
            to="/dashboard/bookings"
            className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
          >
            View Bookings
          </Link>
        </div>

        <button
          onClick={handleLogout}
          className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition"
        >
          Logout
        </button>
      </div>

      {/* Page Content */}
      {children}
    </div>
  );
};

export default AdminLayout;