import React from 'react';
import { Routes, Route } from 'react-router-dom';
import RequireAuth from './components/RequireAuth';
import Home from './pages/Home';
import PatientDashboard from './pages/PatientDashboard';
import CaregiverDashboard from './pages/CaregiverDashboard';
import NursingHomeDashboard from './pages/NursingHomeDashboard';

function App() {
  return (
    <div className='App'>
      <Routes>
        <Route path="/" element={
          <RequireAuth allowedRoles={[]}>
            <Home/>
          </RequireAuth>
        }/>
        <Route path="/patient" element={
          <RequireAuth allowedRoles={['patient']}>
            <PatientDashboard/>
          </RequireAuth>
        }/>
        <Route path="/caregiver" element={
          <RequireAuth allowedRoles={['caregiver']}>
            <CaregiverDashboard/>
          </RequireAuth>
        }/>
        <Route path="/nursing-home" element={
          <RequireAuth allowedRoles={['nursing-home']}>
            <NursingHomeDashboard/>
          </RequireAuth>
        }/>
      </Routes>
    </div>
  );
}

export default App;