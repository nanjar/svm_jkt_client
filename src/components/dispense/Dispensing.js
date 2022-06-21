import React, { useContext, useEffect, useState } from "react";
import { useHistory, useParams, useLocation } from "react-router-dom";
import { Container, Row, Modal } from 'react-bootstrap';
import SERVER_REQ from '../../helpers/Request';
import { SocketContext } from "../../services/socket";
import DispenseSuccess from "./dispense_success";
import DispenseError from "./dispense_error";

const DISPENSE_E = "dispense";
const BUTTON_E = "button_pressed";

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
	const [showAlertTimeout, setShowAlertTimeout] = useState(false);
	const [buttonTimeout, setButtonTimeout] = useState(false);
	const [showAlert, setShowAlert] = useState(false);
	const socket = useContext(SocketContext);
	const history = useHistory()
	const activate_button = () => {
		console.log("command-sent", JSON.stringify({ command: 'button_poll', action: 'start', interval: 50, reply_to: BUTTON_E }))
		socket.emit('vendingv1-indo', { command: 'button_poll', action: 'start', interval: 50, reply_to: BUTTON_E });
	}
	let is_dispensing = false;
	useEffect(()=>{
		if(is_dispensing) return;
		is_dispensing = true;
		// change slot to numeric
		// const slot = parseInt(slot_id);
		const urlParams = new URLSearchParams(search);
		let slots = urlParams.get('slots').split(",");
		let slotDispenseIndex = 0
		let is_Dispensing = true;
		// console.log("debugging");
		
		socket.emit("ui-logs", {"command":"single_dispense","slot": parseInt(slots[slotDispenseIndex]),"reply_to": DISPENSE_E})
		socket.emit('vendingv1-indo', {"command":"single_dispense","slot": parseInt(slots[slotDispenseIndex]),"reply_to": DISPENSE_E});
		const dispense_event = (data) => {
			const {type, slot=false, status=false} = JSON.parse(data);
			if ( !(["single_dispense_response", "multiple_dispense_response"].includes(type)) )
				return;
			console.log(`slot dispense index => ${slotDispenseIndex} => ${slots[slotDispenseIndex]}`)
			if( parseInt(status) !== 0){
				slotDispenseIndex += 1
				if(slotDispenseIndex < slots.length){
					is_Dispensing = true;
					socket.emit("ui-logs",{"command":"single_dispense","slot": parseInt(slots[slotDispenseIndex]),"reply_to": DISPENSE_E})
					socket.emit('vendingv1-indo', {"command":"single_dispense","slot": parseInt(slots[slotDispenseIndex]),"reply_to": DISPENSE_E});
				}else{
					is_Dispensing = false;
					setDespensing(false);
					setDispenseResult(status);
				}
			}else{
				is_Dispensing = false
				setDespensing(false);
				setDispenseResult(status);
			}
			// :dispense_code, :dispense_status
			SERVER_REQ.put(`/api/sales/${sale_id}.json`, {"sale[dispense_code]": status, "sale[dispense_status]": DISPENSE_CODE_TEXT[status], "sale[dispense_belt]": slot});
		}
		socket.off(DISPENSE_E).on(DISPENSE_E, dispense_event);

		if(!isDispensing) {
			setDispensingTimeout(setTimeout(function() { window.location.href="/";  console.log("inTimeout") }, 12000));
		}

		return () => {
			clearTimeout(dispensingTimeout);
			clearTimeout(showAlertTimeout);
			clearTimeout(buttonTimeout);
			setDispensingTimeout(false);
			setShowAlertTimeout(false);
			setButtonTimeout(false);
			socket.off(DISPENSE_E);	
		}
		// eslint-disable-next-line
	}, []);

	useEffect(() => {
		var button_pressed = false;
		if(socket && parseInt(dispenseResult) === 0){
			// socket.emit('vendingv1-indo', { command: 'button_poll', action: 'start', interval: 50, reply_to: BUTTON_E });
			activate_button();
			const button_event = async (data) => {
				socket.emit("ui-logs",{ command: 'button_poll', action: 'stop', interval: 300, reply_to: BUTTON_E })
				socket.emit('vendingv1-indo', { command: 'button_poll', action: 'stop', interval: 300, reply_to: BUTTON_E });
				data = JSON.parse(data);
				// console.log(data);
				if(button_pressed)
					return;
				button_pressed = true;
				if (button_pressed) { setShowAlert(false); } // close EmptyStockModal at the button pressed
				const button = data.button_no
				if(button === 0 )
					return;
				// console.log('pressed')
				const button_req = await SERVER_REQ.get(`/api/buttons/${button}.json`);
				// console.log(button_req);
				const button_response = button_req.response
				// console.log("button response", button_response);
				if(!button_response.success){
					button_pressed=false;
					setShowAlert(true); // out of stock alert
					setShowAlertTimeout(setTimeout(function(){ setShowAlert(false); console.log("inTimeout") }, 5000));
					setButtonTimeout(setTimeout( () => activate_button(), 500));
					return;
				} 
				// clearTimeout(dispensingTimeout);
				// setDispensingTimeout(false);
				const button_detail = button_req.response.data;
				
				const product_detail = {name: button_detail.product.name, url: button_detail.product.image_url, slots: button_detail.slot_available}
				console.log("Product Details", product_detail);
				const url_params = new URLSearchParams(product_detail);
				socket.off(BUTTON_E)
				// console.log(button_detail, `/sales/${button_detail.product.id}/${button_detail.price}?${url_params}`);
				history.push(`/sales/${button_detail.product.id}/${button_detail.price}?${url_params}`)
			}
			socket.off(BUTTON_E).on(BUTTON_E, button_event);
		}
		return () => {
			clearTimeout(dispensingTimeout);
			clearTimeout(showAlertTimeout);
			clearTimeout(buttonTimeout);
			setDispensingTimeout(false);
			setShowAlertTimeout(false);
			setButtonTimeout(false);
			socket.off(BUTTON_E);
			socket.emit('vendingv1-indo', { command: 'button_poll', action: 'stop', interval: 50, reply_to: BUTTON_E });
		}
		// eslint-disable-next-line
	},[dispenseResult]);

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
						dispenseResult !== 0  ? <DispenseError dispensingTimeout={dispensingTimeout} setDispensingTimeout={setDispensingTimeout} /> : <DispenseSuccess dispensingTimeout={dispensingTimeout} setDispensingTimeout={setDispensingTimeout} />
				}
			</Container>
			
			<Modal show={showAlert} size="lg" centered>
				<Modal.Body>
					<Row className="w-100 justify-content-center text-center">
						<p className="text-uppsercase custom-t2">MAAF STOK TIDAK TERSEDIA</p>
					</Row>
				</Modal.Body>
			</Modal>
		</div>);
}

export default Dispensing;