import { useContext, useEffect, useState } from "react";
import { useHistory, useParams, useLocation } from "react-router-dom";
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
	const {sale_id} = useParams();
	const {search} = useLocation();
	const [dispenseResult, setDispenseResult] = useState(4); // change to 0 to check the dispense success, change to other number to check dispense success
	const [isDispensing, setDespensing] = useState(true); // change to false to see the dispense error or success
	const [dispensingTimeout, setDispensingTimeout] = useState(false);
	const socket = useContext(SocketContext);
	const history = useHistory()
	useEffect(()=>{
		// change slot to numeric
		// const slot = parseInt(slot_id);
		const urlParams = new URLSearchParams(search);
		let slots = urlParams.get('slots').split(",");
		let slotDispenseIndex = 0
		let isDispensing = true
		console.log(slots);
		socket.emit('vendingv1-indo', {"command":"single_dispense","slot": parseInt(slots[slotDispenseIndex]),"reply_to": DISPENSE_E});
		const dispense_event = (data) => {
			const {type, slot=false, status=false} = JSON.parse(data);
			if ( !(["single_dispense_response", "multiple_dispense_response"].includes(type)) )
				return;
			console.log(`slot dispense index => ${slotDispenseIndex} => ${slots[slotDispenseIndex]}`)
			if( parseInt(status) !== 0){
				slotDispenseIndex += 1
				if(slotDispenseIndex < slots.length){
					isDispensing = true
					socket.emit('vendingv1-indo', {"command":"single_dispense","slot": parseInt(slots[slotDispenseIndex]),"reply_to": DISPENSE_E});
				}else{
					isDispensing = false
					setDespensing(false);
					setDispenseResult(status);
				}
			}else{
				isDispensing = false
				setDespensing(false);
				setDispenseResult(status);
			}
			// :dispense_code, :dispense_status
			SERVER_REQ.put(`/api/sales/${sale_id}.json`, {"sale[dispense_code]": status, "sale[dispense_status]": DISPENSE_CODE_TEXT[status], "sale[dispense_belt]": slot})
			if(!isDispensing)
				setDispensingTimeout(setTimeout(() => history.push("/"), 10000));
		}
		socket.off(DISPENSE_E, dispense_event).on(DISPENSE_E, dispense_event);
		
		return () => {
			socket.off(DISPENSE_E, dispense_event)
		}
		// eslint-disable-next-line
	}, [])
	return (
		<div className="vw-100 vh-100 d-flex align-items-center background-ImgWithLogo overflow-hidden">
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
						dispenseResult !== 0  ? <DispenseError /> : <DispenseSuccess dispensingTimeout={dispensingTimeout} setDispensingTimeout={setDispensingTimeout} />
				}
			</Container>
		</div>);
}

export default Dispensing;
