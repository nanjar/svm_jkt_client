import { useEffect, useState } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
// import SERVER_REQ from '../../helpers/Request';
import { Row, Col, Container } from 'react-bootstrap';
import { useIdleTimer } from 'react-idle-timer';

const Management = (props) => {
	const [piTemp] = useState(0);
	const [machineTemp] = useState(0);
	
	const location = useLocation();
	const history = useHistory()
	useEffect(()=>{
		if(!(location.state && location.state.login)){
			// history.push('/management/login');d0
			return;
		}
		return () => {}
	}, []);
	const min = 10; // 10 minutes

	let timer = 1000 * 60 * min; // set timer

	const handleOnAction = (event) => {
		console.log("user did something", event);
		timer = 1000 * 60 * min; // reset timer
		console.log("remaining time 1 ", getRemainingTime());
	}

	const handleOnActive = (event) => {
		console.log("user is active", event);
		timer = 1000 * 60 * min; // reset timer
		console.log("remaining time 2 ", getRemainingTime());
	}

	const handleOnIdle = (event) => {
		console.log("user is idle", event);
		console.log("remaining time 3 ", getRemainingTime());
		props.history.push("/");
	}

	const { getRemainingTime } = useIdleTimer({
		timeout: timer,
		onIdle: handleOnIdle,
		onActive: handleOnActive,
		onAction: handleOnAction
	});

	return <div className="vw-100 vh-100 d-flex align-items-center">
		<Container fluid>
			<Row className="mt-1">
				<Col lg={6}><span className="text-uppercase custom-t2">SUHU PERANGKAT - {piTemp} C</span></Col> {/* device/pi temp */}
				<Col lg={6}><span className="text-uppercase float-end custom-t2">SUHU MESIN - {machineTemp} C</span></Col> {/* machine temp */}
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
		</Container>
	</div>;
}

export default Management;