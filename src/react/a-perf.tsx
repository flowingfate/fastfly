import ReactDOM from 'react-dom/client';
import React from 'react';
import { Animation } from './tree';

function App() {
  return <Animation />;
}

const root = document.getElementById('root') as HTMLElement;
ReactDOM.createRoot(root).render(<App />);

