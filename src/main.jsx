import { createRoot } from 'react-dom/client';
import './components/GeneralStyles/index.scss';
import App from './components/App/App.jsx';
import { Provider } from 'react-redux';
import store from './store';

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>
);
