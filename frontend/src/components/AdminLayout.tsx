
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, Calendar, LogOut } from "lucide-react";

const AdminLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/gallery");
  };

  return (
    <div className="min-h-screen flex flex-col bg-brand-secondary">

      {/* TOP NAVBAR */}
      <header className="sticky top-0 z-50 bg-brand-secondary border-b border-brand-accent px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold tracking-tight">
            Admin Panel
        </h1>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-red-500 hover:text-red-600"
        >
          <LogOut size={18} />
          Logout
        </button>
      </header>

      {/* MAIN AREA */}
      <div className="flex flex-1">

        {/* SIDEBAR */}
        <aside className="w-64 bg-brand-accent border-r border-brand-accent p-6 flex flex-col gap-6">

          <nav className="flex flex-col gap-2">

            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-lg transition ${
                  isActive
                    ? "bg-brand-secondary text-brand-primary font-semibold"
                    : "hover:bg-brand-secondary"
                }`
              }
            >
              <LayoutDashboard size={18} />
              Manage Nail Arts
            </NavLink>

            <NavLink
              to="/dashboard/bookings"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-lg transition ${
                  isActive
                    ? "bg-brand-secondary text-brand-primary font-semibold"
                    : "hover:bg-brand-secondary"
                }`
              }
            >
              <Calendar size={18} />
              View Bookings
            </NavLink>

          </nav>
        </aside>

        {/* CONTENT */}
        <main className="flex-1 p-8">
          <Outlet />
        </main>

      </div>
    </div>
  );
};

export default AdminLayout;