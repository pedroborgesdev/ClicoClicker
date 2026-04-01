import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Aplica o tema salvo antes do React renderizar, evitando flash sem tema
const savedTheme = localStorage.getItem('clickerTheme');
if (savedTheme) {
  document.documentElement.setAttribute('data-theme', savedTheme);
}

const rootElement = document.getElementById('root');

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);

  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  console.error("Failed to find the root element. Make sure your index.html has an element with id='root'.");
}
