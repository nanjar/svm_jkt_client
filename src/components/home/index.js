import React, { useContext, useState, useEffect } from "react";
import {SocketContext} from '../../services/socket';
import SERVER_REQ  from '../../helpers/Request';
import FORMATTER  from '../../helpers/Formatter';
import MachineShop from './MachineShop';
import '../../App.css';
import { Container, Row, Col } from 'react-bootstrap';
import { useHistory } from "react-router-dom";
import image_fail from '../../assets/static_images/icon-fail.png';
import image_success from '../../assets/static_images/icon-success.png';
import Maintenance from "../Maintenance";

const Home = (props) => {
	const [machineCode, setMachineCode] = useState("");
	const [missingConfigs, setMissingConfigs] = useState([]);
	const [missingResources, setMissingResources] = useState(false);
	
	// eslint-disable-next-line
	const [machineMessage, setMachineMessage] = useState("");
	const [ipAddress, setIpAddress] = useState("");
 	const socket = useContext(SocketContext);
	const history = useHistory()
	const [buttonResponse, setButtonResponse] = useState(true);

	useEffect(() => {
		if(window.location.hostname !== "localhost") {
			history.push('/management/login')
			return;
		}

		fetchHome();
		socket.off('machine_temperature_update').on('machine_temperature_update', (data) => {
            data = JSON.parse(data);
			SERVER_REQ.get('/api/health.json', { vending: buttonResponse ? 2 : 1, vending_temp: data.value });
		})

		socket.off('button_status').on('button_status', (data) => {
			const response = JSON.parse(data);
			const isButtonActive = parseInt(response.status) !== 1;
			setButtonResponse(isButtonActive);
			SERVER_REQ.get('/api/health.json', { vending: isButtonActive ? 2 : 1, status: 1 });
			// if(!isButtonActive){
			// 	SERVER_REQ.get('/api/health.json', { vending: 1, status: 1 });
			// }
		})
		// // listen to button polling status
		// socket.off('button_polling_status').on('button_polling_status', (data) => {
		// 	console.log(data);
		// })
		
		return function cleanup() {
			socket.emit('vendingv1-indo', { command: 'button_poll', action: 'stop', interval: 300, reply_to: 'button_pressed' });
		};
		// eslint-disable-next-line
	}, []);

	const fetchHome = () => {
		const url = `${FORMATTER.api_base_url()}/api/home.json`;
		fetch(url)
			.then(response => {
				if (response.ok) {
					return response.json();
				}
				throw new Error("Network response was not ok.");
			})
			.then(response => {
				setMissingResources(response.resources)
				setMachineCode(response.machine_code)
				setIpAddress(response.ip)
				setMachineMessage(response.message)
				setMissingConfigs(response.statuses)
				if(response.request_after){
					setTimeout( () => fetchHome(), response.request_after * 1000)
				}
			})
			.catch(error => console.log(error.message));
		
	}

	const MachineSetup = () => {
		const percent = (missingConfigs.filter(x => x.value).length / missingConfigs.length) * 100
		return <div className="initialization-container">
			<div className="progress-container">
				<div>INISIALISASI</div>
				<div>
					<div className="progress" style={{width: `${percent}%`}}></div>
				</div>
				<div>
					<div>0%</div>
					<div>100%</div>
				</div>
				
			</div>
			<div className="clearfix"></div>
			<div className="resources-container">
				<div className="machine-code">{machineCode}</div>
				<div className="machine-ip">{ipAddress}</div>
				<div className="resources">
					<div className="text-description">Menunggu status aktif parameter:</div>
					<Row >
					{ 
						missingConfigs.map( (config, index) => {
							return <Col index={index} className="col-md-4"><img src={config.value ? image_success : image_fail} style={{width: 50}} alt="missing"/>&nbsp; <span>{config.text}</span></Col>
						})
					}
					</Row>
				</div>
			</div>
		</div>;
	};
	return (<div onContextMenu={(e)=> e.preventDefault()} className="vw-100 vh-100 d-flex align-items-center background-Img overflow-hidden">
		<Container fluid className="p-0">
		{
			(missingResources) ? <MachineSetup /> : <MachineShop />
		}
		</Container>
	</div>);
}

// Home.contextType = SocketContext;
export default Home;