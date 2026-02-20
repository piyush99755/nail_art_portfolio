import {  Routes, Route } from "react-router-dom";
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Gallery from './pages/Gallery';
import ProtectedRoutes from './components/ProtectedRoutes';

function App() {
  
  return (
    
    <Routes>
      <Route path="/" element={<Gallery />} />
      <Route path="/login" element={<Login />} />
      <Route
      path="/dashboard" 
      element={
        <ProtectedRoutes>
          <h1 className="text-4xl font-bold text-pink-500">
            Tailwind Working
          </h1>
          <Dashboard /> 
        </ProtectedRoutes>
      }
      />
    </Routes>
    
  );
}

export default App;