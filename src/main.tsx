import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { AudioProvider } from './context/AudioContext';
import { MediaStoreProvider } from './context/MediaStoreContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MediaStoreProvider>
      <AudioProvider>
        <App />
      </AudioProvider>
    </MediaStoreProvider>
  </StrictMode>,
);
