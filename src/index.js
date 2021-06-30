import React from "react";
import ReactDOM from 'react-dom';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import App from './App';
import './index.css';
import { SocketContext, socket } from "./services/socket";

// eslint-disable-next-line
ReactDOM.render(
	// <React.StrictMode>
		<SocketContext.Provider value={socket}>
			<App />
		</SocketContext.Provider>,
	// </React.StrictMode>
	document.getElementById('root')
);

reportWebVitals();
