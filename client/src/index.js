import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {store,persistor} from "./redux/createStore";
import { PersistGate } from 'redux-persist/integration/react';
import {Provider} from "react-redux";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store = {store}>
      <PersistGate persistor = {persistor}>
        <App />
      </PersistGate>
    </Provider>
  </React.StrictMode>
);

