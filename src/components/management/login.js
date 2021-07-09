import { useEffect, useRef, useState } from "react";
import SERVER_REQ from '../../helpers/Request';
import '../../App.css';
import { Container, Row, Col, Modal, Button } from 'react-bootstrap';
import { useHistory } from "react-router-dom";
import { useIdleTimer } from 'react-idle-timer';

const Login = (props) => {
	const numData = [['1', '2', '3'], ['4', '5', '6'], ['7', '8', '9'], ['Del', '0', 'Set']]; // data for numpad, cannot be changed

	const [numInput, setNumInput] = useState("");
	const [showNumpad, setShowNumpad] = useState(false);
	const [pin, setPin] = useState("");
	const [contentMsg, setContentMsg] = useState("");
	const [showModal,setShowModal] = useState(false);
	const timerId = useRef(0);
	const history = useHistory();
	
	useEffect(() => {
		// redirect home page after 30 seconds 
		timerId.current = setTimeout(() => { handleTimeout(); }, 30000); 
		console.log("Timer", timerId);
		return function cleanup() {
			clearTimeout(timerId.current); 
		}		
	}); 

	const duration = 1; // 1 minutes

	let timer = 1000 * 60 * duration; // set timer

	const handleOnAction = (event) => {
		console.log("user did something", event);
		timer = 1000 * 60 * duration; // reset timer
		console.log("remaining time 1 ", getRemainingTime());
	}

	const handleOnActive = (event) => {
		console.log("user is active", event);
		timer = 1000 * 60 * duration; // reset timer
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

	const handleNumInput = (event) => {
		let oldNum = numInput;
		let num = event.target.getAttribute("data-num");
		if (num === "Set") {
			if (oldNum === "") {
				setShowNumpad(false);
			} else {
				setShowNumpad(false);
				setNumInput(oldNum);
				setPin(oldNum);
			}
		} else if ( num === "Del") {
			setNumInput(oldNum.slice(0, -1));
		} else {
			setNumInput(oldNum + num)
		}
	}

	const handleLoginButtonClick = async() => {
		console.log(pin);
		setNumInput("");
		if (pin === "") {
			setContentMsg("JENIS KODE KATA SANDI"); // type password
			setShowModal(true);
		} else {
			const button_post = await SERVER_REQ.get(`/api/users.json`, {'pin': pin});
			const success = button_post.response.success;
			console.log(button_post);
			if (success) {
				const routeName = (window.location.hostname === "localhost") ? '/management' : '/management/auto_topup';
				const locationProps = {
					pathname: routeName,
					state: { login: true }
				}
				history.push(locationProps);
			} else {
				setContentMsg("KATA SANDI TIDAK VALID"); // invalid password
				setShowModal(true);
			}
		}
	}

	const handleShowNumpad = () => {
		setNumInput("");
		setShowNumpad(true);
	}

	const handleHideNumpad = () => {
		setNumInput("");
		setShowNumpad(false);
	}

	const handleTimeout = () => {
		clearTimeout(timerId.current);
		setShowModal(false);
		if(window.location.hostname !== "localhost")
			props.history.push("/");
	}

	const handleButtonOk = () => {
		setShowModal(false);
	}
		
	return (<div className="vw-100 vh-100 d-flex align-items-center background-Img">
		<Container fluid>
			<Row className="justify-content-center">
				<Col lg={5}>
					<input type="text" onClick={handleShowNumpad} value={numInput} className="form-control border border-1 form-control-lg custom-t1" readOnly={true} placeholder="JENIS KODE KATA SANDI" /> {/* type passcode */}
				</Col>
			</Row>

			<Row className="justify-content-center text-center mt-4">
				<Col lg={4}>
					<Button variant="info" className="text-uppercase custom-t1" onClick={handleLoginButtonClick}>MASUK</Button> {/* login */}
				</Col>
			</Row>

			<Modal show={showNumpad} size="md" centered className="text-uppercase">
				<label className="custom-t2" style={{paddingLeft: "90%", cursor: "pointer"}} onClick={handleHideNumpad}>&times;</label>
				<Modal.Body className="m-3 mt-0">
					<Row>
						<input type="text" value={numInput} className="form-control border border-1 form-control-lg custom-t1" readOnly={true} />
					</Row>
					{
						numData.map((rowData, rowIndex) => (
							<Row key={'row-' + rowIndex} className="justify-content-center">
								{
									rowData.map((num, index) => (
										<Col key={index} onClick={handleNumInput} className="col align-self-center text-center border border-1 bg-slot btn-slot" data-num={num}><p data-num={num} className="custom-t3 mt-3 mb-3" >{num}</p></Col>
									))
								}	
							</Row>
						))
					}
				</Modal.Body>
			</Modal>
			
			<Modal show={showModal} size="xl" centered>
				<Modal.Body>
					<p className="custom-t2 text-uppercase">{contentMsg}</p>
				</Modal.Body>
				<Modal.Footer className="text-center">
					<div className="text-center">
						<button type="button" onClick={handleButtonOk} className="btn btn-lg btn-info text-uppercase font-weight-bold ">
							<h2 className="text-center text-uppercase custom-t2">OK</h2>
						</button>
					</div>
				</Modal.Footer>
			</Modal>
		</Container>
	</div>);
}

export default Login;