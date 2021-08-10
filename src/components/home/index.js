import React, { useContext, useState, useEffect } from "react";
import {SocketContext} from '../../services/socket';
import SERVER_REQ  from '../../helpers/Request';
import FORMATTER  from '../../helpers/Formatter';
import MachineShop from './MachineShop';
import '../../App.css';
import { Spinner, Container, Row } from 'react-bootstrap';
import { useHistory } from "react-router-dom";

const Home = (props) => {
	const [machineCode, setMachineCode] = useState("");
	const [chkMissingConfigs, setChkMissingConfigs] = useState([]);
	const [chkMissingResources, setChkMissingResources] = useState([]);
	const [missingConfigs, setMissingConfigs] = useState("");
	const [missingResources, setMissingResources] = useState("");
 	const socket = useContext(SocketContext);
	const history = useHistory()

	useEffect(() => {
		if(window.location.hostname !== "localhost") {
			history.push('/management/login')
			return;
		}
		const url = `${FORMATTER.api_base_url()}/api/home.json`;
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
				setMissingConfigs((response.missing_configs.length > 0) ? response.missing_configs : "");
				setChkMissingResources((response.missing_resources.length > 0) ? response.missing_resources.map(x => x['value']) : []);
				setMissingResources((response.missing_resources.length > 0) ? response.missing_resources : "");
			})
			.catch(error => console.log(error.message));
		
		
		socket.on('machine_temperature_update', (data) => {
            data = JSON.parse(data);
			SERVER_REQ.get('/api/health.json', { vending: 2, vending_temp: data.value });
		})
		
		return function cleanup() {
			socket.emit('vendingv1-indo', { command: 'button_poll', action: 'stop', interval: 300, reply_to: 'button_pressed' });
		};
	}, []);

	const MachineSetup = () => {	
		let code, configsWarn, missingConf, resourcesWarn, missingRes;
		let confData = "";
		let resData = "";

		if (missingConfigs.length > 0) {
			missingConfigs.forEach((element, i) => {
				confData += element.tag + ": " + element.value;
				if (missingConfigs.length - 1 !== i) { confData += ", " }
			});
		}

		if (missingResources.length > 0) {
			missingResources.forEach((element, j) => {
				resData += element.tag + ": " + element.value;
				if (missingResources.length - 1 !== j) { resData += ", " }
			});
		}
		
		console.log("missing configs", resData);
		// console.log("missing resources", resourceData);
		if (machineCode) {
			// machien code
			code = <p className='text-center custom-t0 align-self-center'>KODE MESIN - <span className="custom-t0"><strong> {machineCode} </strong></span></p>;

			if (chkMissingConfigs.includes(false)) {
				// missing configs 
				configsWarn = <p className='text-center text-uppercase text-warning custom-t0 align-self-center'>KONFIGURASI HILANG!</p>;
				missingConf = <p className='text-center custom-t5 align-self-center'>{confData}</p>;
			}

			if (chkMissingResources.includes(false)) {
				// missing resources
				resourcesWarn = <p className='text-center text-uppercase text-warning custom-t0 align-self-center'>SUMBER DARA HILANG!</p>;
				missingRes = <p className='text-center custom-t5 align-self-center'>{resData}</p>;
			}
		} else {
			// machine setup
			code = <p className='text-center text-uppercase custom-t0 align-self-center'>PENGATURAN MESIN</p>;
		}

		return <div className="vw-100 vh-100 d-flex align-items-center background-Img">
			<Container fluid>
				<Row className='justify-content-center'>
					<Spinner animation="border" className="custom-spinner custom-t0" />
					<br />
				</Row>
				<Row className='justify-content-center mt-4'>{ code }</Row>
				<Row className='justify-content-center mt-4'>{ configsWarn }</Row>
				<Row className='justify-content-center mt-4'>{ missingConf }</Row>
				{/* <Row className='justify-content-center mt-4'>{ resourcesWarn }</Row> */}
				<Row className='justify-content-center mt-4'>{ missingRes }</Row>
			</Container>
		</div>;
	};

	return <Container fluid className="overflow-hidden">
	{
		(machineCode === "" || chkMissingConfigs.includes(false) || chkMissingResources.includes(false)) ? <MachineShop/> : <MachineShop />
	}
	</Container>;
}

// Home.contextType = SocketContext;
export default Home;