import { useContext, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Container, Row } from 'react-bootstrap';
import SERVER_REQ from '../../helpers/Request';
import { SocketContext } from "../../services/socket";
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
    9: "Slot is empty",
		255: "Unknown failure"
}

const Dispensing = () => {
	const {slot_id, sale_id} = useParams();
	const [dispenseResult, setDispenseResult] = useState(4); // change to 0 to check the dispense success, change to other number to check dispense success
	const [isDispensing, setDespensing] = useState(true); // change to false to see the dispense error or success
	const socket = useContext(SocketContext);
	const history = useHistory()
	useEffect(()=>{
		// change slot to numeric
		const slot = parseInt(slot_id);
		
		socket.emit('vendingv1-indo', {"command":"single_dispense","slot": slot,"reply_to": DISPENSE_E});

		socket.on(DISPENSE_E, (data) => {
			const {type, slot=false, status=false} = JSON.parse(data);
			console.log(!(["single_dispense_response", "multiple_dispense_response"].includes(type)), type)
			if ( !(["single_dispense_response", "multiple_dispense_response"].includes(type)) )
				return;
				
			setDespensing(false);
			setDispenseResult(status);
			// :dispense_code, :dispense_status
			console.log({"sale[dispense_code]": status, "sale[dispense_status]": DISPENSE_CODE_TEXT[status]});
			SERVER_REQ.put(`/api/sales/${sale_id}.json`, {"sale[dispense_code]": status, "sale[dispense_status]": DISPENSE_CODE_TEXT[status]})
			// received_dispense = true
			console.log(type, slot, status)
			setTimeout(() => history.push("/"), 10000);
		})
		return () => {
			socket.offAny(DISPENSE_E)
		}
	}, [slot_id, socket])
	return (
		<div className="vw-100 vh-100 d-flex align-items-center background-ImgWithLogo">
			<Container fluid>
				{
					isDispensing 
					? 
						<Row className="justify-content-center text-uppercase m-3">
							<div className="container p-2 text-center mt-5 mb-3 payment-success-div">
								<p className='custom-t2 payment-success-div-text'>PEMBAYARAN BERHASIL</p>
								<p className='custom-t3 payment-success-div-text'>MESIN SEDANG MENYIAPKAN PRODUK ANDA</p>
								{/*
									payment success - PEMBAYARAN BERHASIL
									machine is dispensing your product - MESIN SEDANG MENYIAPKAN PRODUK ANDA
								*/}
							</div>
						</Row>
					:
						dispenseResult !== 0  ? <DispenseError /> : <DispenseSuccess />
				}
			</Container>
		</div>);
}

export default Dispensing;
