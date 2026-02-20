import {  Routes, Route } from "react-router-dom";
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Gallery from './pages/Gallery';
import ProtectedRoutes from './components/ProtectedRoutes';
import Layout from "./components/Layout";

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
            <Dashboard /> 
          </Layout>
        </ProtectedRoutes>
      }
      />
    </Routes>
    
  );
}

export default App;