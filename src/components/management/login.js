import {useState} from "react";
import '../../App.css';
import { Container, Row, Col, Modal, Button } from 'react-bootstrap';

const Login = (props) => {
	const [numInput, setNumInput] = useState("");
	const [showNumpad, setShowNumpad] = useState(false);

	const handleNumInput = (event) => {
		let oldNum = numInput;
		let num = event.target.getAttribute("data-num");
		if (num === "Set") {
			if (oldNum === "") {
				setShowNumpad(false);
			} else {
				setShowNumpad(false);
				setNumInput(oldNum);
			}
		} else if ( num === "Del") {
			setNumInput(oldNum.slice(0, -1));
		} else {
			setNumInput(oldNum + num)
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


	const numData = [['1', '2', '3'], ['4', '5', '6'], ['7', '8', '9'], ['Del', '0', 'Set']];
		
	return (
		<Container fluid>
			<Row className="justify-content-center">
				<Col lg={5}>
					<input type="text" onClick={handleShowNumpad} value={numInput} className="form-control border border-1 form-control-lg custom-t1" readOnly={true} placeholder="TYPE PASSCODE" />
				</Col>
			</Row>

			<Row className="justify-content-center text-center mt-4">
				<Col lg={4}>
					<Button variant="info" className="text-uppercase custom-t1">Login</Button>
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
		</Container>
	);
}

export default Login;