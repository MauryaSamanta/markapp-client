// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react';

import './App.css';
import Attend from './components/Attendance';
import Home from './pages/Home';
import Login from './pages/Auth';
import GetReports from './components/GetReports';
function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <BrowserRouter>
      <Routes>
        {!loggedIn ? (
          <Route path="*" element={<Login onLogin={() => setLoggedIn(true)} />} />
        ) : (
          <>
            <Route path="/" element={<Home />} />
            <Route path="/attendance/:type" element={<Home />} />
            <Route path="/get-reports/:type" element={<GetReports />} />

          </>
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
