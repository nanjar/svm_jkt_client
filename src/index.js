import React from "react";
import ReactDOM from 'react-dom';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import App from './App';
import './index.css';
import { SocketContext, socket } from "./services/socket";
import { Container} from 'react-bootstrap';

// eslint-disable-next-line
ReactDOM.render(
	<React.StrictMode>
		<SocketContext.Provider value={socket}>
			<Container fluid>
				<div className="align-items-center">
					<App />
				</div>
			</Container>
		</SocketContext.Provider>
	</React.StrictMode>,
	document.getElementById('root')
);

reportWebVitals();
