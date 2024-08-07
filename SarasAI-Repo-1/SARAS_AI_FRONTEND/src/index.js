import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './Context/AuthProvider';
import { Provider } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import store from './redux/store';
import LoginApp from './loginApp';
// console.log = function () {};
const root = ReactDOM.createRoot(document.getElementById('root'));
{
    /* 
root.render(
    <React.StrictMode>
        <Provider store={store}>
            <BrowserRouter>
                <AuthProvider>
                    <Routes>
                        // <App /> 
                        <Route path="/*" element={<App />} />
                    </Routes>
                    <ToastContainer />
                </AuthProvider>
            </BrowserRouter>
        </Provider>
    </React.StrictMode>
);
*/
}

root.render(
    <React.StrictMode>
        <Provider store={store}>
            <BrowserRouter>
                <Routes>
                    {/* <App />  */}
                    <Route path="/*" element={<LoginApp />} />
                </Routes>
                <ToastContainer />
            </BrowserRouter>
        </Provider>
    </React.StrictMode>
);

reportWebVitals();
