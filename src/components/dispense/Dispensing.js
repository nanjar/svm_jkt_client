import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Row } from 'react-bootstrap';
import { SocketContext } from "../../services/socket";
import LoadingImage from '../../assets/static_images/success.gif';
import DispenseSuccess from "./dispense_success";
import DispenseError from "./dispense_error";
const DISPENSE_E = "dispense";

const DISPENSE_CODE_TEXT = {
    0: "Success",
    1: "Overloaded motor current",
    2: "Disconnected motor wire",
    3: "Motor timeout",
    4: "Invalid motor",
    5: "Motor is already moving",
    6: "Ack is needed",
    7: "Invalid motor steps",
    8: "Machine no response",
    9: "Unknown failure"
}

const Dispensing = () => {
	const {slot_id} = useParams();
	const [dispenseResult, setDispenseResult] = useState(4); // change to 0 to check the dispense success, change to other number to check dispense success
	const [isDispensing, setDespensing] = useState(true); // change to false to see the dispense error or success
	const socket = useContext(SocketContext);
	useEffect(()=>{
		// change slot to numeric
		const slot = parseInt(slot_id);
		
		socket.emit('vendingv1-indo', {"command":"single_dispense","slot":slot-1,"reply_to": DISPENSE_E});

		socket.on(DISPENSE_E, (data) => {
			const {type, slot=false, status=false} = JSON.parse(data);
			console.log(!(["single_dispense_response", "multiple_dispense_response"].includes(type)), type)
			if ( !(["single_dispense_response", "multiple_dispense_response"].includes(type)) )
				return;
				
			setDespensing(false);
			setDispenseResult(status);
			// :dispense_code, :dispense_status
			console.log({"sale[dispense_code]": status, "sale[dispense_status]": DISPENSE_CODE_TEXT[status]});
			// SERVER_REQ.post('/api/sales/1.json', {"sale[dispense_code]": status, "sale[dispense_status]": DISPENSE_CODE_TEXT[status]})
			// received_dispense = true
			console.log(type, slot, status)
		})
		return () => {
			socket.offAny(DISPENSE_E)
		}
	}, [slot_id, socket])
	return (
		<div className="vw-100 vh-100 d-flex align-items-center">
			<Container fluid>
				{
					isDispensing 
					? 
						<Row className="justify-content-center text-uppercase m-3">
							<div className="p-2 align-self-center mb-3">
								<p className="text-center custom-t0">PEMBAYARAN BERHASIL</p> {/* payment success */}
								<p className="text-center custom-t4">MESIN SEDANG MENYIAPKAN PRODUK ANDA ...</p> {/* machine is dispensing your product  */}
							</div>
							<div className="p-2 text-center mb-3">
								<img src={LoadingImage} className="img-thumbnail border-0" alt="Loading..."></img>
							</div>
						</Row>
					:
						dispenseResult !== 0  ? <DispenseError /> : <DispenseSuccess />
				}
			</Container>
		</div>);
}

export default Dispensing;
