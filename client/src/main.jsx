import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { CurrencyProvider } from './context/CurrencyContext.jsx';

// Unregister Service Workers on startup (prevents chrome-extension cache errors)
import './serviceWorkerUnregister.js';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* Wrap the entire application with AuthProvider to manage authentication state */}
    <AuthProvider>
      <CurrencyProvider>
        <App />
      </CurrencyProvider>
    </AuthProvider>
  </StrictMode>,
);
