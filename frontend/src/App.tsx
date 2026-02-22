import {  Routes, Route } from "react-router-dom";
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Gallery from './pages/Gallery';
import ProtectedRoutes from './components/ProtectedRoutes';
import Layout from "./components/Layout";
import Book from "./pages/Book";

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

      <Route
      path='/book'
      element={
        <Layout>
          <Book />
        </Layout>
      }
      />
    </Routes>
    
  );
}

export default App;