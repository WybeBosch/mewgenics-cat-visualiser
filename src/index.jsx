import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './shared/styles/tokens.css';
import './shared/styles/base.css';

const root = createRoot(document.getElementById('root'));
root.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>
);
