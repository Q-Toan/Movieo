import axios from 'axios';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { RouterProvider } from 'react-router-dom';
import router from './routes';
import { store } from '../src/store/store'
import { Provider } from 'react-redux'

axios.defaults.baseURL = "https://api.themoviedb.org/3";
axios.defaults.headers.common['Authorization'] = `Bearer ${process.env.REACT_APP_ACCESS_TOKEN}`

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
  <Provider store= {store}>
    <RouterProvider router={router} />
  </Provider>
  // </React.StrictMode>
);

reportWebVitals();
