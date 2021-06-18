import { useContext, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Container, Row } from 'react-bootstrap';
import { SocketContext } from "../../services/socket";
import LoadingImage from '../../assets/static_images/success.gif';
import DispenseSuccess from "./dispense_success";
import DispenseError from "./dispense_error";
const DISPENSE_E = "dispense";

const Dispensing = () => {
	const {slot_id} = useParams();
	const [dispenseResult, setDispenseResult] = useState(4); // change to 0 to check the dispense success, change to other number to check dispense success
	const [isDispensing, setDespensing] = useState(true); // change to false to see the dispense error or success
	const socket = useContext(SocketContext);
	useEffect(()=>{
		const slot = parseInt(slot_id)
		// socket.emit('vendingv1-indo', {"command":"single_dispense","slot":slot-1,"reply_to": DISPENSE_E});
		let received_dispense = false
		console.log(isDispensing)
		socket.on(DISPENSE_E, (data) => {
			const response = JSON.parse(data);
			// if(isDispensing) return;
			// if(received_dispense) return;
			// setDespensing(false);
			// setDispenseResult(0);
			// received_dispense = true
			console.log(response)
		})

		return () => {
			socket.offAny(DISPENSE_E)
		}
	})
	return (
		<Container fluid>
			{
				isDispensing 
				? 
					<Row className="justify-content-center text-uppercase m-3">
						<div className="p-2 align-self-center mb-3">
							<p className="text-center custom-t0">Payment Success</p>
							<p className="text-center custom-t4">Machine is dispensing your product ...</p>
						</div>
						<div className="p-2 text-center mb-3">
							<img src={LoadingImage} className="img-thumbnail border-0" alt="Loading..."></img>
						</div>
					</Row>
				:
					dispenseResult !== 0  ? <DispenseError /> : <DispenseSuccess />
			}
		</Container>);
}

export default Dispensing;