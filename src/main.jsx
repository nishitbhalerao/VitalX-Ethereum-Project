import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PrivyProvider } from '@privy-io/react-auth';
import './index.css';
import LandingPage from './Landingpage.jsx';
import LoginPage from './login.jsx';
import SignUpPage from './Signup.jsx';
import PatientModule from './patitent.jsx';

// Replace with your real Privy App ID from https://dashboard.privy.io
const PRIVY_APP_ID = 'cmhvr7tt50017jr0clymdhghg';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <PrivyProvider appId={PRIVY_APP_ID}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/patient" element={<PatientModule />} />
        </Routes>
      </PrivyProvider>
    </BrowserRouter>
  </StrictMode>,
);
