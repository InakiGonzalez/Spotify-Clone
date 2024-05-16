import { Routes, Route } from 'react-router-dom';
import Register from './components/register/Register';
import Dashboard from './components/dashboard/Dashboard';
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Register />} />
      <Route path="/" element={<Dashboard />} />

    </Routes>
  );
}

export default App;
