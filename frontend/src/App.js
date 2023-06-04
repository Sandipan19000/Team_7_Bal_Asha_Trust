import './App.css';
import { Routes, Route } from "react-router-dom";
import HomePage from './Pages/HomePage';
import Login from './Component/Login';
import Dashboard from './Component/Dashboard';
import Signup from './Component/Signup';
import Navbar from './Component/Navbar';
import Header from './Component/Header';

import DemoPage from './Pages/DemoPage';
import CaseManagerDashboard from './Pages/CaseManagerDashboard';
import ChildDataForm from './Pages/ChildDataForm';
import ChildDataForm from './Component/ChildDataForm';
import {useSelector} from 'react-redux';
function App() {


  const state = useSelector((state) => ({ ...state }));
  console.log(state);

  return (
    <>
    {/* <Navbar /> */}
    <Header />

    {/* // All routes will go here */}

    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="*" element={<HomePage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/demo" element={<DemoPage />} />
      <Route path="/case-manager" element={<CaseManagerDashboard />} />

             <Route path="/child-data-form" element={<ChildDataForm />} />
    </Routes>
    </>
  );
}

export default App;
