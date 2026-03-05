import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import DataDiagnostic from './components/DataDiagnostic';
import { initWebSocket } from './services/ws';
import { useAppDispatch } from './store';

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // open a WS connection once on app start
    const socket = initWebSocket(dispatch);
    return () => socket.disconnect();
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/diagnostic" element={<DataDiagnostic />} />
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
