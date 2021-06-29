import React, { useContext, useState, useEffect } from "react";
import { SocketContext } from '../../services/socket';
import MachineShop from './MachineShop';
import '../../App.css';
import { Spinner, Container, Row } from 'react-bootstrap';

const Home = (props) => {
	const [machineCode, setMachineCode] = useState("");
	const [chkMissingConfigs, setChkMissingConfigs] = useState([]);
	const [chkMissingResources, setChkMissingResources] = useState([]);
	const socket = useContext(SocketContext);

	useEffect(() => {
		const url = `${process.env.REACT_APP_API}/api/home.json`;
		console.log(url);
		fetch(url)
			.then(response => {
				if (response.ok) {
					return response.json();
				}
				throw new Error("Network response was not ok.");
			})
			.then(response => {
				setMachineCode(response.machine_code);
				setChkMissingConfigs((response.missing_configs.length > 0 )? response.missing_configs.map(x => x['value']) : []);
				setChkMissingResources((response.missing_resources.length > 0) ? response.missing_resources.map(x => x['value']) : []);
			})
			.catch(error => console.log(error.message));
		
			return function cleanup() {
				socket.emit('vendingv1-indo', { command: 'button_poll', action: 'stop', interval: 300, reply_to: 'button_pressed' });
			};
	}, [machineCode, socket]);

	const MachineSetup = () => {	
		let code, configsWarn, resourcesWarn;
		if (machineCode) {
			// MACHINE CODE
			code = <p className='text-center custom-t0 align-self-center'>KODE MESIN - <span className="custom-t0"><strong> {machineCode} </strong></span></p>;

			if (chkMissingConfigs.includes(false)) {
				//Missing configs
				configsWarn = <p className='text-center text-uppercase text-warning custom-t0 align-self-center'>KONFIGURASI HILANG!</p>;
			}

			if (chkMissingResources.includes(false)) {
				// Missing resources!
				resourcesWarn = <p className='text-center text-uppercase text-warning custom-t0 align-self-center'>SUMBER DARA HILANG!</p>;
			}
		} else {
			// Machine Setup ... 
			code = <p className='text-center text-uppercase custom-t0 align-self-center'>PENGATURAN MESIN</p>;
		}

		return <Container fluid>
			<Row className='justify-content-center'>
				<Spinner animation="border" className="custom-spinner custom-t0" />
				<br />
			</Row>
			<Row className='justify-content-center mt-4'>{code}</Row>
			<Row className='justify-content-center mt-4'>{configsWarn}</Row>
			<Row className='justify-content-center mt-4'>{resourcesWarn}</Row>
		</Container>;
	};

	return <Container fluid>
	{
		(machineCode==="" || chkMissingConfigs.includes(false) || chkMissingResources.includes(false)) ? <MachineSetup/> : <MachineShop />
	}
	</Container>;
}

// Home.contextType = SocketContext;
export default Home;