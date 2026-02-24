import {  Routes, Route } from "react-router-dom";
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Gallery from './pages/Gallery';
import ProtectedRoutes from './components/ProtectedRoutes';
import Layout from "./components/Layout";
import Book from "./pages/Book";
import AdminBookings from "./pages/AdminBookings";
import AdminLayout from "./components/AdminLayout";

function App() {
  
  return (
    
    <Routes>
      <Route 
      path="/" 
      element={
      <Layout>
        <Login />
      </Layout>
      } 
      />

      <Route 
      path="/login" 
      element={
      <Layout>
        <Login />
      </Layout>
      }
      />

      <Route
      path="/gallery"
      element={
        <Layout>
          <Gallery />
        </Layout>
      }>
      </Route>

      <Route
      path="/dashboard" 
      element={
        <ProtectedRoutes>
          <Layout>
            <AdminLayout>
              <Dashboard /> 
            </AdminLayout>
          </Layout>
        </ProtectedRoutes>
      }
      />

      <Route
      path='/book'
      element={
        <Layout>
          <Book />
        </Layout>
      }
      />
      <Route
      path='/dashboard/bookings'
      element={
        <ProtectedRoutes>
          <Layout>
            <AdminBookings />
          </Layout>
        </ProtectedRoutes>
      }
      />
    </Routes>

    
    
  );
}

export default App;