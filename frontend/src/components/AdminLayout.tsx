
import { Outlet, Link, useNavigate } from "react-router-dom";



const AdminLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/gallery");
  };

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-white shadow-md p-4">
        <h2 className="font-bold mb-6">Admin Panel</h2>

        <div className="flex flex-col gap-3">
          <Link to="/dashboard">Manage Nail Arts</Link>
          <Link to="/dashboard/bookings">View Bookings</Link>

          <button
            onClick={handleLogout}
            className="mt-6 text-red-500 text-left"
          >
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 p-6 bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;