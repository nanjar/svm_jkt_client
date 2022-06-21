import React, { useEffect, useContext, useState } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import SERVER_REQ from '../../helpers/Request';
import { Row, Col, Container, Modal } from 'react-bootstrap';
import { useIdleTimer } from 'react-idle-timer';
import { SocketContext } from '../../services/socket';

const TEMPERATURE_EVENT = 'machine_temperature_update';

const Management = (props) => {
	const [piTemp, setPITemp] = useState(0);
	const [machineTemp, setMachineTemp] = useState(0);
	const [showConfirm, setShowConfirm] = useState(false);
	const [showAck, setShowAck] = useState(false);
	const [checkTemplateResponse, setCheckTemplateResponse] = useState("");
	const [changeTemplateResponse, setChangeTamplateResponse] = useState("");
	const socket = useContext(SocketContext);
	// eslint-disable-next-line
	const location = useLocation();
	const history = useHistory();
	useEffect(()=>{
		// console.log("loc state ", !(location.state && location.state.login));
		// if(!(location.state && location.state.login)){
		// 	history.push('/management/login'); // redirecting to login page for the desktop browsers
		// 	return;
		// }
		// console.log(window.location.hostname)
		if(window.location.hostname !== "localhost") {
			history.push('/management/login')
			return;
		}
		(async function(){
			const check_template_req = await SERVER_REQ.get('/api/topups.json')
			const check_template_response = check_template_req.response;
			setPITemp(check_template_response.pi_temp)
			if (check_template_response.has_template_change) {
				setShowConfirm(true);
				setCheckTemplateResponse(check_template_response.has_template_change);
			}
		})();
		
        const temperature_event = async (data) => {
            data = JSON.parse(data);
			setMachineTemp(data.value);
		}
        socket.off(TEMPERATURE_EVENT).on(TEMPERATURE_EVENT, temperature_event);
		return () => {}
		// eslint-disable-next-line
	},[]);

	const duration = 10; // 10 minutes

	let timer = 1000 * 60 * duration; // set timer

	const handleOnAction = (event) => {
		// console.log("user did something", event);
		timer = 1000 * 60 * duration; // reset timer
		// console.log("remaining time 1 ", getRemainingTime());
	}

	const handleOnActive = (event) => {
		// console.log("user is active", event);
		timer = 1000 * 60 * duration; // reset timer
		// console.log("remaining time 2 ", getRemainingTime());
	}

	const handleOnIdle = (event) => {
		// console.log("user is idle", event);
		// console.log("remaining time 3 ", getRemainingTime());
		props.history.push("/");
	}
	// eslint-disable-next-line
	const { getRemainingTime } = useIdleTimer({
		timeout: timer,
		onIdle: handleOnIdle,
		onActive: handleOnActive,
		onAction: handleOnAction
	});

	const handleButtonConfirm = () => {
		setShowConfirm(false);
		(async function(){
			const change_template = await SERVER_REQ.get('/api/topups/change.json',{template: checkTemplateResponse});
			setChangeTamplateResponse(change_template.response.message);
			setShowAck(true);
		})();
	}

	const handleButtonOk = () => {
		setShowAck(false);
	}

	return (<div className="vw-100 vh-100 d-flex align-items-center background-Img overflow-hidden">
		<Container fluid>
			<Row className="mt-1">
				<Col lg={6}><span className="text-uppercase custom-t2">SUHU PERANGKAT - {piTemp} &deg;C</span></Col> {/* device/pi temp */}
				<Col lg={6}><span className="text-uppercase float-end custom-t2">SUHU MESIN - {machineTemp} &deg;C</span></Col> {/* machine temp */}
			</Row> 
			<Row>
				<Col lg={6} className="bg-smvprimary">
					<Link to="/management/auto_topup" className="btn btn-lg btn-block set-wh text-uppercase">
						<h1 className="display-2 set-mtop">TOP UP OTOMATIS</h1> {/* auto topup */}
					</Link>
				</Col>

				<Col lg={6} className="bg-smvsecondary">
					<Link to="/management/manual_topup" className="btn btn-lg btn-block set-wh text-uppercase">
						<h1 className="display-2 set-mtop">TOP UP MANUAL</h1> {/* manual topup */}
					</Link>
				</Col>
			</Row>
			<Row>
				<Col lg={6} className="bg-smvsecondary">
					<Link to="/management/button_config" className="btn btn-lg btn-block set-wh text-uppercase">
						<h1 className="display-2 set-mtop2">TOMBOL KONFIGURASI</h1> {/* button configuration */}
					</Link>
				</Col>

				<Col lg={6} className="bg-smvprimary">
					<Link to="/" className="btn btn-lg btn-block set-wh text-uppercase">
						<h1 className="display-2 set-mtop">KELUAR</h1> {/* logout */}
					</Link>
				</Col>
			</Row>

			<Modal show={showConfirm} size="xl" centered className="rounded-3">
				<Modal.Header className="modal-background">
					<Modal.Title>
						<p className="custom-t2 text-uppercase">Confirm Template Change</p> {/* Confirm Template Change */}
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<p className="custom-t2 text-uppercase">Do you want to change the template?</p> {/* Do you want to change the template? */}
				</Modal.Body>
				<Modal.Footer className="text-center">
					<div className="text-center">
						<button type="button" onClick={handleButtonConfirm} className="btn btn-lg btn-info text-uppercase font-weight-bold ">
							<h2 className="text-center text-uppercase custom-t2 p-3">CONFIRM</h2> {/* confirm */}
						</button>
					</div>
				</Modal.Footer>
			</Modal>

			<Modal show={showAck} size="xl" centered className="rounded-3">
				<Modal.Body>
					<p className="custom-t2 text-uppercase">{changeTemplateResponse}</p> {/* template changed successfully */}
				</Modal.Body>
				<Modal.Footer className="text-center">
					<div className="text-center">
						<button type="button" onClick={handleButtonOk} className="btn btn-lg btn-info text-uppercase font-weight-bold ">
							<h2 className="text-center text-uppercase custom-t2 p-3">OK</h2> {/* ok */}
						</button>
					</div>
				</Modal.Footer>
			</Modal>
		</Container>
	</div>);
}

export default Management;