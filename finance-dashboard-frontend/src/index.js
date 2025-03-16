import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/css/index.css';
import App from './App';
import { GoogleOAuthProvider } from '@react-oauth/google';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
     <GoogleOAuthProvider clientId="856805720033-2038136lchil4aoi3p4ial2c7i5ujtih.apps.googleusercontent.com">
    <App />
    </GoogleOAuthProvider>
  </React.StrictMode>
);


