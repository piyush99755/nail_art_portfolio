import {  Routes, Route } from "react-router-dom";
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Gallery from './pages/Gallery';
import ProtectedRoutes from './components/ProtectedRoutes';
import Layout from "./components/Layout";
import Book from "./pages/Book";
import AdminBookings from "./pages/AdminBookings";
import AdminLayout from "./components/AdminLayout";
import PaymentWrapper from "./pages/PaymentWrapper";

function App() {
  
  return (
    
    <Routes>
       {/*  PUBLIC ROUTES */}
      <Route element={<Layout />}>
        <Route path="/" element={<Gallery />} />
        <Route path="/login" element={<Login />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/book" element={<Book />} />
      </Route>

      {/* PAYMENT (no navbar) */}
      <Route path="/payment/:id" element={<PaymentWrapper />} />

      {/* ADMIN ROUTES */}
      <Route
        path="/dashboard/*"
        element={
          <ProtectedRoutes>
            <AdminLayout />
          </ProtectedRoutes>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="bookings" element={<AdminBookings />} />
      </Route>
    </Routes>

    
    
  );
}

export default App;